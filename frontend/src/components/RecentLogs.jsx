import React from 'react';
import { AlertTriangle, Shield, Activity, Info, CheckCircle2, Lock } from 'lucide-react';

const RecentLogs = ({ logs }) => {
    const getIcon = (log) => {
        if (log.status >= 500) return <AlertTriangle size={16} className="text-red-500" />;
        if (log.status >= 400) return <Lock size={16} className="text-orange-500" />;
        if (log.attack_type && log.attack_type !== 'Normal') return <Shield size={16} className="text-yellow-500" />;
        return <CheckCircle2 size={16} className="text-green-500" />;
    };

    const getStatusColor = (status) => {
        if (status >= 500) return 'text-red-400';
        if (status >= 400) return 'text-orange-400';
        if (status >= 300) return 'text-blue-400';
        return 'text-green-400';
    };

    return (
        <div className="glass-panel p-6 h-full flex flex-col relative overflow-hidden">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <span className="w-1.5 h-6 bg-purple-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                        Live Security Events
                    </h3>
                    <p className="text-xs text-gray-500 ml-3.5 mt-1">Real-time firewall decisions</p>
                </div>
                <div className="bg-purple-500/10 text-purple-400 px-2 py-1 rounded text-xs font-mono">
                    LIVE
                </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent -mr-2">
                {logs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-4">
                        <Activity size={48} className="opacity-20" />
                        <p>No recent activity logs...</p>
                    </div>
                ) : (
                    logs.map((log, index) => (
                        <div key={index} className="group flex items-start gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] hover:border-white/10 transition-all duration-200">
                            <div className="mt-1 bg-white/5 p-2 rounded-lg group-hover:bg-white/10 transition-colors">
                                {getIcon(log)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-1">
                                    <p className={`text-sm font-bold truncate ${log.attack_type && log.attack_type !== 'Normal' ? 'text-yellow-400' : 'text-gray-200'}`}>
                                        {log.attack_type && log.attack_type !== 'Normal' ? log.attack_type : log.endpoint}
                                    </p>
                                    <span className={`text-xs font-mono font-bold ${getStatusColor(log.status)}`}>
                                        {log.status}
                                    </span>
                                </div>

                                <p className="text-xs text-gray-400 mb-2 line-clamp-2">
                                    {log.reason || 'Request processed successfully'}
                                </p>

                                <div className="flex items-center gap-3">
                                    {log.ip && (
                                        <span className="px-2 py-0.5 rounded text-[10px] bg-black/30 border border-white/10 text-blue-300 font-mono tracking-wide">
                                            {log.ip}
                                        </span>
                                    )}
                                    <span className="text-[10px] text-gray-600">
                                        {new Date(log.timestamp).toLocaleTimeString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default RecentLogs;
