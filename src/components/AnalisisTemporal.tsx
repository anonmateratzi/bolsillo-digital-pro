
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, Calendar, BarChart3 } from 'lucide-react';
import { useIngresos } from '@/hooks/useIngresos';
import { useEgresos } from '@/hooks/useEgresos';
import { useBalancesConsolidados } from '@/hooks/useBalancesConsolidados';

export const AnalisisTemporal: React.FC = () => {
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState('6');
  const { sueldoFijo, ingresosExtras } = useIngresos();
  const { egresos } = useEgresos();
  const { balances } = useBalancesConsolidados();

  // Generar datos de evolución mensual
  const generarDatosEvolucion = () => {
    const meses = parseInt(periodoSeleccionado);
    const datos = [];
    const hoy = new Date();
    
    for (let i = meses - 1; i >= 0; i--) {
      const fecha = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1);
      const mesAnio = `${fecha.getMonth() + 1}/${fecha.getFullYear()}`;
      
      // Calcular ingresos del mes
      const ingresosMes = ingresosExtras
        .filter(ing => {
          const fechaIng = new Date(ing.fecha);
          return fechaIng.getMonth() === fecha.getMonth() && fechaIng.getFullYear() === fecha.getFullYear();
        })
        .reduce((sum, ing) => sum + (ing.moneda === 'USD' ? ing.monto * 1000 : ing.monto), 0);
      
      const totalIngresos = (sueldoFijo?.monto || 0) + ingresosMes;
      
      // Calcular egresos del mes
      const egresosMes = egresos
        .filter(eg => {
          const fechaEg = new Date(eg.fecha);
          return fechaEg.getMonth() === fecha.getMonth() && fechaEg.getFullYear() === fecha.getFullYear();
        })
        .reduce((sum, eg) => sum + (eg.moneda === 'USD' ? eg.monto * 1000 : eg.monto), 0);
      
      datos.push({
        mes: mesAnio,
        ingresos: totalIngresos,
        egresos: egresosMes,
        balance: totalIngresos - egresosMes
      });
    }
    
    return datos;
  };

  // Generar datos de categorías de egresos
  const generarDatosCategorias = () => {
    const categorias = {};
    
    egresos.forEach(egreso => {
      const categoria = egreso.categoria || 'Sin categoría';
      const monto = egreso.moneda === 'USD' ? egreso.monto * 1000 : egreso.monto;
      
      if (categorias[categoria]) {
        categorias[categoria] += monto;
      } else {
        categorias[categoria] = monto;
      }
    });
    
    return Object.entries(categorias)
      .map(([categoria, monto]) => ({ categoria, monto }))
      .sort((a, b) => b.monto - a.monto);
  };

  const datosEvolucion = generarDatosEvolucion();
  const datosCategorias = generarDatosCategorias();
  const patrimonioTotal = balances.reduce((sum, balance) => sum + balance.valor_ars, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Análisis Temporal</h1>
          <p className="text-gray-600 mt-2">Evolución de tus finanzas a lo largo del tiempo</p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <Select value={periodoSeleccionado} onValueChange={setPeriodoSeleccionado}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3">Últimos 3 meses</SelectItem>
              <SelectItem value="6">Últimos 6 meses</SelectItem>
              <SelectItem value="12">Último año</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Patrimonio Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${patrimonioTotal.toLocaleString()} ARS
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Promedio Mensual</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${datosEvolucion.length > 0 ? 
                    Math.round(datosEvolucion.reduce((sum, d) => sum + d.balance, 0) / datosEvolucion.length).toLocaleString() 
                    : 0} ARS
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Mejor Mes</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${datosEvolucion.length > 0 ? 
                    Math.max(...datosEvolucion.map(d => d.balance)).toLocaleString() 
                    : 0} ARS
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="evolucion" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="evolucion">Evolución Mensual</TabsTrigger>
          <TabsTrigger value="categorias">Análisis por Categorías</TabsTrigger>
          <TabsTrigger value="proyeccion">Proyecciones</TabsTrigger>
        </TabsList>

        <TabsContent value="evolucion" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Evolución de Ingresos, Egresos y Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={datosEvolucion}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${value.toLocaleString()} ARS`} />
                    <Line type="monotone" dataKey="ingresos" stroke="#10b981" strokeWidth={2} name="Ingresos" />
                    <Line type="monotone" dataKey="egresos" stroke="#ef4444" strokeWidth={2} name="Egresos" />
                    <Line type="monotone" dataKey="balance" stroke="#3b82f6" strokeWidth={3} name="Balance" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categorias" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Egresos por Categoría</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={datosCategorias}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="categoria" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${value.toLocaleString()} ARS`} />
                    <Bar dataKey="monto" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="proyeccion" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Proyecciones Financieras</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold text-blue-900">Proyección 6 meses</h3>
                    <p className="text-2xl font-bold text-blue-700">
                      ${datosEvolucion.length > 0 ? 
                        (patrimonioTotal + (datosEvolucion[datosEvolucion.length - 1]?.balance || 0) * 6).toLocaleString() 
                        : 0} ARS
                    </p>
                    <p className="text-sm text-blue-600">Basado en tendencia actual</p>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h3 className="font-semibold text-green-900">Proyección 1 año</h3>
                    <p className="text-2xl font-bold text-green-700">
                      ${datosEvolucion.length > 0 ? 
                        (patrimonioTotal + (datosEvolucion[datosEvolucion.length - 1]?.balance || 0) * 12).toLocaleString() 
                        : 0} ARS
                    </p>
                    <p className="text-sm text-green-600">Basado en tendencia actual</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
