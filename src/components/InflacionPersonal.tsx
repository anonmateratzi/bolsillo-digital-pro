
import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useEgresos } from '@/hooks/useEgresos';
import { useIngresos } from '@/hooks/useIngresos';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

export const InflacionPersonal: React.FC = () => {
  const { egresos, loading: egresosLoading } = useEgresos();
  const { sueldoFijo, ingresosExtras, loading: ingresosLoading } = useIngresos();
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [filtroAnio, setFiltroAnio] = useState('');

  // Calcular datos por mes
  const datosPorMes = useMemo(() => {
    const gastosPorMes: Record<string, {
      anio: number;
      mes: number;
      total: number;
      categorias: Record<string, number>;
      fechaKey: string;
    }> = {};

    egresos.forEach(egreso => {
      const fecha = new Date(egreso.fecha);
      const anio = fecha.getFullYear();
      const mes = fecha.getMonth() + 1;
      const fechaKey = `${anio}-${mes.toString().padStart(2, '0')}`;
      
      if (!gastosPorMes[fechaKey]) {
        gastosPorMes[fechaKey] = {
          anio,
          mes,
          total: 0,
          categorias: {},
          fechaKey
        };
      }
      
      const monto = egreso.moneda === 'USD' ? egreso.monto * 1000 : egreso.monto;
      gastosPorMes[fechaKey].total += monto;
      
      if (egreso.categoria) {
        gastosPorMes[fechaKey].categorias[egreso.categoria] = 
          (gastosPorMes[fechaKey].categorias[egreso.categoria] || 0) + monto;
      }
    });

    return Object.values(gastosPorMes).sort((a, b) => 
      b.anio - a.anio || b.mes - a.mes
    );
  }, [egresos]);

  // Calcular inflación personal (variación porcentual mes a mes)
  const inflacionPersonal = useMemo(() => {
    const datos = datosPorMes.slice().reverse(); // Orden cronológico
    const inflacion: Array<{
      anio: number;
      mes: number;
      inflacionTotal: number;
      inflacionPorCategoria: Record<string, number>;
      totalGastos: number;
      fechaKey: string;
    }> = [];

    for (let i = 1; i < datos.length; i++) {
      const mesActual = datos[i];
      const mesAnterior = datos[i - 1];
      
      // Inflación total
      const inflacionTotal = mesAnterior.total > 0 
        ? ((mesActual.total - mesAnterior.total) / mesAnterior.total) * 100
        : 0;
      
      // Inflación por categoría
      const inflacionPorCategoria: Record<string, number> = {};
      const todasCategorias = new Set([
        ...Object.keys(mesActual.categorias),
        ...Object.keys(mesAnterior.categorias)
      ]);
      
      todasCategorias.forEach(categoria => {
        const gastoActual = mesActual.categorias[categoria] || 0;
        const gastoAnterior = mesAnterior.categorias[categoria] || 0;
        
        if (gastoAnterior > 0) {
          inflacionPorCategoria[categoria] = ((gastoActual - gastoAnterior) / gastoAnterior) * 100;
        } else if (gastoActual > 0) {
          inflacionPorCategoria[categoria] = 100; // Nueva categoría
        }
      });
      
      inflacion.push({
        anio: mesActual.anio,
        mes: mesActual.mes,
        inflacionTotal,
        inflacionPorCategoria,
        totalGastos: mesActual.total,
        fechaKey: mesActual.fechaKey
      });
    }
    
    return inflacion.reverse(); // Más reciente primero
  }, [datosPorMes]);

  // Filtrar datos
  const datosFiltrados = useMemo(() => {
    return inflacionPersonal.filter(dato => {
      const cumpleAnio = !filtroAnio || dato.anio.toString() === filtroAnio;
      return cumpleAnio;
    });
  }, [inflacionPersonal, filtroAnio]);

  // Calcular porcentaje de ahorro
  const ahorrosPorMes = useMemo(() => {
    const sueldoMensual = sueldoFijo?.monto || 0;
    const ingresosExtrasMensuales = ingresosExtras.reduce((sum, ingreso) => {
      const fecha = new Date(ingreso.fecha);
      const mesActual = new Date().getMonth() + 1;
      const anioActual = new Date().getFullYear();
      
      if (fecha.getMonth() + 1 === mesActual && fecha.getFullYear() === anioActual) {
        const monto = ingreso.moneda === 'USD' ? ingreso.monto * 1000 : ingreso.monto;
        return sum + monto;
      }
      return sum;
    }, 0);
    
    return datosPorMes.map(mes => {
      const ingresoTotal = sueldoMensual + ingresosExtrasMensuales;
      const porcentajeAhorro = ingresoTotal > 0 ? ((ingresoTotal - mes.total) / ingresoTotal) * 100 : 0;
      
      return {
        ...mes,
        ingresoTotal,
        ahorro: ingresoTotal - mes.total,
        porcentajeAhorro
      };
    });
  }, [datosPorMes, sueldoFijo, ingresosExtras]);

  // Obtener años únicos para filtro
  const aniosUnicos = useMemo(() => {
    return [...new Set(datosPorMes.map(dato => dato.anio))].sort((a, b) => b - a);
  }, [datosPorMes]);

  // Obtener categorías únicas
  const categoriasUnicas = useMemo(() => {
    const categorias = new Set<string>();
    egresos.forEach(egreso => {
      if (egreso.categoria) categorias.add(egreso.categoria);
    });
    return Array.from(categorias).sort();
  }, [egresos]);

  const formatMes = (mes: number) => {
    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return meses[mes - 1];
  };

  if (egresosLoading || ingresosLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-500">Cargando datos de inflación personal...</p>
        </CardContent>
      </Card>
    );
  }

  if (inflacionPersonal.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-500">
            No hay suficientes datos para calcular la inflación personal. 
            Necesitas al menos gastos de dos meses diferentes.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Año</label>
              <select
                value={filtroAnio}
                onChange={(e) => setFiltroAnio(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos los años</option>
                {aniosUnicos.map((anio) => (
                  <option key={anio} value={anio}>
                    {anio}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
              <select
                value={filtroCategoria}
                onChange={(e) => setFiltroCategoria(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Inflación Total</option>
                {categoriasUnicas.map((categoria) => (
                  <option key={categoria} value={categoria}>
                    {categoria}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <Button 
                onClick={() => {
                  setFiltroAnio('');
                  setFiltroCategoria('');
                }} 
                variant="outline" 
                className="w-full"
              >
                Limpiar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumen de inflación */}
      <Card>
        <CardHeader>
          <CardTitle>Tu Inflación Personal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {datosFiltrados.slice(0, 3).map((dato) => (
              <div key={dato.fechaKey} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">
                    {formatMes(dato.mes)} {dato.anio}
                  </h3>
                  <div className="flex items-center">
                    {dato.inflacionTotal > 0 ? (
                      <TrendingUp className="h-4 w-4 text-red-500 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
                    )}
                    <span className={`font-bold ${dato.inflacionTotal > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {dato.inflacionTotal.toFixed(2)}%
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {filtroCategoria 
                    ? `Inflación en ${filtroCategoria}`
                    : 'Inflación total de gastos'
                  }
                </p>
                <p className="text-xs text-gray-500">
                  Gastos: ${dato.totalGastos.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabla detallada */}
      <Card>
        <CardHeader>
          <CardTitle>
            Detalle de Inflación y Ahorro
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Período</TableHead>
                <TableHead className="text-right">Gastos Totales</TableHead>
                <TableHead className="text-right">
                  {filtroCategoria ? `Inflación ${filtroCategoria}` : 'Inflación Total'}
                </TableHead>
                <TableHead className="text-right">Ahorro</TableHead>
                <TableHead className="text-right">% Ahorro</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {datosFiltrados.map((dato) => {
                const ahorroMes = ahorrosPorMes.find(a => a.fechaKey === dato.fechaKey);
                const inflacionMostrar = filtroCategoria 
                  ? dato.inflacionPorCategoria[filtroCategoria] || 0
                  : dato.inflacionTotal;
                
                return (
                  <TableRow key={dato.fechaKey}>
                    <TableCell>
                      {formatMes(dato.mes)} {dato.anio}
                    </TableCell>
                    <TableCell className="text-right">
                      ${dato.totalGastos.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={`font-semibold ${
                        inflacionMostrar > 0 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {inflacionMostrar.toFixed(2)}%
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={`font-semibold ${
                        (ahorroMes?.ahorro || 0) > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        ${(ahorroMes?.ahorro || 0).toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={`font-semibold ${
                        (ahorroMes?.porcentajeAhorro || 0) > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {(ahorroMes?.porcentajeAhorro || 0).toFixed(1)}%
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
