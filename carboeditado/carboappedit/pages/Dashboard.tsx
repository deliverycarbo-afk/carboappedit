
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
// Fix: Loader2 was used but not imported
import { Loader2 } from 'lucide-react';
import DashboardCard from '../components/DashboardCard';
import { getCarbonInsights } from '../services/geminiService';

const data = [
  { name: 'Jan', emissions: 4000, offsets: 2400 },
  { name: 'Feb', emissions: 3000, offsets: 1398 },
  { name: 'Mar', emissions: 2000, offsets: 9800 },
  { name: 'Apr', emissions: 2780, offsets: 3908 },
  { name: 'May', emissions: 1890, offsets: 4800 },
  { name: 'Jun', emissions: 2390, offsets: 3800 },
];

const Dashboard: React.FC = () => {
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInsights = async () => {
      setLoading(true);
      const res = await getCarbonInsights(data);
      setInsights(res);
      setLoading(false);
    };
    fetchInsights();
  }, []);

  return (
    <div className="p-4 md:p-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <DashboardCard label="Total Carbon" value="12,450 t" change={-12} icon="fa-cloud" color="bg-slate-500" />
        <DashboardCard label="Net Zero" value="64%" change={5} icon="fa-bullseye" color="bg-emerald-500" />
        <DashboardCard label="Credits" value="8,200" change={24} icon="fa-certificate" color="bg-blue-500" />
        <DashboardCard label="Avg. Cost" value="$14.20" change={-3} icon="fa-tag" color="bg-amber-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col min-h-[400px]">
          <h2 className="text-lg font-bold text-slate-800 mb-6">Emissions Trend</h2>
          <div className="flex-1 w-full" style={{ minHeight: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorEmissions" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#64748b" stopOpacity={0.1}/><stop offset="95%" stopColor="#64748b" stopOpacity={0}/></linearGradient>
                  <linearGradient id="colorOffsets" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                <Tooltip />
                <Area type="monotone" dataKey="emissions" stroke="#64748b" fillOpacity={1} fill="url(#colorEmissions)" strokeWidth={2} />
                <Area type="monotone" dataKey="offsets" stroke="#10b981" fillOpacity={1} fill="url(#colorOffsets)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col">
          <h2 className="text-lg font-bold text-slate-800 mb-6">AI Insights</h2>
          <div className="space-y-4 flex-1">
            {loading ? <div className="flex flex-col items-center py-10"><Loader2 className="animate-spin text-emerald-500 mb-2"/><p className="text-xs">Analisando...</p></div>
            : insights.map((insight, idx) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <h4 className="font-bold text-slate-800 text-sm mb-1">{insight.title}</h4>
                  <p className="text-xs text-slate-600 mb-2">{insight.description}</p>
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Impacto: {insight.impact}</span>
                </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
