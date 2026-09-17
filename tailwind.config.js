/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./client/index.html",
    "./client/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sidebar: "#0f172a",
        "sidebar-foreground": "#f1f5f9",
        "sidebar-border": "#1e293b",
        "sidebar-accent": "#1e293b",
        "sidebar-accent-foreground": "#94a3b8",
        "chart-1": "#3b82f6",
        "chart-2": "#ef4444",
        "chart-3": "#10b981",
        "chart-4": "#f59e0b",
        primary: "#1f2937",
      },
    },
  },
  plugins: [],
}
