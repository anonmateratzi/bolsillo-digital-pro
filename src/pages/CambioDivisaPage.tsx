
import React from 'react';
import { Layout } from '@/components/Layout';
import { CambioDivisaForm } from '@/components/CambioDivisaForm';
import { CambioDivisaList } from '@/components/CambioDivisaList';

const CambioDivisaPage = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cambio de Divisa</h1>
          <p className="text-gray-600">Registra y consulta tus cambios de divisa</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CambioDivisaForm />
          <CambioDivisaList />
        </div>
      </div>
    </Layout>
  );
};

export default CambioDivisaPage;
