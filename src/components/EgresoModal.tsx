
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEgresos } from '@/hooks/useEgresos';
import { useToast } from '@/hooks/use-toast';

interface EgresoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CATEGORIAS = [
  'Alimentación',
  'Transporte', 
  'Entretenimiento',
  'Servicios',
  'Salud',
  'Educación',
  'Otros'
];

export const EgresoModal: React.FC<EgresoModalProps> = ({ open, onOpenChange }) => {
  const [descripcion, setDescripcion] = useState('');
  const [monto, setMonto] = useState('');
  const [moneda, setMoneda] = useState('ARS');
  const [categoria, setCategoria] = useState('');
  const [descuentoPorcentaje, setDescuentoPorcentaje] = useState('');
  const [descuentoMoneda, setDescuentoMoneda] = useState('ARS');
  const [cashbackPorcentaje, setCashbackPorcentaje] = useState('');
  const [cashbackMoneda, setCashbackMoneda] = useState('ARS');
  const [loading, setLoading] = useState(false);
  const { addEgreso } = useEgresos();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!descripcion || !monto) return;

    setLoading(true);
    try {
      await addEgreso({
        descripcion,
        monto: parseFloat(monto),
        moneda,
        categoria: categoria || null,
        descuento_porcentaje: descuentoPorcentaje ? parseFloat(descuentoPorcentaje) : null,
        descuento_moneda: descuentoPorcentaje ? descuentoMoneda : null,
        cashback_porcentaje: cashbackPorcentaje ? parseFloat(cashbackPorcentaje) : null,
        cashback_moneda: cashbackPorcentaje ? cashbackMoneda : null,
      });
      
      toast({
        title: "Éxito",
        description: "Egreso agregado correctamente",
      });
      
      // Reset form
      setDescripcion('');
      setMonto('');
      setMoneda('ARS');
      setCategoria('');
      setDescuentoPorcentaje('');
      setDescuentoMoneda('ARS');
      setCashbackPorcentaje('');
      setCashbackMoneda('ARS');
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar el egreso",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Agregar Egreso</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="descripcion">Descripción</Label>
              <Input
                id="descripcion"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Supermercado, Combustible..."
                required
              />
            </div>
            
            <div>
              <Label htmlFor="monto">Monto</Label>
              <Input
                id="monto"
                type="number"
                step="0.01"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                placeholder="25000"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="moneda">Moneda</Label>
              <select
                id="moneda"
                value={moneda}
                onChange={(e) => setMoneda(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ARS">ARS</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
            
            <div>
              <Label htmlFor="categoria">Categoría</Label>
              <select
                id="categoria"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccionar...</option>
                {CATEGORIAS.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h4 className="font-medium mb-3">Descuentos y Cashback (Opcional)</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="descuentoPorcentaje">% Descuento</Label>
                <Input
                  id="descuentoPorcentaje"
                  type="number"
                  step="0.01"
                  value={descuentoPorcentaje}
                  onChange={(e) => setDescuentoPorcentaje(e.target.value)}
                  placeholder="10"
                />
              </div>
              
              <div>
                <Label htmlFor="descuentoMoneda">Moneda del descuento</Label>
                <select
                  id="descuentoMoneda"
                  value={descuentoMoneda}
                  onChange={(e) => setDescuentoMoneda(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ARS">ARS</option>
                  <option value="USD">USD</option>
                  <option value="points">Puntos</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <Label htmlFor="cashbackPorcentaje">% Cashback</Label>
                <Input
                  id="cashbackPorcentaje"
                  type="number"
                  step="0.01"
                  value={cashbackPorcentaje}
                  onChange={(e) => setCashbackPorcentaje(e.target.value)}
                  placeholder="5"
                />
              </div>
              
              <div>
                <Label htmlFor="cashbackMoneda">Moneda del cashback</Label>
                <select
                  id="cashbackMoneda"
                  value={cashbackMoneda}
                  onChange={(e) => setCashbackMoneda(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ARS">ARS</option>
                  <option value="USD">USD</option>
                  <option value="points">Puntos</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
