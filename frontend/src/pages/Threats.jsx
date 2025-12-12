import React from 'react';
import SecurityTools from '../components/SecurityTools';

const Threats = () => {
    return (
        <div className="space-y-8 h-full">
            <header>
                <h2 className="text-3xl font-bold text-white mb-2">Threat Management</h2>
                <p className="text-gray-400">Scan URLs and test WAF defenses actively.</p>
            </header>

            <div className="max-w-4xl h-[600px]">
                <SecurityTools />
            </div>
        </div>
    );
};

export default Threats;
