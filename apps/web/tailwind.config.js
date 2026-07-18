/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class", '[data-theme="dark"]'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './features/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        secondary: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      fontSize: {
        'micro': 'var(--ch-text-micro)',
        'caption': 'var(--ch-text-caption)',
        'body-sm': 'var(--ch-text-body-sm)',
        'body': 'var(--ch-text-body)',
        'body-lg': 'var(--ch-text-body-lg)',
        'subtitle': 'var(--ch-text-subtitle)',
        'title': 'var(--ch-text-title)',
        'h3': 'var(--ch-text-h3)',
        'h2': 'var(--ch-text-h2)',
        'h1': 'var(--ch-text-h1)',
        'display': 'var(--ch-text-display)',
        'hero': 'var(--ch-text-hero)',
        'display-xl': 'var(--ch-text-display-xl)',
      },
      colors: {
        slate: {
          50: 'var(--ch-slate-50)',
          100: 'var(--ch-slate-100)',
          200: 'var(--ch-slate-200)',
          300: 'var(--ch-slate-300)',
          400: 'var(--ch-slate-400)',
          500: 'var(--ch-slate-500)',
          600: 'var(--ch-slate-600)',
          700: 'var(--ch-slate-700)',
          800: 'var(--ch-slate-800)',
          900: 'var(--ch-slate-900)',
          950: 'var(--ch-slate-950)',
        },
        civic: {
          primary: 'var(--ch-primary-base)',
          secondary: 'var(--ch-secondary-base)',
          accent: 'var(--ch-accent-gold)',
          success: 'var(--ch-success-base)',
          warning: 'var(--ch-warning-base)',
          error: 'var(--ch-error-base)',
          info: 'var(--ch-info-base)',
        },
        border: "var(--ch-border-base)",
        input: "var(--ch-border-base)",
        ring: "var(--ch-focus-ring)",
        background: "var(--ch-bg-base)",
        foreground: "var(--ch-text-primary)",
        primary: {
          DEFAULT: "var(--ch-primary-base)",
          foreground: "var(--ch-slate-50)",
        },
        secondary: {
          DEFAULT: "var(--ch-secondary-base)",
          foreground: "var(--ch-slate-50)",
        },
        destructive: {
          DEFAULT: "var(--ch-error-base)",
          foreground: "var(--ch-slate-50)",
        },
        muted: {
          DEFAULT: "var(--ch-slate-100)",
          foreground: "var(--ch-slate-500)",
        },
        accent: {
          DEFAULT: "var(--ch-accent-gold)",
          foreground: "var(--ch-slate-950)",
        },
        popover: {
          DEFAULT: "var(--ch-bg-surface-elevated)",
          foreground: "var(--ch-text-primary)",
        },
        card: {
          DEFAULT: "var(--ch-bg-surface)",
          foreground: "var(--ch-text-primary)",
        },
      },
      borderRadius: {
        lg: "var(--ch-radius-lg)",
        md: "var(--ch-radius-md)",
        sm: "var(--ch-radius-sm)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
