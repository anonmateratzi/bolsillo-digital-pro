
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useCambiosDivisa } from '@/hooks/useCambiosDivisa';

export const CambioDivisaList = () => {
  const { cambios, loading } = useCambiosDivisa();

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Cargando cambios...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historial de Cambios de Divisa</CardTitle>
      </CardHeader>
      <CardContent>
        {cambios.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No hay cambios de divisa registrados
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Origen</TableHead>
                <TableHead>Destino</TableHead>
                <TableHead>Tasa</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Notas</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cambios.map((cambio) => (
                <TableRow key={cambio.id}>
                  <TableCell>{new Date(cambio.fecha).toLocaleDateString('es-ES')}</TableCell>
                  <TableCell>
                    {cambio.monto_origen.toLocaleString()} {cambio.moneda_origen}
                  </TableCell>
                  <TableCell>
                    {cambio.monto_destino.toLocaleString()} {cambio.moneda_destino}
                  </TableCell>
                  <TableCell>{cambio.tasa_cambio}</TableCell>
                  <TableCell className="capitalize">
                    {cambio.tipo_origen}
                    {cambio.ticker_origen && ` (${cambio.ticker_origen})`}
                  </TableCell>
                  <TableCell>{cambio.notas || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
