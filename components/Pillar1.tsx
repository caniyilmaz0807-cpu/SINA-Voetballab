import React from 'react';
import { AppData, CycleOption, ClubName, Month, UserRole } from '../types';
import { CLUBS } from '../constants';
import { getMonthsForCycle, calculateMetrics, formatNumber, formatCurrency } from '../services/calcService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface Props {
  data: AppData;
  updateData: (newData: AppData) => void;
  cycle: CycleOption;
  userRole: UserRole;
}

const Pillar1: React.FC<Props> = ({ data, updateData, cycle, userRole }) => {
  const months = getMonthsForCycle(cycle);
  const metrics = calculateMetrics(data, cycle);
  const isReadOnly = userRole !== 'admin';

  const handleChange = (club: ClubName, month: Month, field: 'expected' | 'actual', value: string) => {
    if (isReadOnly) return;
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
    CLUBS.forEach(c => {
      mExpected += Number(data.clubs[c][m].expected || 0);
      mActual += Number(data.clubs[c][m].actual || 0);
    });
    const pct = mExpected > 0 ? (mActual / mExpected) * 100 : 0;
    return { name: m, percentage: pct };
  });

  const isSuccess = metrics.attendancePct >= 75;

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h2 className="text-xl font-bold text-gray-800">Pijler 1: Planning</h2>
           <p className="text-gray-500 text-sm mt-1">Doel: ≥ 75% opkomst. Bonus: €0,50 / speler.</p>
        </div>
        
        <div className="flex w-full md:w-auto gap-4">
            <div className={`flex-1 md:flex-none flex items-center space-x-3 px-4 py-2 rounded-xl border ${isSuccess ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
              {isSuccess ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
              <div className="text-right flex-1 md:flex-none">
                 <div className="text-xs uppercase font-bold tracking-wide">{isSuccess ? 'Bonus Actief' : 'Onder Drempel'}</div>
                 <div className="text-lg font-bold">{formatNumber(metrics.attendancePct)}%</div>
              </div>
            </div>
            
            <div className="flex-1 md:flex-none bg-gray-50 px-4 py-2 rounded-xl border border-gray-200 text-right">
                <div className="text-xs text-gray-500 uppercase font-bold">Bonus</div>
                <div className="text-xl font-bold text-[#E3000B]">{formatCurrency(metrics.pillar1Bonus)}</div>
            </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100 h-64 md:h-80">
         <h3 className="text-sm font-bold text-gray-600 mb-4 uppercase tracking-wide">Opkomstpercentage verloop</h3>
         <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis domain={[0, 100]} fontSize={12} />
                <Tooltip formatter={(val: number) => `${formatNumber(val)}%`} />
                <Line type="monotone" dataKey="percentage" stroke="#E3000B" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
            </LineChart>
         </ResponsiveContainer>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-700 font-medium border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 sticky left-0 bg-gray-50 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] min-w-[140px]">Club</th>
                <th className="px-4 py-3 bg-gray-50 min-w-[80px]">Type</th>
                {months.map(m => (
                  <th key={m} className="px-2 py-3 text-center min-w-[70px]">{m}</th>
                ))}
                <th className="px-4 py-3 text-right bg-gray-50 font-bold min-w-[80px]">Totaal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {CLUBS.map(club => {
                  let rowExp = 0;
                  let rowAct = 0;
                  months.forEach(m => {
                      rowExp += Number(data.clubs[club][m].expected || 0);
                      rowAct += Number(data.clubs[club][m].actual || 0);
                  });
                  const rowPct = rowExp > 0 ? (rowAct / rowExp) * 100 : 0;

                  return (
                    <React.Fragment key={club}>
                      <tr className="bg-white hover:bg-gray-50/50">
                        <td rowSpan={2} className="px-4 py-3 font-semibold text-gray-900 sticky left-0 bg-white border-r border-gray-100 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                            <div className="truncate">{club}</div>
                            <div className={`mt-1 text-xs px-2 py-0.5 rounded-full w-fit ${rowPct >= 75 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {formatNumber(rowPct)}%
                            </div>
                        </td>
                        <td className="px-4 py-2 text-xs font-bold text-gray-400 uppercase">Verwacht</td>
                        {months.map(m => (
                          <td key={`exp-${m}`} className="px-2 py-2 text-center">
                            <input
                              type="number"
                              className={`w-full text-center p-1 border rounded text-xs ${isReadOnly ? 'bg-transparent border-transparent text-gray-500' : 'bg-gray-50/50 border-gray-200 text-gray-600 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500'}`}
                              value={data.clubs[club][m].expected ?? ''}
                              onChange={(e) => handleChange(club, m, 'expected', e.target.value)}
                              placeholder="-"
                              disabled={isReadOnly}
                            />
                          </td>
                        ))}
                        <td className="px-4 py-2 text-right font-medium text-gray-500">{rowExp}</td>
                      </tr>
                      <tr className="bg-white border-b border-gray-100 hover:bg-gray-50/50">
                        <td className="px-4 py-2 text-xs font-bold text-[#E3000B] uppercase">Actueel</td>
                        {months.map(m => (
                          <td key={`act-${m}`} className="px-2 py-2 text-center">
                            <input
                              type="number"
                              className={`w-full text-center p-1 border rounded font-medium text-xs ${isReadOnly ? 'bg-transparent border-transparent text-gray-900' : 'border-gray-200 text-gray-900 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500'}`}
                              value={data.clubs[club][m].actual ?? ''}
                              onChange={(e) => handleChange(club, m, 'actual', e.target.value)}
                              placeholder="-"
                              disabled={isReadOnly}
                            />
                          </td>
                        ))}
                        <td className="px-4 py-2 text-right font-bold text-gray-900">{rowAct}</td>
                      </tr>
                    </React.Fragment>
                  );
              })}
            </tbody>
            <tfoot className="bg-gray-50 font-bold text-gray-800">
               <tr>
                   <td colSpan={2} className="px-4 py-3 text-right sticky left-0 bg-gray-50 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Totaal Actueel:</td>
                   {months.map(m => {
                       let sum = 0;
                       CLUBS.forEach(c => sum += Number(data.clubs[c][m].actual || 0));
                       return <td key={m} className="px-4 py-3 text-center">{sum}</td>;
                   })}
                   <td className="px-4 py-3 text-right text-[#E3000B]">
                       {(() => {
                           let total = 0;
                           CLUBS.forEach(c => months.forEach(m => total += Number(data.clubs[c][m].actual || 0)));
                           return total;
                       })()}
                   </td>
               </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Pillar1;