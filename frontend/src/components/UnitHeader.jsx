import { 
  BookOpen
} from 'lucide-react';

const UnitHeader = ({ title, desc, color, mascot }) => (
    <div className={`w-full max-w-2xl mx-auto mb-16 relative mt-8`}>
        <div className={`p-6 rounded-3xl text-white shadow-xl flex justify-between items-center relative overflow-hidden ${color}`}>
            <div className="relative z-10 max-w-[60%]">
                <h3 className="font-extrabold text-2xl mb-2">{title}</h3>
                <p className="text-white/90 font-medium leading-relaxed">{desc}</p>
            </div>
            <button className="relative z-10 bg-white/20 px-4 py-3 rounded-2xl text-sm font-extrabold backdrop-blur-md border border-white/30 hover:bg-white/30 transition-colors uppercase tracking-wider flex items-center gap-2">
                <BookOpen size={18} /> Guidebook
            </button>
            <div className="absolute inset-0 bg-white opacity-5" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 2px, transparent 2px)', backgroundSize: '20px 20px' }}></div>
        </div>
    </div>
);

export default UnitHeader;