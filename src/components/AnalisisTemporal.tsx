
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useIngresos } from '@/hooks/useIngresos';
import { useEgresos } from '@/hooks/useEgresos';
import { useCambiosDivisa } from '@/hooks/useCambiosDivisa';
import { TrendingUp, DollarSign, Calendar, PieChart as PieChartIcon } from 'lucide-react';

export const AnalisisTemporal: React.FC = () => {
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState('6meses');
  const { sueldoFijo, ingresosExtras } = useIngresos();
  const { egresos } = useEgresos();
  const { cambios } = useCambiosDivisa();

  const obtenerFechaInicio = (periodo: string) => {
    const ahora = new Date();
    switch (periodo) {
      case '3meses':
        return new Date(ahora.getFullYear(), ahora.getMonth() - 3, 1);
      case '6meses':
        return new Date(ahora.getFullYear(), ahora.getMonth() - 6, 1);
      case '1ano':
        return new Date(ahora.getFullYear() - 1, ahora.getMonth(), 1);
      default:
        return new Date(ahora.getFullYear(), ahora.getMonth() - 6, 1);
    }
  };

  const datosEvolucion = useMemo(() => {
    const fechaInicio = obtenerFeclaInicio(periodoSeleccionado);
    const mesesData: Record<string, { mes: string; ingresos: number; egresos: number; ahorro: number }> = {};

    // Generar meses vacíos
    for (let d = new Date(fechaInicio); d <= new Date(); d.setMonth(d.getMonth() + 1)) {
      const mesKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      mesesData[mesKey] = {
        mes: d.toLocaleDateString('es-ES', { month: 'short', year: '2-digit' }),
        ingresos: 0,
        egresos: 0,
        ahorro: 0
      };
    }

    // Agregar sueldo fijo a cada mes
    if (sueldoFijo) {
      Object.keys(mesesData).forEach(mesKey => {
        const sueldoEnARS = sueldoFijo.moneda === 'USD' ? (sueldoFijo.monto || 0) * 1000 : (sueldoFijo.monto || 0);
        mesesData[mesKey].ingresos += sueldoEnARS;
      });
    }

    // Agregar ingresos extras
    ingresosExtras.forEach(ingreso => {
      const fecha = new Date(ingreso.fecha);
      if (fecha >= fechaInicio) {
        const mesKey = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
        if (mesesData[mesKey]) {
          const montoEnARS = ingreso.moneda === 'USD' ? ingreso.monto * 1000 : ingreso.monto;
          mesesData[mesKey].ingresos += montoEnARS;
        }
      }
    });

    // Agregar egresos
    egresos.forEach(egreso => {
      const fecha = new Date(egreso.fecha);
      if (fecha >= fechaInicio) {
        const mesKey = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
        if (mesesData[mesKey]) {
          const montoEnARS = egreso.moneda === 'USD' ? egreso.monto * 1000 : egreso.monto;
          mesesData[mesKey].egresos += montoEnARS;
        }
      }
    });

    // Calcular ahorro
    Object.keys(mesesData).forEach(mesKey => {
      mesesData[mesKey].ahorro = mesesData[mesKey].ingresos - mesesData[mesKey].egresos;
    });

    return Object.values(mesesData);
  }, [periodoSeleccionado, sueldoFijo, ingresosExtras, egresos]);

  const datosCategoriasEgresos = useMemo(() => {
    const fechaInicio = obtenerFechaInicio(periodoSeleccionado);
    const categorias: Record<string, number> = {};

    egresos.forEach(egreso => {
      const fecha = new Date(egreso.fecha);
      if (fecha >= fechaInicio) {
        const categoria = egreso.categoria || 'Sin categoría';
        const montoEnARS = egreso.moneda === 'USD' ? egreso.monto * 1000 : egreso.monto;
        categorias[categoria] = (categorias[categoria] || 0) + montoEnARS;
      }
    });

    return Object.entries(categorias).map(([categoria, monto]) => ({
      categoria,
      monto
    })).sort((a, b) => b.monto - a.monto);
  }, [periodoSeleccionado, egresos]);

  const coloresPie = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00', '#ff00ff'];

  const promedioAhorro = datosEvolucion.length > 0 
    ? datosEvolucion.reduce((sum, item) => sum + item.ahorro, 0) / datosEvolucion.length 
    : 0;

  const promedioIngresos = datosEvolucion.length > 0 
    ? datosEvolucion.reduce((sum, item) => sum + item.ingresos, 0) / datosEvolucion.length 
    : 0;

  const porcentajeAhorroPromedio = promedioIngresos > 0 ? (promedioAhorro / promedioIngresos) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Análisis Temporal</h1>
          <p className="text-gray-600 mt-2">Evolución de tus finanzas en el tiempo</p>
        </div>
        
        <Select value={periodoSeleccionado} onValueChange={setPeriodoSeleccionado}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3meses">Últimos 3 meses</SelectItem>
            <SelectItem value="6meses">Últimos 6 meses</SelectItem>
            <SelectItem value="1ano">Último año</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Cards de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Promedio Mensual Ahorrado</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${promedioAhorro.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">ARS por mes</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">% Sueldo Ahorrado</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {porcentajeAhorroPromedio.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">Promedio del período</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Promedio Ingresos</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${promedioIngresos.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">ARS por mes</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de evolución */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="mr-2 h-5 w-5" />
            Evolución Temporal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={datosEvolucion}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, '']} />
              <Legend />
              <Line type="monotone" dataKey="ingresos" stroke="#82ca9d" name="Ingresos" />
              <Line type="monotone" dataKey="egresos" stroke="#ff7300" name="Egresos" />
              <Line type="monotone" dataKey="ahorro" stroke="#8884d8" name="Ahorro" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráficos de barras y torta */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ahorro por Mes</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={datosEvolucion}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, 'Ahorro']} />
                <Bar dataKey="ahorro" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChartIcon className="mr-2 h-5 w-5" />
              Egresos por Categoría
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={datosCategoriasEgresos}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ categoria, percent }) => `${categoria} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="monto"
                >
                  {datosCategoriasEgresos.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={coloresPie[index % coloresPie.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, 'Monto']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
