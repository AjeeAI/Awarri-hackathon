import UnitHeader from "./UnitHeader";
import PathNode from "./PathNode";
import { 
  MessageCircle, Star, Trophy,  Headphones,Utensils, ShoppingBag, BookA
} from 'lucide-react';
import MascotMama from "./MascotMama";
import MascotTola from "./MascotTola";

const LearnView = ({ onStartLesson }) => (

    <div className="flex-1 overflow-y-auto min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-10 transition-colors duration-300">
        {/* <style>
            {styles}
        </style> */}
        <div className="w-full max-w-4xl mx-auto pb-20">
            <UnitHeader title="Unit 1: Introduction" desc="Basic greetings and self introduction" color="bg-green-600" />
            <div className="flex flex-col items-center mb-24 relative">
                <div className="absolute top-10 bottom-10 w-1 bg-slate-200 dark:bg-slate-800 -z-10 rounded-full"></div>
                <PathNode icon={<Star size={32} strokeWidth={3} />} status="completed" stars={3} position="center" colorClass="bg-yellow-500 border-yellow-700" />
                <PathNode icon={<BookA size={28} strokeWidth={3} />} status="completed" stars={3} position="left" colorClass="bg-purple-500 border-purple-700" />
                <PathNode icon={<MessageCircle size={28} strokeWidth={3} />} status="active" stars={0} position="center" onClick={onStartLesson} colorClass="bg-green-500 border-green-700" mascot={<MascotTola />} />
                <PathNode icon={<Headphones size={28} strokeWidth={3} />} status="locked" stars={0} position="right" colorClass="bg-blue-500 border-blue-700" />
                <PathNode icon={<Trophy size={32} strokeWidth={3} />} status="locked" stars={0} position="center" colorClass="bg-orange-500 border-orange-700" />
            </div>
            <UnitHeader title="Unit 2: Market Life" desc="Bargaining and trade" color="bg-blue-600" />
            <div className="flex flex-col items-center mb-16 relative">
                <div className="absolute top-10 bottom-10 w-1 bg-slate-200 dark:bg-slate-800 -z-10 rounded-full"></div>
                <PathNode icon={<Utensils size={28} strokeWidth={3} />} status="locked" stars={0} position="center" colorClass="bg-red-500 border-red-700" mascot={<MascotMama />} />
                <PathNode icon={<ShoppingBag size={28} strokeWidth={3} />} status="locked" stars={0} position="left" colorClass="bg-teal-500 border-teal-700" />
                <PathNode icon={<Trophy size={32} strokeWidth={3} />} status="locked" stars={0} position="center" colorClass="bg-yellow-500 border-yellow-700" />
            </div>
        </div>
    </div>
);

export default LearnView;