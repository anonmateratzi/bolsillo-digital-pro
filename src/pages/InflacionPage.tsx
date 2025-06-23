
import React from 'react';
import { Layout } from '@/components/Layout';
import { InflacionPersonal } from '@/components/InflacionPersonal';

const InflacionPage = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inflación Personal</h1>
          <p className="text-gray-600">Analiza tu inflación personal basada en tus gastos reales</p>
        </div>
        
        <InflacionPersonal />
      </div>
    </Layout>
  );
};

export default InflacionPage;
