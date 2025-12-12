import React, { useState, useEffect } from 'react';
import { fetchRules, updateRules } from '../services/api';
import { Settings, Save, RefreshCw } from 'lucide-react';

const RulesManagement = () => {
    const [rules, setRules] = useState({
        max_req_per_sec: 10,
        max_req_per_min: 600,
        anomaly_threshold: 0.8,
        ransomware_entropy_threshold: 7.5,
        url_reputation_threshold: 50
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        loadRules();
    }, []);

    const loadRules = async () => {
        setLoading(true);
        const data = await fetchRules();
        if (data) {
            setRules(data);
        }
        setLoading(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRules(prev => ({
            ...prev,
            [name]: parseFloat(value)
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage(null);
        try {
            await updateRules(rules);
            setMessage({ type: 'success', text: 'Rules updated successfully!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update rules.' });
        } finally {
            setSaving(false);
            setTimeout(() => setMessage(null), 3000);
        }
    };

    if (loading) return <div className="text-gray-400 p-4">Loading rules...</div>;

    return (
        <div className="glass-panel p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-200 flex items-center gap-2">
                    <Settings className="text-blue-400" size={24} />
                    Firewall Rules Configuration
                </h3>
                <button
                    onClick={loadRules}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    title="Refresh Rules"
                >
                    <RefreshCw size={18} className="text-gray-400" />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <h4 className="text-sm font-medium text-blue-300 uppercase tracking-wider">Rate Limiting</h4>

                    <div className="form-group">
                        <label className="block text-sm text-gray-400 mb-1">Max Requests per Second</label>
                        <input
                            type="number"
                            name="max_req_per_sec"
                            value={rules.max_req_per_sec}
                            onChange={handleChange}
                            className="w-full bg-background-dark border border-gray-700 rounded px-3 py-2 text-gray-200 focus:border-blue-500 focus:outline-none"
                        />
                    </div>

                    <div className="form-group">
                        <label className="block text-sm text-gray-400 mb-1">Max Requests per Minute</label>
                        <input
                            type="number"
                            name="max_req_per_min"
                            value={rules.max_req_per_min}
                            onChange={handleChange}
                            className="w-full bg-background-dark border border-gray-700 rounded px-3 py-2 text-gray-200 focus:border-blue-500 focus:outline-none"
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <h4 className="text-sm font-medium text-pink-300 uppercase tracking-wider">Thresholds</h4>

                    <div className="form-group">
                        <label className="block text-sm text-gray-400 mb-1">Anomaly Score Threshold (0.0 - 1.0)</label>
                        <input
                            type="number"
                            step="0.1"
                            name="anomaly_threshold"
                            value={rules.anomaly_threshold}
                            onChange={handleChange}
                            className="w-full bg-background-dark border border-gray-700 rounded px-3 py-2 text-gray-200 focus:border-blue-500 focus:outline-none"
                        />
                    </div>

                    <div className="form-group">
                        <label className="block text-sm text-gray-400 mb-1">Ransomware Entropy Threshold</label>
                        <input
                            type="number"
                            step="0.1"
                            name="ransomware_entropy_threshold"
                            value={rules.ransomware_entropy_threshold}
                            onChange={handleChange}
                            className="w-full bg-background-dark border border-gray-700 rounded px-3 py-2 text-gray-200 focus:border-blue-500 focus:outline-none"
                        />
                    </div>

                    <div className="form-group">
                        <label className="block text-sm text-gray-400 mb-1">URL Reputation Risk Threshold</label>
                        <input
                            type="number"
                            name="url_reputation_threshold"
                            value={rules.url_reputation_threshold}
                            onChange={handleChange}
                            className="w-full bg-background-dark border border-gray-700 rounded px-3 py-2 text-gray-200 focus:border-blue-500 focus:outline-none"
                        />
                    </div>
                </div>
            </div>

            <div className="mt-8 flex items-center justify-between">
                <div>
                    {message && (
                        <span className={`text-sm font-medium ${message.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                            {message.text}
                        </span>
                    )}
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="btn-primary flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors disabled:opacity-50"
                >
                    {saving ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
                    Save Configuration
                </button>
            </div>
        </div>
    );
};

export default RulesManagement;
