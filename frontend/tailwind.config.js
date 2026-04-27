/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', "system-ui", "-apple-system", "sans-serif"],
        display: ['"Outfit"', "system-ui", "sans-serif"],
      },
      colors: {
        dark: {
          900: "#06060a",
          800: "#0c0c14",
          700: "#12121e",
          600: "#1a1a2e",
          500: "#242440",
        },
        accent: {
          purple: "#8b5cf6",
          indigo: "#6366f1",
          blue: "#3b82f6",
          cyan: "#06b6d4",
        },
        bias: {
          low: "#10b981",
          "low-light": "#d1fae5",
          medium: "#f59e0b",
          "medium-light": "#fef3c7",
          high: "#ef4444",
          "high-light": "#fee2e2",
        },
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "fade-in-up": "fadeInUp 0.6s ease-out forwards",
        "slide-in-right": "slideInRight 0.5s ease-out forwards",
        "scale-in": "scaleIn 0.4s ease-out forwards",
        "spin-slow": "spin 3s linear infinite",
        "progress-fill": "progressFill 1.5s ease-out forwards",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        progressFill: {
          "0%": { strokeDashoffset: "440" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
