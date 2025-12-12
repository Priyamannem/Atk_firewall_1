import React from 'react';
import RulesManagement from '../components/RulesManagement';
import IPManager from '../components/IPManager';

const Prevention = () => {
    return (
        <div className="space-y-8">
            <header>
                <h2 className="text-3xl font-bold text-white mb-2">Prevention & Rules</h2>
                <p className="text-gray-400">Configure firewall barriers and manage blocked entities.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <RulesManagement />
                <IPManager />
            </div>
        </div>
    );
};

export default Prevention;
