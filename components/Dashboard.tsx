import React, { useState } from 'react';
import { AppData, CycleOption } from '../types';
import { calculateMetrics, formatCurrency, formatNumber, getMonthsForCycle } from '../services/calcService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Euro, Users, Phone, Smile, TrendingUp, X, ChevronRight } from 'lucide-react';
import { CLUBS } from '../constants';

interface Props {
  data: AppData;
  cycle: CycleOption;
}

const Dashboard: React.FC<Props> = ({ data, cycle }) => {
  const [showBonusDetails, setShowBonusDetails] = useState(false);
  const metrics = calculateMetrics(data, cycle);
  const months = getMonthsForCycle(cycle);

  const currentDate = new Date().toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long' });

  // Budget color logic
  let bonusColor = "text-[#E3000B]"; // Default SINA Red
  if (cycle === "Seizoen") {
      if (metrics.totalBonus >= 600 && metrics.totalBonus <= 1000) bonusColor = "text-[#2ECC71]";
      else if (metrics.totalBonus < 600) bonusColor = "text-[#F39C12]";
  } else {
      if (metrics.totalBonus >= 300 && metrics.totalBonus <= 500) bonusColor = "text-[#2ECC71]";
      else if (metrics.totalBonus < 300) bonusColor = "text-[#F39C12]";
  }

  // Chart data
  const chartData = [
    { name: 'Plan', value: metrics.pillar1Bonus, fill: '#3498DB' },
    { name: 'Bel', value: metrics.pillar2Bonus, fill: '#9B59B6' },
    { name: 'Tevr', value: metrics.pillar3Bonus, fill: '#E67E22' },
  ];

  // Table rows calculation
  const clubRows = CLUBS.map(club => {
    let cExpected = 0;
    let cActual = 0;
    let cTraj = 0;
    months.forEach(m => {
        cExpected += Number(data.clubs[club][m].expected || 0);
        cActual += Number(data.clubs[club][m].actual || 0);
        cTraj += Number(data.clubs[club][m].trajectories || 0);
    });
    const pct = cExpected > 0 ? (cActual / cExpected) * 100 : 0;
    
    const p1Contrib = metrics.pillar1Bonus > 0 ? cActual * 0.50 : 0;
    const p2Contrib = cTraj * 10;
    const totalContrib = p1Contrib + p2Contrib; 

    return { club, pct, trajectories: cTraj, totalContrib };
  });

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Welcome Banner */}
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Hoi Joshua 👋</h1>
          <p className="text-gray-500 font-medium text-sm md:text-base">{cycle} • {currentDate}</p>
        </div>
        <div className="mt-4 md:mt-0 px-4 py-2 md:px-6 md:py-3 bg-red-50 text-[#E3000B] rounded-xl font-bold text-base md:text-lg border border-red-100 self-start md:self-auto">
          SINA Voetballab
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Total Bonus - Clickable */}
        <div 
            onClick={() => setShowBonusDetails(true)}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all group relative ring-2 ring-transparent hover:ring-red-50"
        >
          <div className="absolute top-4 right-4 text-gray-300 group-hover:text-red-400 transition-colors">
              <ChevronRight size={20} />
          </div>

          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-green-50 rounded-lg text-green-600"><Euro size={24} /></div>
            {metrics.totalBonus > 0 && <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full mr-6">+Actief</span>}
          </div>
          <p className="text-sm text-gray-500 font-medium">Totale Bonus</p>
          <h3 className={`text-3xl font-bold mt-1 ${bonusColor}`}>{formatCurrency(metrics.totalBonus)}</h3>
          <p className="text-xs text-gray-400 mt-2 group-hover:text-[#E3000B] transition-colors">Klik voor details</p>
        </div>

        {/* Opkomst */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Users size={24} /></div>
            <span className={`text-xs font-bold px-2 py-1 rounded-full ${metrics.attendancePct >= 75 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                {metrics.attendancePct >= 75 ? 'Doel bereikt' : 'Onder doel'}
            </span>
          </div>
          <p className="text-sm text-gray-500 font-medium">Opkomst %</p>
          <h3 className="text-3xl font-bold mt-1 text-gray-900">{formatNumber(metrics.attendancePct)}%</h3>
          <p className="text-xs text-gray-400 mt-2">Drempel: 75%</p>
        </div>

        {/* Trajecten */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-purple-50 rounded-lg text-purple-600"><Phone size={24} /></div>
          </div>
          <p className="text-sm text-gray-500 font-medium">Trajecten ingepland</p>
          <h3 className="text-3xl font-bold mt-1 text-gray-900">{metrics.totalTrajectories}</h3>
          <p className="text-xs text-gray-400 mt-2">Waarde: {formatCurrency(metrics.pillar2Bonus)}</p>
        </div>

        {/* Tevredenheid */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-orange-50 rounded-lg text-orange-600"><Smile size={24} /></div>
            {metrics.satisfactionMet ? (
                 <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">Voldaan</span>
            ) : (
                 <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Nog niet</span>
            )}
          </div>
          <p className="text-sm text-gray-500 font-medium">Klanttevredenheid</p>
          <h3 className="text-3xl font-bold mt-1 text-gray-900">{metrics.satisfactionBonus > 0 ? formatCurrency(metrics.satisfactionBonus) : '€ 0'}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
         {/* Chart */}
         <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                <TrendingUp size={20} className="text-[#E3000B]" /> Bonus Verdeling
            </h3>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" tick={{fontSize: 12}} />
                        <YAxis tickFormatter={(val) => `€${val}`} width={40} />
                        <Tooltip formatter={(val: number) => formatCurrency(val)} cursor={{fill: 'transparent'}} />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
         </div>

         {/* Detailed Table */}
         <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-800">Prestaties per Club</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-medium">
                        <tr>
                            <th className="px-6 py-3 min-w-[150px]">Club</th>
                            <th className="px-6 py-3">Opkomst</th>
                            <th className="px-6 py-3 text-center">Trajecten</th>
                            <th className="px-6 py-3 text-right">Bijdrage</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {clubRows.map((row) => (
                            <tr key={row.club} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-900">{row.club}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                        row.pct >= 75 ? 'bg-green-100 text-green-700' : 
                                        row.pct >= 60 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                        {formatNumber(row.pct)}%
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center text-gray-600">{row.trajectories}</td>
                                <td className="px-6 py-4 text-right font-medium text-gray-900">{formatCurrency(row.totalContrib)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
         </div>
      </div>

      {/* Bonus Details Modal */}
      {showBonusDetails && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setShowBonusDetails(false)}>
              <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
                  <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                      <h3 className="text-lg font-bold text-gray-900">Bonus Opbouw</h3>
                      <button onClick={() => setShowBonusDetails(false)} className="p-2 hover:bg-gray-200 rounded-full text-gray-500 transition-colors">
                          <X size={20} />
                      </button>
                  </div>
                  <div className="p-6 space-y-4">
                      {/* Pillar 1 */}
                      <div className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex items-center gap-3">
                              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Users size={18} /></div>
                              <div>
                                  <p className="font-semibold text-gray-900">Pijler 1: Planning</p>
                                  <p className="text-xs text-gray-500">Opkomst {formatNumber(metrics.attendancePct)}% {metrics.attendancePct >= 75 ? '(Behaald)' : '(Niet behaald)'}</p>
                              </div>
                          </div>
                          <span className="font-bold text-gray-900">{formatCurrency(metrics.pillar1Bonus)}</span>
                      </div>

                      {/* Pillar 2 */}
                      <div className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex items-center gap-3">
                              <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Phone size={18} /></div>
                              <div>
                                  <p className="font-semibold text-gray-900">Pijler 2: Nabellen</p>
                                  <p className="text-xs text-gray-500">{metrics.totalTrajectories} trajecten × €10</p>
                              </div>
                          </div>
                          <span className="font-bold text-gray-900">{formatCurrency(metrics.pillar2Bonus)}</span>
                      </div>

                      {/* Pillar 3 */}
                      <div className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex items-center gap-3">
                              <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><Smile size={18} /></div>
                              <div>
                                  <p className="font-semibold text-gray-900">Pijler 3: Tevredenheid</p>
                                  <p className="text-xs text-gray-500">{metrics.satisfactionBonus > 0 ? 'Doelen behaald' : 'Nog niet volledig'}</p>
                              </div>
                          </div>
                          <span className="font-bold text-gray-900">{formatCurrency(metrics.pillar3Bonus)}</span>
                      </div>

                      <div className="border-t border-gray-100 my-4"></div>

                      {/* Total */}
                      <div className="flex justify-between items-center px-3 pt-2">
                          <p className="font-bold text-lg text-gray-900">Totaal</p>
                          <p className={`font-bold text-2xl ${bonusColor}`}>{formatCurrency(metrics.totalBonus)}</p>
                      </div>
                  </div>
                  <div className="p-4 bg-gray-50 text-center">
                      <button onClick={() => setShowBonusDetails(false)} className="w-full py-3 bg-[#2D2D2D] text-white font-bold rounded-xl hover:bg-black transition-colors">
                          Sluiten
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}

export default Dashboard;