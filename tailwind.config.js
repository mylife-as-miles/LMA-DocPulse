/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                background: "#050505",
                "pitch-black": "#050505",
                surface: "#141416",
                "surface-card": "#0A0F14",
                "surface-dark": "#0A0F14",
                "surface-highlight": "#1f1f22",
                "surface-hover": "#111820",
                border: "#27272a",
                "border-dim": "#1E293B",
                primary: "#00ff9d",
                "brand-green": "#00ff9d",
                "primary-dim": "rgba(0, 255, 157, 0.1)",
                "brand-green-dim": "rgba(0, 255, 157, 0.1)",
                "accent-red": "#ff4d4d",
                "accent-orange": "#ffa600",
                "text-main": "#ffffff",
                "text-muted": "#a1a1aa",
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                display: ['Space Grotesk', 'sans-serif'],
            },
            boxShadow: {
                'glow': '0 0 20px rgba(0, 255, 157, 0.15)',
                'glow-sm': '0 0 10px rgba(0, 255, 157, 0.1)',
            },
            keyframes: {
                shimmer: {
                    '0%': { transform: 'translateX(-100%)' },
                    '100%': { transform: 'translateX(100%)' },
                },
                scan: {
                    '0%': { top: '0%', opacity: '0' },
                    '10%': { top: '0%', opacity: '1' },
                    '90%': { top: '100%', opacity: '1' },
                    '100%': { top: '100%', opacity: '0' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideInRight: {
                    '0%': { opacity: '0', transform: 'translateX(-20px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                growWidth: {
                    '0%': { width: '0%' }
                },
                typing: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                }
            },
            animation: {
                shimmer: 'shimmer 1.5s infinite linear',
                scan: 'scan 3s ease-in-out infinite',
                'fade-in': 'fadeIn 0.5s ease-out forwards',
                'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
                'slide-in-right': 'slideInRight 0.5s ease-out forwards',
                'grow-width': 'growWidth 1s ease-out forwards',
                'typing-1': 'typing 0.1s forwards 0.5s',
                'typing-2': 'typing 0.1s forwards 1.0s',
                'typing-3': 'typing 0.1s forwards 1.5s',
            },
        }
    },
    plugins: [],
}
