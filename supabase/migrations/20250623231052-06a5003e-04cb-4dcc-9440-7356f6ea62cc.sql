
-- Actualizar la tabla inversiones para incluir los campos necesarios
ALTER TABLE public.inversiones ADD COLUMN IF NOT EXISTS precio_actual DECIMAL(15,2);
ALTER TABLE public.inversiones ADD COLUMN IF NOT EXISTS notas TEXT;

-- Crear índice para mejorar performance
CREATE INDEX IF NOT EXISTS idx_inversiones_user_activa ON public.inversiones(user_id, activa);

-- Asegurar que tenemos todos los campos necesarios
-- Si la tabla no tiene algunos campos, los agregamos
DO $$
BEGIN
    -- Verificar y agregar campos faltantes si no existen
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'inversiones' AND column_name = 'tipo_inversion') THEN
        ALTER TABLE public.inversiones ADD COLUMN tipo_inversion TEXT NOT NULL DEFAULT 'cantidad';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'inversiones' AND column_name = 'nombre_activo') THEN
        ALTER TABLE public.inversiones ADD COLUMN nombre_activo TEXT;
    END IF;
END $$;
