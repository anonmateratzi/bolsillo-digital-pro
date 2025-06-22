
import React, { useState } from 'react';
import { TrendingUp, Plus, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const Inversiones: React.FC = () => {
  const inversiones = [
    { 
      id: 1, 
      ticker: 'BTC', 
      nombre: 'Bitcoin', 
      cantidad: 0.025, 
      valorCompra: 95000, 
      valorActual: 98000, 
      monedaCompra: 'USD',
      tipo: 'cantidad'
    },
    { 
      id: 2, 
      ticker: 'AAPL', 
      nombre: 'Apple Inc.', 
      cantidad: 10, 
      valorCompra: 150, 
      valorActual: 155, 
      monedaCompra: 'USD',
      tipo: 'cantidad'
    },
    { 
      id: 3, 
      ticker: 'ETH', 
      nombre: 'Ethereum', 
      monto: 2000, 
      valorCompra: 3500, 
      valorActual: 3650, 
      monedaCompra: 'USD',
      tipo: 'monto'
    }
  ];

  const calcularGananciaPerdida = (inversion: typeof inversiones[0]) => {
    if (inversion.tipo === 'cantidad') {
      const valorInicialTotal = inversion.cantidad * inversion.valorCompra;
      const valorActualTotal = inversion.cantidad * inversion.valorActual;
      return valorActualTotal - valorInicialTotal;
    } else {
      const porcentajeCambio = (inversion.valorActual - inversion.valorCompra) / inversion.valorCompra;
      return inversion.monto * porcentajeCambio;
    }
  };

  const valorTotalPortfolio = inversiones.reduce((total, inv) => {
    if (inv.tipo === 'cantidad') {
      return total + (inv.cantidad * inv.valorActual);
    } else {
      const porcentajeCambio = (inv.valorActual - inv.valorCompra) / inv.valorCompra;
      return total + inv.monto * (1 + porcentajeCambio);
    }
  }, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Inversiones</h1>
        <p className="text-gray-600 mt-2">Gestiona tu portfolio de inversiones y criptomonedas</p>
      </div>

      {/* Resumen del Portfolio */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Valor Total</p>
              <p className="text-2xl font-bold text-gray-900">${valorTotalPortfolio.toLocaleString()} USD</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Ganancia/Pérdida</p>
              <p className="text-2xl font-bold text-green-600">+$325 USD</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Rendimiento</p>
              <p className="text-2xl font-bold text-green-600">+5.2%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Agregar Nueva Inversión */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-blue-600" />
              Agregar Inversión
            </CardTitle>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nueva Inversión
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Ticker/Símbolo</label>
              <input
                type="text"
                placeholder="BTC, AAPL, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Tipo</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                <option value="cantidad">Por Cantidad</option>
                <option value="monto">Por Monto Invertido</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Cantidad/Monto</label>
              <input
                type="number"
                placeholder="2 ETH o $1000"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Moneda de Compra</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                <option value="USD">USD</option>
                <option value="ARS">ARS</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Inversiones */}
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Actual</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {inversiones.map((inversion) => {
              const gananciaPerdida = calcularGananciaPerdida(inversion);
              const esGanancia = gananciaPerdida >= 0;
              
              return (
                <div key={inversion.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">{inversion.ticker}</p>
                        <p className="text-sm text-gray-600">{inversion.nombre}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="mt-2 grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">
                          {inversion.tipo === 'cantidad' ? 'Cantidad' : 'Monto Invertido'}
                        </p>
                        <p className="font-medium">
                          {inversion.tipo === 'cantidad' 
                            ? `${inversion.cantidad} ${inversion.ticker}`
                            : `$${inversion.monto.toLocaleString()} ${inversion.monedaCompra}`
                          }
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Valor Actual</p>
                        <p className="font-medium">${inversion.valorActual.toLocaleString()} {inversion.monedaCompra}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Ganancia/Pérdida</p>
                        <p className={`font-bold ${esGanancia ? 'text-green-600' : 'text-red-600'}`}>
                          {esGanancia ? '+' : ''}${gananciaPerdida.toFixed(2)} {inversion.monedaCompra}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
