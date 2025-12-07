const QuestItem = ({ icon, title, progress, total, unit = "" }) => (
    <div className="flex items-center gap-4 p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors">
        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            {icon}
        </div>
        <div className="flex-1">
            <div className="flex justify-between text-sm mb-2">
                <span className="font-bold text-slate-700 dark:text-slate-200">
                    {title}
                </span>
                <span className="text-slate-400 dark:text-slate-500 font-bold">
                    {progress}/{total}{unit}
                </span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
                <div className="bg-yellow-400 h-3 rounded-full transition-all duration-500 relative" style={{ width: `${(progress / total) * 100}%` }}></div>
            </div>
        </div>
    </div>
);

export default QuestItem;