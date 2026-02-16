
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Pillar1 from './components/Pillar1';
import Pillar2 from './components/Pillar2';
import Pillar3 from './components/Pillar3';
import ImportExport from './components/ImportExport';
import Login from './components/Login';
import TeamOverview from './components/TeamOverview';
import { AppData, CycleOption, UserRole, TomAppData } from './types';
import { INITIAL_DATA, TOM_INITIAL_DATA } from './constants';
import { Menu, Clock, Users, LayoutGrid } from 'lucide-react';

// Tom Components
import TomSidebar from './components/TomSidebar';
import TomDashboard from './components/TomDashboard';
import TomPillar1 from './components/TomPillar1';
import TomPillar2 from './components/TomPillar2';
import TomPillar3 from './components/TomPillar3';
import TomImportExport from './components/TomImportExport';

const App: React.FC = () => {
  // Joshua State
  const [data, setData] = useState<AppData>(INITIAL_DATA);
  // Tom State
  const [tomData, setTomData] = useState<TomAppData>(TOM_INITIAL_DATA);
  
  const [view, setView] = useState('dashboard');
  const [cycle, setCycle] = useState<CycleOption>('Cyclus 1');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  // Admin View State: 'joshua', 'tom', or 'overview'
  const [adminView, setAdminView] = useState<'joshua' | 'tom' | 'overview'>('joshua');

  // Load Joshua Data
  useEffect(() => {
    const saved = localStorage.getItem('joshua_dashboard_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setData({ ...INITIAL_DATA, ...parsed });
      } catch (e) {
        console.error("Failed to load Joshua data", e);
      }
    }
  }, []);

  // Load Tom Data
  useEffect(() => {
    const saved = localStorage.getItem('tom_dashboard_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTomData({ ...TOM_INITIAL_DATA, ...parsed });
      } catch (e) {
        console.error("Failed to load Tom data", e);
      }
    }
  }, []);

  // Save Joshua Data
  useEffect(() => {
    localStorage.setItem('joshua_dashboard_data', JSON.stringify(data));
  }, [data]);

  // Save Tom Data
  useEffect(() => {
    localStorage.setItem('tom_dashboard_data', JSON.stringify(tomData));
  }, [tomData]);

  // Handlers for Joshua
  const handleDataUpdate = (newData: AppData) => {
    setData({ ...newData, lastUpdated: new Date().toISOString() });
  };
  const handlePartialUpdate = (partial: Partial<AppData>) => {
      const newData = { ...data };
      if (partial.clubs) newData.clubs = partial.clubs as any;
      if (partial.satisfaction) newData.satisfaction = partial.satisfaction as any;
      newData.lastUpdated = new Date().toISOString();
      setData(newData);
  };

  // Handlers for Tom
  const handleTomUpdate = (newData: TomAppData) => {
      setTomData({ ...newData, lastUpdated: new Date().toISOString() });
  };
  const handleTomPartialUpdate = (partial: Partial<TomAppData>) => {
      const newData = { ...tomData };
      if (partial.clubs) {
          Object.keys(partial.clubs).forEach(club => {
             // @ts-ignore
             newData.clubs[club] = { ...newData.clubs[club], ...partial.clubs[club] };
          });
      }
      if (partial.growth) {
          // @ts-ignore
          newData.growth = partial.growth;
      }
      newData.lastUpdated = new Date().toISOString();
      setTomData(newData);
  };


  const closeSidebar = () => setIsSidebarOpen(false);

  const handleLogout = () => {
    setUserRole(null);
    setView('dashboard');
    setIsSidebarOpen(false);
    setAdminView('joshua'); // Reset admin view on logout
  };

  const formatDate = (isoString?: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString('nl-NL', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric'
    });
  };

  if (!userRole) {
    return <Login onLogin={setUserRole} />;
  }

  // --- Render Logic ---
  const isTeamOverview = userRole === 'admin' && adminView === 'overview';
  // If not overview, determine if we show Tom or Joshua
  const showTom = userRole === 'tom' || (userRole === 'admin' && adminView === 'tom');
  
  const lastUpdated = showTom ? tomData.lastUpdated : data.lastUpdated;

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans text-slate-800 relative">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 p-4 z-20 flex justify-between items-center shadow-sm h-16 no-print">
        <div className="flex items-center gap-3">
          {!isTeamOverview && (
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <Menu size={24} />
            </button>
          )}
          <span className="font-bold text-lg">SINA <span className="text-[#E3000B]">Voetballab</span></span>
        </div>

        {!isTeamOverview && lastUpdated && (
           <div className="flex flex-col items-end">
              <span className="text-[10px] text-gray-400 flex items-center gap-1">
                <Clock size={10} /> Laatste update
              </span>
              <span className="text-xs font-semibold text-gray-600">
                {formatDate(lastUpdated)}
              </span>
           </div>
        )}
      </div>

      {!isTeamOverview && (
        showTom ? (
            <TomSidebar 
              currentView={view} 
              setCurrentView={(v) => { setView(v); closeSidebar(); }}
              currentCycle={cycle} 
              setCurrentCycle={setCycle}
              isOpen={isSidebarOpen}
              onClose={closeSidebar}
              onLogout={handleLogout}
              userRole={userRole}
            />
        ) : (
            <Sidebar 
              currentView={view} 
              setCurrentView={(v) => { setView(v); closeSidebar(); }}
              currentCycle={cycle} 
              setCurrentCycle={setCycle}
              isOpen={isSidebarOpen}
              onClose={closeSidebar}
              onLogout={handleLogout}
              userRole={userRole}
            />
        )
      )}
      
      {/* Main Content Area */}
      <main className={`flex-1 p-4 md:p-8 overflow-y-auto w-full ${isTeamOverview ? '' : 'md:ml-64'} pt-20 md:pt-8 transition-all duration-300 print:ml-0 print:pt-0`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="text-sm text-gray-500 italic hidden md:flex items-center gap-2 mt-2">
              <span>Ingelogd als: <span className="font-semibold text-gray-800">
                  {userRole === 'admin' ? 'Beheerder' : showTom ? 'Tom' : 'Joshua'}
              </span></span>
              
              {userRole === 'admin' && (
                 <>
                   <span className="mx-2 text-gray-300">|</span>
                   <span className="flex items-center gap-1.5 text-blue-600 font-medium">
                     {isTeamOverview ? <LayoutGrid size={14} /> : <Users size={14} />}
                     Bekijkt: {isTeamOverview ? 'Team Totaal' : (showTom ? 'Tom' : 'Joshua')}
                   </span>
                 </>
              )}

              {!isTeamOverview && lastUpdated && (
                <>
                  <span className="mx-2 text-gray-300">|</span>
                  <span className="flex items-center gap-1.5" title={`Laatste wijziging: ${new Date(lastUpdated).toLocaleString('nl-NL')}`}>
                    <Clock size={14} className="text-gray-400" />
                    <span>Data update: <span className="font-semibold text-gray-800">{formatDate(lastUpdated)}</span></span>
                  </span>
                </>
              )}
            </div>
            
            {/* Right Side: Import/Export + Admin Switch */}
            <div className="flex flex-col items-end gap-3 w-full md:w-auto">
               {/* Import/Export Buttons - Hidden in Overview */}
               {!isTeamOverview && (
                 <div className="w-full md:w-auto">
                    {showTom ? (
                        <TomImportExport onDataLoaded={handleTomPartialUpdate} fullData={tomData} userRole={userRole} />
                    ) : (
                        <ImportExport onDataLoaded={handlePartialUpdate} fullData={data} userRole={userRole} />
                    )}
                 </div>
               )}

               {/* Admin Dashboard Switcher */}
               {userRole === 'admin' && (
                  <div className="flex gap-2 self-end w-full md:w-auto">
                    <div className="bg-white p-1 rounded-lg border border-gray-200 flex shadow-sm no-print w-full md:w-auto">
                      <button
                        onClick={() => { setAdminView('joshua'); setView('dashboard'); }}
                        className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex-1 md:flex-initial ${
                          adminView === 'joshua' 
                            ? 'bg-[#E3000B] text-white shadow-sm' 
                            : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        Joshua
                      </button>
                      <button
                        onClick={() => { setAdminView('tom'); setView('dashboard'); }}
                        className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex-1 md:flex-initial ${
                          adminView === 'tom' 
                            ? 'bg-blue-600 text-white shadow-sm' 
                            : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        Tom
                      </button>
                      <button
                        onClick={() => { setAdminView('overview'); }}
                        className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex-1 md:flex-initial flex items-center justify-center gap-1 ${
                          adminView === 'overview' 
                            ? 'bg-gray-800 text-white shadow-sm' 
                            : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                         <LayoutGrid size={12} /> Team
                      </button>
                    </div>

                    {isTeamOverview && (
                       <button 
                         onClick={handleLogout}
                         className="bg-white p-2 border border-gray-200 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                         title="Uitloggen"
                       >
                         <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                       </button>
                    )}
                  </div>
               )}
            </div>
        </div>

        {/* View Rendering */}
        {isTeamOverview ? (
           <TeamOverview joshuaData={data} tomData={tomData} cycle={cycle} setCycle={setCycle} />
        ) : showTom ? (
            <>
                {view === 'dashboard' && <TomDashboard data={tomData} cycle={cycle} />}
                {view === 'pillar1' && <TomPillar1 data={tomData} updateData={handleTomUpdate} cycle={cycle} userRole={userRole} />}
                {view === 'pillar2' && <TomPillar2 data={tomData} updateData={handleTomUpdate} cycle={cycle} />}
                {view === 'pillar3' && <TomPillar3 data={tomData} updateData={handleTomUpdate} cycle={cycle} />}
            </>
        ) : (
            <>
                {view === 'dashboard' && <Dashboard data={data} cycle={cycle} />}
                {view === 'pillar1' && <Pillar1 data={data} updateData={handleDataUpdate} cycle={cycle} userRole={userRole} />}
                {view === 'pillar2' && <Pillar2 data={data} updateData={handleDataUpdate} cycle={cycle} userRole={userRole} />}
                {view === 'pillar3' && <Pillar3 data={data} updateData={handleDataUpdate} cycle={cycle} userRole={userRole} />}
            </>
        )}
      </main>
    </div>
  );
};

export default App;
