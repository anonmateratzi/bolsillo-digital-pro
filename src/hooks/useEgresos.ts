
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import type { Database } from '@/integrations/supabase/types';

type Egresos = Database['public']['Tables']['egresos']['Row'];
type EgresosInsert = Database['public']['Tables']['egresos']['Insert'];

export const useEgresos = () => {
  const [egresos, setEgresos] = useState<Egresos[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchEgresos = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('egresos')
      .select('*')
      .order('fecha', { ascending: false });

    if (error) {
      console.error('Error fetching egresos:', error);
    } else {
      setEgresos(data || []);
    }
    setLoading(false);
  };

  const addEgreso = async (egreso: Omit<EgresosInsert, 'user_id'>) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('egresos')
      .insert([{ ...egreso, user_id: user.id }])
      .select()
      .single();

    if (error) throw error;
    
    if (data) {
      setEgresos(prev => [data, ...prev]);
      
      // Si hay cashback, agregarlo como ingreso extra
      if (data.cashback_porcentaje && data.cashback_porcentaje > 0) {
        const cashbackMonto = (data.monto * data.cashback_porcentaje) / 100;
        const cashbackMoneda = data.cashback_moneda || data.moneda;
        
        await supabase
          .from('ingresos_extras')
          .insert([{
            user_id: user.id,
            descripcion: `Cashback de ${data.descripcion}`,
            monto: cashbackMonto,
            moneda: cashbackMoneda,
            categoria: 'Cashback',
            fecha: data.fecha
          }]);
      }
    }
    return data;
  };

  const deleteEgreso = async (id: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('egresos')
      .delete()
      .eq('id', id);

    if (error) throw error;
    setEgresos(prev => prev.filter(item => item.id !== id));
  };

  useEffect(() => {
    fetchEgresos();
  }, [user]);

  return {
    egresos,
    loading,
    addEgreso,
    deleteEgreso,
    refetch: fetchEgresos
  };
};
