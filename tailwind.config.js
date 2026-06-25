/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bgPrimary: "var(--bg-primary)",
        bgSecondary: "var(--bg-secondary)",
        bgCard: "var(--bg-card)",
        bgCardHover: "var(--bg-card-hover)",
        accentBlue: "var(--accent-blue)",
        accentPurple: "var(--accent-purple)",
        accentGold: "var(--accent-gold)",
        accentTeal: "var(--accent-teal)",
        accentRed: "var(--accent-red)",
        textPrimary: "var(--text-primary)",
        textSecondary: "var(--text-secondary)",
        textMuted: "var(--text-muted)",
        success: "var(--success)",
      },
      fontFamily: {
        heading: ["Black Ops One", "Rajdhani", "sans-serif"],
        body: ["Rajdhani", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        blueGlow: "0 0 24px rgba(59,130,246,0.25)",
      },
    },
  },
  plugins: [],
};
