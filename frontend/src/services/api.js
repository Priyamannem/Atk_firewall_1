import axios from 'axios';

const API_URL = 'http://localhost:8000';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const fetchStats = async () => {
    try {
        const response = await api.get('/admin/traffic/stats');
        return response.data;
    } catch (error) {
        console.error("Error fetching stats:", error);
        return null;
    }
};

export const fetchRecentLogs = async (limit = 50) => {
    try {
        const response = await api.get(`/admin/logs/recent?limit=${limit}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching logs:", error);
        return [];
    }
};

export const fetchBlockedIPs = async () => {
    try {
        const response = await api.get('/admin/blocked_ips');
        return response.data;
    } catch (error) {
        console.error("Error fetching blocked IPs:", error);
        return [];
    }
};

export const updateRules = async (rules) => {
    try {
        const response = await api.post('/admin/update_rules', rules);
        return response.data;
    } catch (error) {
        console.error("Error updating rules:", error);
        throw error;
    }
};

export const simulateDDoS = async (targetIp, count) => {
    try {
        // Correct endpoint based on simulate.py: /simulate/ddos?count=...&ip=...
        const response = await api.get(`/simulate/ddos?count=${count}&ip=${targetIp}`);
        return response.data;
    } catch (error) {
        console.error("Error simulating DDoS:", error);
        throw error;
    }
};

export const simulateRansomware = async (fileCount = 5) => {
    try {
        const response = await api.post('/simulate/ransomware', { file_count: fileCount });
        return response.data;
    } catch (error) {
        console.error("Error simulating Ransomware:", error);
        throw error;
    }
};

// --- New Endpoints ---

export const fetchRules = async () => {
    try {
        const response = await api.get('/admin/rules');
        return response.data;
    } catch (error) {
        console.error("Error fetching rules:", error);
        return null;
    }
};

export const fetchIpInfo = async (ip) => {
    try {
        const response = await api.get(`/admin/ip/${ip}`);
        return response.data;
    } catch (error) {
        // Suppress 404 explicitly if needed, or just log
        console.error("Error fetching IP info:", error);
        return null; // or propagate
    }
};

export const blockIp = async (ip, reason = "Manual Block") => {
    try {
        const response = await api.post('/admin/block_ip', { ip, reason });
        return response.data;
    } catch (error) {
        console.error("Error blocking IP:", error);
        throw error;
    }
};

export const unblockIp = async (ip) => {
    try {
        const response = await api.post('/admin/unblock_ip', { ip });
        return response.data;
    } catch (error) {
        console.error("Error unblocking IP:", error);
        throw error;
    }
};

export const scanUrl = async (url) => {
    try {
        const response = await api.post('/admin/scan_url', { url });
        return response.data;
    } catch (error) {
        console.error("Error scanning URL:", error);
        throw error;
    }
};

export const scanRansomwareFile = async (filePath, entropy) => {
    try {
        const response = await api.post('/admin/scan_ransomware', { file_path: filePath, entropy });
        return response.data;
    } catch (error) {
        console.error("Error scanning ransomware file:", error);
        throw error;
    }
};

export const checkPublicEndpoint = async () => {
    try {
        const response = await api.get('/public/');
        return response.data;
    } catch (error) {
        console.error("Error checking public endpoint:", error);
        return null;
    }
};

export const submitPublicData = async (data) => {
    try {
        // Data should be a string or object depending on what the backend expects. 
        // Backend reads raw body string. Axios sends JSON by default.
        // If backend wants raw string, we might need to adjust content-type or send string.
        // But backend: body = await request.body(); body_str = body.decode("utf-8")
        // So JSON stringified body is fine.
        const response = await api.post('/public/submit_data', data);
        return response.data;
    } catch (error) {
        console.error("Error submitting public data:", error);
        throw error;
    }
};

export default api;
