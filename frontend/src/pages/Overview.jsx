import React, { useEffect, useState } from 'react';
import { Activity, Shield, Users, AlertOctagon, TrendingUp, TrendingDown } from 'lucide-react';
import { fetchStats, fetchRecentLogs, fetchBlockedIPs } from '../services/api';
import StatsCard from '../components/StatsCard';
import PacketTrafficChart from '../components/PacketTrafficChart';
import RecentLogs from '../components/RecentLogs';

const Overview = () => {
    const [stats, setStats] = useState({ total_requests: 0, blocked: 0, active_ips: 0 });
    const [logs, setLogs] = useState([]);
    const [blockedIPs, setBlockedIPs] = useState([]);
    const [trafficData, setTrafficData] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        try {
            const [statsData, logsData, blockedData] = await Promise.all([
                fetchStats(),
                fetchRecentLogs(20),
                fetchBlockedIPs()
            ]);

            if (statsData) setStats(statsData);
            if (logsData) setLogs(logsData);
            if (blockedData) setBlockedIPs(blockedData);

            // Mock traffic data generation
            const now = new Date();
            const mockTraffic = Array.from({ length: 15 }).map((_, i) => ({
                time: new Date(now.getTime() - (14 - i) * 5000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                reqs: Math.floor(Math.random() * 150) + (statsData?.total_requests % 50 || 20)
            }));
            setTrafficData(mockTraffic);

        } catch (error) {
            console.error("Failed to load dashboard data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
        const interval = setInterval(loadData, 3000); // Fast refresh for "Real-time" feel
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-4xl font-bold text-white mb-2 tracking-tight">Network Overview</h2>
                    <div className="flex items-center gap-2 text-gray-400">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <p className="text-sm font-medium">Real-time data stream active</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <div className="px-4 py-2 bg-white/5 rounded-lg border border-white/10 text-sm text-gray-300">
                        Server Time: <span className="text-blue-400 font-mono">{new Date().toLocaleTimeString()}</span>
                    </div>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total Requests"
                    value={stats.total_requests.toLocaleString()}
                    icon={<Activity size={24} />}
                    color="blue"
                    trend={12}
                    trendLabel="vs avg"
                />
                <StatsCard
                    title="Threats Blocked"
                    value={stats.blocked.toLocaleString()}
                    icon={<Shield size={24} />}
                    color="green"
                    trend={-2}
                    trendLabel="decreased"
                />
                <StatsCard
                    title="Active Sources"
                    value={stats.active_ips.toLocaleString()}
                    icon={<Users size={24} />}
                    color="purple"
                    trend={5}
                    trendLabel="new hosts"
                />
                <StatsCard
                    title="Blacklisted IPs"
                    value={blockedIPs.length}
                    icon={<AlertOctagon size={24} />}
                    color="red"
                    trend={1}
                    trendLabel="just added"
                />
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 h-[600px]">
                {/* Traffic Chart */}
                <div className="xl:col-span-2 h-full flex flex-col">
                    <PacketTrafficChart data={trafficData} />
                </div>

                {/* Logs Feed */}
                <div className="h-full flex flex-col">
                    <RecentLogs logs={logs} />
                </div>
            </div>
        </div>
    );
};

export default Overview;
