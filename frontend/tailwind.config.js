/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: {
                    dark: '#0f172a',
                    card: '#1e293b',
                },
                text: {
                    primary: '#f8fafc',
                    secondary: '#94a3b8',
                },
                border: {
                    color: '#334155'
                },
                // We can map the functional colors we used in the CSS
                'primary-color': '#3b82f6',
                'secondary-color': '#10b981',
                'danger-color': '#ef4444',
                'warning-color': '#f59e0b',
            },
        },
    },
    plugins: [],
}
