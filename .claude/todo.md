# Claude — Working Context for AuthorForge (VS Code)

_Last updated: 2025-11-12_

## 🔧 Environment Summary
- **Project**: AuthorForge (desktop author suite)
- **Stack**: SolidStart + TailwindCSS + Tauri + TypeScript
- **Frontend state**: Solid signals (no Redux)
- **CSS tokens**: forge.* colors and custom shadows defined in tailwind.config.cjs
- **Theme system**: light/dark toggled by `[data-theme="forge-dark"]`
- **Route layout**: folder-based structure — every main page lives in `/src/routes/[page]/index.tsx`

