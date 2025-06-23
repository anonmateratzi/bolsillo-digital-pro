
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { useCambiosDivisa } from '@/hooks/useCambiosDivisa';

export const CambioDivisaForm = () => {
  const [formData, setFormData] = useState({
    montoOrigen: '',
    monedaOrigen: 'ARS',
    monedaDestino: 'USD',
    tasaCambio: '',
    fecha: new Date().toISOString().split('T')[0],
    tipoOrigen: 'efectivo' as 'efectivo' | 'inversion',
    tickerOrigen: '',
    notas: ''
  });

  const { addCambio } = useCambiosDivisa();
  const [loading, setLoading] = useState(false);

  const calculateConversion = () => {
    if (formData.montoOrigen && formData.tasaCambio) {
      // Si cambio de ARS a otra moneda, divido por la tasa
      // Si cambio de otra moneda a ARS, multiplico por la tasa
      let montoDestino: number;
      
      if (formData.monedaOrigen === 'ARS' && formData.monedaDestino !== 'ARS') {
        montoDestino = parseFloat(formData.montoOrigen) / parseFloat(formData.tasaCambio);
      } else if (formData.monedaOrigen !== 'ARS' && formData.monedaDestino === 'ARS') {
        montoDestino = parseFloat(formData.montoOrigen) * parseFloat(formData.tasaCambio);
      } else {
        // Para otros casos, usar la tasa directamente
        montoDestino = parseFloat(formData.montoOrigen) / parseFloat(formData.tasaCambio);
      }
      
      return montoDestino.toFixed(2);
    }
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const montoDestino = calculateConversion();
    if (!montoDestino) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos requeridos.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      await addCambio({
        monto_origen: parseFloat(formData.montoOrigen),
        moneda_origen: formData.monedaOrigen,
        monto_destino: parseFloat(montoDestino),
        moneda_destino: formData.monedaDestino,
        tasa_cambio: parseFloat(formData.tasaCambio),
        fecha: formData.fecha,
        tipo_origen: formData.tipoOrigen,
        ticker_origen: formData.tickerOrigen || null,
        notas: formData.notas || null
      });

      toast({
        title: "¡Cambio registrado!",
        description: "El cambio de divisa se ha guardado exitosamente.",
      });

      // Reset form
      setFormData({
        montoOrigen: '',
        monedaOrigen: 'ARS',
        monedaDestino: 'USD',
        tasaCambio: '',
        fecha: new Date().toISOString().split('T')[0],
        tipoOrigen: 'efectivo',
        tickerOrigen: '',
        notas: ''
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar el cambio de divisa.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const montoDestino = calculateConversion();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nuevo Cambio de Divisa</CardTitle>
        <CardDescription>
          Registra un cambio de divisas realizado
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monto Origen
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.montoOrigen}
                onChange={(e) => handleInputChange('montoOrigen', e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="20000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Moneda Origen
              </label>
              <select
                value={formData.monedaOrigen}
                onChange={(e) => setFormData(prev => ({ ...prev, monedaOrigen: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ARS">ARS</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="BTC">BTC</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tasa de Cambio (1 {formData.monedaDestino} = X {formData.monedaOrigen})
              </label>
              <input
                type="number"
                step="0.000001"
                value={formData.tasaCambio}
                onChange={(e) => handleInputChange('tasaCambio', e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="1200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Moneda Destino
              </label>
              <select
                value={formData.monedaDestino}
                onChange={(e) => setFormData(prev => ({ ...prev, monedaDestino: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="USD">USD</option>
                <option value="ARS">ARS</option>
                <option value="EUR">EUR</option>
                <option value="BTC">BTC</option>
              </select>
            </div>
          </div>

          {montoDestino && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">
                Conversión estimada:
              </p>
              <p className="text-lg font-semibold text-blue-700">
                {formData.montoOrigen} {formData.monedaOrigen} = {montoDestino} {formData.monedaDestino}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Origen
              </label>
              <select
                value={formData.tipoOrigen}
                onChange={(e) => setFormData(prev => ({ ...prev, tipoOrigen: e.target.value as 'efectivo' | 'inversion' }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="efectivo">Efectivo</option>
                <option value="inversion">Inversión</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha
              </label>
              <input
                type="date"
                value={formData.fecha}
                onChange={(e) => setFormData(prev => ({ ...prev, fecha: e.target.value }))}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {formData.tipoOrigen === 'inversion' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ticker
              </label>
              <input
                type="text"
                value={formData.tickerOrigen}
                onChange={(e) => setFormData(prev => ({ ...prev, tickerOrigen: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: AAPL, BTC"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notas (opcional)
            </label>
            <textarea
              value={formData.notas}
              onChange={(e) => setFormData(prev => ({ ...prev, notas: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Información adicional sobre el cambio..."
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Guardando...' : 'Registrar Cambio'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
