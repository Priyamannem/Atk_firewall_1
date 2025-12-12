import React from 'react';
import SimulationControl from '../components/SimulationControl';
import { Terminal } from 'lucide-react';

const Simulation = () => {
    return (
        <div className="space-y-8">
            <header>
                <h2 className="text-3xl font-bold text-white mb-2">Attack Lab</h2>
                <p className="text-gray-400">Simulate cyber attacks to validity firewall resilience.</p>
            </header>

            <div className="max-w-2xl">
                <div className="glass-panel p-8 mb-8 relative overflow-hidden group">
                    {/* Decoration */}
                    <div className="absolute -right-20 -top-20 w-64 h-64 bg-red-500/10 rounded-full blur-3xl group-hover:bg-red-500/20 transition-all duration-700" />

                    <h3 className="text-xl font-semibold mb-6 flex items-center gap-3">
                        <Terminal className="text-red-400" />
                        Execute Simulation
                    </h3>

                    <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                        Use this centralized control panel to trigger controlled simulated attacks against your own infrastructure.
                        This allows you to verify that the <strong>Rate Limiting</strong>, <strong>Anomaly Detection</strong>, and <strong>Ransomware Heuristics</strong> are functioning correctly.
                        <br /><br />
                        <span className="text-yellow-500/80">⚠️ Warning: These actions generate real load on the backend service.</span>
                    </p>

                    <SimulationControl />
                </div>
            </div>
        </div>
    );
};

export default Simulation;
