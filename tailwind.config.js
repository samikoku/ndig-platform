/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./client/index.html",
    "./client/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // NDIG brand palette: deep Nigerian green, gold accent, cream ground
        background: "#f7f5ef",
        foreground: "#03381d",
        card: "#ffffff",
        "card-foreground": "#03381d",
        border: "#ddd6c3",
        muted: "#ece7da",
        "muted-foreground": "#5b6b5e",
        destructive: "#b91c1c",

        primary: "#0b6b3a",
        "primary-foreground": "#f7f5ef",
        secondary: "#e8e4d5",
        "secondary-foreground": "#03381d",

        // Masthead / footer / dark sections
        sidebar: "#03381d",
        "sidebar-foreground": "#f7f5ef",
        "sidebar-border": "#0b6b3a",
        "sidebar-accent": "#054d28",
        "sidebar-accent-foreground": "#f7f5ef",

        // Gold accent - reserved for highlights placed on dark green surfaces
        // (chart-1/text-white has poor contrast on the cream background, so
        // it is used deliberately in Home.tsx/Layout.tsx dark sections only)
        gold: "#c9a227",

        // Accent scale used for badges, icons, step markers on light surfaces
        "chart-1": "#0b6b3a",
        "chart-2": "#054d28",
        "chart-3": "#03381d",
        "chart-4": "#03381d",
        "chart-5": "#158a4c",
      },
    },
  },
  plugins: [],
}
