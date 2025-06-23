
import React, { useState } from 'react';
import { TrendingUp, Plus, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useInversiones } from '@/hooks/useInversiones';
import { InversionModal } from '@/components/InversionModal';

export const Inversiones: React.FC = () => {
  const { inversiones, loading } = useInversiones();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const calcularGananciaPerdida = (inversion: typeof inversiones[0]) => {
    if (!inversion.precio_actual || !inversion.precio_compra) return 0;
    
    if (inversion.tipo_inversion === 'cantidad' && inversion.cantidad_activos) {
      const valorInicialTotal = inversion.cantidad_activos * inversion.precio_compra;
      const valorActualTotal = inversion.cantidad_activos * inversion.precio_actual;
      return valorActualTotal - valorInicialTotal;
    } else if (inversion.tipo_inversion === 'monto' && inversion.monto_invertido) {
      const porcentajeCambio = (inversion.precio_actual - inversion.precio_compra) / inversion.precio_compra;
      return inversion.monto_invertido * porcentajeCambio;
    }
    return 0;
  };

  const calcularValorActualTotal = (inversion: typeof inversiones[0]) => {
    if (!inversion.precio_actual) return 0;
    
    if (inversion.tipo_inversion === 'cantidad' && inversion.cantidad_activos) {
      return inversion.cantidad_activos * inversion.precio_actual;
    } else if (inversion.tipo_inversion === 'monto' && inversion.monto_invertido && inversion.precio_compra) {
      const porcentajeCambio = (inversion.precio_actual - inversion.precio_compra) / inversion.precio_compra;
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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Inversiones</h1>
        <p className="text-gray-600 mt-2">Gestiona tu portfolio de inversiones y criptomonedas</p>
      </div>

      {/* Resumen del Portfolio */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Valor Total</p>
              <p className="text-2xl font-bold text-gray-900">
                ${valorTotalPortfolio.toLocaleString()} USD
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Ganancia/Pérdida</p>
              <p className={`text-2xl font-bold ${gananciaPerdidaTotal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {gananciaPerdidaTotal >= 0 ? '+' : ''}${gananciaPerdidaTotal.toFixed(2)} USD
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

      {/* Agregar Nueva Inversión */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-blue-600" />
              Agregar Inversión
            </CardTitle>
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Nueva Inversión
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Lista de Inversiones */}
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Actual</CardTitle>
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
                const gananciaPerdida = calcularGananciaPerdida(inversion);
                const valorActual = calcularValorActualTotal(inversion);
                const esGanancia = gananciaPerdida >= 0;
                
                return (
                  <div key={inversion.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">{inversion.ticker}</p>
                          <p className="text-sm text-gray-600">{inversion.nombre_activo || 'Sin nombre'}</p>
                        </div>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="mt-2 grid grid-cols-4 gap-4">
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
                            ${inversion.precio_actual?.toLocaleString() || 'N/A'} {inversion.moneda_origen}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Valor Total</p>
                          <p className="font-medium">
                            ${valorActual.toLocaleString()} {inversion.moneda_origen}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Ganancia/Pérdida</p>
                          <p className={`font-bold ${esGanancia ? 'text-green-600' : 'text-red-600'}`}>
                            {esGanancia ? '+' : ''}${gananciaPerdida.toFixed(2)} {inversion.moneda_origen}
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
    </div>
  );
};
