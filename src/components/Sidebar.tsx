
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { DollarSign, ArrowUpDown, TrendingUp, ArrowDown, BarChart3, LineChart, PieChart } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    { 
      path: '/', 
      icon: BarChart3, 
      label: 'Dashboard' 
    },
    { 
      path: '/ingresos', 
      icon: DollarSign, 
      label: 'Ingresos' 
    },
    { 
      path: '/cambio-divisa', 
      icon: ArrowUpDown, 
      label: 'Cambio de Divisa' 
    },
    { 
      path: '/inversiones', 
      icon: TrendingUp, 
      label: 'Inversiones' 
    },
    { 
      path: '/egresos', 
      icon: ArrowDown, 
      label: 'Egresos' 
    },
    { 
      path: '/analisis', 
      icon: PieChart, 
      label: 'Análisis Temporal' 
    },
    { 
      path: '/inflacion', 
      icon: LineChart, 
      label: 'Inflación' 
    }
  ];

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800">FinanzasApp</h1>
        <p className="text-sm text-gray-500 mt-1">Gestión Financiera Personal</p>
      </div>
      
      <nav className="mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-6 py-3 text-sm font-medium transition-colors duration-200 ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
