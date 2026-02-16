import React from 'react';
import { LayoutDashboard, Users, Phone, Smile, X, LogOut, Shield, User } from 'lucide-react';
import { CycleOption, UserRole } from '../types';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  currentCycle: CycleOption;
  setCurrentCycle: (cycle: CycleOption) => void;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  userRole: UserRole;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  currentView, 
  setCurrentView, 
  currentCycle, 
  setCurrentCycle, 
  isOpen, 
  onClose,
  onLogout,
  userRole
}) => {
  
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'pillar1', label: 'Pijler 1: Planning', icon: Users },
    { id: 'pillar2', label: 'Pijler 2: Nabellen', icon: Phone },
    { id: 'pillar3', label: 'Pijler 3: Tevredenheid', icon: Smile },
  ];

  return (
    <>
      {/* Mobile Overlay - Only visible when open on mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm no-print"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed top-0 left-0 h-full w-64 bg-[#2D2D2D] text-white z-50 shadow-xl flex flex-col
        transition-transform duration-300 ease-in-out no-print
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0
      `}>
        {/* Header */}
        <div className="h-20 flex flex-col justify-center px-6 border-b border-gray-700 bg-[#2D2D2D] shrink-0 relative">
           <button 
             onClick={onClose}
             className="absolute top-4 right-4 md:hidden text-gray-400 hover:text-white p-1 hover:bg-gray-700 rounded-md transition-colors"
           >
             <X size={24} />
           </button>
           
           <div className="font-bold text-xl tracking-tight">SINA <span className="text-[#E3000B]">Voetballab</span></div>
           
           <div className="flex items-center gap-2 mt-1">
             <div className={`w-2 h-2 rounded-full ${userRole === 'admin' ? 'bg-red-500' : 'bg-green-500'}`}></div>
             <span className="text-xs font-medium text-gray-300 flex items-center gap-1">
               {userRole === 'admin' ? (
                 <>Beheerder <Shield size={10} /></>
               ) : (
                 <>Joshua <User size={10} /></>
               )}
             </span>
           </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-[#E3000B] text-white shadow-md transform scale-[1.02]' 
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon size={20} className="shrink-0" />
                <span className="font-medium text-sm truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer / Cycle Selection */}
        <div className="p-4 border-t border-gray-700 bg-[#252525] shrink-0 space-y-4">
          <div>
            <p className="text-xs text-gray-500 mb-3 font-bold uppercase tracking-wider px-2">Periode</p>
            <div className="space-y-1">
              {(["Cyclus 1", "Cyclus 2", "Seizoen"] as CycleOption[]).map((cycle) => (
                 <button
                    key={cycle}
                    onClick={() => { setCurrentCycle(cycle); onClose(); }}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      currentCycle === cycle 
                      ? 'bg-gray-700 text-white font-semibold border-l-4 border-[#E3000B]' 
                      : 'text-gray-400 hover:bg-gray-800'
                    }`}
                 >
                   {cycle}
                 </button>
              ))}
            </div>
          </div>
          
          <button 
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-md text-gray-400 hover:bg-gray-800 hover:text-white transition-colors mt-2 border-t border-gray-700 pt-4"
          >
            <LogOut size={18} />
            <span className="text-sm font-medium">Uitloggen</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;