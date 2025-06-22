
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useInflacion } from '@/hooks/useInflacion';
import { useToast } from '@/hooks/use-toast';

export const InflacionForm: React.FC = () => {
  const [mes, setMes] = useState<number>(new Date().getMonth() + 1);
  const [anio, setAnio] = useState<number>(new Date().getFullYear());
  const [categoria, setCategoria] = useState('');
  const [porcentaje, setPorcentaje] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [loading, setLoading] = useState(false);

  const { addInflacion } = useInflacion();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoria || !porcentaje) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await addInflacion({
        mes,
        anio,
        categoria: categoria.trim(),
        porcentaje_inflacion: parseFloat(porcentaje),
        descripcion: descripcion.trim() || null,
      });

      // Reset form
      setCategoria('');
      setPorcentaje('');
      setDescripcion('');
      
      toast({
        title: "Éxito",
        description: "Dato de inflación agregado correctamente",
      });
    } catch (error) {
      console.error('Error adding inflacion:', error);
      toast({
        title: "Error",
        description: "No se pudo agregar el dato de inflación",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const meses = [
    { value: 1, label: 'Enero' },
    { value: 2, label: 'Febrero' },
    { value: 3, label: 'Marzo' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Mayo' },
    { value: 6, label: 'Junio' },
    { value: 7, label: 'Julio' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Septiembre' },
    { value: 10, label: 'Octubre' },
    { value: 11, label: 'Noviembre' },
    { value: 12, label: 'Diciembre' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Agregar Dato de Inflación</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="mes">Mes</Label>
              <select
                id="mes"
                value={mes}
                onChange={(e) => setMes(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {meses.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="anio">Año</Label>
              <Input
                id="anio"
                type="number"
                value={anio}
                onChange={(e) => setAnio(parseInt(e.target.value))}
                min="2000"
                max="2050"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="categoria">Categoría</Label>
            <Input
              id="categoria"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              placeholder="Ej: Combustibles, Alimentos, Alquileres, etc."
              required
            />
          </div>

          <div>
            <Label htmlFor="porcentaje">Porcentaje de Inflación (%)</Label>
            <Input
              id="porcentaje"
              type="number"
              step="0.01"
              value={porcentaje}
              onChange={(e) => setPorcentaje(e.target.value)}
              placeholder="Ej: 12.5"
              required
            />
          </div>

          <div>
            <Label htmlFor="descripcion">Descripción (opcional)</Label>
            <Textarea
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Notas adicionales sobre este dato..."
              rows={3}
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Agregando...' : 'Agregar Dato'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
