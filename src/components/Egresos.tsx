
import React, { useState } from 'react';
import { ArrowDown, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEgresos } from '@/hooks/useEgresos';
import { EgresoModal } from '@/components/EgresoModal';
import { useToast } from '@/hooks/use-toast';

export const Egresos: React.FC = () => {
  const { egresos, loading, deleteEgreso } = useEgresos();
  const [modalOpen, setModalOpen] = useState(false);
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    try {
      await deleteEgreso(id);
      toast({
        title: "Éxito",
        description: "Egreso eliminado correctamente",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el egreso",
        variant: "destructive",
      });
    }
  };

  const categorias = ['Alimentación', 'Transporte', 'Entretenimiento', 'Servicios', 'Salud', 'Educación', 'Otros'];

  const egresosPorCategoria = categorias.map(categoria => {
    const gastosCategoria = egresos.filter(e => e.categoria === categoria);
    const total = gastosCategoria.reduce((sum, e) => {
      const monto = e.moneda === 'USD' ? e.monto * 1000 : e.monto;
      return sum + monto;
    }, 0);
    return { categoria, total, cantidad: gastosCategoria.length };
  }).filter(c => c.cantidad > 0);

  const totalEgresos = egresos.reduce((sum, e) => {
    const monto = e.moneda === 'USD' ? e.monto * 1000 : e.monto;
    return sum + monto;
  }, 0);

  const promedioMensual = egresos.length > 0 ? totalEgresos / 30 : 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Cargando egresos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Egresos</h1>
        <p className="text-gray-600 mt-2">Controla tus gastos y analiza tus patrones de consumo</p>
      </div>

      {/* Resumen del Mes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Total del Mes</p>
              <p className="text-2xl font-bold text-red-600">${totalEgresos.toLocaleString()} ARS</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Promedio Diario</p>
              <p className="text-2xl font-bold text-gray-900">${promedioMensual.toLocaleString()} ARS</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Transacciones</p>
              <p className="text-2xl font-bold text-gray-900">{egresos.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Agregar Nuevo Egreso */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center">
              <ArrowDown className="mr-2 h-5 w-5 text-red-600" />
              Egresos
            </CardTitle>
            <Button onClick={() => setModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Egreso
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Análisis por Categorías */}
      {egresosPorCategoria.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Gastos por Categoría</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {egresosPorCategoria.map((cat) => (
                <div key={cat.categoria} className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">{cat.categoria}</span>
                  <div className="text-right">
                    <span className="font-bold text-gray-900">${cat.total.toLocaleString()} ARS</span>
                    <span className="text-sm text-gray-500 ml-2">({cat.cantidad} transacciones)</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de Egresos Recientes */}
      <Card>
        <CardHeader>
          <CardTitle>Egresos Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          {egresos.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No hay egresos registrados. Agrega algunos usando el botón de arriba.
            </p>
          ) : (
            <div className="space-y-3">
              {egresos.map((egreso) => (
                <div key={egreso.id} className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">{egreso.descripcion}</p>
                        <p className="text-sm text-gray-600">{egreso.fecha}</p>
                        {egreso.categoria && (
                          <p className="text-xs text-gray-500">{egreso.categoria}</p>
                        )}
                      </div>
                      <div className="text-right flex items-center space-x-2">
                        <div>
                          <p className="font-bold text-red-600">
                            -${egreso.monto.toLocaleString()} {egreso.moneda}
                          </p>
                          {(egreso.descuento_porcentaje || egreso.cashback_porcentaje) && (
                            <div className="text-xs text-green-600">
                              {egreso.descuento_porcentaje && (
                                <p>{egreso.descuento_porcentaje}% desc. en {egreso.descuento_moneda}</p>
                              )}
                              {egreso.cashback_porcentaje && (
                                <p>{egreso.cashback_porcentaje}% cashback en {egreso.cashback_moneda}</p>
                              )}
                            </div>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(egreso.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <EgresoModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
};
