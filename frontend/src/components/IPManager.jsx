import React, { useState, useEffect } from 'react';
import { fetchBlockedIPs, blockIp, unblockIp } from '../services/api';
import { ShieldAlert, Trash2, PlusCircle, Ban } from 'lucide-react';

const IPManager = () => {
    const [blockedIPs, setBlockedIPs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newIp, setNewIp] = useState('');
    const [reason, setReason] = useState('Manual Block');

    useEffect(() => {
        loadBlockedIPs();
    }, []);

    const loadBlockedIPs = async () => {
        setLoading(true);
        const data = await fetchBlockedIPs();
        if (data) setBlockedIPs(data);
        setLoading(false);
    };

    const handleBlock = async (e) => {
        e.preventDefault();
        if (!newIp) return;
        try {
            await blockIp(newIp, reason);
            setNewIp('');
            loadBlockedIPs();
        } catch (error) {
            console.error("Failed to block IP");
        }
    };

    const handleUnblock = async (ip) => {
        if (!window.confirm(`Are you sure you want to unblock ${ip}?`)) return;
        try {
            await unblockIp(ip);
            loadBlockedIPs();
        } catch (error) {
            console.error("Failed to unblock IP");
        }
    };

    return (
        <div className="glass-panel p-6">
            <h3 className="text-xl font-semibold text-gray-200 mb-6 flex items-center gap-2">
                <Ban className="text-red-500" size={24} />
                Blocked IP Management
            </h3>

            {/* Block New IP Form */}
            <form onSubmit={handleBlock} className="mb-8 bg-black/20 p-4 rounded-lg flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 w-full">
                    <label className="block text-sm text-gray-400 mb-1">IP Address to Block</label>
                    <input
                        type="text"
                        value={newIp}
                        onChange={(e) => setNewIp(e.target.value)}
                        placeholder="e.g., 192.168.1.50"
                        className="w-full bg-background-dark border border-gray-700 rounded px-3 py-2 text-gray-200 focus:border-red-500 focus:outline-none"
                    />
                </div>
                <div className="flex-1 w-full">
                    <label className="block text-sm text-gray-400 mb-1">Reason</label>
                    <input
                        type="text"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="w-full bg-background-dark border border-gray-700 rounded px-3 py-2 text-gray-200 focus:border-red-500 focus:outline-none"
                    />
                </div>
                <button type="submit" className="w-full md:w-auto btn-danger px-6 py-2 flex items-center justify-center gap-2">
                    <PlusCircle size={18} />
                    Block IP
                </button>
            </form>

            {/* List */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-gray-400 border-b border-gray-700">
                            <th className="py-3 px-2">IP Address</th>
                            <th className="py-3 px-2">Reason</th>
                            <th className="py-3 px-2">Blocked At</th>
                            <th className="py-3 px-2 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-300">
                        {loading && <tr><td colSpan="4" className="py-4 text-center">Loading...</td></tr>}
                        {!loading && blockedIPs.length === 0 && (
                            <tr><td colSpan="4" className="py-4 text-center text-gray-500">No IPs currently blocked.</td></tr>
                        )}
                        {blockedIPs.map((item) => (
                            <tr key={item.ip} className="border-b border-gray-700/50 hover:bg-white/5 transition-colors">
                                <td className="py-3 px-2 font-mono text-red-300">{item.ip}</td>
                                <td className="py-3 px-2">{item.reason || 'N/A'}</td>
                                <td className="py-3 px-2 text-sm text-gray-500">{new Date(item.blocked_at).toLocaleString()}</td>
                                <td className="py-3 px-2 text-right">
                                    <button
                                        onClick={() => handleUnblock(item.ip)}
                                        className="text-gray-400 hover:text-green-400 transition-colors p-1"
                                        title="Unblock"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default IPManager;
