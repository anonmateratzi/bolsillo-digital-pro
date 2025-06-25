
import React from 'react';
import { useBalancesConsolidados } from '@/hooks/useBalancesConsolidados';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp, Coins } from 'lucide-react';

export const BalancesTable: React.FC = () => {
  const { balances, loading } = useBalancesConsolidados();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Balances Consolidados</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Cargando balances...</p>
        </CardContent>
      </Card>
    );
  }

  const totalPatrimonio = balances.reduce((sum, balance) => sum + balance.valor_ars, 0);

  const getTypeIcon = (tipo: string) => {
    switch (tipo) {
      case 'Efectivo':
        return <DollarSign className="h-4 w-4" />;
      case 'Divisa':
        return <Coins className="h-4 w-4" />;
      case 'Inversión':
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  };

  const getTypeBadgeColor = (tipo: string) => {
    switch (tipo) {
      case 'Efectivo':
        return 'bg-green-100 text-green-800';
      case 'Divisa':
        return 'bg-blue-100 text-blue-800';
      case 'Inversión':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Patrimonio Consolidado
        </CardTitle>
        <CardDescription>
          Tu patrimonio total distribuido en diferentes activos y monedas
        </CardDescription>
        <div className="pt-2">
          <p className="text-2xl font-bold text-green-600">
            ${totalPatrimonio.toLocaleString()} ARS
          </p>
          <p className="text-sm text-gray-600">Valor total aproximado</p>
        </div>
      </CardHeader>
      <CardContent>
        {balances.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No hay balances disponibles</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo</TableHead>
                <TableHead>Activo/Moneda</TableHead>
                <TableHead className="text-right">Cantidad</TableHead>
                <TableHead className="text-right">Precio Unit. (ARS)</TableHead>
                <TableHead className="text-right">Valor Total (ARS)</TableHead>
                <TableHead className="text-right">% del Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {balances.map((balance, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Badge className={getTypeBadgeColor(balance.tipo)}>
                      <div className="flex items-center gap-1">
                        {getTypeIcon(balance.tipo)}
                        {balance.tipo}
                      </div>
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {balance.ticker}
                    {balance.moneda !== balance.ticker && (
                      <span className="text-sm text-gray-500 ml-1">({balance.moneda})</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {balance.cantidad.toLocaleString(undefined, { 
                      minimumFractionDigits: balance.tipo === 'Inversión' ? 4 : 2,
                      maximumFractionDigits: balance.tipo === 'Inversión' ? 4 : 2
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    ${balance.precio_unitario_ars.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    ${balance.valor_ars.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {totalPatrimonio > 0 ? 
                      ((balance.valor_ars / totalPatrimonio) * 100).toFixed(1) 
                      : '0'}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
