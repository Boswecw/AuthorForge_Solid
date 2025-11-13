# AuthorForge — Development Task Log
_Last updated: 2025-11-12_

---

## 📍 Purpose
This file acts as a **rolling command board** for AuthorForge.  
Both **Claude** (VS Code) and **Augment** can read/update it to stay aligned with your active goals.  
All tasks use GitHub-style checkboxes for easy progress tracking.

---

## 🚧 Active Tasks
- [ ] Add **Bloom** route (`src/routes/bloom/index.tsx`) with ForgeShell wrapper and placeholder cards  
- [ ] Connect **Smithy** to TipTap editor toolbar (Bold, Italic, Underline, Heading, Link)  
- [ ] Build **Anvil** arc view (lane grid + draggable beats, minimal prototype)  
- [ ] Integrate **Lore** YAML editor save button (stub to backend command)  
- [ ] Add **global keyboard shortcuts** (F = Focus Mode, Ctrl +/ = Search, etc.)  
- [ ] Implement **right-panel persistence** in ForgeShell (`localStorage['forge-shell']`)  
- [ ] Review Tailwind tokens for parity with `authorforge.tailwind` plugin  
- [ ] Verify each route compiles under Tauri dev build  
- [ ] Add skeleton test file structure for future Vitest integration (`/tests/`)

---

## ✅ Completed
- [x] Established folder-based route structure  
- [x] Added ForgeShell layout with left/right rails  
- [x] Integrated Nav component with theme toggle  
- [x] Upgraded Foundry with Ingest + Overview tabs  
- [x] Implemented Lore mock parser and EntityView  
- [x] Installed TipTap + Tailwind editor base styles  
- [x] Standardized Tailwind tokens (`forge.*`)  
- [x] Created AI context files: `project-brief.md`, `claude.md`, `style/ux-guidelines.md`

---

## 🧠 Ideas / Future Enhancements
- Add autosave + revision history to Smithy  
- Implement world-graph visualization for Lore  
- Add Bloom “idea card” clustering (Framer Motion)  
- Integrate local LLM hooks for “Assist in Focus Mode”  
- Keyboard shortcut editor in Boundary page  
- Light analytics module (word-count trends, writing time)  

---

## 🔄 Workflow Notes
- Keep tasks **atomic** — one file or feature per entry.  
- Mark completed items with `[x]` and move them to “Completed.”  
- Add “blocked” items inline (e.g., `- [ ] ⏳ Waiting on backend endpoint`).  
- Claude reads this file before major refactors to understand priorities.  
- Augment can use it to label quick-fixes (`bugfix`, `ui`, `refactor`).

---

_This file lives at `/ai/tasks.todo.md` and serves as the live project pulse for AuthorForge._
