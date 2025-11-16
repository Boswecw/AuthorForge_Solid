- anvilBadge is Webp not tsx
- 📜 Prompt: Describe the Navigation System & Naming Convention for AuthorForge

System Description:
AuthorForge uses a unified navigation architecture shared across all “Forge” apps (AuthorForge, DataForge, TradeForge, NeuroForge). The navigation is modular, semantic, and forge-themed, reflecting the app’s internal layout and creative workflow. Each section of the nav corresponds to a functional “workspace,” named after a smithing or crafting process to reinforce the brand metaphor of “forging” ideas into creation.

Naming Convention:

The Forge = The overarching workspace (app frame, theme, and shell).

Anvil = Core structure or “story/idea” development zone. Handles narrative arcs, schemas, and high-level data models.

Smithy = The editor zone where creation happens (text, code, or documents). It’s the “write” or “build” surface.

Foundry = The project and asset management layer — where users create or import works, upload files, and organize them.

Bloom = Output or publishing stage (rendering, exports, deployment, visualizations).

Tempering = Export refinement and formatting — where users configure export profiles, validate content, manage assets, and preview formatted output before final export (EPUB, PDF, DOCX, Markdown).

Lore = Worldbuilding and reference database (characters, places, histories, etc.).

Boundary = The contextual AI environment — handles parsing, context injection, and story logic limits.

Hearth = Home or dashboard; where users land, view stats, and access quick actions.

Ember = Settings and themes (user preferences, dark/light toggle, account, etc.).

UI Hierarchy:

Primary Nav (Top or Left Rail) → Displays the major workspace icons (Hearth, Foundry, Smithy, Anvil, Lore, Bloom, Tempering, Boundary, Ember).

Secondary Nav (Breadcrumb / Context Bar) → Shows location within current workspace, e.g.
Anvil / Character Arcs / Rawn Mortisimus

Action Bar (Optional) → Workspace-specific tools (Save, Generate, Analyze, Export).

Implementation Notes:

Each nav item is an object with:

{
  name: "Smithy",
  icon: "hammer", // FontAwesome or Lucide
  route: "/smithy",
  tooltip: "Editor Workspace"
}


The ForgeNav component imports this schema and dynamically renders routes with icon + label + breadcrumb support.

Nav state (open/close, active route) persists via localStorage for desktop continuity.

Prompt Objective:
Generate documentation or code that clearly defines how the navigation system works, how naming conventions reflect AuthorForge’s metaphor, and how each section is represented both semantically (meaning) and structurally (UI routing).