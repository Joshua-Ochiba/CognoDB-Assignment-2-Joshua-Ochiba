/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#0a0d1a',
                sidebar: '#0f1630',
                card: '#131b38',
                'card-border': '#1e294f',
                accent: '#6366f1',
                'accent-hover': '#4f46e5',
            }
        },
    },
    plugins: [],
};
