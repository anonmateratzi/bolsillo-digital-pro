
import React from 'react';
import { DollarSign, TrendingUp, ArrowDown, ArrowUpDown, Percent } from 'lucide-react';
import { useIngresos } from '@/hooks/useIngresos';
import { useEgresos } from '@/hooks/useEgresos';
import { useCambiosDivisa } from '@/hooks/useCambiosDivisa';
import { BalancesTable } from '@/components/BalancesTable';

export const Dashboard: React.FC = () => {
  const { sueldoFijo, ingresosExtras, loading: loadingIngresos } = useIngresos();
  const { egresos, loading: loadingEgresos } = useEgresos();
  const { cambios, loading: loadingCambios } = useCambiosDivisa();

  // Calcular totales del mes actual
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const ingresosMesActual = ingresosExtras
    .filter(ingreso => {
      const fecha = new Date(ingreso.fecha);
      return fecha.getMonth() + 1 === currentMonth && fecha.getFullYear() === currentYear;
    })
    .reduce((sum, ingreso) => sum + (ingreso.moneda === 'USD' ? ingreso.monto * 1000 : ingreso.monto), 0);

  const totalIngresos = (sueldoFijo?.monto || 0) + ingresosMesActual;

  const egresosMesActual = egresos
    .filter(egreso => {
      const fecha = new Date(egreso.fecha);
      return fecha.getMonth() + 1 === currentMonth && fecha.getFullYear() === currentYear;
    })
    .reduce((sum, egreso) => sum + (egreso.moneda === 'USD' ? egreso.monto * 1000 : egreso.monto), 0);

  const ahorroMensual = totalIngresos - egresosMesActual;
  const porcentajeAhorroMensual = totalIngresos > 0 ? (ahorroMensual / totalIngresos) * 100 : 0;

  // Últimos movimientos
  const ultimosMovimientos = [
    ...ingresosExtras.slice(0, 2).map(ing => ({
      tipo: 'ingreso',
      descripcion: ing.descripcion,
      fecha: ing.fecha,
      monto: ing.monto,
      moneda: ing.moneda
    })),
    ...egresos.slice(0, 2).map(eg => ({
      tipo: 'egreso',
      descripcion: eg.descripcion,
      fecha: eg.fecha,
      monto: eg.monto,
      moneda: eg.moneda
    })),
    ...cambios.slice(0, 1).map(c => ({
      tipo: 'cambio',
      descripcion: `${c.moneda_origen} → ${c.moneda_destino}`,
      fecha: c.fecha,
      monto: c.monto_origen,
      moneda: c.moneda_origen
    }))
  ].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()).slice(0, 3);

  if (loadingIngresos || loadingEgresos || loadingCambios) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Cargando dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="px-4 md:px-0">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard Financiero</h1>
        <p className="text-gray-600 mt-2 text-sm md:text-base">Resumen de tu situación financiera actual</p>
      </div>

      {/* Patrimonio Consolidado */}
      <div className="px-4 md:px-0">
        <BalancesTable />
      </div>

      {/* Resumen Cards del mes actual - Responsive grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-6 px-4 md:px-0">
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-4 w-4 md:h-6 md:w-6 text-green-600" />
            </div>
            <div className="ml-2 md:ml-4 min-w-0 flex-1">
              <p className="text-xs md:text-sm font-medium text-gray-600 truncate">Ingresos del Mes</p>
              <p className="text-lg md:text-2xl font-bold text-gray-900 truncate">
                ${totalIngresos.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">ARS</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <ArrowDown className="h-4 w-4 md:h-6 md:w-6 text-red-600" />
            </div>
            <div className="ml-2 md:ml-4 min-w-0 flex-1">
              <p className="text-xs md:text-sm font-medium text-gray-600 truncate">Egresos del Mes</p>
              <p className="text-lg md:text-2xl font-bold text-gray-900 truncate">
                ${egresosMesActual.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">ARS</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="h-4 w-4 md:h-6 md:w-6 text-blue-600" />
            </div>
            <div className="ml-2 md:ml-4 min-w-0 flex-1">
              <p className="text-xs md:text-sm font-medium text-gray-600 truncate">Balance Mensual</p>
              <p className={`text-lg md:text-2xl font-bold truncate ${ahorroMensual >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${ahorroMensual.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">ARS</p>
            </div>
          </div>
        </div>

        {/* Nueva card destacada para % de ahorro */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 md:p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-white">
          <div className="flex items-center">
            <div className="p-2 bg-white/20 rounded-lg">
              <Percent className="h-4 w-4 md:h-6 md:w-6 text-white" />
            </div>
            <div className="ml-2 md:ml-4 min-w-0 flex-1">
              <p className="text-xs md:text-sm font-medium text-green-100 truncate">% Sueldo Ahorrado</p>
              <p className="text-lg md:text-2xl font-bold text-white truncate">
                {porcentajeAhorroMensual.toFixed(1)}%
              </p>
              <p className="text-xs text-green-100">Este mes</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <ArrowUpDown className="h-4 w-4 md:h-6 md:w-6 text-purple-600" />
            </div>
            <div className="ml-2 md:ml-4 min-w-0 flex-1">
              <p className="text-xs md:text-sm font-medium text-gray-600 truncate">Cambios de Divisa</p>
              <p className="text-lg md:text-2xl font-bold text-gray-900">{cambios.length}</p>
              <p className="text-xs text-gray-500">Operaciones</p>
            </div>
          </div>
        </div>
      </div>

      {/* Resumen Mensual - Stack en móvil */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 px-4 md:px-0">
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Últimos Movimientos</h2>
          <div className="space-y-3">
            {ultimosMovimientos.length === 0 ? (
              <p className="text-gray-500 text-center py-4 text-sm">No hay movimientos registrados</p>
            ) : (
              ultimosMovimientos.map((mov, index) => (
                <div key={index} className={`flex justify-between items-center p-3 rounded-lg ${
                  mov.tipo === 'ingreso' ? 'bg-green-50' : mov.tipo === 'egreso' ? 'bg-red-50' : 'bg-blue-50'
                }`}>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 text-sm truncate">{mov.descripcion}</p>
                    <p className="text-xs text-gray-600">{new Date(mov.fecha).toLocaleDateString('es-ES')}</p>
                  </div>
                  <p className={`font-bold text-sm ml-2 ${
                    mov.tipo === 'ingreso' ? 'text-green-600' : mov.tipo === 'egreso' ? 'text-red-600' : 'text-blue-600'
                  }`}>
                    {mov.tipo === 'ingreso' ? '+' : mov.tipo === 'egreso' ? '-' : ''}${mov.monto.toLocaleString()} {mov.moneda}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Resumen Mensual</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Ingresos</span>
                <span className="text-sm text-gray-500">${totalIngresos.toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Egresos</span>
                <span className="text-sm text-gray-500">${egresosMesActual.toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-red-600 h-2 rounded-full" style={{ 
                  width: `${totalIngresos > 0 ? Math.min((egresosMesActual / totalIngresos) * 100, 100) : 0}%` 
                }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Ahorro</span>
                <span className="text-sm text-gray-500">
                  {porcentajeAhorroMensual.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ 
                  width: `${Math.max(porcentajeAhorroMensual, 0)}%` 
                }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
