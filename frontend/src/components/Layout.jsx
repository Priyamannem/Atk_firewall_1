import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
    return (
        <div className="min-h-screen bg-[#050912] text-slate-200 font-sans selection:bg-blue-500/30 overflow-x-hidden">
            <Sidebar />

            <main className="pl-72 min-h-screen relative z-10">
                <div className="max-w-[1600px] mx-auto p-8 lg:p-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <Outlet />
                </div>
            </main>

            {/* Ambient Background Effects */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[128px]" />
                <div className="absolute bottom-0 left-72 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[128px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />
            </div>
        </div>
    );
};

export default Layout;
