# AuthorForge – App Structure Summary and Open TODOs

This document summarizes the overall structure of the AuthorForge app, the major workspaces, and any notable missing pieces or TODOs found during review.

---

1. Frontend: SolidStart (SolidJS)

- Entrypoints

  - src/entry-client.tsx – StartClient mount point
  - src/entry-server.tsx – SSR handler and HTML document template
  - src/app.tsx – Router with FileRoutes, global styles (tokens.css, tailwind.css, app.css), ToastContainer, font scale init
  - src/root.tsx – theme init and base HTML shell

- Global styles

  - src/styles/\* (tokens.css, tailwind.css, components.css, utilities.css, base.css, tiptap.css)

- Shared UI & utilities

  - src/components/\* (ForgeShell, Nav, Splash, ToastContainer, ErrorBoundary, Binder, TipTapEditor & extension Highlight, AnvilBadge, Counter, Smithy index)
  - src/lib/\*
    - types/tempering.ts (full type system for Tempering)
    - hooks/useToast.ts
    - ui/theme.ts, ui/panes.ts
    - db/storyArcGraphDB.ts, db/characterArcDB.ts (front‑end storage helpers)
    - validation/characterArcValidation.ts
    - lore/\* (graph.ts, colors.ts)
    - utils/tauriGuards.ts (isTauriEnvironment/requireTauriEnvironment)
  - src/state/fontScale.ts – app‑wide font scaling

- Routes (workspaces)

  - / (src/routes/index.tsx) + /about
  - /hearth (landing/dashboard with FontSizeControl)
  - /foundry
  - /smithy (editor surface + panels/toolbars)
  - /anvil (story structure & graph tools)
  - /lore
  - /bloom
  - /ember (settings)
  - /tempering/:projectId – export/publishing workspace
    - components: ProfileEditorPanel, ValidationPanel, AssetBindingPanel, LivePreviewPanel
    - hooks: useExportProfiles, useExportJob, useValidation
  - /[...404]

- Navigation
  - src/components/Nav.tsx implements primary nav (workspaces) and a Toolbox (🔧) utilities menu; docs in EMBER_TOOLBOX_INTEGRATION.md. Utilities include Ember, Tempering, Boundary, Help.

2. Tempering (Export & Publishing)

- Types in src/lib/types/tempering.ts define ExportProfile, Formatting/Layout/Structure, ImageBinding, ExportJob, phases, defaults, and helpers.
- Page at src/routes/tempering/[projectId].tsx orchestrates UI and hooks.
- Hooks
  - useExportProfiles – CRUD + selection, invokes Tauri commands
  - useExportJob – job lifecycle with @tauri-apps/api events (export-progress, export-log, export-complete)
  - useValidation – client‑side validation (debounced)
- Panels
  - ProfileEditorPanel – Basic/Formatting/Layout/Structure tabs
  - ValidationPanel – status + stats + estimated pages
  - AssetBindingPanel – image bindings (roles)
  - LivePreviewPanel – preview modes

3. Backend: Rust + Tauri crates

- Folder: backend-rs/
  - crates/
    - shared – shared models/types
    - lore_parser – Gazetteer/Parser/Patterns/Calendar/Linker
    - world_builder – world store & models
    - llm_context – LLM context helpers
  - src/ – main/lib (Rust). Access partially visible (lib.rs), with integrations to crates.
  - tests/ – persistence_test.rs
- Observations
  - Solid hooks reference Tauri commands (get_export_profiles, start_export, etc.). Those exact commands are not visible in the scanned snippets, so confirm presence in backend-rs/src or a tauri sidecar project.
  - If running in pure browser mode, guards make calls no‑op and profiles will be empty.

4. Docs and Guides

- docs/tempering/tempering-context.md/input.md – full Tempering architecture and stages (SolidJS, Tauri bridge, optional Python engine design docs; the live project currently uses a Rust backend).
- Numerous workspace docs: NAVIGATION*\* guides, HEARTH*_ docs, TEMPERING\__ reports, SMITHY\_\* docs, STORY_ARC_GRAPH_ENHANCEMENTS.md.
- New help: docs/toolbox/tempering-help.md (Toolbox Help page)

5. Open TODOs / Missing Pieces

- Tauri command handlers
  - Ensure Rust side exposes: get_export_profiles, create_export_profile, update_export_profile, delete_export_profile, set_default_export_profile, start_export, cancel_export, get_export_job, get_project_export_jobs, and emits export-progress/export-complete.
- Profile persistence
  - Confirm profile storage (DB or local). Migrations exist under backend-rs/migrations for lore/world features; add export_profiles/export_jobs/artifacts if using DB persistence.
- Live Preview engines
  - Components are scaffolded; verify preview data sources and rendering engines (EPUB/CSS for cover/first page/spread). It may be mock/approximate.
- Asset Binding upload pipeline
  - Implement file storage and binding persistence (cover, figure, etc.) + validation hooks for required assets per format/kind.
- Boundary (AI context) integration
  - Appears in Toolbox. If Tempering needs context‑aware post‑processing, define a shared API.
- Help route linking
  - Link docs/toolbox/tempering-help.md from your /help route or in‑app docs viewer so users can open it via Toolbox → Help.
- Mobile polish
  - Verify Toolbox Utilities sub‑menu and active states on small screens.

6. Run and Dev Notes

- Frontend (SolidStart + Vinxi):
  - npm install
  - npm run dev
- Rust backend:
  - Uses Cargo workspaces; ensure toolchain is installed
  - Add/confirm Tauri command handlers if targeting desktop packaging

That’s the current high‑level snapshot. Update this summary as new workspaces, commands, or migrations land.
