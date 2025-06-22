
import React, { useState } from 'react';
import { DollarSign, Plus, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const Ingresos: React.FC = () => {
  const [sueldoFijo, setSueldoFijo] = useState(120000);
  const [editandoSueldo, setEditandoSueldo] = useState(false);

  const ingresosExtras = [
    { id: 1, descripcion: 'Freelance', monto: 25000, fecha: '2024-11-28', moneda: 'ARS' },
    { id: 2, descripcion: 'Venta', monto: 15000, fecha: '2024-11-25', moneda: 'ARS' },
  ];

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
                  <p className="text-3xl font-bold text-gray-900">${sueldoFijo.toLocaleString()} ARS</p>
                  <p className="text-sm text-gray-500">Monto mensual</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditandoSueldo(!editandoSueldo)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
              
              {editandoSueldo && (
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={sueldoFijo}
                    onChange={(e) => setSueldoFijo(Number(e.target.value))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <Button onClick={() => setEditandoSueldo(false)}>
                    Guardar
                  </Button>
                </div>
              )}
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
                <span className="font-semibold">${sueldoFijo.toLocaleString()} ARS</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Ingresos Extras:</span>
                <span className="font-semibold">$40,000 ARS</span>
              </div>
              <hr />
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="text-green-600">${(sueldoFijo + 40000).toLocaleString()} ARS</span>
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
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Agregar Ingreso
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {ingresosExtras.map((ingreso) => (
              <div key={ingreso.id} className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{ingreso.descripcion}</p>
                  <p className="text-sm text-gray-600">{ingreso.fecha}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">+${ingreso.monto.toLocaleString()} {ingreso.moneda}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
