
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useInversiones } from '@/hooks/useInversiones';
import { useToast } from '@/hooks/use-toast';

interface InversionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InversionModal: React.FC<InversionModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    ticker: '',
    nombre_activo: '',
    tipo_inversion: 'cantidad',
    cantidad_activos: '',
    monto_invertido: '',
    precio_compra: '',
    precio_actual: '',
    moneda_origen: 'USD',
    fecha_compra: new Date().toISOString().split('T')[0],
    notas: ''
  });

  const { addInversion } = useInversiones();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const inversionData = {
        ticker: formData.ticker,
        nombre_activo: formData.nombre_activo || null,
        tipo_inversion: formData.tipo_inversion,
        cantidad_activos: formData.cantidad_activos ? parseFloat(formData.cantidad_activos) : null,
        monto_invertido: formData.monto_invertido ? parseFloat(formData.monto_invertido) : null,
        precio_compra: formData.precio_compra ? parseFloat(formData.precio_compra) : null,
        precio_actual: formData.precio_actual ? parseFloat(formData.precio_actual) : null,
        moneda_origen: formData.moneda_origen,
        fecha_compra: formData.fecha_compra,
        notas: formData.notas || null
      };

      await addInversion(inversionData);
      
      toast({
        title: "Inversión agregada",
        description: "La inversión se ha registrado correctamente",
      });
      
      setFormData({
        ticker: '',
        nombre_activo: '',
        tipo_inversion: 'cantidad',
        cantidad_activos: '',
        monto_invertido: '',
        precio_compra: '',
        precio_actual: '',
        moneda_origen: 'USD',
        fecha_compra: new Date().toISOString().split('T')[0],
        notas: ''
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo agregar la inversión",
        variant: "destructive",
      });
    }
  };

  const calcularMontoAproximado = () => {
    if (formData.tipo_inversion === 'cantidad' && formData.cantidad_activos && formData.precio_compra) {
      return parseFloat(formData.cantidad_activos) * parseFloat(formData.precio_compra);
    }
    if (formData.tipo_inversion === 'monto' && formData.monto_invertido) {
      return parseFloat(formData.monto_invertido);
    }
    return 0;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Agregar Nueva Inversión</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ticker">Ticker/Símbolo *</Label>
              <Input
                id="ticker"
                value={formData.ticker}
                onChange={(e) => setFormData(prev => ({ ...prev, ticker: e.target.value }))}
                placeholder="BTC, AAPL, etc."
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="nombre_activo">Nombre del Activo</Label>
              <Input
                id="nombre_activo"
                value={formData.nombre_activo}
                onChange={(e) => setFormData(prev => ({ ...prev, nombre_activo: e.target.value }))}
                placeholder="Bitcoin, Apple Inc., etc."
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipo_inversion">Tipo de Inversión</Label>
            <Select value={formData.tipo_inversion} onValueChange={(value) => setFormData(prev => ({ ...prev, tipo_inversion: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cantidad">Por Cantidad</SelectItem>
                <SelectItem value="monto">Por Monto Invertido</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {formData.tipo_inversion === 'cantidad' ? (
              <div className="space-y-2">
                <Label htmlFor="cantidad_activos">Cantidad</Label>
                <Input
                  id="cantidad_activos"
                  type="number"
                  step="0.0001"
                  value={formData.cantidad_activos}
                  onChange={(e) => setFormData(prev => ({ ...prev, cantidad_activos: e.target.value }))}
                  placeholder="2.5"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="monto_invertido">Monto Invertido</Label>
                <Input
                  id="monto_invertido"
                  type="number"
                  step="0.01"
                  value={formData.monto_invertido}
                  onChange={(e) => setFormData(prev => ({ ...prev, monto_invertido: e.target.value }))}
                  placeholder="1000"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="precio_compra">Precio de Compra</Label>
              <Input
                id="precio_compra"
                type="number"
                step="0.0001"
                value={formData.precio_compra}
                onChange={(e) => setFormData(prev => ({ ...prev, precio_compra: e.target.value }))}
                placeholder="95000"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="precio_actual">Precio Actual (Opcional)</Label>
              <Input
                id="precio_actual"
                type="number"
                step="0.0001"
                value={formData.precio_actual}
                onChange={(e) => setFormData(prev => ({ ...prev, precio_actual: e.target.value }))}
                placeholder="98000"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="moneda_origen">Moneda</Label>
              <Select value={formData.moneda_origen} onValueChange={(value) => setFormData(prev => ({ ...prev, moneda_origen: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="ARS">ARS</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fecha_compra">Fecha de Compra</Label>
            <Input
              id="fecha_compra"
              type="date"
              value={formData.fecha_compra}
              onChange={(e) => setFormData(prev => ({ ...prev, fecha_compra: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notas">Notas (Opcional)</Label>
            <Input
              id="notas"
              value={formData.notas}
              onChange={(e) => setFormData(prev => ({ ...prev, notas: e.target.value }))}
              placeholder="Notas adicionales..."
            />
          </div>

          {/* Mostrar monto aproximado */}
          {calcularMontoAproximado() > 0 && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Monto Aproximado:</strong> ${calcularMontoAproximado().toLocaleString()} {formData.moneda_origen}
              </p>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              Agregar Inversión
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
