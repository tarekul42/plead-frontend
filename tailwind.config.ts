import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./providers/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          1: "#0F172A",
          2: "#2563EB",
          3: "#10B981",
        },
        neutral: {
          100: "#F1F5F9",
          200: "#E2E8F0",
          300: "#CBD5E1",
        },
        muted: "#64748B",
        danger: "#EF4444",
        warning: "#F59E0B",
        background: "var(--background)",
        foreground: "var(--text)",
        surface: "var(--surface)",
        border: "var(--border)",
        "text-muted": "var(--text-muted)",
      },
      borderRadius: {
        card: "12px",
        btn: "8px",
      },
      maxWidth: {
        container: "1400px",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      fontSize: {
        xs: "12px",
        sm: "14px",
        base: "16px",
        lg: "18px",
        xl: "20px",
        "2xl": "24px",
        "3xl": "32px",
        "4xl": "40px",
        "5xl": "56px",
        "6xl": "72px",
      },
      transitionDuration: {
        DEFAULT: "150ms",
        card: "200ms",
      },
    },
  },
  plugins: [],
};

export default config;
