import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Import hook for redirection
import { Moon, Volume2, Mic, Bell, LogOut } from 'lucide-react';

const Settings = () => {
  const navigate = useNavigate();

  // --- STATE MANAGEMENT ---
  
  // 1. Dynamic User State (Lazy Load)
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    try {
      return stored ? JSON.parse(stored) : { name: 'Guest', email: 'guest@example.com' };
    } catch (e) {
      return { name: 'Guest', email: 'guest@example.com' };
    }
  });

  // 2. Persisted Preferences (Load from LS, default to defaults)
  const [preferences, setPreferences] = useState(() => {
    const savedPrefs = localStorage.getItem('app_preferences');
    return savedPrefs ? JSON.parse(savedPrefs) : {
        darkMode: true,
        soundEffects: true,
        speakingExercises: true,
        dailyReminders: false,
    };
  });

  // Save preferences whenever they change
  useEffect(() => {
    localStorage.setItem('app_preferences', JSON.stringify(preferences));
  }, [preferences]);

  const toggleSwitch = (key) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // --- ACTIONS ---

  const handleSignOut = () => {
    // 1. Clear Data
    localStorage.removeItem('user');
    localStorage.removeItem('token'); // If you use tokens
    // 2. Redirect
    window.location.replace("/")
    // navigate('/'); 
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white p-6 md:p-8 font-sans flex-1 flex-col items-center">
      <div className="w-full max-w-2xl space-y-8">
        
        {/* --- Account Section --- */}
        <div>
           <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 ml-2">Account</h2>
           <div className="bg-[#111625] border border-slate-800 rounded-3xl p-6 md:p-8 space-y-8">
               
               {/* Dynamic Display Name */}
               <div className="flex items-center justify-between">
                   <div>
                       <h3 className="text-sm font-bold text-white mb-1">Display Name</h3>
                       <p className="text-slate-400">{user.name}</p> {/* Dynamic Data */}
                   </div>
                   <button className="text-green-500 font-bold text-sm hover:text-green-400 transition-colors">EDIT</button>
               </div>

               {/* Dynamic Email */}
               <div className="flex items-center justify-between">
                   <div>
                       <h3 className="text-sm font-bold text-white mb-1">Email</h3>
                       <p className="text-slate-400">{user.email}</p> {/* Dynamic Data */}
                   </div>
                   <button className="text-green-500 font-bold text-sm hover:text-green-400 transition-colors">VERIFY</button>
               </div>
               
               {/* Password Section remains static for security UI */}
               <div className="flex items-center justify-between">
                   <div>
                       <h3 className="text-sm font-bold text-white mb-1">Password</h3>
                       <p className="text-slate-400">********</p>
                   </div>
                   <button className="text-green-500 font-bold text-sm hover:text-green-400 transition-colors">CHANGE</button>
               </div>
           </div>
        </div>

        {/* --- Preferences Section (Unchanged logic, just passes state) --- */}
        <div>
           <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 ml-2">Preferences</h2>
           <div className="bg-[#111625] border border-slate-800 rounded-3xl overflow-hidden">
               <PreferenceItem 
                   icon={Moon} label="Dark Mode" description="Switch between light and dark themes"
                   isOn={preferences.darkMode} onToggle={() => toggleSwitch('darkMode')}
               />
               <PreferenceItem 
                   icon={Volume2} label="Sound Effects" description="Play sounds for correct/incorrect answers"
                   isOn={preferences.soundEffects} onToggle={() => toggleSwitch('soundEffects')}
               />
               <PreferenceItem 
                   icon={Mic} label="Speaking Exercises" description="Enable voice recognition lessons"
                   isOn={preferences.speakingExercises} onToggle={() => toggleSwitch('speakingExercises')}
               />
               <PreferenceItem 
                   icon={Bell} label="Daily Reminders" description="Remind me to practice at 8:00 AM"
                   isOn={preferences.dailyReminders} onToggle={() => toggleSwitch('dailyReminders')} isLast={true}
               />
           </div>
        </div>

        {/* --- Working Sign Out Button --- */}
        <button 
            onClick={handleSignOut}
            className="w-full py-4 rounded-2xl border border-red-500/20 text-red-500 font-bold hover:bg-red-500/10 transition-colors flex items-center justify-center gap-2"
        >
            <LogOut size={20} />
            Sign Out
        </button>

      </div>
    </div>
  );
};

// ... Helper Component PreferenceItem remains exactly the same ...
const PreferenceItem = ({ icon: Icon, label, description, isOn, onToggle, isLast }) => {
    return (
        <div className={`p-6 flex items-center justify-between hover:bg-slate-800/30 transition-colors ${!isLast ? 'border-b border-slate-800' : ''}`}>
            <div className="flex items-start gap-4">
                <Icon className="text-slate-400 mt-1" size={24} />
                <div>
                    <h3 className="font-bold text-white mb-1">{label}</h3>
                    <p className="text-slate-400 text-sm">{description}</p>
                </div>
            </div>
            <button 
                onClick={onToggle}
                className={`w-12 h-7 rounded-full relative transition-colors duration-300 ease-in-out ${
                    isOn ? 'bg-green-600' : 'bg-slate-600'
                }`}
            >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-1 shadow-md transition-transform duration-300 ease-in-out ${
                    isOn ? 'left-6' : 'left-1'
                }`} />
            </button>
        </div>
    );
};

export default Settings;