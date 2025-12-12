import React from 'react';

const StatsCard = ({ title, value, icon, trend, trendLabel, color = "blue" }) => {
    const colorStyles = {
        blue: { text: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", glow: "group-hover:shadow-blue-500/20", progress: "bg-blue-500" },
        green: { text: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20", glow: "group-hover:shadow-green-500/20", progress: "bg-green-500" },
        red: { text: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", glow: "group-hover:shadow-red-500/20", progress: "bg-red-500" },
        purple: { text: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20", glow: "group-hover:shadow-purple-500/20", progress: "bg-purple-500" },
    };

    const style = colorStyles[color] || colorStyles.blue;

    return (
        <div className={`glass-panel p-6 flex flex-col justify-between group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${style.glow}`}>
            {/* Background Glow */}
            <div className={`absolute -right-6 -top-6 w-24 h-24 ${style.bg} rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

            <div className="flex justify-between items-start relative z-10">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${style.progress} animate-pulse`} />
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">{title}</p>
                    </div>
                    <h4 className="text-3xl font-bold text-white tracking-tight tabular-nums">{value}</h4>
                </div>
                <div className={`p-3.5 rounded-xl ${style.bg} ${style.text} border ${style.border} shadow-lg backdrop-blur-md`}>
                    {icon}
                </div>
            </div>

            {trend !== undefined && (
                <div className="mt-4 flex items-center gap-2 relative z-10">
                    <div className={`px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1 ${trend >= 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                        }`}>
                        {trend > 0 ? "+" : ""}{trend}%
                    </div>
                    <span className="text-xs text-gray-500 font-medium">{trendLabel || 'change'}</span>
                </div>
            )}

            {/* Bottom Progress Line Decoration */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-white/5">
                <div className={`h-full ${style.progress} opacity-50`} style={{ width: '40%' }} />
            </div>
        </div>
    );
};

export default StatsCard;
