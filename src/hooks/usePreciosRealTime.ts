
import { useState, useEffect } from 'react';

interface PrecioActivo {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

export const usePreciosRealTime = (symbols: string[]) => {
  const [precios, setPrecios] = useState<Record<string, PrecioActivo>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPrecios = async () => {
    if (symbols.length === 0) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Usando API gratuita de CoinGecko para criptos y Yahoo Finance para acciones
      const preciosActualizados: Record<string, PrecioActivo> = {};
      
      for (const symbol of symbols) {
        try {
          // Determinar si es cripto o acción
          const isCrypto = ['BTC', 'ETH', 'ADA', 'SOL', 'DOGE', 'USDT', 'USDC'].includes(symbol.toUpperCase());
          
          if (isCrypto) {
            // API de CoinGecko para criptomonedas
            const coinId = getCoinGeckoId(symbol);
            const response = await fetch(
              `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true`
            );
            const data = await response.json();
            
            if (data[coinId]) {
              preciosActualizados[symbol] = {
                symbol,
                price: data[coinId].usd,
                change: data[coinId].usd_24h_change || 0,
                changePercent: data[coinId].usd_24h_change || 0
              };
            }
          } else {
            // Para acciones, usar API simulada (en producción usar Alpha Vantage, IEX Cloud, etc.)
            // Por ahora generamos precios simulados
            const basePrice = getBasePriceForStock(symbol);
            const randomChange = (Math.random() - 0.5) * 10; // -5% a +5%
            
            preciosActualizados[symbol] = {
              symbol,
              price: basePrice * (1 + randomChange / 100),
              change: randomChange,
              changePercent: randomChange
            };
          }
        } catch (err) {
          console.error(`Error fetching price for ${symbol}:`, err);
        }
      }
      
      setPrecios(preciosActualizados);
    } catch (err) {
      setError('Error al obtener precios');
      console.error('Error fetching prices:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrecios();
    
    // Actualizar cada 5 minutos
    const interval = setInterval(fetchPrecios, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [symbols.join(',')]);

  return {
    precios,
    loading,
    error,
    refetch: fetchPrecios
  };
};

// Mapeo de símbolos a IDs de CoinGecko
const getCoinGeckoId = (symbol: string): string => {
  const mapping: Record<string, string> = {
    'BTC': 'bitcoin',
    'ETH': 'ethereum',
    'ADA': 'cardano',
    'SOL': 'solana',
    'DOGE': 'dogecoin',
    'USDT': 'tether',
    'USDC': 'usd-coin'
  };
  
  return mapping[symbol.toUpperCase()] || symbol.toLowerCase();
};

// Precios base para acciones (en producción usar API real)
const getBasePriceForStock = (symbol: string): number => {
  const basePrices: Record<string, number> = {
    'AAPL': 150,
    'GOOGL': 2500,
    'MSFT': 300,
    'TSLA': 200,
    'AMZN': 3000,
    'NVDA': 400,
    'META': 250
  };
  
  return basePrices[symbol.toUpperCase()] || 100;
};
