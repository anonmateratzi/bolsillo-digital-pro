
import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useInflacion } from '@/hooks/useInflacion';
import { Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const InflacionList: React.FC = () => {
  const { inflacionData, loading, deleteInflacion } = useInflacion();
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [filtroAnio, setFiltroAnio] = useState('');
  const [filtroMes, setFiltroMes] = useState('');
  const { toast } = useToast();

  // Filtrar datos según los filtros seleccionados
  const datosFiltrados = useMemo(() => {
    return inflacionData.filter(dato => {
      const cumpleCategoria = !filtroCategoria || 
        dato.categoria.toLowerCase().includes(filtroCategoria.toLowerCase());
      const cumpleAnio = !filtroAnio || dato.anio.toString() === filtroAnio;
      const cumpleMes = !filtroMes || dato.mes.toString() === filtroMes;
      
      return cumpleCategoria && cumpleAnio && cumpleMes;
    });
  }, [inflacionData, filtroCategoria, filtroAnio, filtroMes]);

  // Obtener categorías únicas para el filtro
  const categoriasUnicas = useMemo(() => {
    return [...new Set(inflacionData.map(dato => dato.categoria))].sort();
  }, [inflacionData]);

  // Obtener años únicos para el filtro
  const aniosUnicos = useMemo(() => {
    return [...new Set(inflacionData.map(dato => dato.anio))].sort((a, b) => b - a);
  }, [inflacionData]);

  // Calcular inflación total por período
  const inflacionTotal = useMemo(() => {
    if (datosFiltrados.length === 0) return null;
    
    const porMes = datosFiltrados.reduce((acc, dato) => {
      const key = `${dato.anio}-${dato.mes}`;
      if (!acc[key]) {
        acc[key] = { anio: dato.anio, mes: dato.mes, total: 0, categorias: [] };
      }
      acc[key].total += dato.porcentaje_inflacion;
      acc[key].categorias.push(dato.categoria);
      return acc;
    }, {} as Record<string, { anio: number; mes: number; total: number; categorias: string[] }>);
    
    return Object.values(porMes).sort((a, b) => b.anio - a.anio || b.mes - a.mes);
  }, [datosFiltrados]);

  const handleDelete = async (id: string) => {
    try {
      await deleteInflacion(id);
      toast({
        title: "Éxito",
        description: "Dato de inflación eliminado correctamente",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el dato",
        variant: "destructive",
      });
    }
  };

  const limpiarFiltros = () => {
    setFiltroCategoria('');
    setFiltroAnio('');
    setFiltroMes('');
  };

  const formatMes = (mes: number) => {
    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return meses[mes - 1];
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-500">Cargando datos de inflación...</p>
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="filtroCategoria">Categoría</Label>
              <select
                id="filtroCategoria"
                value={filtroCategoria}
                onChange={(e) => setFiltroCategoria(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todas las categorías</option>
                {categoriasUnicas.map((categoria) => (
                  <option key={categoria} value={categoria}>
                    {categoria}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="filtroAnio">Año</Label>
              <select
                id="filtroAnio"
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
              <Label htmlFor="filtroMes">Mes</Label>
              <select
                id="filtroMes"
                value={filtroMes}
                onChange={(e) => setFiltroMes(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos los meses</option>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((mes) => (
                  <option key={mes} value={mes}>
                    {formatMes(mes)}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <Button onClick={limpiarFiltros} variant="outline" className="w-full">
                Limpiar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumen de inflación total por mes */}
      {inflacionTotal && inflacionTotal.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Inflación Total por Mes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {inflacionTotal.map((item, index) => (
                <div key={`${item.anio}-${item.mes}`} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">
                      {formatMes(item.mes)} {item.anio}
                    </h3>
                    <div className="flex items-center">
                      {item.total > 0 ? (
                        <TrendingUp className="h-4 w-4 text-red-500 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
                      )}
                      <span className={`font-bold ${item.total > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {item.total.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {item.categorias.length} categoría{item.categorias.length !== 1 ? 's' : ''}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabla de datos detallados */}
      <Card>
        <CardHeader>
          <CardTitle>
            Datos de Inflación 
            {datosFiltrados.length !== inflacionData.length && (
              <span className="text-sm font-normal text-gray-500">
                ({datosFiltrados.length} de {inflacionData.length} registros)
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {datosFiltrados.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              {inflacionData.length === 0 
                ? "No hay datos de inflación registrados. Agrega algunos datos usando el formulario."
                : "No se encontraron datos que coincidan con los filtros seleccionados."
              }
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Período</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead className="text-right">Inflación (%)</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead className="text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {datosFiltrados.map((dato) => (
                  <TableRow key={dato.id}>
                    <TableCell>
                      {formatMes(dato.mes)} {dato.anio}
                    </TableCell>
                    <TableCell>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {dato.categoria}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={`font-semibold ${
                        dato.porcentaje_inflacion > 0 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {dato.porcentaje_inflacion.toFixed(2)}%
                      </span>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {dato.descripcion || '-'}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(dato.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
