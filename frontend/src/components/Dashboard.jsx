import { useState } from "react"; // 1. Don't forget to import useState!
import { 
  Mic, Heart, Flame, Star, Zap, ChevronRight, Globe, CheckSquare, Music, Target, BookA, Headphones
} from 'lucide-react';
import StatBadge from './StatBadge';
import QuestItem from './QuestItem';
import PracticeCard from './PracticeCard';

// 2. Changed "(" to "{" to start a function block
const DashboardView = ({ onStart, userLang }) => { 
      
      const [user, setUser] = useState(() => {
        const stored = localStorage.getItem('user');
        try {
          return stored ? JSON.parse(stored) : { name: 'Guest', email: 'guest@example.com' };
        } catch (e) {
          return { name: 'Guest', email: 'guest@example.com' };
        }
      });

    // 3. Added the "return" statement here
    return (
    <div className="flex-1 overflow-y-auto min-h-screen p-4 md:p-8 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <div className="w-full">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white mb-2">
                        E kaaro, {user.name}! 👋
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400">
                        Ready to continue your {userLang || 'Yoruba'} journey?
                    </p>
                </div>
                <div className="hidden md:flex space-x-4">
                    <StatBadge icon={<Flame size={20} />} value="0" label="Streak" color="text-orange-500" bg="bg-orange-50 dark:bg-orange-900/20" />
                    <StatBadge icon={<Zap size={20} />} value="0" label="Total XP" color="text-yellow-600" bg="bg-yellow-50 dark:bg-yellow-900/20" />
                    <StatBadge icon={<Heart size={20} />} value="5" label="Lives" color="text-red-500" bg="bg-red-50 dark:bg-red-900/20" />
                </div>
            </div>
            <div className="bg-slate-900 dark:bg-slate-800 rounded-3xl p-8 text-white shadow-xl mb-10 relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div>
                        <div className="inline-block px-3 py-1 bg-green-900/50 border border-green-700/50 rounded-lg text-green-400 text-xs font-bold mb-4 uppercase tracking-wider">
                            Active Module
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold mb-2">
                            Unit 1: Introduction
                        </h2>
                        <p className="text-slate-400 max-w-lg">
                            Start your journey with basic greetings and introductions.
                        </p>
                    </div>
                    <button onClick={onStart} className="bg-green-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-green-500 transition-colors shadow-lg flex items-center whitespace-nowrap">
                        Start Learning <ChevronRight size={20} className="ml-2" />
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-lg flex items-center text-slate-800 dark:text-white">
                            <Star className="mr-2 text-yellow-500" size={20} /> Daily Quests
                        </h3>
                    </div>
                    <div className="space-y-4">
                        <QuestItem icon={<Mic size={20} className="text-blue-500" />} title="Speak 5 phrases" progress={0} total={5} />
                        <QuestItem icon={<CheckSquare size={20} className="text-green-500" />} title="Complete 1 Lesson" progress={0} total={1} />
                        <QuestItem icon={<Target size={20} className="text-red-500" />} title="Score 90%" progress={0} total={90} unit="%" />
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm xl:col-span-2">
                    <h3 className="font-bold text-lg mb-4 flex items-center text-slate-800 dark:text-white">
                        <Zap className="mr-2 text-purple-500" size={20} /> Smart Practice
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <PracticeCard icon={<Music className="text-purple-600" size={24} />} title="Tone Marks" duration="3 min" color="bg-purple-50 dark:bg-purple-900/10 border-purple-200" />
                        <PracticeCard icon={<BookA className="text-blue-600" size={24} />} title="Vocabulary: Basics" duration="5 min" color="bg-blue-50 dark:bg-blue-900/10 border-blue-200" />
                        <PracticeCard icon={<Globe className="text-orange-600" size={24} />} title="Culture: Greetings" duration="4 min" color="bg-orange-50 dark:bg-orange-900/10 border-orange-200" />
                        <PracticeCard icon={<Headphones className="text-pink-600" size={24} />} title="Listening Practice" duration="6 min" color="bg-pink-50 dark:bg-pink-900/10 border-pink-200" />
                    </div>
                </div>
            </div>
        </div>
  </div>
  );
}; // 4. Closed the function block here

export default DashboardView;