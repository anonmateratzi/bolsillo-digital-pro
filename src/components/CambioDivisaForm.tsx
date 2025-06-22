
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { useCambiosDivisa } from '@/hooks/useCambiosDivisa';

export const CambioDivisaForm = () => {
  const [formData, setFormData] = useState({
    montoOrigen: '',
    monedaOrigen: 'USD',
    montoDestino: '',
    monedaDestino: 'ARS',
    tasaCambio: '',
    fecha: new Date().toISOString().split('T')[0],
    tipoOrigen: 'efectivo' as 'efectivo' | 'inversion',
    tickerOrigen: '',
    notas: ''
  });

  const { addCambio } = useCambiosDivisa();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addCambio({
        monto_origen: parseFloat(formData.montoOrigen),
        moneda_origen: formData.monedaOrigen,
        monto_destino: parseFloat(formData.montoDestino),
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
        monedaOrigen: 'USD',
        montoDestino: '',
        monedaDestino: 'ARS',
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
    
    // Auto-calculate conversion
    if (field === 'montoOrigen' && formData.tasaCambio) {
      const converted = parseFloat(value) * parseFloat(formData.tasaCambio);
      setFormData(prev => ({ ...prev, montoDestino: converted.toFixed(2) }));
    } else if (field === 'tasaCambio' && formData.montoOrigen) {
      const converted = parseFloat(formData.montoOrigen) * parseFloat(value);
      setFormData(prev => ({ ...prev, montoDestino: converted.toFixed(2) }));
    }
  };

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
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="ARS">ARS</option>
                <option value="BTC">BTC</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tasa de Cambio
              </label>
              <input
                type="number"
                step="0.000001"
                value={formData.tasaCambio}
                onChange={(e) => handleInputChange('tasaCambio', e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monto Destino
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.montoDestino}
                onChange={(e) => setFormData(prev => ({ ...prev, montoDestino: e.target.value }))}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Moneda Destino
              </label>
              <select
                value={formData.monedaDestino}
                onChange={(e) => setFormData(prev => ({ ...prev, monedaDestino: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ARS">ARS</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="BTC">BTC</option>
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
          </div>

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
