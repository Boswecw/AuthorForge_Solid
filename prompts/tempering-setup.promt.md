You are helping me implement the Tempering module for AuthorForge.

Context:
- Tech stack: SolidStart + Tauri (Rust) frontend, Python FastAPI backend, PostgreSQL DB.
- Tempering is the export/publishing engine.
- The detailed spec lives in: docs/tempering/tempering-context.md
- Treat that spec as the source of truth for:
  - Type definitions
  - Solid components and hooks
  - Python export engines
  - DB schema and repository layer
  - Integration via Tauri commands

Rules:
- Always read or reference docs/tempering/tempering-context.md before suggesting code.
- Work FILE-BY-FILE and STEP-BY-STEP. Don’t try to implement everything at once.
- Prefer to generate complete, compilable files when I ask for “full file”.
- Match the existing AuthorForge style: forge-themed names, Tailwind classes, Solid patterns.

First task:
1. Inspect the spec in docs/tempering/tempering-context.md.
2. Generate the initial implementation for src/lib/types/tempering.ts based on the “Core Type Definitions” and “Profile Structure” sections.
3. Output a full file, not a diff.
