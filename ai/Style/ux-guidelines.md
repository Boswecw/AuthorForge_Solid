# AuthorForge — Style & UX Guidelines
_Last updated: 2025-11-12_

---

## 🎨 1. Design Philosophy
AuthorForge’s interface should feel **calm, tactile, and purposeful** — an app that invites deep creative focus without distraction.

Core principles:
1. **Clarity over decoration** — readability first.
2. **Contrast through material depth** — use shadow and subtle gradients instead of harsh borders.
3. **Forge identity** — every surface, border, and accent reflects the metal-and-ember theme.
4. **Motion as guidance** — use soft transitions and respect `prefers-reduced-motion`.

---

## 🌈 2. Color Tokens

Defined in `tailwind.config.cjs` and mapped to CSS variables (`--forge-*`).

| Token | Use | Light Mode | Dark Mode |
|-------|-----|-------------|------------|
| `forge.ash` | Neutral backgrounds | #f3f3f3 | #1f1f1f |
| `forge.brass` | Highlights, titles, icons | #cfa96c | #dcb97a |
| `forge.ember` | Interactive accents (buttons, focus, glow) | #ff6a3d | #ff784f |
| `forge.steel` | Dividers, outlines | #999 | #555 |
| `forge.parchment` | Panels, cards | #fffaf2 | #2a2420 |
| `forge.ink` | Main background | #0c0c0c | #0c0c0c |
| `forge.iron` | Text subtle / disabled | #444 | #aaa |
| `fg` | Foreground text | rgb(var(--fg)) | — |
| `bg` | Background base | rgb(var(--bg)) | — |

⚙️ CSS form:
```css
color: rgb(var(--forge-brass));
background-color: rgb(var(--forge-ink));
