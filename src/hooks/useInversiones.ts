
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import type { Database } from '@/integrations/supabase/types';

type Inversion = Database['public']['Tables']['inversiones']['Row'];
type InversionInsert = Database['public']['Tables']['inversiones']['Insert'];

export const useInversiones = () => {
  const [inversiones, setInversiones] = useState<Inversion[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchInversiones = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('inversiones')
      .select('*')
      .eq('activa', true)
      .order('fecha_compra', { ascending: false });

    if (error) {
      console.error('Error fetching inversiones:', error);
    } else {
      setInversiones(data || []);
    }
    setLoading(false);
  };

  const addInversion = async (inversion: Omit<InversionInsert, 'user_id'>) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('inversiones')
      .insert([{ ...inversion, user_id: user.id }])
      .select()
      .single();

    if (error) throw error;
    
    if (data) {
      setInversiones(prev => [data, ...prev]);
    }
    return data;
  };

  const updateInversion = async (id: string, updates: Partial<Inversion>) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('inversiones')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    
    if (data) {
      setInversiones(prev => prev.map(inv => inv.id === id ? data : inv));
    }
    return data;
  };

  const deleteInversion = async (id: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('inversiones')
      .update({ activa: false })
      .eq('id', id);

    if (error) throw error;
    setInversiones(prev => prev.filter(item => item.id !== id));
  };

  useEffect(() => {
    fetchInversiones();
  }, [user]);

  return {
    inversiones,
    loading,
    addInversion,
    updateInversion,
    deleteInversion,
    refetch: fetchInversiones
  };
};
