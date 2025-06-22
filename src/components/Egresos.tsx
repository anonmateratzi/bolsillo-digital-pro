
import React, { useState } from 'react';
import { ArrowDown, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const Egresos: React.FC = () => {
  const egresos = [
    { 
      id: 1, 
      descripcion: 'Supermercado', 
      monto: 25000, 
      fecha: '2024-11-28', 
      categoria: 'Alimentación',
      moneda: 'ARS',
      descuento: { tiene: true, porcentaje: 10, moneda: 'ARS' }
    },
    { 
      id: 2, 
      descripcion: 'Combustible', 
      monto: 15000, 
      fecha: '2024-11-27', 
      categoria: 'Transporte',
      moneda: 'ARS',
      descuento: { tiene: false }
    },
    { 
      id: 3, 
      descripcion: 'Netflix', 
      monto: 12, 
      fecha: '2024-11-25', 
      categoria: 'Entretenimiento',
      moneda: 'USD',
      descuento: { tiene: false }
    },
  ];

  const categorias = [
    'Alimentación',
    'Transporte', 
    'Entretenimiento',
    'Servicios',
    'Salud',
    'Educación',
    'Otros'
  ];

  const egresosPorCategoria = categorias.map(categoria => {
    const gastosCategoria = egresos.filter(e => e.categoria === categoria);
    const total = gastosCategoria.reduce((sum, e) => {
      if (e.moneda === 'USD') return sum + (e.monto * 1000); // Conversión aproximada
      return sum + e.monto;
    }, 0);
    return { categoria, total, cantidad: gastosCategoria.length };
  }).filter(c => c.cantidad > 0);

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
              <p className="text-2xl font-bold text-red-600">$52,000 ARS</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Promedio Diario</p>
              <p className="text-2xl font-bold text-gray-900">$1,733 ARS</p>
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
              Agregar Egreso
            </CardTitle>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Egreso
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Descripción</label>
              <input
                type="text"
                placeholder="Supermercado, Combustible..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Monto</label>
              <input
                type="number"
                placeholder="25,000"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Moneda</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                <option value="ARS">ARS</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Categoría</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                <option value="">Seleccionar...</option>
                {categorias.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Sección de Descuentos/Cashback */}
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">Descuentos y Cashback (Opcional)</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">¿Tiene descuento?</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option value="no">No</option>
                  <option value="descuento">Descuento</option>
                  <option value="cashback">Cashback</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Porcentaje</label>
                <input
                  type="number"
                  placeholder="10"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Moneda del beneficio</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option value="ARS">ARS</option>
                  <option value="USD">USD</option>
                  <option value="points">Puntos</option>
                </select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Análisis por Categorías */}
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

      {/* Lista de Egresos Recientes */}
      <Card>
        <CardHeader>
          <CardTitle>Egresos Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {egresos.map((egreso) => (
              <div key={egreso.id} className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">{egreso.descripcion}</p>
                      <p className="text-sm text-gray-600">{egreso.fecha}</p>
                      <p className="text-xs text-gray-500">{egreso.categoria}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-red-600">
                        -${egreso.monto.toLocaleString()} {egreso.moneda}
                      </p>
                      {egreso.descuento.tiene && (
                        <p className="text-xs text-green-600">
                          {egreso.descuento.porcentaje}% desc. en {egreso.descuento.moneda}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
