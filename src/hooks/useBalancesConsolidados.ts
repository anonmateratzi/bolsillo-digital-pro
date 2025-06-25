
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface BalanceConsolidado {
  user_id: string;
  moneda: string;
  tipo: string;
  ticker: string;
  cantidad: number;
  precio_unitario_ars: number;
  valor_ars: number;
}

export const useBalancesConsolidados = () => {
  const [balances, setBalances] = useState<BalanceConsolidado[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchBalances = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('balances_consolidados')
      .select('*')
      .eq('user_id', user.id)
      .order('valor_ars', { ascending: false });

    if (error) {
      console.error('Error fetching balances consolidados:', error);
    } else {
      setBalances(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBalances();
  }, [user]);

  return {
    balances,
    loading,
    refetch: fetchBalances
  };
};
