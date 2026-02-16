
import React from 'react';
import { TomAppData, CycleOption, TomClubName, Month, UserRole } from '../types';
import { TOM_CLUBS } from '../constants';
import { getMonthsForCycle, calculateTomMetrics } from '../services/tomCalcService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface Props {
  data: TomAppData;
  updateData: (newData: TomAppData) => void;
  cycle: CycleOption;
  userRole: UserRole;
}

const TomPillar1: React.FC<Props> = ({ data, updateData, cycle, userRole }) => {
  const months = getMonthsForCycle(cycle);
  const metrics = calculateTomMetrics(data, cycle);
  const isReadOnly = userRole === 'admin' ? false : false; // Tom can edit

  const handleChange = (club: TomClubName, month: Month, field: 'expected' | 'actual', value: string) => {
    const numVal = value === '' ? null : Number(value);
    const newData = { ...data };
    newData.clubs[club][month] = {
      ...newData.clubs[club][month],
      [field]: numVal
    };
    updateData(newData);
  };

  const chartData = months.map(m => {
    let mExpected = 0;
    let mActual = 0;
    TOM_CLUBS.forEach(c => {
      mExpected += Number(data.clubs[c][m].expected || 0);
      mActual += Number(data.clubs[c][m].actual || 0);
    });
    const pct = mExpected > 0 ? (mActual / mExpected) * 100 : 0;
    return { name: m, percentage: pct };
  });

  const formatEuro = (val: number) => new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(val);
  const formatPct = (val: number) => new Intl.NumberFormat('nl-NL', { maximumFractionDigits: 1 }).format(val) + '%';

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h2 className="text-xl font-bold text-gray-800">Pijler 1: Opkomst</h2>
           <p className="text-gray-500 text-sm mt-1">Staffel per club: 70% (€0.35), 80% (€0.65), 90% (€1.00)</p>
        </div>
        
        <div className="bg-gray-50 px-4 py-2 rounded-xl border border-gray-200 text-right">
            <div className="text-xs text-gray-500 uppercase font-bold">Totaal Bonus</div>
            <div className="text-xl font-bold text-[#E3000B]">{formatEuro(metrics.pillar1.totalBonus)}</div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100 h-64">
         <h3 className="text-sm font-bold text-gray-600 mb-4 uppercase tracking-wide">Gemiddelde Opkomst Trend</h3>
         <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis domain={[0, 100]} fontSize={12} />
                <Tooltip formatter={(val: number) => formatPct(val)} />
                <Line type="monotone" dataKey="percentage" stroke="#E3000B" strokeWidth={3} dot={{r: 4}} />
            </LineChart>
         </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 gap-6">
          {TOM_CLUBS.map(club => {
              const details = metrics.pillar1.clubDetails[club];
              const isHigh = details.pct >= 90;
              const isMid = details.pct >= 80;
              const isLow = details.pct >= 70;
              
              const badgeColor = isHigh ? 'bg-green-100 text-green-700' : isMid ? 'bg-blue-100 text-blue-700' : isLow ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700';

              return (
                <div key={club} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <span className="font-bold text-gray-900">{club}</span>
                            <span className={`text-xs px-2 py-1 rounded-full font-bold ${badgeColor}`}>
                                {formatPct(details.pct)} ({formatEuro(details.rate)}/speler)
                            </span>
                        </div>
                        <span className="font-bold text-gray-900">{formatEuro(details.bonus)}</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="text-gray-500 bg-white border-b border-gray-100">
                                <tr>
                                    <th className="px-4 py-2 text-left w-32">Maand</th>
                                    {months.map(m => <th key={m} className="px-2 py-2 text-center">{m}</th>)}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                <tr>
                                    <td className="px-4 py-2 font-medium text-gray-400">Verwacht</td>
                                    {months.map(m => (
                                        <td key={m} className="p-2">
                                            <input 
                                                type="number"
                                                className="w-full text-center border rounded p-1 text-xs"
                                                value={data.clubs[club][m].expected ?? ''}
                                                onChange={e => handleChange(club, m, 'expected', e.target.value)}
                                                placeholder="-"
                                            />
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="px-4 py-2 font-medium text-[#E3000B]">Daadwerkelijk</td>
                                    {months.map(m => (
                                        <td key={m} className="p-2">
                                            <input 
                                                type="number"
                                                className="w-full text-center border rounded p-1 text-xs font-bold"
                                                value={data.clubs[club][m].actual ?? ''}
                                                onChange={e => handleChange(club, m, 'actual', e.target.value)}
                                                placeholder="-"
                                            />
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
              );
          })}
      </div>
    </div>
  );
};

export default TomPillar1;
