import React, { useState } from 'react';
import { 
  Edit2, 
  Globe, 
  Flame, 
  Zap, 
  Crown, 
  Medal, 
  CheckCircle2, 
  BookOpen 
} from 'lucide-react';

const Profile = () => {
    const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    try {
      return stored ? JSON.parse(stored) : { name: 'Guest', email: 'guest@example.com' };
    } catch (e) {
      return { name: 'Guest', email: 'guest@example.com' };
    }
  });
  // Mock data to match the screenshot
  const stats = [
    { label: 'DAY STREAK', value: '0', icon: Flame, color: 'text-orange-500', borderColor: 'border-orange-500/20' },
    { label: 'TOTAL XP', value: '0', icon: Zap, color: 'text-yellow-400', borderColor: 'border-yellow-400/20' },
    { label: 'CURRENT LEAGUE', value: 'Sapphire', icon: Crown, color: 'text-purple-500', borderColor: 'border-purple-500/20' },
    { label: 'TOP 3 FINISHES', value: '12', icon: Medal, color: 'text-blue-500', borderColor: 'border-blue-500/20' },
  ];

  const achievements = [
    { 
      name: 'Wildfire', 
      desc: 'Reach a 3 day streak', 
      level: 1, 
      progress: 35, 
      icon: Flame, 
      iconColor: 'text-orange-500', 
      iconBg: 'bg-orange-500/10' 
    },
    { 
      name: 'Sage', 
      desc: 'Finish a unit without mistakes', 
      level: 2, 
      progress: 60, 
      icon: CheckCircle2, 
      iconColor: 'text-green-500', 
      iconBg: 'bg-green-500/10' 
    },
    { 
      name: 'Scholar', 
      desc: 'Learn 50 new words', 
      level: 5, 
      progress: 80, 
      icon: BookOpen, 
      iconColor: 'text-blue-500', 
      iconBg: 'bg-blue-500/10' 
    },
  ];

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white p-8 overflow-y-auto w-full font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* --- Header Card --- */}
        <div className="bg-[#111625] border border-slate-800 rounded-3xl p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-slate-700/50 border-4 border-[#0B0F19] flex items-center justify-center text-3xl font-bold text-slate-400">
                {user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2)}
              </div>
              <div className="absolute bottom-1 right-1 bg-[#0B0F19] rounded-full p-1">
                <div className="bg-green-600 rounded-full p-1">
                  <Globe size={14} className="text-white" />
                </div>
              </div>
            </div>
            
            <div>
              <h1 className="text-2xl font-bold mb-1">{user.name}</h1>
              <p className="text-slate-400 text-sm mb-3">@naija_john • Joined September 2025</p>
              <div className="flex items-center gap-6 text-sm font-medium">
                <div className="flex items-center gap-1.5">
                    <span className="text-white font-bold">12</span>
                    <span className="text-slate-400">Following</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="text-white font-bold">8</span>
                    <span className="text-slate-400">Followers</span>
                </div>
              </div>
            </div>
          </div>

          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 transition-colors text-sm font-semibold">
            <Edit2 size={16} />
            Edit Profile
          </button>
        </div>

        {/* --- Statistics Section --- */}
        <div>
          <h2 className="text-xl font-bold mb-4">Statistics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="bg-[#111625] border border-slate-800 rounded-2xl p-4 flex items-center gap-4 hover:bg-slate-800/50 transition-colors">
                <stat.icon className={`${stat.color}`} size={24} />
                <div>
                  <div className={`text-xl font-bold ${stat.value === '0' ? 'text-slate-500' : 'text-white'}`}>
                    {stat.value}
                  </div>
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- Achievements Section --- */}
        <div>
          <h2 className="text-xl font-bold mb-4">Achievements</h2>
          <div className="bg-[#111625] border border-slate-800 rounded-3xl p-2">
            {achievements.map((item, index) => (
              <div key={index} className="flex items-center gap-4 p-4 border-b border-slate-800 last:border-0 hover:bg-slate-800/30 rounded-2xl transition-colors">
                <div className={`w-16 h-16 rounded-xl ${item.iconBg} flex items-center justify-center flex-shrink-0`}>
                  <item.icon className={item.iconColor} size={32} />
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-bold text-lg">{item.name}</h3>
                    <span className="text-slate-500 text-sm">Level {item.level}</span>
                  </div>
                  <p className="text-slate-400 text-sm mb-3">{item.desc}</p>
                  
                  {/* Progress Bar */}
                  <div className="h-4 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-yellow-500 rounded-full" 
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;