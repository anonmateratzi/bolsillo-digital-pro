
import React from 'react';
import { Layout } from '@/components/Layout';
import { InflacionForm } from '@/components/InflacionForm';
import { InflacionList } from '@/components/InflacionList';

const InflacionPage = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inflación</h1>
          <p className="text-gray-600">Registra y consulta datos de inflación por categorías</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <InflacionForm />
          </div>
          <div className="lg:col-span-2">
            <InflacionList />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default InflacionPage;
