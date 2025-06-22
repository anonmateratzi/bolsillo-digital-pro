
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import type { Database } from '@/integrations/supabase/types';

type Inflacion = Database['public']['Tables']['inflacion']['Row'];
type InflacionInsert = Database['public']['Tables']['inflacion']['Insert'];

export const useInflacion = () => {
  const [inflacionData, setInflacionData] = useState<Inflacion[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchInflacion = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('inflacion')
      .select('*')
      .order('anio', { ascending: false })
      .order('mes', { ascending: false });

    if (error) {
      console.error('Error fetching inflacion:', error);
    } else {
      setInflacionData(data || []);
    }
    setLoading(false);
  };

  const addInflacion = async (inflacion: Omit<InflacionInsert, 'user_id'>) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('inflacion')
      .insert([{ ...inflacion, user_id: user.id }])
      .select()
      .single();

    if (error) {
      console.error('Error adding inflacion:', error);
      throw error;
    }

    if (data) {
      setInflacionData(prev => [data, ...prev]);
    }
    return data;
  };

  const updateInflacion = async (id: string, updates: Partial<Omit<InflacionInsert, 'user_id'>>) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('inflacion')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating inflacion:', error);
      throw error;
    }

    if (data) {
      setInflacionData(prev => prev.map(item => item.id === id ? data : item));
    }
    return data;
  };

  const deleteInflacion = async (id: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('inflacion')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting inflacion:', error);
      throw error;
    }

    setInflacionData(prev => prev.filter(item => item.id !== id));
  };

  useEffect(() => {
    fetchInflacion();
  }, [user]);

  return {
    inflacionData,
    loading,
    addInflacion,
    updateInflacion,
    deleteInflacion,
    refetch: fetchInflacion
  };
};
