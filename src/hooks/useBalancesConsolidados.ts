
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
  const [tasaUSD, setTasaUSD] = useState<number>(1185); // fallback
  const { user } = useAuth();

  const obtenerTasaUSD = async (): Promise<number> => {
    try {
      const response = await fetch('https://criptoya.com/api/lemoncash/usdt/ars');
      const data = await response.json();
      const tasa = data.totalBid || 1185;
      console.log('Tasa USD obtenida de CriptoYa:', tasa);
      return tasa;
    } catch (error) {
      console.error('Error obteniendo tasa USD:', error);
      return 1185; // fallback
    }
  };

  const fetchBalances = async () => {
    if (!user) return;
    
    setLoading(true);
    
    // Obtener tasa real del USD
    const tasaReal = await obtenerTasaUSD();
    setTasaUSD(tasaReal);
    
    const { data, error } = await supabase
      .from('balances_consolidados')
      .select('*')
      .eq('user_id', user.id)
      .order('valor_ars', { ascending: false });

    if (error) {
      console.error('Error fetching balances consolidados:', error);
    } else {
      // Corregir los precios usando la tasa real
      const balancesCorregidos = (data || []).map(balance => {
        // Si es USD y tiene precio incorrecto (1000), usar la tasa real
        if (balance.moneda === 'USD' && Math.abs(balance.precio_unitario_ars - 1000) < 1) {
          return {
            ...balance,
            precio_unitario_ars: Math.round(tasaReal),
            valor_ars: Math.round(balance.cantidad * tasaReal)
          };
        }
        return balance;
      });
      
      setBalances(balancesCorregidos);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBalances();
  }, [user]);

  return {
    balances,
    loading,
    tasaUSD,
    refetch: fetchBalances
  };
};
