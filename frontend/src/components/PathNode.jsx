import { 
  Star, Lock, Check
} from 'lucide-react';

const PathNode = ({ icon, status, stars, onClick, position, colorClass = "bg-green-500 border-green-700", mascot }) => {
  let translateClass = '';
  let mascotPositionClass = ''; 
  if (position === 'left') { translateClass = '-translate-x-16'; mascotPositionClass = 'left-full ml-6'; } 
  else if (position === 'right') { translateClass = 'translate-x-16'; mascotPositionClass = 'right-full mr-6'; } 
  else { translateClass = ''; mascotPositionClass = 'left-[130%]'; }

  const isLocked = status === 'locked';
  const isActive = status === 'active';
  const isCompleted = status === 'completed';

  return (
    <div className={`flex justify-center mb-10 relative ${translateClass} z-10`}>
        {mascot && (
            <div className={`absolute top-1/2 -translate-y-1/2 ${mascotPositionClass} z-20 pointer-events-none transition-transform hover:scale-105`}>
                {mascot}
            </div>
        )}
        <div className="relative group">
            {isActive && (
                <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-extrabold px-4 py-2 rounded-xl shadow-xl border-2 border-slate-100 dark:border-slate-700 animate-bounce z-30 whitespace-nowrap">
                    START
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 rotate-45 w-4 h-4 bg-white dark:bg-slate-800 border-r-2 border-b-2 border-slate-100 dark:border-slate-700"></div>
                </div>
            )}
            <button onClick={!isLocked ? onClick : undefined} className={`w-20 h-20 rounded-full flex items-center justify-center relative transition-all duration-200 ${isLocked ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 border-b-8 border-slate-300 dark:border-slate-700 cursor-not-allowed' : isActive ? `${colorClass} text-white border-b-8 shadow-2xl scale-110 ring-4 ring-white dark:ring-slate-900` : `${colorClass.replace('bg-', 'bg-opacity-80 bg-')} text-white border-b-8 hover:scale-105 active:border-b-0 active:translate-y-2`}`}>
                <div className="w-16 h-16 rounded-full border-4 border-white/20 flex items-center justify-center">
                    {isLocked ? <Lock size={28} /> : isCompleted ? <Check size={36} strokeWidth={4} /> : icon}
                </div>
                {!isLocked && stars > 0 && (
                    <div className="absolute -bottom-2 flex gap-1 bg-slate-800 px-2 py-1 rounded-full shadow-lg border border-slate-700">
                    {[...Array(3)].map((_, i) => (<Star key={i} size={10} className={i < stars ? 'fill-yellow-400 text-yellow-400' : 'text-slate-600'} />))}
                    </div>
                )}
            </button>
        </div>
    </div>
  );
};

export default PathNode;