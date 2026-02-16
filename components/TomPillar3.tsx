
import React from 'react';
import { TomAppData, CycleOption, TomClubName } from '../types';
import { TOM_CLUBS } from '../constants';
import { calculateTomMetrics } from '../services/tomCalcService';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface Props {
  data: TomAppData;
  updateData: (newData: TomAppData) => void;
  cycle: CycleOption;
}

const TomPillar3: React.FC<Props> = ({ data, updateData, cycle }) => {
  const metrics = calculateTomMetrics(data, cycle);

  const handleGrowthChange = (club: TomClubName, cycleKey: 'cyclus1' | 'cyclus2', field: 'previous' | 'current', value: string) => {
    const numVal = value === '' ? null : Number(value);
    const newData = { ...data };
    newData.growth[club][cycleKey] = {
      ...newData.growth[club][cycleKey],
      [field]: numVal
    };
    updateData(newData);
  };

  const formatEuro = (val: number) => new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(val);
  const formatPct = (val: number) => new Intl.NumberFormat('nl-NL', { maximumFractionDigits: 1 }).format(val) + '%';

  const GrowthRow = ({ club, cycleKey, label }: { club: TomClubName, cycleKey: 'cyclus1' | 'cyclus2', label: string }) => {
      const prev = data.growth[club][cycleKey].previous;
      const curr = data.growth[club][cycleKey].current;
      
      let growthPct = 0;
      let bonus = 0;
      
      if (prev && Number(prev) > 0) {
          growthPct = ((Number(curr) - Number(prev)) / Number(prev));
          if (growthPct < -0.10) bonus = -25;
          else if (growthPct < 0.05) bonus = 0;
          else if (growthPct < 0.10) bonus = 50;
          else if (growthPct < 0.20) bonus = 100;
          else bonus = 150;
      }

      const isPositive = growthPct >= 0.05;
      const isNegative = growthPct < -0.10;

      return (
          <div className="grid grid-cols-12 gap-2 items-center py-3 border-b border-gray-100 last:border-0">
              <div className="col-span-3 text-sm font-medium text-gray-600">{label}</div>
              <div className="col-span-2">
                  <input 
                    type="number" 
                    placeholder="Vorige"
                    className="w-full p-1 border rounded text-xs text-center"
                    value={prev ?? ''}
                    onChange={e => handleGrowthChange(club, cycleKey, 'previous', e.target.value)}
                  />
              </div>
              <div className="col-span-2">
                   <input 
                    type="number" 
                    placeholder="Nu"
                    className="w-full p-1 border rounded text-xs text-center font-bold"
                    value={curr ?? ''}
                    onChange={e => handleGrowthChange(club, cycleKey, 'current', e.target.value)}
                  />
              </div>
              <div className="col-span-3 flex items-center justify-center gap-1">
                  {prev && (
                      <>
                        {isPositive ? <TrendingUp size={14} className="text-green-500" /> : isNegative ? <TrendingDown size={14} className="text-red-500" /> : <Minus size={14} className="text-gray-400" />}
                        <span className={`text-xs font-bold ${isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : 'text-gray-500'}`}>
                            {formatPct(growthPct * 100)}
                        </span>
                      </>
                  )}
              </div>
              <div className="col-span-2 text-right font-bold text-sm">
                  {prev ? formatEuro(bonus) : '-'}
              </div>
          </div>
      );
  };

  return (
    <div className="space-y-6">
       <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h2 className="text-xl font-bold text-gray-800">Pijler 3: Groei & Retentie</h2>
           <p className="text-gray-500 text-sm mt-1">Staffel op basis van groei %. Pas op: >10% daling is malus.</p>
        </div>
        
        <div className="bg-gray-50 px-4 py-2 rounded-xl border border-gray-200 text-right">
            <div className="text-xs text-gray-500 uppercase font-bold">Totaal Bonus</div>
            <div className="text-xl font-bold text-[#E3000B]">{formatEuro(metrics.pillar3.totalBonus)}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {TOM_CLUBS.map(club => (
             <div key={club} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                 <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-2 mb-2">{club}</h3>
                 
                 {(cycle === 'Cyclus 1' || cycle === 'Seizoen') && (
                     <GrowthRow club={club} cycleKey="cyclus1" label="Cyclus 1" />
                 )}
                 {(cycle === 'Cyclus 2' || cycle === 'Seizoen') && (
                     <GrowthRow club={club} cycleKey="cyclus2" label="Cyclus 2" />
                 )}
             </div>
         ))}
      </div>
    </div>
  );
};

export default TomPillar3;
