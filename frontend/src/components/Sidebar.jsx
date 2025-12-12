import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Shield, AlertTriangle, Terminal, Activity, ChevronRight } from 'lucide-react';

const Sidebar = () => {
    const location = useLocation();

    const navItems = [
        { path: '/', label: 'Overview', icon: <LayoutDashboard size={20} /> },
        { path: '/prevention', label: 'Prevention', icon: <Shield size={20} /> },
        { path: '/threats', label: 'Threats', icon: <AlertTriangle size={20} /> },
        { path: '/simulation', label: 'Attack Lab', icon: <Terminal size={20} /> },
    ];

    return (
        <aside className="w-72 bg-[#0a0f1c]/95 backdrop-blur-xl border-r border-white/5 flex flex-col h-screen fixed left-0 top-0 z-50">
            {/* Header */}
            <div className="p-8 border-b border-white/5">
                <div className="flex items-center gap-3 mb-1">
                    <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-500/20">
                        <Activity size={24} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white tracking-tight">DefenseFW</h1>
                        <p className="text-xs text-blue-400 font-medium tracking-wider uppercase">Enterprise Security</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-8 space-y-2">
                <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">Module Access</p>
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={`relative flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group overflow-hidden ${isActive
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            {/* Active Indicator */}
                            {isActive && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white/20 rounded-r-full" />
                            )}

                            <span className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                                {item.icon}
                            </span>

                            <span className="font-medium flex-1">{item.label}</span>

                            {isActive && <ChevronRight size={16} className="text-white/50" />}
                        </NavLink>
                    );
                })}
            </nav>

            {/* Status Footer */}
            <div className="p-6 mt-auto border-t border-white/5 bg-[#0f1623]/50">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <span className="absolute -inset-1 bg-green-500 rounded-full opacity-20 blur-sm animate-pulse"></span>
                        <div className="w-2.5 h-2.5 bg-green-500 rounded-full relative z-10"></div>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-200">System Operational</p>
                        <p className="text-xs text-gray-500">v2.4.0 • Stable</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
