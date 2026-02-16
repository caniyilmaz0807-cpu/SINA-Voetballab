import React from 'react';
import { AppData, CycleOption, UserRole } from '../types';
import { calculateMetrics, formatCurrency } from '../services/calcService';
import { Smile, Check, FileCheck, Share2, Star } from 'lucide-react';

interface Props {
  data: AppData;
  updateData: (newData: AppData) => void;
  cycle: CycleOption;
  userRole: UserRole;
}

const Pillar3: React.FC<Props> = ({ data, updateData, cycle, userRole }) => {
  const metrics = calculateMetrics(data, cycle);
  const isReadOnly = userRole !== 'admin';

  const CycleCard = ({ cycleName, dataKey }: { cycleName: string, dataKey: 'cyclus1' | 'cyclus2' }) => {
      const cData = data.satisfaction[dataKey];
      
      const updateField = (field: keyof typeof cData, value: any) => {
          if (isReadOnly) return;
          const newData = { ...data };
          newData.satisfaction[dataKey] = {
              ...newData.satisfaction[dataKey],
              [field]: value
          };
          updateData(newData);
      };

      const isComplete = Number(cData.score) >= 8 && cData.processed && cData.shared;

      return (
        <div className={`p-6 rounded-xl border-2 transition-all ${isComplete ? 'bg-orange-50 border-orange-200' : 'bg-white border-gray-100'}`}>
            <div className="flex justify-between items-start mb-6">
                <h3 className="text-lg font-bold text-gray-800">{cycleName}</h3>
                {isComplete ? (
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full flex items-center gap-1">
                        <Check size={12} /> VERDIEND
                    </span>
                ) : (
                    <span className="px-3 py-1 bg-gray-100 text-gray-500 text-xs font-bold rounded-full">
                        NOG NIET
                    </span>
                )}
            </div>

            <div className="space-y-6">
                {/* Score Input */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${Number(cData.score) >= 8 ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                            <Star size={20} />
                        </div>
                        <div>
                            <p className="font-medium text-gray-900">Gemiddelde Score</p>
                            <p className="text-xs text-gray-500">Doel: 8.0 of hoger</p>
                        </div>
                    </div>
                    <input 
                        type="number" 
                        min="0" max="10" step="0.1"
                        value={cData.score ?? ''}
                        onChange={(e) => updateField('score', e.target.value)}
                        className={`w-20 text-center font-bold text-lg p-2 border rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none ${isReadOnly ? 'border-transparent bg-transparent' : 'border-gray-200'}`}
                        placeholder="0.0"
                        disabled={isReadOnly}
                    />
                </div>

                {/* Survey Processed Toggle */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${cData.processed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                            <FileCheck size={20} />
                        </div>
                        <div>
                            <p className="font-medium text-gray-900">Survey Verwerkt</p>
                            <p className="text-xs text-gray-500">Binnen 3 weken</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => updateField('processed', !cData.processed)}
                        disabled={isReadOnly}
                        className={`w-12 h-7 rounded-full transition-colors relative ${cData.processed ? 'bg-green-500' : 'bg-gray-300'} ${isReadOnly ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        <div className={`absolute top-1 left-1 bg-white w-5 h-5 rounded-full shadow transition-transform ${cData.processed ? 'translate-x-5' : ''}`} />
                    </button>
                </div>

                {/* Shared Toggle */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${cData.shared ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                            <Share2 size={20} />
                        </div>
                        <div>
                            <p className="font-medium text-gray-900">Gedeeld met PM/CM</p>
                            <p className="text-xs text-gray-500">Besproken</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => updateField('shared', !cData.shared)}
                        disabled={isReadOnly}
                        className={`w-12 h-7 rounded-full transition-colors relative ${cData.shared ? 'bg-green-500' : 'bg-gray-300'} ${isReadOnly ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        <div className={`absolute top-1 left-1 bg-white w-5 h-5 rounded-full shadow transition-transform ${cData.shared ? 'translate-x-5' : ''}`} />
                    </button>
                </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                 <span className="text-sm font-medium text-gray-500">Bonus</span>
                 <span className={`text-xl font-bold ${isComplete ? 'text-[#E3000B]' : 'text-gray-300'}`}>€ 100,00</span>
            </div>
        </div>
      );
  };

  return (
    <div className="space-y-6">
       {/* Header */}
       <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h2 className="text-xl font-bold text-gray-800">Pijler 3: Klanttevredenheid</h2>
           <p className="text-gray-500 text-sm mt-1">Doel: Score ≥ 8.0 & survey verwerkt. Bonus: €100 per cyclus.</p>
        </div>
        
        <div className="flex w-full md:w-auto gap-4">
            <div className="flex-1 md:flex-none flex items-center space-x-3 px-4 py-2 bg-orange-50 text-orange-700 rounded-xl border border-orange-100">
               <Smile size={24} />
               <div className="text-right">
                 <div className="text-xs uppercase font-bold tracking-wide">Status</div>
                 <div className="text-lg font-bold">{metrics.satisfactionBonus > 0 ? 'Behaald' : 'Nog niet'}</div>
               </div>
            </div>
            
            <div className="flex-1 md:flex-none bg-gray-50 px-4 py-2 rounded-xl border border-gray-200 text-right">
                <div className="text-xs text-gray-500 uppercase font-bold">Bonus</div>
                <div className="text-xl font-bold text-[#E3000B]">{formatCurrency(metrics.pillar3Bonus)}</div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
         {(cycle === 'Cyclus 1' || cycle === 'Seizoen') && <CycleCard cycleName="Cyclus 1 (Sep - Dec)" dataKey="cyclus1" />}
         {(cycle === 'Cyclus 2' || cycle === 'Seizoen') && <CycleCard cycleName="Cyclus 2 (Jan - Mei)" dataKey="cyclus2" />}
      </div>
    </div>
  );
};

export default Pillar3;