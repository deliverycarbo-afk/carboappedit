
import React from 'react';
import { CarbonProject } from '../types';

const mockProjects: CarbonProject[] = [
  {
    id: '1',
    name: 'Amazon Rainforest Protection',
    type: 'Reforestation',
    status: 'Active',
    location: 'Brazil',
    creditsAvailable: 1200,
    totalAvoidedCO2: 45000,
    lastUpdated: '2023-10-12',
  },
  {
    id: '2',
    name: 'Sahel Green Belt',
    type: 'Blue Carbon',
    status: 'Pending',
    location: 'Senegal',
    creditsAvailable: 0,
    totalAvoidedCO2: 15000,
    lastUpdated: '2023-10-15',
  },
  {
    id: '3',
    name: 'Northeastern Wind Power',
    type: 'Renewable Energy',
    status: 'Active',
    location: 'USA',
    creditsAvailable: 5400,
    totalAvoidedCO2: 89000,
    lastUpdated: '2023-10-18',
  },
];

const Projects: React.FC = () => {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div className="relative">
          <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
          <input 
            type="text" 
            placeholder="Search projects..." 
            className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg w-80 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
          />
        </div>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">
            <i className="fas fa-filter mr-2"></i> Filters
          </button>
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">
            <i className="fas fa-download mr-2"></i> Export
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Project Name</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Type</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Credits</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Total Avoided</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {mockProjects.map((project) => (
              <tr key={project.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div>
                    <div className="font-bold text-slate-800">{project.name}</div>
                    <div className="text-xs text-slate-500"><i className="fas fa-map-marker-alt mr-1"></i> {project.location}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-600">{project.type}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                    project.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                  }`}>
                    {project.status}
                  </span>
                </td>
                <td className="px-6 py-4 font-mono text-sm">
                  {project.creditsAvailable.toLocaleString()}
                </td>
                <td className="px-6 py-4 font-mono text-sm">
                  {project.totalAvoidedCO2.toLocaleString()} t
                </td>
                <td className="px-6 py-4">
                  <button className="p-2 text-slate-400 hover:text-emerald-500 transition-colors">
                    <i className="fas fa-ellipsis-v"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-6 flex justify-between items-center text-sm text-slate-500">
        <p>Showing 3 of 42 projects</p>
        <div className="flex space-x-1">
          <button className="px-3 py-1 border border-slate-200 rounded-lg hover:bg-slate-50">Previous</button>
          <button className="px-3 py-1 bg-emerald-500 text-white rounded-lg">1</button>
          <button className="px-3 py-1 border border-slate-200 rounded-lg hover:bg-slate-50">2</button>
          <button className="px-3 py-1 border border-slate-200 rounded-lg hover:bg-slate-50">Next</button>
        </div>
      </div>
    </div>
  );
};

export default Projects;
