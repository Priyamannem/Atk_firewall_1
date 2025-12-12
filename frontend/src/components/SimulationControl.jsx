import React, { useState } from 'react';
import { simulateDDoS, simulateRansomware } from '../services/api';
import { Zap, Lock, RefreshCw } from 'lucide-react';

const SimulationControl = ({ onSimulationComplete }) => {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');

    const handleDDoS = async () => {
        setLoading(true);
        setStatus('Simulating DDoS Attack...');
        try {
            await simulateDDoS('192.168.1.100', 2000); // Trigger 2000 reqs
            setStatus('DDoS Simulation Complete. Check logs.');
            if (onSimulationComplete) onSimulationComplete();
        } catch (err) {
            setStatus('DDoS Simulation Failed.');
        } finally {
            setLoading(false);
            setTimeout(() => setStatus(''), 3000);
        }
    };

    const handleRansomware = async () => {
        setLoading(true);
        setStatus('Simulating Ransomware Activity...');
        try {
            await simulateRansomware(10);
            setStatus('Ransomware Simulation Complete.');
            if (onSimulationComplete) onSimulationComplete();
        } catch (err) {
            setStatus('Ransomware Simulation Failed.');
        } finally {
            setLoading(false);
            setTimeout(() => setStatus(''), 3000);
        }
    };

    return (
        <div className="glass-panel p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-200">Attack Simulations</h3>
            <div className="flex flex-col gap-4">
                <button
                    onClick={handleDDoS}
                    disabled={loading}
                    className="btn-danger flex items-center justify-center gap-2 py-3"
                >
                    {loading ? <RefreshCw className="animate-spin" size={20} /> : <Zap size={20} />}
                    Simulate DDoS Attack
                </button>

                <button
                    onClick={handleRansomware}
                    disabled={loading}
                    className="btn-primary flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                >
                    {loading ? <RefreshCw className="animate-spin" size={20} /> : <Lock size={20} />}
                    Simulate Ransomware
                </button>

                {status && (
                    <div className="mt-2 text-center text-sm font-medium text-secondary-color animate-pulse">
                        {status}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SimulationControl;
