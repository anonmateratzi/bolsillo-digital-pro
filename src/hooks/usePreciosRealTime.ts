
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

  const obtenerPrecioCriptoYa = async (ticker: string): Promise<PrecioActivo | null> => {
    try {
      // Mapear tickers a exchanges de CriptoYa
      const exchanges = ['lemoncash', 'buenbit', 'belo', 'ripio'];
      let mejorPrecio = 0;
      let exchange = 'lemoncash'; // por defecto
      
      // Determinar si es cripto o necesita conversión
      const cryptoTickers = ['USDT', 'USDC', 'BTC', 'ETH', 'ADA', 'SOL', 'DOGE'];
      const isCrypto = cryptoTickers.includes(ticker.toUpperCase());
      
      if (isCrypto) {
        // Para criptos, probar diferentes exchanges
        for (const ex of exchanges) {
          try {
            const api = `https://criptoya.com/api/${ex}/${ticker.toLowerCase()}/ars`;
            const response = await fetch(api);
            const data = await response.json();
            
            if (data.totalBid && data.totalBid > mejorPrecio) {
              mejorPrecio = data.totalBid;
              exchange = ex;
            }
          } catch (err) {
            console.log(`Error con ${ex}:`, err);
          }
        }
      } else {
        // Para acciones, usar USDT como referencia y convertir
        try {
          const usdtResponse = await fetch('https://criptoya.com/api/lemoncash/usdt/ars');
          const usdtData = await usdtResponse.json();
          const usdToArs = usdtData.totalBid || 1185; // fallback al valor que mencionaste
          
          // Precios base de acciones en USD (estos deberían venir de otra API idealmente)
          const preciosBaseUSD = getBasePriceForStock(ticker);
          mejorPrecio = preciosBaseUSD * usdToArs;
        } catch (err) {
          console.error('Error obteniendo tasa USD/ARS:', err);
          return null;
        }
      }

      if (mejorPrecio > 0) {
        return {
          symbol: ticker,
          price: mejorPrecio,
          change: 0, // CriptoYa no proporciona cambio 24h directamente
          changePercent: 0
        };
      }
      
      return null;
    } catch (error) {
      console.error(`Error fetching price for ${ticker}:`, error);
      return null;
    }
  };

  const fetchPrecios = async () => {
    if (symbols.length === 0) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const preciosActualizados: Record<string, PrecioActivo> = {};
      
      for (const symbol of symbols) {
        const precio = await obtenerPrecioCriptoYa(symbol);
        if (precio) {
          preciosActualizados[symbol] = precio;
        }
      }
      
      setPrecios(preciosActualizados);
    } catch (err) {
      setError('Error al obtener precios de CriptoYa');
      console.error('Error fetching prices:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // No hacer fetch automático, solo cuando se llame manualmente
    // fetchPrecios();
    
    // Actualizar cada 10 minutos en lugar de 5
    const interval = setInterval(fetchPrecios, 10 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [symbols.join(',')]);

  return {
    precios,
    loading,
    error,
    refetch: fetchPrecios
  };
};

// Precios base para acciones en USD (idealmente esto vendría de una API real)
const getBasePriceForStock = (symbol: string): number => {
  const basePrices: Record<string, number> = {
    'AAPL': 150,
    'GOOGL': 2500,
    'MSFT': 300,
    'TSLA': 200,
    'AMZN': 3000,
    'NVDA': 400,
    'META': 250,
    'SPY': 400,
    'QQQ': 350
  };
  
  return basePrices[symbol.toUpperCase()] || 100;
};
