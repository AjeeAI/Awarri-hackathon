import React from 'react';
import { Crown, Zap, Lock, CheckCircle, Shield } from 'lucide-react';

const Leaderboard = () => {
  // Mock User State
  const userStats = {
    currentLeague: 'Bronze', // UPDATED: Set to the first league
    currentXP: 150,          // OPTIONAL: Lowered XP to reflect a starter stats
    requiredXP: 500,         // OPTIONAL: Lowered requirement for the first level
    totalLifetimeXP: 150
  };

  // League Definitions
  const leagues = [
    { id: 1, name: 'Bronze', color: 'text-orange-400', bg: 'bg-orange-500', border: 'border-orange-500' },
    { id: 2, name: 'Silver', color: 'text-slate-300', bg: 'bg-slate-400', border: 'border-slate-400' },
    { id: 3, name: 'Gold', color: 'text-yellow-400', bg: 'bg-yellow-500', border: 'border-yellow-500' },
    { id: 4, name: 'Sapphire', color: 'text-blue-400', bg: 'bg-blue-500', border: 'border-blue-500' },
    { id: 5, name: 'Diamond', color: 'text-cyan-300', bg: 'bg-cyan-400', border: 'border-cyan-400' },
    { id: 6, name: 'Ruby', color: 'text-red-400', bg: 'bg-red-500', border: 'border-red-500' },
  ];

  // Find active index
  const activeIndex = leagues.findIndex(l => l.name === userStats.currentLeague);
  const percentage = Math.min(100, Math.round((userStats.currentXP / userStats.requiredXP) * 100));

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white p-4 md:p-8 w-full font-sans flex flex-col items-center">
      
      {/* --- Header --- */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center p-3 bg-slate-800/50 rounded-2xl border border-slate-700 mb-4">
            <Shield className="text-slate-400 mr-2" size={20} />
            <span className="font-bold text-slate-200 tracking-wide uppercase text-sm">League Journey</span>
        </div>
        <h1 className="text-3xl font-extrabold mb-2">My Progress</h1>
        <p className="text-slate-400 text-sm">
            Collect XP to promote to the next league tier.
        </p>
      </div>

      {/* --- Main Tracker Card --- */}
      <div className="w-full max-w-xl bg-[#111625] rounded-3xl border border-slate-800/60 overflow-hidden shadow-2xl p-6 relative">
        
        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -z-10"></div>

        <div className="space-y-4 relative">
            {/* Connecting Line */}
            <div className="absolute left-[27px] top-6 bottom-6 w-1 bg-slate-800 rounded-full -z-10"></div>

            {leagues.map((league, index) => {
                const isCompleted = index < activeIndex;
                const isActive = index === activeIndex;
                const isLocked = index > activeIndex;

                return (
                    <div 
                        key={league.id} 
                        className={`relative flex gap-4 p-4 rounded-2xl border transition-all duration-300
                            ${isActive 
                                ? 'bg-slate-800/60 border-slate-700 shadow-lg scale-[1.02]' 
                                : 'border-transparent opacity-90'
                            }
                            ${isLocked ? 'opacity-50 grayscale' : ''}
                        `}
                    >
                        {/* Status Icon Column */}
                        <div className="flex-shrink-0 flex items-start pt-1">
                            <div className={`w-14 h-14 rounded-full flex items-center justify-center border-4 shadow-sm z-10 bg-[#111625]
                                ${isActive ? `${league.border} ${league.color}` : 
                                  isCompleted ? 'border-green-500 text-green-500' : 
                                  'border-slate-700 text-slate-600'}
                            `}>
                                {isCompleted ? (
                                    <CheckCircle size={24} fill="currentColor" className="text-[#111625]" />
                                ) : isLocked ? (
                                    <Lock size={20} />
                                ) : (
                                    <Crown size={24} fill="currentColor" className={league.color} />
                                )}
                            </div>
                        </div>

                        {/* Content Column */}
                        <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                                <h3 className={`text-lg font-bold ${isActive ? 'text-white' : 'text-slate-400'}`}>
                                    {league.name} League
                                </h3>
                                {isActive && (
                                    <span className="text-xs font-bold text-slate-400 bg-slate-700/50 px-2 py-1 rounded">
                                        Current
                                    </span>
                                )}
                            </div>

                            {isActive ? (
                                <div className="mt-2 animate-in fade-in duration-500">
                                    <div className="flex justify-between text-xs font-bold text-slate-400 mb-2">
                                        <span>{userStats.currentXP} XP</span>
                                        <span>{userStats.requiredXP} XP Goal</span>
                                    </div>
                                    <div className="h-4 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-700/50 relative">
                                        {/* Progress Bar */}
                                        <div 
                                            className={`h-full ${league.bg} transition-all duration-1000 ease-out relative`}
                                            style={{ width: `${percentage}%` }}
                                        >
                                            {/* Shimmer Effect */}
                                            <div className="absolute inset-0 bg-white/20 w-full h-full animate-pulse"></div>
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-3 font-medium">
                                        You need <span className="text-white">{userStats.requiredXP - userStats.currentXP} more XP</span> to promote to {leagues[index + 1]?.name || 'Champion'} League.
                                    </p>
                                </div>
                            ) : isCompleted ? (
                                <div className="text-sm text-green-500 font-medium flex items-center mt-1">
                                    Completed <CheckCircle size={14} className="ml-1" />
                                </div>
                            ) : (
                                <div className="text-sm text-slate-600 font-medium mt-1">
                                    Locked
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;