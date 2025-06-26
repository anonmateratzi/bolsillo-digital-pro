import React, { useState } from 'react';
import { TrendingUp, Plus, Edit, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useInversiones } from '@/hooks/useInversiones';
import { usePreciosRealTime } from '@/hooks/usePreciosRealTime';
import { InversionModal } from '@/components/InversionModal';
import { EditInversionModal } from '@/components/EditInversionModal';
import type { Database } from '@/integrations/supabase/types';

type Inversion = Database['public']['Tables']['inversiones']['Row'];

export const InversionesEnhanced: React.FC = () => {
  const { inversiones, loading, updateInversion } = useInversiones();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedInversion, setSelectedInversion] = useState<Inversion | null>(null);
  
  // Obtener símbolos únicos de las inversiones
  const symbols = Array.from(new Set(inversiones.map(inv => inv.ticker)));
  const { precios, loading: loadingPrecios, error: errorPrecios, refetch } = usePreciosRealTime(symbols);

  const actualizarPreciosAutomaticamente = async () => {
    for (const inversion of inversiones) {
      const precioAPI = precios[inversion.ticker];
      // Solo actualizar si no tiene precio actual o si el precio de la API es muy diferente
      if (precioAPI && (!inversion.precio_actual || Math.abs(precioAPI.price - inversion.precio_actual) > inversion.precio_actual * 0.05)) {
        await updateInversion(inversion.id, {
          precio_actual: precioAPI.price
        });
      }
    }
  };

  const handleEditClick = (inversion: Inversion) => {
    setSelectedInversion(inversion);
    setIsEditModalOpen(true);
  };

  const calcularGananciaPerdida = (inversion: typeof inversiones[0]) => {
    // PRIORIZAR el precio actual del usuario sobre el de la API
    const precioActual = inversion.precio_actual || precios[inversion.ticker]?.price;
    if (!precioActual || !inversion.precio_compra) return 0;
    
    if (inversion.tipo_inversion === 'cantidad' && inversion.cantidad_activos) {
      const valorInicialTotal = inversion.cantidad_activos * inversion.precio_compra;
      const valorActualTotal = inversion.cantidad_activos * precioActual;
      return valorActualTotal - valorInicialTotal;
    } else if (inversion.tipo_inversion === 'monto' && inversion.monto_invertido) {
      const porcentajeCambio = (precioActual - inversion.precio_compra) / inversion.precio_compra;
      return inversion.monto_invertido * porcentajeCambio;
    }
    return 0;
  };

  const calcularValorActualTotal = (inversion: typeof inversiones[0]) => {
    // PRIORIZAR el precio actual del usuario sobre el de la API
    const precioActual = inversion.precio_actual || precios[inversion.ticker]?.price;
    if (!precioActual) return 0;
    
    if (inversion.tipo_inversion === 'cantidad' && inversion.cantidad_activos) {
      return inversion.cantidad_activos * precioActual;
    } else if (inversion.tipo_inversion === 'monto' && inversion.monto_invertido && inversion.precio_compra) {
      const porcentajeCambio = (precioActual - inversion.precio_compra) / inversion.precio_compra;
      return inversion.monto_invertido * (1 + porcentajeCambio);
    }
    return 0;
  };

  const valorTotalPortfolio = inversiones.reduce((total, inv) => {
    return total + calcularValorActualTotal(inv);
  }, 0);

  const gananciaPerdidaTotal = inversiones.reduce((total, inv) => {
    return total + calcularGananciaPerdida(inv);
  }, 0);

  const rendimientoTotal = inversiones.reduce((total, inv) => {
    if (inv.tipo_inversion === 'cantidad' && inv.cantidad_activos && inv.precio_compra) {
      return total + (inv.cantidad_activos * inv.precio_compra);
    } else if (inv.tipo_inversion === 'monto' && inv.monto_invertido) {
      return total + inv.monto_invertido;
    }
    return total;
  }, 0);

  const porcentajeRendimiento = rendimientoTotal > 0 ? (gananciaPerdidaTotal / rendimientoTotal) * 100 : 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Cargando inversiones...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inversiones</h1>
          <p className="text-gray-600 mt-2">Portfolio con precios actualizados</p>
        </div>
        
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button 
            onClick={refetch} 
            variant="outline" 
            disabled={loadingPrecios}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loadingPrecios ? 'animate-spin' : ''}`} />
            Obtener Precios (CriptoYa)
          </Button>
          <Button onClick={actualizarPreciosAutomaticamente} variant="outline">
            Sync Precios a BD
          </Button>
        </div>
      </div>

      {errorPrecios && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-orange-700">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">Error al obtener precios de CriptoYa: {errorPrecios}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resumen del Portfolio */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Valor Total</p>
              <p className="text-2xl font-bold text-gray-900">
                ${valorTotalPortfolio.toLocaleString()} ARS
              </p>
              {loadingPrecios && (
                <p className="text-xs text-blue-600 mt-1">Consultando CriptoYa...</p>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Ganancia/Pérdida</p>
              <p className={`text-2xl font-bold ${gananciaPerdidaTotal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {gananciaPerdidaTotal >= 0 ? '+' : ''}${gananciaPerdidaTotal.toFixed(2)} ARS
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Rendimiento</p>
              <p className={`text-2xl font-bold ${porcentajeRendimiento >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {porcentajeRendimiento >= 0 ? '+' : ''}{porcentajeRendimiento.toFixed(1)}%
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Inversiones */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-blue-600" />
              Portfolio Actual
            </CardTitle>
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Nueva Inversión
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {inversiones.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No tienes inversiones registradas</p>
                <Button 
                  onClick={() => setIsModalOpen(true)}
                  className="mt-4"
                  variant="outline"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar tu primera inversión
                </Button>
              </div>
            ) : (
              inversiones.map((inversion) => {
                const precioAPI = precios[inversion.ticker];
                // PRIORIZAR precio actual del usuario
                const precioActual = inversion.precio_actual || precioAPI?.price;
                const gananciaPerdida = calcularGananciaPerdida(inversion);
                const valorActual = calcularValorActualTotal(inversion);
                const esGanancia = gananciaPerdida >= 0;
                const tieneAPI = !!precioAPI;
                
                return (
                  <div key={inversion.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-gray-900">{inversion.ticker}</p>
                            {inversion.precio_actual ? (
                              <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700">
                                Precio Manual
                              </span>
                            ) : tieneAPI ? (
                              <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700">
                                CriptoYa
                              </span>
                            ) : (
                              <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700">
                                Sin Precio
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{inversion.nombre_activo || 'Sin nombre'}</p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditClick(inversion)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-xs text-gray-500">
                            {inversion.tipo_inversion === 'cantidad' ? 'Cantidad' : 'Monto Invertido'}
                          </p>
                          <p className="font-medium">
                            {inversion.tipo_inversion === 'cantidad' 
                              ? `${inversion.cantidad_activos} ${inversion.ticker}`
                              : `$${inversion.monto_invertido?.toLocaleString()} ${inversion.moneda_origen}`
                            }
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Precio Actual</p>
                          <p className="font-medium">
                            ${precioActual?.toLocaleString() || 'N/A'} ARS
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Valor Total</p>
                          <p className="font-medium">
                            ${valorActual.toLocaleString()} ARS
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Ganancia/Pérdida</p>
                          <p className={`font-bold ${esGanancia ? 'text-green-600' : 'text-red-600'}`}>
                            {esGanancia ? '+' : ''}${gananciaPerdida.toFixed(2)} ARS
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      <InversionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
      
      <EditInversionModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        inversion={selectedInversion}
      />
    </div>
  );
};
