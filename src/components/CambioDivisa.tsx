
import React, { useState } from 'react';
import { ArrowUpDown, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const CambioDivisa: React.FC = () => {
  const cambiosRecientes = [
    { id: 1, monedaOrigen: 'ARS', monedaDestino: 'USD', montoOrigen: 100000, montoDestino: 100, tasa: 1000, fecha: '2024-11-28' },
    { id: 2, monedaOrigen: 'ARS', monedaDestino: 'EUR', montoOrigen: 50000, montoDestino: 45, tasa: 1111, fecha: '2024-11-25' },
  ];

  const saldosPorMoneda = [
    { moneda: 'ARS', saldo: 65000, simbolo: '$' },
    { moneda: 'USD', saldo: 1800, simbolo: '$' },
    { moneda: 'EUR', saldo: 450, simbolo: '€' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Cambio de Divisa</h1>
        <p className="text-gray-600 mt-2">Gestiona tus cambios de moneda y protégete de la inflación</p>
      </div>

      {/* Saldos por Moneda */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {saldosPorMoneda.map((saldo) => (
          <Card key={saldo.moneda}>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">{saldo.moneda}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {saldo.simbolo}{saldo.saldo.toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Nuevo Cambio */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center">
              <ArrowUpDown className="mr-2 h-5 w-5 text-blue-600" />
              Realizar Cambio
            </CardTitle>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Cambio
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Desde</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                <option value="ARS">ARS - Peso Argentino</option>
                <option value="USD">USD - Dólar</option>
                <option value="EUR">EUR - Euro</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Hacia</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                <option value="USD">USD - Dólar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="ARS">ARS - Peso Argentino</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Monto</label>
              <input
                type="number"
                placeholder="20,000"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">
              Tasa estimada: 1 USD = 1,000 ARS
            </p>
            <p className="text-lg font-semibold text-blue-700">
              Recibirás aproximadamente: $20 USD
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Historial de Cambios */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Cambios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {cambiosRecientes.map((cambio) => (
              <div key={cambio.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">
                    {cambio.monedaOrigen} → {cambio.monedaDestino}
                  </p>
                  <p className="text-sm text-gray-600">{cambio.fecha}</p>
                  <p className="text-sm text-gray-500">Tasa: {cambio.tasa.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-red-600">
                    -{cambio.montoOrigen.toLocaleString()} {cambio.monedaOrigen}
                  </p>
                  <p className="font-medium text-green-600">
                    +{cambio.montoDestino.toLocaleString()} {cambio.monedaDestino}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
