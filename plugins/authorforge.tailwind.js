// plugins/authorforge.tailwind.js
const plugin = require('tailwindcss/plugin');

/** Flatten nested theme colors into dot-notation keys (e.g., "forge.ember") */
function flattenColors(obj, prefix = '', out = {}) {
  for (const [k, v] of Object.entries(obj || {})) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (typeof v === 'string') out[key] = v;
    else flattenColors(v, key, out);
  }
  return out;
}

/** Replace "<alpha-value>" or append "/ alpha" to rgb(...) */
function withAlpha(color, alpha = 0.55) {
  if (typeof color !== 'string') return color;
  if (color.includes('<alpha-value>')) return color.replace('<alpha-value>', String(alpha));
  if (/^rgb\(/i.test(color) && !color.includes('/')) return color.replace(/\)$/, ` / ${alpha})`);
  return color;
}

module.exports = plugin(function ({ addUtilities, addComponents, addVariant, matchUtilities, theme }) {
  // ===== Base utilities =====
  addUtilities(
    {
      '.ring-accent': { boxShadow: '0 0 0 var(--ring, 2px) rgb(var(--accent))' },
      '.glow-forge': { boxShadow: '0 8px 26px rgb(var(--forge-ember) / .55)' },
      '.shadow-forge': { boxShadow: theme('boxShadow.elevate') },
      '.accent-border': { borderColor: 'rgb(var(--accent) / .45)' },

      '.surface': {
        backgroundColor: 'rgb(var(--bg) / .95)',
        color: 'rgb(var(--fg))',
        border: '1px solid rgb(var(--fg) / .08)',
        borderRadius: 'var(--radius)',
      },
      '.surface-panel': {
        backgroundColor: 'rgb(var(--bg) / .80)',
        backdropFilter: 'blur(8px)',
        color: 'rgb(var(--fg))',
        border: '1px solid rgb(var(--fg) / .10)',
        borderRadius: 'var(--radius)',
      },

      '.kbd': {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: Array.isArray(theme('fontFamily.mono'))
          ? theme('fontFamily.mono').join(',')
          : theme('fontFamily.mono') || 'monospace',
        fontSize: Array.isArray(theme('fontSize.xs'))
          ? theme('fontSize.xs')[0]
          : theme('fontSize.xs') || '0.75rem',
        padding: '2px 6px',
        borderRadius: '6px',
        border: '1px solid rgb(var(--fg) / .20)',
        backgroundColor: 'rgb(var(--bg) / .70)',
        color: 'rgb(var(--subtle))',
      },
    },
    ['responsive', 'hover', 'focus', 'active']
  );

  // ===== Components =====
  addComponents({
    '.btn': {
      display: 'inline-flex',
      alignItems: 'center',
      gap: theme('spacing.2'),
      height: theme('spacing.10'),
      paddingInline: '14px',
      borderRadius: 'var(--radius)',
      border: '1px solid transparent',
      backgroundColor: 'rgb(var(--accent))',
      color: 'rgb(var(--bg))',
      fontWeight: 600,
      transition: 'background-color .15s ease, box-shadow .15s ease',
    },
    '.btn:hover': { backgroundColor: 'rgb(var(--accent) / .90)' },
    '.btn:active': { backgroundColor: 'rgb(var(--accent) / .80)' },

    '.btn-ghost': {
      display: 'inline-flex',
      alignItems: 'center',
      gap: theme('spacing.2'),
      height: theme('spacing.10'),
      paddingInline: '14px',
      borderRadius: 'var(--radius)',
      border: '1px solid rgb(var(--fg) / .12)',
      backgroundColor: 'transparent',
      color: 'rgb(var(--fg))',
      transition: 'background-color .15s ease, border-color .15s ease',
    },
    '.btn-ghost:hover': {
      backgroundColor: 'rgb(var(--fg) / .05)',
      borderColor: 'rgb(var(--fg) / .20)',
    },

    '.card': {
      backgroundColor: 'rgb(var(--bg) / .95)',
      color: 'rgb(var(--fg))',
      border: '1px solid rgb(var(--fg) / .08)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: theme('boxShadow.card'),
      padding: theme('spacing.5'),
    },

    '.badge': {
      display: 'inline-flex',
      alignItems: 'center',
      gap: theme('spacing.1'),
      height: '28px',
      paddingInline: theme('spacing.2'),
      borderRadius: '9999px',
      border: '1px solid rgb(var(--fg) / .10)',
      backgroundColor: 'rgb(var(--fg) / .04)',
      fontSize: Array.isArray(theme('fontSize.sm'))
        ? theme('fontSize.sm')[0]
        : theme('fontSize.sm') || '0.875rem',
    },

    '.input': {
      height: theme('spacing.10'),
      width: '100%',
      borderRadius: 'var(--radius)',
      border: '1px solid rgb(var(--fg) / .15)',
      backgroundColor: 'rgb(var(--bg) / .90)',
      color: 'rgb(var(--fg))',
      paddingInline: theme('spacing.3'),
    },
    '.input::placeholder': { color: 'rgb(var(--subtle) / .70)' },
    '.input:focus': {
      outline: 'none',
      boxShadow: '0 0 0 2px rgb(var(--accent) / .40)',
      borderColor: 'rgb(var(--accent) / .40)',
    },

    '.toolbar': {
      position: 'sticky',
      top: 0,
      zIndex: 40,
      backgroundColor: 'rgb(var(--bg) / .85)',
      backdropFilter: 'blur(8px)',
      borderBottom: '1px solid rgb(var(--fg) / .10)',
    },
  });

  // ===== Variant =====
  addVariant('hocus', ['&:hover', '&:focus-visible']);

  // ===== matchUtilities =====
  const flatColors = flattenColors(theme('colors'));

  // 1) glow-[...]  (tokens & arbitrary values)
  matchUtilities(
    {
      glow: (modifier) => {
        const value = flatColors[modifier] ?? modifier; // token or raw css value
        return { boxShadow: `0 8px 26px ${withAlpha(value, 0.55)}` };
      },
    },
    {
      values: flatColors,           // enables glow-forge-ember, glow-blue-500, etc.
      type: ['color', 'any'],       // enables glow-[forge.ember], glow-[rgb(...)] etc.
    }
  );

  // 2) accent-[forge.ember|forge.brass|forge.ink|forge.iron]
  const accentMap = {
    'forge.ember': 'var(--forge-ember)',
    'forge.brass': 'var(--forge-brass)',
    'forge.ink': 'var(--forge-ink)',
    'forge.iron': 'var(--forge-iron)',
  };
  matchUtilities(
    {
      accent: (cssVar) => ({ '--accent': cssVar }),
    },
    { values: accentMap, type: ['any'] }
  );

  // 3) r-[size] → sets --radius (global rounding)
  matchUtilities(
    { r: (value) => ({ '--radius': value }) },
    { values: theme('borderRadius'), type: ['length', 'any'] }
  );

  // 4) rlg-[size] → sets --radius-lg (cards, large surfaces)
  matchUtilities(
    { rlg: (value) => ({ '--radius-lg': value }) },
    { values: theme('borderRadius'), type: ['length', 'any'] }
  );

  // 5) radius-[size] → local-only border radius override
  matchUtilities(
    { radius: (value) => ({ borderRadius: value }) },
    { values: theme('borderRadius'), type: ['length', 'any'] }
  );

  // 6) surface-[0|1|2|3] → standardized panels
  matchUtilities(
    {
      surface: (level) => {
        const base = {
          color: 'rgb(var(--fg))',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid rgb(var(--fg) / .10)',
          backdropFilter: 'blur(8px)',
        };
        const map = {
          0: { backgroundColor: 'rgb(var(--bg) / .96)', boxShadow: 'none' },
          1: { backgroundColor: 'rgb(var(--bg) / .92)', boxShadow: '0 1px 2px rgba(0,0,0,.06), 0 8px 18px rgba(0,0,0,.08)' },
          2: { backgroundColor: 'rgb(var(--bg) / .88)', boxShadow: '0 2px 6px rgba(0,0,0,.08), 0 14px 30px rgba(0,0,0,.10)' },
          3: { backgroundColor: 'rgb(var(--bg) / .84)', boxShadow: '0 6px 16px rgba(0,0,0,.10), 0 22px 50px rgba(0,0,0,.14)' },
        };
        return { ...base, ...(map[level] || map[1]) };
      },
    },
    { values: { 0: '0', 1: '1', 2: '2', 3: '3' } }
  );

  // 7) surface-top-[0|1|2|3]
  matchUtilities(
    {
      'surface-top': (level) => {
        const base = {
          color: 'rgb(var(--fg))',
          backgroundColor: 'rgb(var(--bg) / .92)',
          borderBottom: '1px solid rgb(var(--fg) / .10)',
          backdropFilter: 'blur(8px)',
        };
        const map = {
          0: { backgroundColor: 'rgb(var(--bg) / .96)', boxShadow: 'none' },
          1: { backgroundColor: 'rgb(var(--bg) / .92)', boxShadow: '0 4px 12px rgba(0,0,0,.10)' },
          2: { backgroundColor: 'rgb(var(--bg) / .88)', boxShadow: '0 8px 24px rgba(0,0,0,.12)' },
          3: { backgroundColor: 'rgb(var(--bg) / .84)', boxShadow: '0 14px 40px rgba(0,0,0,.16)' },
        };
        return { ...base, ...(map[level] || map[1]) };
      },
    },
    { values: { 0: '0', 1: '1', 2: '2', 3: '3' } }
  );

  // 8) surface-bottom-[0|1|2|3]
  matchUtilities(
    {
      'surface-bottom': (level) => {
        const base = {
          color: 'rgb(var(--fg))',
          backgroundColor: 'rgb(var(--bg) / .92)',
          borderTop: '1px solid rgb(var(--fg) / .10)',
          backdropFilter: 'blur(8px)',
        };
        const map = {
          0: { backgroundColor: 'rgb(var(--bg) / .96)', boxShadow: 'none' },
          1: { backgroundColor: 'rgb(var(--bg) / .92)', boxShadow: '0 -4px 12px rgba(0,0,0,.10)' },
          2: { backgroundColor: 'rgb(var(--bg) / .88)', boxShadow: '0 -8px 24px rgba(0,0,0,.12)' },
          3: { backgroundColor: 'rgb(var(--bg) / .84)', boxShadow: '0 -14px 40px rgba(0,0,0,.16)' },
        };
        return { ...base, ...(map[level] || map[1]) };
      },
    },
    { values: { 0: '0', 1: '1', 2: '2', 3: '3' } }
  );

  // 9) surface-left-[0|1|2|3]
  matchUtilities(
    {
      'surface-left': (level) => {
        const base = {
          color: 'rgb(var(--fg))',
          backgroundColor: 'rgb(var(--bg) / .92)',
          borderRight: '1px solid rgb(var(--fg) / .10)',
          backdropFilter: 'blur(8px)',
        };
        const map = {
          0: { backgroundColor: 'rgb(var(--bg) / .96)', boxShadow: 'none' },
          1: { backgroundColor: 'rgb(var(--bg) / .92)', boxShadow: '6px 0 12px rgba(0,0,0,.10)' },
          2: { backgroundColor: 'rgb(var(--bg) / .88)', boxShadow: '12px 0 24px rgba(0,0,0,.12)' },
          3: { backgroundColor: 'rgb(var(--bg) / .84)', boxShadow: '22px 0 50px rgba(0,0,0,.16)' },
        };
        return { ...base, ...(map[level] || map[1]) };
      },
    },
    { values: { 0: '0', 1: '1', 2: '2', 3: '3' } }
  );

  // 10) surface-right-[0|1|2|3]
  matchUtilities(
    {
      'surface-right': (level) => {
        const base = {
          color: 'rgb(var(--fg))',
          backgroundColor: 'rgb(var(--bg) / .92)',
          borderLeft: '1px solid rgb(var(--fg) / .10)',
          backdropFilter: 'blur(8px)',
        };
        const map = {
          0: { backgroundColor: 'rgb(var(--bg) / .96)', boxShadow: 'none' },
          1: { backgroundColor: 'rgb(var(--bg) / .92)', boxShadow: '-6px 0 12px rgba(0,0,0,.10)' },
          2: { backgroundColor: 'rgb(var(--bg) / .88)', boxShadow: '-12px 0 24px rgba(0,0,0,.12)' },
          3: { backgroundColor: 'rgb(var(--bg) / .84)', boxShadow: '-22px 0 50px rgba(0,0,0,.16)' },
        };
        return { ...base, ...(map[level] || map[1]) };
      },
    },
    { values: { 0: '0', 1: '1', 2: '2', 3: '3' } }
  );
});
