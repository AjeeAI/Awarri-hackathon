import React from 'react';
import { Crown } from 'lucide-react';

const Leaderboard = () => {
  // Mock Data
  const podium = [
    { 
      rank: 2, 
      name: 'Fatima', 
      xp: 980, 
      initials: 'FA', 
      color: 'bg-slate-600', 
      border: 'border-slate-500',
      size: 'w-20 h-20 text-xl',
      height: 'mt-8' // Push down slightly
    },
    { 
      rank: 1, 
      name: 'Chinedu', 
      xp: 1240, 
      initials: 'CO', 
      color: 'bg-yellow-600', 
      border: 'border-yellow-400',
      size: 'w-24 h-24 text-2xl', // Largest
      height: 'mb-4', // Push up
      icon: true // Has Crown
    },
    { 
      rank: 3, 
      name: 'Emeka', 
      xp: 890, 
      initials: 'EN', 
      color: 'bg-orange-700', 
      border: 'border-orange-600',
      size: 'w-20 h-20 text-xl',
      height: 'mt-8' // Push down slightly
    },
  ];

  const list = [
    { rank: 4, name: 'Sarah J.', xp: 750, initials: 'SJ' },
    { rank: 5, name: 'Tunde B.', xp: 620, initials: 'TB' },
    { rank: 6, name: 'John Doe (You)', xp: 450, initials: 'JD', isUser: true },
  ];

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white p-8 w-full font-sans flex flex-col items-center">
      
      {/* --- Header --- */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-2">
            <div className="w-12 h-12 rounded-full bg-slate-800/50 flex items-center justify-center border border-slate-700">
                <Crown className="text-yellow-500" size={24} />
            </div>
        </div>
        <h1 className="text-2xl font-bold">Sapphire League</h1>
        <p className="text-slate-400 text-sm mt-1">Top 10 advance to the Diamond League</p>
      </div>

      {/* --- Main Card --- */}
      <div className="w-full max-w-md bg-[#111625] rounded-3xl border border-slate-800/50 overflow-hidden shadow-2xl">
        
        {/* Podium Section */}
        <div className="flex justify-center items-end gap-4 p-8 pb-4">
            {podium.map((user) => (
                <div key={user.rank} className={`flex flex-col items-center ${user.height}`}>
                    {/* Crown Icon for 1st Place */}
                    {user.icon && (
                        <Crown className="text-yellow-400 mb-2 drop-shadow-lg" size={28} fill="currentColor" />
                    )}
                    
                    {/* Avatar Circle */}
                    <div className={`${user.size} rounded-full ${user.color} border-4 ${user.border} flex items-center justify-center font-bold shadow-lg mb-3 relative`}>
                        {user.initials}
                        {/* Rank Badge */}
                        <div className={`absolute -bottom-3 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            user.rank === 1 ? 'bg-yellow-400 text-black' : 
                            user.rank === 2 ? 'bg-slate-400 text-black' : 
                            'bg-orange-400 text-black'
                        }`}>
                            {user.rank}
                        </div>
                    </div>

                    <div className="text-center mt-2">
                        <div className="font-bold text-lg">{user.name}</div>
                        <div className={`font-bold text-sm ${
                            user.rank === 1 ? 'text-yellow-400' : 'text-slate-400'
                        }`}>
                            {user.xp} XP
                        </div>
                    </div>
                </div>
            ))}
        </div>

        {/* Ranking List */}
        <div className="px-4 pb-6 space-y-2 mt-4">
            {list.map((user) => (
                <div 
                    key={user.rank}
                    className={`flex items-center justify-between p-4 rounded-2xl transition-all
                        ${user.isUser 
                            ? 'bg-slate-800/80 border border-slate-700 shadow-lg' // Highlight for User
                            : 'hover:bg-slate-800/30 border border-transparent'
                        }
                    `}
                >
                    <div className="flex items-center gap-4">
                        <span className={`font-bold w-6 text-center ${user.isUser ? 'text-green-400' : 'text-slate-500'}`}>
                            {user.rank}
                        </span>
                        
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
                            ${user.isUser 
                                ? 'bg-slate-700 text-green-400 border border-slate-600' 
                                : 'bg-slate-800 text-slate-400'
                            }
                        `}>
                            {user.initials}
                        </div>
                        
                        <span className={`font-semibold ${user.isUser ? 'text-green-400' : 'text-white'}`}>
                            {user.name}
                        </span>
                    </div>
                    
                    <span className="font-bold text-slate-400 text-sm">
                        {user.xp} XP
                    </span>
                </div>
            ))}
        </div>

      </div>
    </div>
  );
};

export default Leaderboard;