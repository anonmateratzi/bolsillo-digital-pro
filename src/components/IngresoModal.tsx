
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useIngresos } from '@/hooks/useIngresos';
import { useToast } from '@/hooks/use-toast';

interface IngresoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'sueldo' | 'extra';
}

export const IngresoModal: React.FC<IngresoModalProps> = ({ open, onOpenChange, type }) => {
  const [descripcion, setDescripcion] = useState('');
  const [monto, setMonto] = useState('');
  const [moneda, setMoneda] = useState('ARS');
  const [categoria, setCategoria] = useState('');
  const [loading, setLoading] = useState(false);
  const { addSueldoFijo, addIngresoExtra } = useIngresos();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!monto) return;

    setLoading(true);
    try {
      if (type === 'sueldo') {
        await addSueldoFijo({
          monto: parseFloat(monto),
          moneda,
        });
        toast({
          title: "Éxito",
          description: "Sueldo fijo actualizado correctamente",
        });
      } else {
        await addIngresoExtra({
          descripcion,
          monto: parseFloat(monto),
          moneda,
          categoria: categoria || null,
        });
        toast({
          title: "Éxito",
          description: "Ingreso extra agregado correctamente",
        });
      }
      
      // Reset form
      setDescripcion('');
      setMonto('');
      setMoneda('ARS');
      setCategoria('');
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar el ingreso",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {type === 'sueldo' ? 'Actualizar Sueldo Fijo' : 'Agregar Ingreso Extra'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {type === 'extra' && (
            <div>
              <Label htmlFor="descripcion">Descripción</Label>
              <Input
                id="descripcion"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Freelance, venta, etc."
                required
              />
            </div>
          )}
          
          <div>
            <Label htmlFor="monto">Monto</Label>
            <Input
              id="monto"
              type="number"
              step="0.01"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              placeholder="120000"
              required
            />
          </div>
          
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
          
          {type === 'extra' && (
            <div>
              <Label htmlFor="categoria">Categoría (Opcional)</Label>
              <Input
                id="categoria"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                placeholder="Freelance, Venta, etc."
              />
            </div>
          )}
          
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
