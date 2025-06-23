
import React from 'react';
import { TrendingUp, Calendar, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEgresos } from '@/hooks/useEgresos';

export const InflacionPersonal: React.FC = () => {
  const { egresos, loading } = useEgresos();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Cargando datos de inflación...</p>
      </div>
    );
  }

  // Obtener mes actual y anterior
  const fechaActual = new Date();
  const mesActual = fechaActual.getMonth() + 1;
  const anioActual = fechaActual.getFullYear();
  
  const fechaAnterior = new Date(fechaActual);
  fechaAnterior.setMonth(fechaAnterior.getMonth() - 1);
  const mesAnterior = fechaAnterior.getMonth() + 1;
  const anioAnterior = fechaAnterior.getFullYear();

  // Calcular gastos por mes
  const gastosActuales = egresos.filter(egreso => {
    const fecha = new Date(egreso.fecha);
    return fecha.getMonth() + 1 === mesActual && fecha.getFullYear() === anioActual;
  });

  const gastosAnteriores = egresos.filter(egreso => {
    const fecha = new Date(egreso.fecha);
    return fecha.getMonth() + 1 === mesAnterior && fecha.getFullYear() === anioAnterior;
  });

  // Calcular totales
  const totalActual = gastosActuales.reduce((sum, egreso) => {
    const monto = egreso.moneda === 'USD' ? egreso.monto * 1000 : egreso.monto;
    return sum + monto;
  }, 0);

  const totalAnterior = gastosAnteriores.reduce((sum, egreso) => {
    const monto = egreso.moneda === 'USD' ? egreso.monto * 1000 : egreso.monto;
    return sum + monto;
  }, 0);

  // Calcular inflación personal
  const inflacionPersonal = totalAnterior > 0 ? ((totalActual - totalAnterior) / totalAnterior) * 100 : 0;

  // Agrupar gastos por categoría para el mes actual
  const gastosPorCategoria = gastosActuales.reduce((acc, egreso) => {
    const categoria = egreso.categoria || 'Sin categoría';
    const monto = egreso.moneda === 'USD' ? egreso.monto * 1000 : egreso.monto;
    
    if (!acc[categoria]) {
      acc[categoria] = { actual: 0, anterior: 0 };
    }
    acc[categoria].actual += monto;
    return acc;
  }, {} as Record<string, { actual: number; anterior: number }>);

  // Agregar gastos del mes anterior por categoría
  gastosAnteriores.forEach(egreso => {
    const categoria = egreso.categoria || 'Sin categoría';
    const monto = egreso.moneda === 'USD' ? egreso.monto * 1000 : egreso.monto;
    
    if (!gastosPorCategoria[categoria]) {
      gastosPorCategoria[categoria] = { actual: 0, anterior: 0 };
    }
    gastosPorCategoria[categoria].anterior += monto;
  });

  // Calcular inflación por categoría
  const inflacionPorCategoria = Object.entries(gastosPorCategoria).map(([categoria, datos]) => {
    const inflacion = datos.anterior > 0 ? ((datos.actual - datos.anterior) / datos.anterior) * 100 : 0;
    return {
      categoria,
      actual: datos.actual,
      anterior: datos.anterior,
      inflacion
    };
  }).sort((a, b) => Math.abs(b.inflacion) - Math.abs(a.inflacion));

  const nombreMesActual = new Date(anioActual, mesActual - 1).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  const nombreMesAnterior = new Date(anioAnterior, mesAnterior - 1).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });

  // Si no hay gastos en absoluto
  if (egresos.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inflación Personal</h1>
          <p className="text-gray-600 mt-2">Analiza cómo varía tu inflación personal basada en tus gastos reales</p>
        </div>

        <Card>
          <CardContent className="p-8 text-center">
            <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay datos suficientes</h3>
            <p className="text-gray-600">
              Para calcular tu inflación personal necesitas registrar gastos. 
              Comienza agregando tus egresos para ver el análisis.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Inflación Personal</h1>
        <p className="text-gray-600 mt-2">Analiza cómo varía tu inflación personal basada en tus gastos reales</p>
      </div>

      {/* Resumen de Inflación */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Inflación Personal</p>
                <p className={`text-2xl font-bold ${totalAnterior > 0 ? (inflacionPersonal >= 0 ? 'text-red-600' : 'text-green-600') : 'text-gray-900'}`}>
                  {totalAnterior > 0 ? `${inflacionPersonal >= 0 ? '+' : ''}${inflacionPersonal.toFixed(1)}%` : 'N/A'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Gasto {nombreMesActual}</p>
                <p className="text-2xl font-bold text-gray-900">${totalActual.toLocaleString()} ARS</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Calendar className="h-6 w-6 text-gray-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Gasto {nombreMesAnterior}</p>
                <p className="text-2xl font-bold text-gray-900">${totalAnterior.toLocaleString()} ARS</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Comparación Mensual */}
      <Card>
        <CardHeader>
          <CardTitle>Comparación Mensual</CardTitle>
        </CardHeader>
        <CardContent>
          {totalAnterior === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">
                No hay datos del mes anterior ({nombreMesAnterior}) para comparar.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                La inflación personal se calculará cuando tengas gastos de al menos 2 meses.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-900">Variación Total</p>
                  <p className="text-sm text-gray-600">
                    {nombreMesAnterior} → {nombreMesActual}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-bold ${inflacionPersonal >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {inflacionPersonal >= 0 ? '+' : ''}${(totalActual - totalAnterior).toLocaleString()} ARS
                  </p>
                  <p className={`text-sm ${inflacionPersonal >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {inflacionPersonal >= 0 ? '+' : ''}{inflacionPersonal.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Inflación por Categoría */}
      {inflacionPorCategoria.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Inflación por Categoría</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {inflacionPorCategoria.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{item.categoria}</p>
                    <p className="text-sm text-gray-600">
                      ${item.anterior.toLocaleString()} → ${item.actual.toLocaleString()} ARS
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${item.anterior > 0 ? (item.inflacion >= 0 ? 'text-red-600' : 'text-green-600') : 'text-gray-900'}`}>
                      {item.anterior > 0 ? `${item.inflacion >= 0 ? '+' : ''}${item.inflacion.toFixed(1)}%` : 'Nuevo'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resumen del Mes Actual */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen de {nombreMesActual}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">Gastos por Categoría</p>
              <div className="space-y-2">
                {Object.entries(gastosPorCategoria).map(([categoria, datos]) => (
                  <div key={categoria} className="flex justify-between">
                    <span className="text-sm text-gray-700">{categoria}</span>
                    <span className="text-sm font-medium">${datos.actual.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">Estadísticas</p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-700">Total de gastos</span>
                  <span className="text-sm font-medium">{gastosActuales.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-700">Promedio por gasto</span>
                  <span className="text-sm font-medium">
                    ${gastosActuales.length > 0 ? (totalActual / gastosActuales.length).toLocaleString() : '0'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-700">Categorías únicas</span>
                  <span className="text-sm font-medium">{Object.keys(gastosPorCategoria).length}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
