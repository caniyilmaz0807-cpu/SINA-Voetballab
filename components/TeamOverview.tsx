
import React from 'react';
import { AppData, TomAppData, CycleOption } from '../types';
import { calculateMetrics, formatCurrency } from '../services/calcService';
import { calculateTomMetrics } from '../services/tomCalcService';
import { Users, Euro, Briefcase, TrendingUp, Phone, Smile } from 'lucide-react';

interface Props {
  joshuaData: AppData;
  tomData: TomAppData;
  cycle: CycleOption;
  setCycle: (cycle: CycleOption) => void;
}

const TeamOverview: React.FC<Props> = ({ joshuaData, tomData, cycle, setCycle }) => {
  const jMetrics = calculateMetrics(joshuaData, cycle);
  const tMetrics = calculateTomMetrics(tomData, cycle);

  const totalBonus = jMetrics.totalBonus + tMetrics.totalBonus;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Team Overzicht 🚀</h1>
          
          {/* Cycle Selector */}
          <div className="inline-flex bg-gray-100 p-1 rounded-lg">
             {(['Cyclus 1', 'Cyclus 2', 'Seizoen'] as CycleOption[]).map((option) => (
                <button
                    key={option}
                    onClick={() => setCycle(option)}
                    className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${
                        cycle === option 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    {option}
                </button>
             ))}
          </div>
        </div>

        <div className="flex items-center gap-4 bg-gray-900 text-white px-6 py-4 rounded-xl shadow-lg w-full md:w-auto">
           <div className="p-2 bg-gray-800 rounded-lg"><Euro size={24} className="text-[#E3000B]" /></div>
           <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Totaal Team Bonus</p>
              <p className="text-3xl font-bold">{formatCurrency(totalBonus)}</p>
           </div>
        </div>
      </div>

      {/* Breakdown Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
           <h3 className="text-lg font-bold text-gray-800">Bonus Verdeling per Medewerker</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm font-bold uppercase tracking-wider border-b border-gray-200">
                <th className="px-6 py-4">Medewerker</th>
                <th className="px-6 py-4">Pijler 1</th>
                <th className="px-6 py-4">Pijler 2</th>
                <th className="px-6 py-4">Pijler 3</th>
                <th className="px-6 py-4 text-right">Totaal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm md:text-base">
              {/* Joshua Row */}
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-bold text-gray-900 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-[#E3000B]">
                        <Users size={16} />
                    </div>
                    Joshua
                    <span className="text-xs font-normal text-gray-400 ml-1">(CS Manager)</span>
                </td>
                <td className="px-6 py-4">
                    <div className="font-medium">{formatCurrency(jMetrics.pillar1Bonus)}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-1 mt-1"><Users size={10} /> Planning</div>
                </td>
                <td className="px-6 py-4">
                    <div className="font-medium">{formatCurrency(jMetrics.pillar2Bonus)}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-1 mt-1"><Phone size={10} /> Nabellen</div>
                </td>
                <td className="px-6 py-4">
                    <div className="font-medium">{formatCurrency(jMetrics.pillar3Bonus)}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-1 mt-1"><Smile size={10} /> Tevredenheid</div>
                </td>
                <td className="px-6 py-4 text-right font-bold text-[#E3000B] text-lg">
                    {formatCurrency(jMetrics.totalBonus)}
                </td>
              </tr>

              {/* Tom Row */}
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-bold text-gray-900 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <Briefcase size={16} />
                    </div>
                    Tom
                    <span className="text-xs font-normal text-gray-400 ml-1">(Op. Coördinator)</span>
                </td>
                <td className="px-6 py-4">
                    <div className="font-medium">{formatCurrency(tMetrics.pillar1.totalBonus)}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-1 mt-1"><Users size={10} /> Opkomst</div>
                </td>
                <td className="px-6 py-4">
                    <div className="font-medium">{formatCurrency(tMetrics.pillar2.totalBonus)}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-1 mt-1"><Briefcase size={10} /> Bezoeken</div>
                </td>
                <td className="px-6 py-4">
                    <div className="font-medium">{formatCurrency(tMetrics.pillar3.totalBonus)}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-1 mt-1"><TrendingUp size={10} /> Groei</div>
                </td>
                <td className="px-6 py-4 text-right font-bold text-[#E3000B] text-lg">
                    {formatCurrency(tMetrics.totalBonus)}
                </td>
              </tr>
            </tbody>
            <tfoot className="bg-gray-50 border-t border-gray-200">
                <tr>
                    <td className="px-6 py-4 font-bold text-gray-900 uppercase tracking-wide">Totaal Team</td>
                    <td className="px-6 py-4 font-bold text-gray-600">{formatCurrency(jMetrics.pillar1Bonus + tMetrics.pillar1.totalBonus)}</td>
                    <td className="px-6 py-4 font-bold text-gray-600">{formatCurrency(jMetrics.pillar2Bonus + tMetrics.pillar2.totalBonus)}</td>
                    <td className="px-6 py-4 font-bold text-gray-600">{formatCurrency(jMetrics.pillar3Bonus + tMetrics.pillar3.totalBonus)}</td>
                    <td className="px-6 py-4 text-right font-bold text-gray-900 text-xl">{formatCurrency(totalBonus)}</td>
                </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TeamOverview;
