const PracticeCard = ({ icon, title, duration, color, onClick }) => (
    <div onClick={onClick} className={`p-4 rounded-2xl flex items-center gap-4 cursor-pointer hover:opacity-90 transition-all border-b-4 hover:scale-[1.02] active:scale-95 active:border-b-0 active:translate-y-1 ${color}`}>
        <div className="p-3 bg-white/40 rounded-xl backdrop-blur-sm shadow-sm">
            {icon}
        </div>
        <div className="flex-1">
            <span className="font-extrabold text-sm block tracking-tight">
                {title}
            </span>
            <span className="text-xs font-bold bg-white/40 dark:bg-black/20 px-2 py-1 rounded-lg inline-block mt-1">
                {duration}
            </span>
        </div>
    </div>
);

export default PracticeCard;