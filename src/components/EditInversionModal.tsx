
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useInversiones } from '@/hooks/useInversiones';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type Inversion = Database['public']['Tables']['inversiones']['Row'];

interface EditInversionModalProps {
  isOpen: boolean;
  onClose: () => void;
  inversion: Inversion | null;
}

export const EditInversionModal: React.FC<EditInversionModalProps> = ({ 
  isOpen, 
  onClose, 
  inversion 
}) => {
  const [formData, setFormData] = useState({
    precio_actual: '',
    notas: ''
  });

  const { updateInversion } = useInversiones();
  const { toast } = useToast();

  useEffect(() => {
    if (inversion) {
      setFormData({
        precio_actual: inversion.precio_actual?.toString() || '',
        notas: inversion.notas || ''
      });
    }
  }, [inversion]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inversion) return;

    try {
      await updateInversion(inversion.id, {
        precio_actual: formData.precio_actual ? parseFloat(formData.precio_actual) : null,
        notas: formData.notas || null
      });
      
      toast({
        title: "Inversión actualizada",
        description: "Los datos se han actualizado correctamente",
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar la inversión",
        variant: "destructive",
      });
    }
  };

  if (!inversion) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Inversión - {inversion.ticker}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="precio_actual">Precio Actual ({inversion.moneda_origen})</Label>
            <Input
              id="precio_actual"
              type="number"
              step="0.0001"
              value={formData.precio_actual}
              onChange={(e) => setFormData(prev => ({ ...prev, precio_actual: e.target.value }))}
              placeholder="Ingresa el precio actual"
            />
            <p className="text-sm text-gray-500">
              Precio de compra: ${inversion.precio_compra?.toLocaleString() || 'N/A'} {inversion.moneda_origen}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notas">Notas</Label>
            <Input
              id="notas"
              value={formData.notas}
              onChange={(e) => setFormData(prev => ({ ...prev, notas: e.target.value }))}
              placeholder="Notas adicionales..."
            />
          </div>

          {/* Información adicional */}
          <div className="p-3 bg-gray-50 rounded-lg space-y-2">
            <p className="text-sm"><strong>Activo:</strong> {inversion.nombre_activo || inversion.ticker}</p>
            <p className="text-sm">
              <strong>Cantidad:</strong> {
                inversion.tipo_inversion === 'cantidad' 
                  ? `${inversion.cantidad_activos} ${inversion.ticker}`
                  : `$${inversion.monto_invertido?.toLocaleString()} ${inversion.moneda_origen} invertidos`
              }
            </p>
            <p className="text-sm">
              <strong>Fecha de compra:</strong> {new Date(inversion.fecha_compra).toLocaleDateString('es-ES')}
            </p>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              Actualizar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
