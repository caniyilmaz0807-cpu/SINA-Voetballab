import React from 'react';
import { AppData, CycleOption, ClubName, Month, UserRole } from '../types';
import { CLUBS } from '../constants';
import { getMonthsForCycle, calculateMetrics, formatCurrency } from '../services/calcService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Phone, TrendingUp } from 'lucide-react';

interface Props {
  data: AppData;
  updateData: (newData: AppData) => void;
  cycle: CycleOption;
  userRole: UserRole;
}

const Pillar2: React.FC<Props> = ({ data, updateData, cycle, userRole }) => {
  const months = getMonthsForCycle(cycle);
  const metrics = calculateMetrics(data, cycle);
  const isReadOnly = userRole !== 'admin';

  const handleChange = (club: ClubName, month: Month, value: string) => {
    if (isReadOnly) return;
    const numVal = value === '' ? null : Number(value);
    const newData = { ...data };
    newData.clubs[club][month] = {
      ...newData.clubs[club][month],
      trajectories: numVal
    };
    updateData(newData);
  };

  const chartData = months.map(m => {
    let total = 0;
    CLUBS.forEach(c => total += Number(data.clubs[c][m].trajectories || 0));
    return { name: m, trajectories: total };
  });

  return (
    <div className="space-y-6">
       {/* Header */}
       <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h2 className="text-xl font-bold text-gray-800">Pijler 2: Nabellen</h2>
           <p className="text-gray-500 text-sm mt-1">Doel: Trajecten inplannen. Bonus: €10,00 per traject.</p>
        </div>
        
        <div className="flex w-full md:w-auto gap-4">
            <div className="flex-1 md:flex-none flex items-center space-x-3 px-4 py-2 bg-purple-50 text-purple-700 rounded-xl border border-purple-100">
               <Phone size={24} />
               <div className="text-right">
                 <div className="text-xs uppercase font-bold tracking-wide">Totaal</div>
                 <div className="text-xl font-bold">{metrics.totalTrajectories}</div>
               </div>
            </div>
            
            <div className="flex-1 md:flex-none bg-gray-50 px-4 py-2 rounded-xl border border-gray-200 text-right">
                <div className="text-xs text-gray-500 uppercase font-bold">Bonus</div>
                <div className="text-xl font-bold text-[#E3000B]">{formatCurrency(metrics.pillar2Bonus)}</div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table - Takes up 2 columns */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
             <div className="p-4 border-b border-gray-100">
                 <h3 className="font-bold text-gray-700">Invoer Trajecten</h3>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-700 font-medium">
                        <tr>
                            <th className="px-4 py-3 font-semibold sticky left-0 bg-gray-50 border-r border-gray-200 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] min-w-[140px]">Club</th>
                            {months.map(m => <th key={m} className="px-2 py-3 text-center min-w-[60px]">{m}</th>)}
                            <th className="px-4 py-3 text-right font-bold min-w-[70px]">Totaal</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {CLUBS.map(club => {
                            let rowTotal = 0;
                            months.forEach(m => rowTotal += Number(data.clubs[club][m].trajectories || 0));
                            return (
                                <tr key={club} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium text-gray-900 sticky left-0 bg-white border-r border-gray-100 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] truncate">{club}</td>
                                    {months.map(m => (
                                        <td key={m} className="px-2 py-2">
                                            <input
                                                type="number"
                                                className={`w-full text-center p-2 border rounded focus:outline-none text-sm ${isReadOnly ? 'bg-transparent border-transparent' : 'border-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500'}`}
                                                value={data.clubs[club][m].trajectories ?? ''}
                                                onChange={(e) => handleChange(club, m, e.target.value)}
                                                placeholder="0"
                                                disabled={isReadOnly}
                                            />
                                        </td>
                                    ))}
                                    <td className="px-4 py-3 text-right font-bold text-gray-900">{rowTotal}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                    <tfoot className="bg-gray-50 font-bold text-gray-800">
                        <tr>
                            <td className="px-4 py-3 text-right sticky left-0 bg-gray-50 border-r border-gray-200 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Totaal:</td>
                            {months.map(m => {
                                let colSum = 0;
                                CLUBS.forEach(c => colSum += Number(data.clubs[c][m].trajectories || 0));
                                return <td key={m} className="px-2 py-3 text-center">{colSum}</td>;
                            })}
                            <td className="px-4 py-3 text-right text-purple-700">{metrics.totalTrajectories}</td>
                        </tr>
                    </tfoot>
                </table>
             </div>
        </div>

        {/* Chart - Takes up 1 column */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
             <h3 className="text-sm font-bold text-gray-600 mb-6 uppercase tracking-wide flex items-center gap-2">
                 <TrendingUp size={16} /> Per Maand
             </h3>
             <div className="flex-1 min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" fontSize={12} />
                        <YAxis allowDecimals={false} width={30} />
                        <Tooltip cursor={{fill: 'transparent'}} />
                        <Bar dataKey="trajectories" fill="#9B59B6" radius={[4, 4, 0, 0]} barSize={30} />
                    </BarChart>
                </ResponsiveContainer>
             </div>
        </div>
      </div>
    </div>
  );
};

export default Pillar2;