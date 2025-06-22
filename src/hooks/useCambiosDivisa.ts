
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import type { Database } from '@/integrations/supabase/types';

type CambioDivisa = Database['public']['Tables']['cambios_divisa']['Row'];
type CambioDivisaInsert = Database['public']['Tables']['cambios_divisa']['Insert'];

export const useCambiosDivisa = () => {
  const [cambios, setCambios] = useState<CambioDivisa[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchCambios = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('cambios_divisa')
      .select('*')
      .order('fecha', { ascending: false });

    if (error) {
      console.error('Error fetching cambios:', error);
    } else {
      setCambios(data || []);
    }
    setLoading(false);
  };

  const addCambio = async (cambio: Omit<CambioDivisaInsert, 'user_id'>) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('cambios_divisa')
      .insert([{ ...cambio, user_id: user.id }])
      .select()
      .single();

    if (error) {
      console.error('Error adding cambio:', error);
      throw error;
    }

    if (data) {
      setCambios(prev => [data, ...prev]);
    }
    return data;
  };

  useEffect(() => {
    fetchCambios();
  }, [user]);

  return {
    cambios,
    loading,
    addCambio,
    refetch: fetchCambios
  };
};
