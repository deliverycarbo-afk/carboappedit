
import React from 'react';

interface DashboardCardProps {
  label: string;
  value: string | number;
  change: number;
  icon: string;
  color: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ label, value, change, icon, color }) => {
  const isPositive = change >= 0;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-lg ${color} bg-opacity-10 text-${color.split('-')[1]}-600`}>
          <i className={`fas ${icon} text-xl`}></i>
        </div>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
          {isPositive ? '+' : ''}{change}%
        </span>
      </div>
      <div>
        <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider">{label}</h3>
        <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
      </div>
    </div>
  );
};

export default DashboardCard;
