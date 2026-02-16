
import React, { useState } from 'react';
import { TomAppData, CycleOption } from '../types';
import { calculateTomMetrics } from '../services/tomCalcService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Euro, Users, Briefcase, TrendingUp, X, ChevronRight } from 'lucide-react';
import { TOM_CLUBS } from '../constants';

interface Props {
  data: TomAppData;
  cycle: CycleOption;
}

const TomDashboard: React.FC<Props> = ({ data, cycle }) => {
  const [showBonusDetails, setShowBonusDetails] = useState(false);
  const metrics = calculateTomMetrics(data, cycle);
  const currentDate = new Date().toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long' });

  const formatEuro = (val: number) => new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(val);
  const formatPct = (val: number) => new Intl.NumberFormat('nl-NL', { maximumFractionDigits: 1 }).format(val) + '%';

  // Budget Colors
  let bonusColor = "text-[#E3000B]";
  const isSeason = cycle === 'Seizoen';
  const lowerBound = isSeason ? 1000 : 500;
  const upperBound = isSeason ? 2000 : 1000;
  
  if (metrics.totalBonus >= upperBound) bonusColor = "text-[#2ECC71]"; // Green
  else if (metrics.totalBonus >= lowerBound) bonusColor = "text-[#F39C12]"; // Orange

  const chartData = [
    { name: 'Opkomst', value: metrics.pillar1.totalBonus, fill: '#3498DB' },
    { name: 'Bezoek', value: metrics.pillar2.totalBonus, fill: '#9B59B6' },
    { name: 'Groei', value: metrics.pillar3.totalBonus, fill: '#E67E22' },
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Banner */}
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Hoi Tom 👋</h1>
          <p className="text-gray-500 font-medium text-sm md:text-base">{cycle} • 5 Clubs</p>
        </div>
        <div className="mt-4 md:mt-0 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-bold border border-blue-100">
          Operationeel Coördinator
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Total Bonus */}
        <div 
            onClick={() => setShowBonusDetails(true)}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all group relative"
        >
             <ChevronRight className="absolute top-4 right-4 text-gray-300 group-hover:text-[#E3000B]" size={20} />
             <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-green-50 rounded-lg text-green-600"><Euro size={24} /></div>
             </div>
             <p className="text-sm text-gray-500 font-medium">Totale Bonus</p>
             <h3 className={`text-3xl font-bold mt-1 ${bonusColor}`}>{formatEuro(metrics.totalBonus)}</h3>
             <p className="text-xs text-gray-400 mt-2">Klik voor details</p>
        </div>

        {/* Opkomst */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Users size={24} /></div>
            </div>
            <p className="text-sm text-gray-500 font-medium">Gem. Opkomst</p>
            <h3 className="text-3xl font-bold mt-1 text-gray-900">{formatPct(metrics.pillar1.avgAttendancePct)}</h3>
            <p className="text-xs text-gray-400 mt-2">Waarde: {formatEuro(metrics.pillar1.totalBonus)}</p>
        </div>

        {/* Bezoeken */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-purple-50 rounded-lg text-purple-600"><Briefcase size={24} /></div>
            </div>
            <p className="text-sm text-gray-500 font-medium">Clubbezoeken</p>
            <h3 className="text-3xl font-bold mt-1 text-gray-900">{metrics.pillar2.totalVisits}</h3>
            <p className="text-xs text-gray-400 mt-2">Waarde: {formatEuro(metrics.pillar2.totalBonus)}</p>
        </div>

        {/* Groei */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-orange-50 rounded-lg text-orange-600"><TrendingUp size={24} /></div>
            </div>
            <p className="text-sm text-gray-500 font-medium">Gem. Groei</p>
            <h3 className="text-3xl font-bold mt-1 text-gray-900">{formatPct(metrics.pillar3.avgGrowthPct * 100)}</h3>
            <p className="text-xs text-gray-400 mt-2">Waarde: {formatEuro(metrics.pillar3.totalBonus)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-6">Bonus Verdeling</h3>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" fontSize={12} />
                        <YAxis width={40} />
                        <Tooltip formatter={(val: number) => formatEuro(val)} cursor={{fill: 'transparent'}} />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
         </div>

         <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
             <div className="p-6 border-b border-gray-100">
                 <h3 className="text-lg font-bold text-gray-800">Prestaties per Club</h3>
             </div>
             <div className="overflow-x-auto">
                 <table className="w-full text-sm text-left">
                     <thead className="bg-gray-50 text-gray-500 font-medium">
                         <tr>
                             <th className="px-6 py-3">Club</th>
                             <th className="px-6 py-3">Opkomst</th>
                             <th className="px-6 py-3">Groei</th>
                             <th className="px-6 py-3 text-right">Totaal Bonus</th>
                         </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-100">
                         {TOM_CLUBS.map(club => {
                             const p1 = metrics.pillar1.clubDetails[club];
                             const p3 = metrics.pillar3.clubDetails[club];
                             const total = p1.bonus + p3.bonus; // Note: Visits are global in this summary or need per-club logic if strictly tracked per club for P2

                             return (
                                 <tr key={club} className="hover:bg-gray-50">
                                     <td className="px-6 py-4 font-medium text-gray-900">{club}</td>
                                     <td className="px-6 py-4">
                                         <span className={`px-2 py-1 rounded-full text-xs font-bold ${p1.pct >= 90 ? 'bg-green-100 text-green-700' : p1.pct >= 70 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                                             {formatPct(p1.pct)}
                                         </span>
                                     </td>
                                     <td className="px-6 py-4">
                                         <span className={`px-2 py-1 rounded-full text-xs font-bold ${p3.growthPct >= 10 ? 'bg-green-100 text-green-700' : p3.growthPct >= 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                                             {formatPct(p3.growthPct)}
                                         </span>
                                     </td>
                                     <td className="px-6 py-4 text-right font-bold text-gray-900">{formatEuro(total)}</td>
                                 </tr>
                             );
                         })}
                     </tbody>
                 </table>
             </div>
         </div>
      </div>

      {/* Modal */}
      {showBonusDetails && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setShowBonusDetails(false)}>
              <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold text-gray-900">Bonus Details</h3>
                      <button onClick={() => setShowBonusDetails(false)}><X size={24} className="text-gray-400" /></button>
                  </div>
                  <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg text-blue-900">
                          <span>Opkomst Bonus</span>
                          <span className="font-bold">{formatEuro(metrics.pillar1.totalBonus)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg text-purple-900">
                          <span>Bezoek Bonus ({metrics.pillar2.totalVisits}x)</span>
                          <span className="font-bold">{formatEuro(metrics.pillar2.totalBonus)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg text-orange-900">
                          <span>Groei Bonus</span>
                          <span className="font-bold">{formatEuro(metrics.pillar3.totalBonus)}</span>
                      </div>
                      <div className="border-t border-gray-100 pt-4 flex justify-between items-center text-xl font-bold">
                          <span>Totaal</span>
                          <span className={bonusColor}>{formatEuro(metrics.totalBonus)}</span>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default TomDashboard;
