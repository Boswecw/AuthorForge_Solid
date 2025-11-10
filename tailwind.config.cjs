// tailwind.config.cjs
module.exports = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx,svelte}'],
  theme: {
    extend: {
      colors: {
        fg: 'rgb(var(--fg) / <alpha-value>)',
        bg: 'rgb(var(--bg) / <alpha-value>)',
        subtle: 'rgb(var(--subtle) / <alpha-value>)',
        forge: {
          ink: 'rgb(var(--forge-ink) / <alpha-value>)',
          brass: 'rgb(var(--forge-brass) / <alpha-value>)',
          ember: 'rgb(var(--forge-ember) / <alpha-value>)',
          iron: 'rgb(var(--forge-iron) / <alpha-value>)',
        },
        accent: 'rgb(var(--accent) / <alpha-value>)',
      },
      boxShadow: {
        card: '0 1px 2px rgba(0,0,0,.06), 0 8px 24px rgba(0,0,0,.08)',
        elevate: '0 10px 30px rgba(0,0,0,.12)',
        // 👇 new — used for the “Smithy” active pill
        ember: '0 0 0 2px rgba(255,106,61,.25), 0 8px 24px rgba(255,106,61,.12)',
      },
      borderRadius: { xl2: '1.25rem' },
      fontFamily: {
        ui: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['"EB Garamond"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('./plugins/authorforge.tailwind'),
  ],
};
