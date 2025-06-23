
import React, { useState } from 'react';
import { DollarSign, Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useIngresos } from '@/hooks/useIngresos';
import { IngresoModal } from '@/components/IngresoModal';
import { useToast } from '@/hooks/use-toast';

export const Ingresos: React.FC = () => {
  const { sueldoFijo, ingresosExtras, loading, deleteIngresoExtra } = useIngresos();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'sueldo' | 'extra'>('extra');
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    try {
      await deleteIngresoExtra(id);
      toast({
        title: "Éxito",
        description: "Ingreso eliminado correctamente",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el ingreso",
        variant: "destructive",
      });
    }
  };

  const totalIngresosExtras = ingresosExtras.reduce((sum, ingreso) => {
    // Conversión simple para mostrar en ARS
    const monto = ingreso.moneda === 'USD' ? ingreso.monto * 1000 : ingreso.monto;
    return sum + monto;
  }, 0);

  const totalIngresos = (sueldoFijo?.monto || 0) + totalIngresosExtras;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Cargando ingresos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Ingresos</h1>
        <p className="text-gray-600 mt-2">Gestiona tu sueldo fijo y ingresos adicionales</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sueldo Fijo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="mr-2 h-5 w-5 text-green-600" />
              Sueldo Fijo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-gray-900">
                    ${sueldoFijo?.monto?.toLocaleString() || '0'} {sueldoFijo?.moneda || 'ARS'}
                  </p>
                  <p className="text-sm text-gray-500">Monto mensual</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setModalType('sueldo');
                    setModalOpen(true);
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resumen Mensual */}
        <Card>
          <CardHeader>
            <CardTitle>Resumen del Mes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Sueldo Fijo:</span>
                <span className="font-semibold">${sueldoFijo?.monto?.toLocaleString() || '0'} ARS</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Ingresos Extras:</span>
                <span className="font-semibold">${totalIngresosExtras.toLocaleString()} ARS</span>
              </div>
              <hr />
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="text-green-600">${totalIngresos.toLocaleString()} ARS</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ingresos Extras */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Ingresos Extras</CardTitle>
            <Button onClick={() => {
              setModalType('extra');
              setModalOpen(true);
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Agregar Ingreso
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {ingresosExtras.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No hay ingresos extras registrados. Agrega algunos usando el botón de arriba.
            </p>
          ) : (
            <div className="space-y-3">
              {ingresosExtras.map((ingreso) => (
                <div key={ingreso.id} className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{ingreso.descripcion}</p>
                    <p className="text-sm text-gray-600">{ingreso.fecha}</p>
                    {ingreso.categoria && (
                      <p className="text-xs text-gray-500">{ingreso.categoria}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-right">
                      <p className="font-bold text-green-600">+${ingreso.monto.toLocaleString()} {ingreso.moneda}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(ingreso.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <IngresoModal 
        open={modalOpen} 
        onOpenChange={setModalOpen} 
        type={modalType}
      />
    </div>
  );
};
