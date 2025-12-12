import React, { useState } from 'react';
import { scanUrl, submitPublicData } from '../services/api';
import { Globe, Search, AlertTriangle, CheckCircle, ShieldAlert, Send } from 'lucide-react';

const SecurityTools = () => {
    // URL Scanner State
    const [url, setUrl] = useState('');
    const [scanResult, setScanResult] = useState(null);
    const [scanLoading, setScanLoading] = useState(false);

    // WAF Tester State
    const [wafPayload, setWafPayload] = useState('');
    const [wafResult, setWafResult] = useState(null);
    const [wafLoading, setWafLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('scanner'); // 'scanner' or 'waf'

    const handleScan = async (e) => {
        e.preventDefault();
        if (!url) return;
        setScanLoading(true);
        setScanResult(null);
        try {
            const result = await scanUrl(url);
            setScanResult(result);
        } catch (error) {
            console.error("Scan failed");
        } finally {
            setScanLoading(false);
        }
    };

    const handleWafTest = async (e) => {
        e.preventDefault();
        if (!wafPayload) return;
        setWafLoading(true);
        setWafResult(null);
        try {
            const response = await submitPublicData(wafPayload);
            setWafResult({ status: 'allowed', message: response.message });
        } catch (error) {
            // Assume 403 maps to blocked
            if (error.response && error.response.status === 403) {
                setWafResult({ status: 'blocked', message: error.response.data.detail || "Blocked by WAF" });
            } else {
                setWafResult({ status: 'error', message: "Request failed" });
            }
        } finally {
            setWafLoading(false);
        }
    };

    return (
        <div className="glass-panel p-0 h-full overflow-hidden flex flex-col">
            <div className="flex border-b border-gray-700">
                <button
                    onClick={() => setActiveTab('scanner')}
                    className={`flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === 'scanner' ? 'bg-white/10 text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-200'}`}
                >
                    <Globe size={16} /> URL Scanner
                </button>
                <button
                    onClick={() => setActiveTab('waf')}
                    className={`flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === 'waf' ? 'bg-white/10 text-orange-400 border-b-2 border-orange-400' : 'text-gray-400 hover:text-gray-200'}`}
                >
                    <ShieldAlert size={16} /> WAF Tester
                </button>
            </div>

            <div className="p-6 flex-1 overflow-y-auto">
                {activeTab === 'scanner' ? (
                    <>
                        <h3 className="text-lg font-semibold text-gray-200 mb-4">Check URL Reputation</h3>
                        <form onSubmit={handleScan} className="flex gap-2 mb-6">
                            <input
                                type="text"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="Enter URL (e.g. http://example.com)"
                                className="flex-1 bg-background-dark border border-gray-700 rounded px-3 py-2 text-gray-200 focus:border-blue-500 focus:outline-none"
                            />
                            <button
                                type="submit"
                                disabled={scanLoading}
                                className="btn-primary bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2"
                            >
                                {scanLoading ? '...' : <Search size={18} />}
                            </button>
                        </form>

                        {scanResult && (
                            <div className={`p-4 rounded-lg border ${scanResult.status === 'safe' ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                                <div className="flex items-center gap-3">
                                    {scanResult.status === 'safe' ? <CheckCircle className="text-green-500" /> : <AlertTriangle className="text-red-500" />}
                                    <span className={`font-bold uppercase ${scanResult.status === 'safe' ? 'text-green-400' : 'text-red-400'}`}>
                                        {scanResult.status}
                                    </span>
                                </div>
                                <p className="text-gray-400 mt-2 text-sm">{scanResult.url}</p>
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        <h3 className="text-lg font-semibold text-gray-200 mb-4">Test WAF Protection</h3>
                        <p className="text-sm text-gray-400 mb-4">Try submitting generic SQLi or XSS payloads to see if they get blocked.</p>
                        <form onSubmit={handleWafTest} className="flex flex-col gap-4 mb-6">
                            <textarea
                                value={wafPayload}
                                onChange={(e) => setWafPayload(e.target.value)}
                                placeholder="<script>alert('xss')</script> OR ' OR 1=1 --"
                                className="w-full h-24 bg-background-dark border border-gray-700 rounded px-3 py-2 text-gray-200 focus:border-orange-500 focus:outline-none font-mono text-sm"
                            />
                            <button
                                type="submit"
                                disabled={wafLoading}
                                className="btn-primary bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded flex items-center justify-center gap-2"
                            >
                                {wafLoading ? 'Testing...' : <><Send size={18} /> Send Payload</>}
                            </button>
                        </form>

                        {wafResult && (
                            <div className={`p-4 rounded-lg border ${wafResult.status === 'allowed' ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                                <div className="flex items-center gap-3">
                                    {wafResult.status === 'allowed' ? <CheckCircle className="text-green-500" /> : <ShieldAlert className="text-red-500" />}
                                    <span className={`font-bold uppercase ${wafResult.status === 'allowed' ? 'text-green-400' : 'text-red-400'}`}>
                                        {wafResult.status}
                                    </span>
                                </div>
                                <p className="text-gray-400 mt-2 text-sm">{wafResult.message}</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default SecurityTools;
