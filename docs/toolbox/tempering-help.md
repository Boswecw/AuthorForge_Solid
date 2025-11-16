# Tempering & Toolbox Utilities: Complete Help Guide

This Help page explains how to use the Tempering workspace (export & publishing engine) and how it integrates with the Toolbox (🔧) menu in AuthorForge. It covers workflows, UI, profile concepts, and backend notes so you can confidently publish your project to EPUB, PDF, DOCX, Markdown, or HTML.

---

1. What is Tempering?
   Tempering is the final stage of the Forge workflow: the export and publishing engine. It converts your project’s content into polished, professional outputs using a profile-driven configuration. Tempering follows the forge metaphor: heating → hammering → quenching → cooled.

- Heating: Gather and prepare content
- Hammering: Apply formatting and structure
- Quenching: Generate the final artifact
- Cooled: Export complete

2. How to open Tempering from the Toolbox
   You can reach Tempering from multiple places, but the quickest path is the desktop Toolbox menu.

- Desktop header: Click the 🔧 Toolbox button (top-right) to open the utilities dropdown
- Select Tempering → routes to /tempering/:projectId
- Mobile: Use the primary menu (≡) and then Utilities → Tempering

Tip: The Toolbox menu groups utility workspaces (Ember, Tempering, Boundary, Help) separate from the primary workspaces (Hearth, Foundry, Smithy, Anvil, Lore, Bloom).

3. Tempering UI overview
   Path: /tempering/:projectId

Left panel: Profiles list

- Pick or create an Export Profile (EPUB, PDF, DOCX, Markdown, or HTML)
- Duplicates and defaults are supported (depending on backend availability)

Center panel: Quick or Detailed mode

- Quick Export: One‑click run using the selected profile
- Detailed Settings: Open the Profile Editor with tabs:
  - Basic: name/description, read‑only info
  - Formatting: fonts, sizes, spacing, alignment, drop caps
  - Layout: page size, margins, header/footer, page numbers
  - Structure: title page, TOC depth, dedication, acknowledgments, chapter breaks/numbering

Right panel: Export Progress

- Live phase + progress bar (Ready, Gathering, Forging, Tempering, Complete, Failed)
- Cancel/Clear actions
- Displays output path or error messages when finished

Below: Panels (loaded when a profile is selected)

- Validation Panel: live checks and content stats (est. pages)
- Asset Binding Panel: manage image roles (cover, figure, map, etc.)
- Live Preview Panel: cover/first page/spread previews

4. Core concepts
   Profiles

- ExportProfile captures everything needed to generate an output:
  - kind (manuscript, novel, scientific_paper, blog_post, newsletter)
  - format (epub, docx, pdf, markdown, html)
  - formatting, layout, structure, kindOptions
  - imageBindings (cover, figure, hero, etc.)
  - isDefault flag for quick selection

Validation

- Validation runs automatically as you edit a profile (debounced)
- Errors block export; warnings are advisory
- Typical checks: font sizes, margins, TOC depth, header/footer content

Jobs

- ExportJob tracks phase, progress, logs, outputPath, and errors
- Tempering listens to Tauri events: export-progress, export-log, export-complete

5. Typical workflows
   Quick export

- Select a profile → Quick Export → Start Export → monitor progress → download artifact

Full control

- Select a profile → switch to Detailed Settings → tune Formatting/Layout/Structure → check Validation → Start Export

Asset‑driven (e.g., adding a cover)

- Select a profile → Asset Binding Panel → upload/assign role → export EPUB/PDF again

6. Toolbox integration details
   Navigation

- Tempering is available under the Toolbox dropdown (🔧) in the desktop header along with:
  - Ember (Settings), Boundary (AI Context), Help (this page)
- From any page, open Toolbox → Tempering to jump to export for the current project

State

- The UI uses SolidStart routing and lazy‑loads heavy panels for fast navigation
- Local state (like Toolbox open/close) uses internal signals; route activity highlights the matching menu item

7. Backend and environment
   Current project includes a Rust + Tauri backend (backend-rs). The Tempering hooks are wired to Tauri commands via @tauri-apps/api:

- get_export_profiles, create_export_profile, update_export_profile, delete_export_profile
- set_default_export_profile, start_export, cancel_export
- get_export_job, get_project_export_jobs

If Tauri is not present (browser mode), the hooks gracefully degrade using guards (isTauriEnvironment/requireTauriEnvironment). Profile lists will be empty and export commands will no‑op.

8. Tips, troubleshooting, and limitations

- If Validation reports errors, fix them first; export is disabled otherwise
- If no profiles are shown, ensure your Tauri backend exposes get_export_profiles and that a projectId is valid in the URL
- If events don’t update, verify export-progress/export-complete events are emitted by the backend
- Est. Pages are heuristic and change with page size, margins, and line spacing
- Live Preview is a UI‑only approximation; final layout may differ by engine

9. Glossary

- Tempering: Export/publishing workspace
- Toolbox: Utilities dropdown in the top header (desktop), also listed under Utilities in mobile nav
- Profile: Saved configuration for an export format and kind
- Job: A single export run with tracked progress
- Validation: Pre‑flight checks to catch formatting/layout issues

10. Related docs

- docs/tempering/tempering-context.md/input.md (architecture & stages)
- EMBER_TOOLBOX_INTEGRATION.md (Toolbox menu behavior)
- TEMPERING_P0_P1_IMPLEMENTATION_SUMMARY.md (status notes)

Release notes

- This Help page is new and lives at docs/toolbox/tempering-help.md. Link it from your Help route (/help) or docs viewer as needed.
