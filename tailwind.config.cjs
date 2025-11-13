// tailwind.config.cjs
module.exports = {
  darkMode: ['class', '[data-theme="forge-dark"]'],
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx,svelte}'],
  theme: {
    extend: {
      colors: {
        fg: 'rgb(var(--fg) / <alpha-value>)',
        bg: 'rgb(var(--bg) / <alpha-value>)',
        subtle: 'rgb(var(--subtle) / <alpha-value>)',
        forge: {
          ash: 'rgb(var(--forge-ash) / <alpha-value>)',
          brass: 'rgb(var(--forge-brass) / <alpha-value>)',
          ember: 'rgb(var(--forge-ember) / <alpha-value>)',
          steel: 'rgb(var(--forge-steel) / <alpha-value>)',
          parchment: 'rgb(var(--forge-parchment) / <alpha-value>)',
          ink: 'rgb(var(--forge-ink) / <alpha-value>)',
          iron: 'rgb(var(--forge-iron) / <alpha-value>)',
        },
        accent: 'rgb(var(--accent) / <alpha-value>)',
      },

      boxShadow: {
        card: '0 1px 2px rgba(0,0,0,.06), 0 8px 24px rgba(0,0,0,.08)',
        elevate: '0 10px 30px rgba(0,0,0,.12)',
        ember: '0 0 0 2px rgba(255,106,61,.25), 0 8px 24px rgba(255,106,61,.12)',
      },

      borderRadius: {
        sm: '0.375rem',
        md: '0.5rem',
        xl2: '1.25rem',
      },

      /* ───────────────────────────────────────────────
         FONT FAMILIES — FULL AUTHORFORGE TYPE SYSTEM
         ─────────────────────────────────────────────── */
      fontFamily: {
        // Legacy aliases (kept so older components don't break)
        ui: ['"InterCustom"', 'system-ui', 'sans-serif'],
        serif: ['"EBGaramond"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        typewriter: ['"Courier Prime"', '"Courier New"', 'monospace'],
        display: ['"CinzelDecorative"', 'serif'],

        // AuthorForge semantic type system
        afUi: ['"InterCustom"', 'system-ui', 'sans-serif'],          // UI chrome
        afBody: ['"EBGaramond"', 'Georgia', 'serif'],                // Smithy body text
        afBodyAlt: ['"CormorantGaramond"', 'serif'],                 // Lore pages, flavor text
        afHeading: ['"Cinzel"', 'serif'],                            // H1/H2/H3
        afDecor: ['"CinzelDecorative"', 'serif'],                    // Display titles
      },

      /* ───────────────────────────────────────────────
         FONT WEIGHTS — MAPPED TO THE FILES YOU INSTALLED
         ─────────────────────────────────────────────── */
      fontWeight: {
        normal: '400',     // Regular: Cinzel-400, EBGaramond-400, etc.
        medium: '500',     // Medium: Cinzel-500, Cormorant-500, EB-500
        semibold: '600',   // SemiBold: EBGaramond-600
        bold: '700',       // Cinzel-700, CinzelDecorative-700
        black: '900',      // Cinzel-Black, CinzelDecorative-Black
      },
    },
  },

  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('./plugins/authorforge.tailwind'),
  ],
};
