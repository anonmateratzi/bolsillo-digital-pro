
-- Crear vista para consolidar balances por usuario (sin índice)
CREATE OR REPLACE VIEW public.balances_consolidados AS
WITH balance_ars AS (
  -- Balance en ARS (ingresos - egresos)
  SELECT 
    COALESCE(i.user_id, e.user_id) as user_id,
    'ARS' as moneda,
    'Efectivo' as tipo,
    'ARS' as ticker,
    COALESCE(ingresos_total, 0) - COALESCE(egresos_total, 0) as cantidad,
    1 as precio_unitario_ars
  FROM (
    SELECT 
      user_id,
      SUM(CASE WHEN moneda = 'ARS' THEN monto ELSE monto * 1000 END) as ingresos_total
    FROM (
      SELECT user_id, monto, moneda FROM sueldo_fijo WHERE activo = true
      UNION ALL
      SELECT user_id, monto, moneda FROM ingresos_extras
    ) ingresos
    GROUP BY user_id
  ) i
  FULL OUTER JOIN (
    SELECT 
      user_id,
      SUM(CASE WHEN moneda = 'ARS' THEN monto ELSE monto * 1000 END) as egresos_total
    FROM egresos
    GROUP BY user_id
  ) e ON i.user_id = e.user_id
),

balance_divisas AS (
  -- Balance de divisas (cambios de divisa)
  SELECT 
    user_id,
    moneda_destino as moneda,
    'Divisa' as tipo,
    moneda_destino as ticker,
    SUM(monto_destino) - COALESCE(SUM(monto_origen) FILTER (WHERE moneda_origen = moneda_destino), 0) as cantidad,
    CASE WHEN moneda_destino = 'USD' THEN 1000 ELSE 1 END as precio_unitario_ars
  FROM cambios_divisa
  GROUP BY user_id, moneda_destino
  HAVING SUM(monto_destino) - COALESCE(SUM(monto_origen) FILTER (WHERE moneda_origen = moneda_destino), 0) > 0
),

balance_inversiones AS (
  -- Balance de inversiones
  SELECT 
    user_id,
    moneda_origen as moneda,
    'Inversión' as tipo,
    ticker,
    CASE 
      WHEN tipo_inversion = 'cantidad' THEN cantidad_activos
      WHEN tipo_inversion = 'monto' AND precio_actual > 0 AND precio_compra > 0 
      THEN monto_invertido / precio_compra
      ELSE 0
    END as cantidad,
    COALESCE(precio_actual, precio_compra, 0) * 
    CASE WHEN moneda_origen = 'USD' THEN 1000 ELSE 1 END as precio_unitario_ars
  FROM inversiones
  WHERE activa = true
)

SELECT 
  user_id,
  moneda,
  tipo,
  ticker,
  cantidad,
  precio_unitario_ars,
  cantidad * precio_unitario_ars as valor_ars
FROM balance_ars
WHERE cantidad != 0

UNION ALL

SELECT 
  user_id,
  moneda,
  tipo,
  ticker,
  cantidad,
  precio_unitario_ars,
  cantidad * precio_unitario_ars as valor_ars
FROM balance_divisas

UNION ALL

SELECT 
  user_id,
  moneda,
  tipo,
  ticker,
  cantidad,
  precio_unitario_ars,
  cantidad * precio_unitario_ars as valor_ars
FROM balance_inversiones
WHERE cantidad > 0;
