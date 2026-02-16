
import React from 'react';
import { TomAppData, CycleOption, TomClubName, Month } from '../types';
import { TOM_CLUBS } from '../constants';
import { getMonthsForCycle, calculateTomMetrics } from '../services/tomCalcService';
import { Briefcase } from 'lucide-react';

interface Props {
  data: TomAppData;
  updateData: (newData: TomAppData) => void;
  cycle: CycleOption;
}

const TomPillar2: React.FC<Props> = ({ data, updateData, cycle }) => {
  const months = getMonthsForCycle(cycle);
  const metrics = calculateTomMetrics(data, cycle);

  const handleChange = (club: TomClubName, month: Month, value: string) => {
    const numVal = value === '' ? null : Number(value);
    const newData = { ...data };
    newData.clubs[club][month] = {
      ...newData.clubs[club][month],
      visits: numVal
    };
    updateData(newData);
  };

  const formatEuro = (val: number) => new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(val);

  return (
    <div className="space-y-6">
       <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h2 className="text-xl font-bold text-gray-800">Pijler 2: Clubbezoeken</h2>
           <p className="text-gray-500 text-sm mt-1">€15 per bezoek (min. 2 uploads in VPlan)</p>
        </div>
        
        <div className="flex gap-4">
             <div className="bg-blue-50 px-4 py-2 rounded-xl border border-blue-200 text-right text-blue-700">
                <div className="text-xs uppercase font-bold">Bezoeken</div>
                <div className="text-xl font-bold">{metrics.pillar2.totalVisits}</div>
            </div>
            <div className="bg-gray-50 px-4 py-2 rounded-xl border border-gray-200 text-right">
                <div className="text-xs text-gray-500 uppercase font-bold">Bonus</div>
                <div className="text-xl font-bold text-[#E3000B]">{formatEuro(metrics.pillar2.totalBonus)}</div>
            </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-700 font-medium">
                    <tr>
                        <th className="px-4 py-3 sticky left-0 bg-gray-50 z-10 min-w-[140px]">Club</th>
                        {months.map(m => <th key={m} className="px-2 py-3 text-center min-w-[60px]">{m}</th>)}
                        <th className="px-4 py-3 text-right font-bold">Totaal</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {TOM_CLUBS.map(club => {
                        let rowTotal = 0;
                        months.forEach(m => rowTotal += Number(data.clubs[club][m].visits || 0));
                        return (
                            <tr key={club} className="hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium text-gray-900 sticky left-0 bg-white z-10">{club}</td>
                                {months.map(m => (
                                    <td key={m} className="px-2 py-2">
                                        <input
                                            type="number"
                                            className="w-full text-center p-2 border rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                            value={data.clubs[club][m].visits ?? ''}
                                            onChange={(e) => handleChange(club, m, e.target.value)}
                                            placeholder="0"
                                        />
                                    </td>
                                ))}
                                <td className="px-4 py-3 text-right font-bold text-gray-900">{rowTotal}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
          </div>
      </div>
    </div>
  );
};

export default TomPillar2;
