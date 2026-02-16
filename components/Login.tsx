
import React, { useState } from 'react';
import { UserRole } from '../types';
import { Shield, User, ChevronRight, Lock, KeyRound, ArrowLeft } from 'lucide-react';

interface LoginProps {
  onLogin: (role: UserRole) => void;
}

type LoginView = 'selection' | 'admin' | 'pin';

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [view, setView] = useState<LoginView>('selection');
  const [selectedUser, setSelectedUser] = useState<'joshua' | 'tom' | null>(null);
  const [inputVal, setInputVal] = useState('');
  const [error, setError] = useState(false);

  // Hardcoded credentials
  const ADMIN_PASS = 'Cani0807!';
  const JOSHUA_PIN = '0000';
  const TOM_PIN = '0000';

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal === ADMIN_PASS) {
      onLogin('admin');
    } else {
      setError(true);
    }
  };

  const handleUserPinLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUser === 'joshua' && inputVal === JOSHUA_PIN) {
      onLogin('joshua');
    } else if (selectedUser === 'tom' && inputVal === TOM_PIN) {
      onLogin('tom');
    } else {
      setError(true);
    }
  };

  const startUserLogin = (user: 'joshua' | 'tom') => {
    setSelectedUser(user);
    setView('pin');
    setInputVal('');
    setError(false);
  };

  const startAdminLogin = () => {
    setView('admin');
    setInputVal('');
    setError(false);
  };

  const reset = () => {
    setView('selection');
    setSelectedUser(null);
    setInputVal('');
    setError(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-2">SINA <span className="text-[#E3000B]">Voetballab</span></h1>
        <p className="text-gray-500">Persoonlijk Bonus Dashboard</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 w-full max-w-md space-y-6">
        
        {/* --- VIEW: SELECTION --- */}
        {view === 'selection' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
             {/* Joshua Login */}
             <button
               onClick={() => startUserLogin('joshua')}
               className="w-full group relative flex items-center p-4 border border-gray-200 rounded-xl hover:border-[#E3000B] hover:bg-red-50 transition-all duration-200"
             >
               <div className="p-3 bg-red-100 text-[#E3000B] rounded-full mr-4 group-hover:scale-110 transition-transform">
                 <User size={24} />
               </div>
               <div className="text-left flex-1">
                 <h3 className="font-bold text-gray-900">Inloggen als Joshua</h3>
                 <p className="text-xs text-gray-500">Pincode vereist</p>
               </div>
               <ChevronRight className="text-gray-300 group-hover:text-[#E3000B]" />
             </button>

             {/* Tom Login */}
             <button
               onClick={() => startUserLogin('tom')}
               className="w-full group relative flex items-center p-4 border border-gray-200 rounded-xl hover:border-[#E3000B] hover:bg-red-50 transition-all duration-200"
             >
               <div className="p-3 bg-red-100 text-[#E3000B] rounded-full mr-4 group-hover:scale-110 transition-transform">
                 <User size={24} />
               </div>
               <div className="text-left flex-1">
                 <h3 className="font-bold text-gray-900">Inloggen als Tom</h3>
                 <p className="text-xs text-gray-500">Pincode vereist</p>
               </div>
               <ChevronRight className="text-gray-300 group-hover:text-[#E3000B]" />
             </button>
             
             <div className="relative py-2">
               <div className="absolute inset-0 flex items-center">
                 <div className="w-full border-t border-gray-200"></div>
               </div>
               <div className="relative flex justify-center text-sm">
                 <span className="px-2 bg-white text-gray-500">of</span>
               </div>
             </div>

             {/* Admin Login Toggle */}
             <button
               onClick={startAdminLogin}
               className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200"
             >
               <div className="flex items-center">
                 <div className="p-3 bg-gray-100 text-gray-600 rounded-full mr-4">
                   <Shield size={24} />
                 </div>
                 <div className="text-left">
                    <h3 className="font-bold text-gray-900">Beheerder</h3>
                    <p className="text-xs text-gray-500">Wachtwoord vereist</p>
                 </div>
               </div>
               <ChevronRight className="text-gray-300" />
             </button>
          </div>
        )}

        {/* --- VIEW: PIN CODE (USER) --- */}
        {view === 'pin' && selectedUser && (
           <form onSubmit={handleUserPinLogin} className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="text-center mb-6">
                 <div className="inline-flex p-3 bg-red-100 text-[#E3000B] rounded-full mb-3">
                    <User size={32} />
                 </div>
                 <h2 className="text-xl font-bold text-gray-900">
                    Welkom {selectedUser === 'joshua' ? 'Joshua' : 'Tom'}
                 </h2>
                 <p className="text-sm text-gray-500">Voer je pincode in</p>
              </div>

              <div className="space-y-2">
                 <div className="relative">
                    <KeyRound className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input 
                       type="password"
                       inputMode="numeric"
                       maxLength={4}
                       value={inputVal}
                       onChange={(e) => { setInputVal(e.target.value); setError(false); }}
                       className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E3000B] text-center tracking-widest text-lg font-bold ${error ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}
                       placeholder="••••"
                       autoFocus
                    />
                 </div>
                 {error && <p className="text-xs text-red-500 font-bold ml-1 text-center">Onjuiste pincode</p>}
              </div>

              <button 
                 type="submit"
                 className="w-full bg-[#E3000B] text-white font-bold py-3 rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
              >
                 Inloggen
              </button>
              
              <button 
                 type="button"
                 onClick={reset}
                 className="w-full text-gray-500 text-sm font-medium hover:text-gray-800 py-2 flex items-center justify-center gap-2"
              >
                 <ArrowLeft size={16} /> Terug
              </button>
           </form>
        )}

        {/* --- VIEW: ADMIN PASSWORD --- */}
        {view === 'admin' && (
          <form onSubmit={handleAdminLogin} className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
             <div className="text-center mb-6">
                <div className="inline-flex p-3 bg-gray-100 text-gray-600 rounded-full mb-3">
                   <Shield size={32} />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Beheerder Inlog</h2>
                <p className="text-sm text-gray-500">Voer het wachtwoord in</p>
             </div>

             <div className="space-y-2">
                <div className="relative">
                   <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                   <input 
                      type="password"
                      value={inputVal}
                      onChange={(e) => { setInputVal(e.target.value); setError(false); }}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E3000B] ${error ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}
                      placeholder="Wachtwoord"
                      autoFocus
                   />
                </div>
                {error && <p className="text-xs text-red-500 font-bold ml-1 text-center">Onjuist wachtwoord</p>}
             </div>

             <button 
                type="submit"
                className="w-full bg-[#2D2D2D] text-white font-bold py-3 rounded-xl hover:bg-black transition-colors shadow-lg"
             >
                Inloggen
             </button>
             
             <button 
                type="button"
                onClick={reset}
                className="w-full text-gray-500 text-sm font-medium hover:text-gray-800 py-2 flex items-center justify-center gap-2"
             >
                <ArrowLeft size={16} /> Terug
             </button>
          </form>
        )}
      </div>

      <div className="mt-8 text-center text-sm text-gray-400">
        &copy; {new Date().getFullYear()} SINA Voetballab
      </div>
    </div>
  );
};

export default Login;
