import { 
   CheckCircle
} from 'lucide-react';

const OptionCard = ({ selected, onClick, label, sub, icon, layout = 'col' }) => (
  <div onClick={onClick} className={`cursor-pointer rounded-2xl border-2 border-b-4 transition-all p-4 ${selected ? 'border-green-500 border-b-green-600 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300' : 'border-slate-200 border-b-slate-300 dark:border-slate-800 dark:border-b-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'} ${layout === 'row' ? 'flex items-center gap-3 text-left' : 'flex flex-col items-center justify-center text-center gap-2'} active:border-b-2 active:translate-y-0.5`}>
    {icon && <div className={selected ? 'text-green-600' : 'text-slate-400'}>{icon}</div>}
    <div className="flex-1"><div className="font-bold">{label}</div>{sub && <div className="text-xs opacity-70 font-medium">{sub}</div>}</div>
    {selected && layout === 'row' && <CheckCircle size={20} className="text-green-600" />}
  </div>
);

export default OptionCard;