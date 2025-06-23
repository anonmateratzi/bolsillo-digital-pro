
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import type { Database } from '@/integrations/supabase/types';

type SueldoFijo = Database['public']['Tables']['sueldo_fijo']['Row'];
type SueldoFijoInsert = Database['public']['Tables']['sueldo_fijo']['Insert'];
type IngresosExtras = Database['public']['Tables']['ingresos_extras']['Row'];
type IngresosExtrasInsert = Database['public']['Tables']['ingresos_extras']['Insert'];

export const useIngresos = () => {
  const [sueldoFijo, setSueldoFijo] = useState<SueldoFijo | null>(null);
  const [ingresosExtras, setIngresosExtras] = useState<IngresosExtras[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchData = async () => {
    if (!user) return;
    
    setLoading(true);
    
    // Fetch sueldo fijo activo
    const { data: sueldoData } = await supabase
      .from('sueldo_fijo')
      .select('*')
      .eq('activo', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (sueldoData) {
      setSueldoFijo(sueldoData);
    }

    // Fetch ingresos extras
    const { data: ingresosData } = await supabase
      .from('ingresos_extras')
      .select('*')
      .order('fecha', { ascending: false });

    if (ingresosData) {
      setIngresosExtras(ingresosData);
    }
    
    setLoading(false);
  };

  const addSueldoFijo = async (sueldo: Omit<SueldoFijoInsert, 'user_id'>) => {
    if (!user) return;

    // Desactivar sueldo anterior
    if (sueldoFijo) {
      await supabase
        .from('sueldo_fijo')
        .update({ activo: false })
        .eq('id', sueldoFijo.id);
    }

    const { data, error } = await supabase
      .from('sueldo_fijo')
      .insert([{ ...sueldo, user_id: user.id }])
      .select()
      .single();

    if (error) throw error;
    if (data) setSueldoFijo(data);
    return data;
  };

  const addIngresoExtra = async (ingreso: Omit<IngresosExtrasInsert, 'user_id'>) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('ingresos_extras')
      .insert([{ ...ingreso, user_id: user.id }])
      .select()
      .single();

    if (error) throw error;
    if (data) {
      setIngresosExtras(prev => [data, ...prev]);
    }
    return data;
  };

  const deleteIngresoExtra = async (id: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('ingresos_extras')
      .delete()
      .eq('id', id);

    if (error) throw error;
    setIngresosExtras(prev => prev.filter(item => item.id !== id));
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  return {
    sueldoFijo,
    ingresosExtras,
    loading,
    addSueldoFijo,
    addIngresoExtra,
    deleteIngresoExtra,
    refetch: fetchData
  };
};
