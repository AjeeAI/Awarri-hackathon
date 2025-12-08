const StatBadge = ({ icon, value, label, color, bg }) => (
    <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${bg} ${color} border border-white dark:border-slate-700 shadow-sm animate-in fade-in zoom-in duration-300`}>
        {icon}
        <div>
            <p className="text-sm font-bold leading-none">
                {value}
            </p>
            <p className="text-[10px] opacity-75 uppercase font-bold">
                {label}
            </p>
        </div>
    </div>
);

export default StatBadge;