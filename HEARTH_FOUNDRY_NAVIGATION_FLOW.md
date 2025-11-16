# 🗺️ Hearth ↔ Foundry Navigation Flow

## Visual Navigation Map

```
┌─────────────────────────────────────────────────────────────────────┐
│                         🔥 THE HEARTH                               │
│                      (Dashboard / Home Base)                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌───────────────────────────────────────────────────────────┐    │
│  │ 💡 Understanding Your Workspaces                          │    │
│  ├───────────────────────────────────────────────────────────┤    │
│  │ 🔥 The Hearth (You are here)  │  📁 The Foundry          │    │
│  │ Your dashboard for quick      │  Your project workshop.  │    │
│  │ access. Think of this as      │  Think of this as your   │    │
│  │ your home base.               │  toolshed.               │    │
│  └───────────────────────────────────────────────────────────┘    │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────┐    │
│  │ 🔥 Continue Writing                                       │    │
│  │ Chapter 7 - The Storm's Return                            │    │
│  │ in Faith in a FireStorm                    [Open Smithy →]│    │
│  └───────────────────────────────────────────────────────────┘    │
│                                                                     │
│  Quick Actions                          [View all in Foundry →]    │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐                 │
│  │ + New       │ │ ↑ Import    │ │ 📁 Manage   │                 │
│  │   Project   │ │   Files     │ │   Projects  │                 │
│  │             │ │             │ │             │                 │
│  │ Opens in    │ │ Opens in    │ │ Opens in    │                 │
│  │ Foundry →   │ │ Foundry →   │ │ Foundry →   │                 │
│  └──────┬──────┘ └──────┬──────┘ └──────┬──────┘                 │
│         │                │                │                        │
│         └────────────────┼────────────────┘                        │
│                          │                                         │
│  Recent Projects         │          [View all projects →]         │
│  ┌─────────────────┐    │                                         │
│  │ Faith in a      │    │                                         │
│  │ FireStorm       │    │                                         │
│  │ 82,000 words    │    │                                         │
│  │ [====62%]       │    │                                         │
│  │ [Manage][Write] │    │                                         │
│  └────┬────────────┘    │                                         │
│       │                 │                                         │
└───────┼─────────────────┼─────────────────────────────────────────┘
        │                 │
        │                 ▼
        │    ┌─────────────────────────────────────────────────┐
        │    │         📁 THE FOUNDRY                          │
        │    │      (Project Workshop / Toolshed)              │
        │    ├─────────────────────────────────────────────────┤
        │    │ ← Back to Hearth                                │
        │    │                                                 │
        │    │ About the Foundry:                              │
        │    │ This is your project workshop. Use it to        │
        │    │ create, import, and manage your writing         │
        │    │ projects.                                       │
        │    │                                                 │
        │    │ Return to the Hearth for quick access to        │
        │    │ continue writing.                               │
        │    │                                                 │
        │    │ [Ingest Tab] [Overview Tab]                     │
        │    │                                                 │
        │    │ ┌─────────────────────────────────────┐        │
        │    │ │ Import Files                        │        │
        │    │ │ Drop DOCX, MD, or PDF here          │        │
        │    │ │ [Parse & Index] [Open in Smithy]    │        │
        │    │ └─────────────────────────────────────┘        │
        │    │                                                 │
        │    │ ┌─────────────────────────────────────┐        │
        │    │ │ Projects Overview                   │        │
        │    │ │ - Faith in a FireStorm (Indexed)    │        │
        │    │ │ - Heart of the Storm (Needs index)  │        │
        │    │ └─────────────────────────────────────┘        │
        │    └─────────────────────────────────────────────────┘
        │                          │
        └──────────────────────────┘
```

---

## Navigation Paths

### Path 1: Quick Writing (Most Common)
```
Hearth → Continue Writing → Smithy
```
**User Intent:** "I just want to write"
**Clicks:** 1 click

---

### Path 2: New Project
```
Hearth → New Project → Foundry (New Project Modal) → Smithy
```
**User Intent:** "I want to start a new book"
**Clicks:** 2-3 clicks

---

### Path 3: Import Manuscript
```
Hearth → Import Files → Foundry (Ingest Tab) → Drop Files → Parse & Index → Smithy
```
**User Intent:** "I have an existing manuscript to import"
**Clicks:** 3-4 clicks

---

### Path 4: Manage Existing Project
```
Hearth → Recent Projects → [Manage] → Foundry (Project View) → Configure → Back to Hearth
```
**User Intent:** "I need to re-index or configure my project"
**Clicks:** 3-4 clicks

---

### Path 5: Browse All Projects
```
Hearth → View all projects → Foundry (Overview Tab) → Select Project → Open in Smithy
```
**User Intent:** "I want to see all my projects"
**Clicks:** 3 clicks

---

## Navigation Elements Reference

### On Hearth Page

| Element | Destination | Visual Cue |
|---------|-------------|------------|
| **Continue Writing** button | `/smithy?project=p1&chapter=7` | Ember glow, Flame icon |
| **New Project** tile | `/foundry/new` | "Opens in Foundry →" |
| **Import Files** tile | `/foundry?tab=ingest` | "Opens in Foundry →" |
| **Manage Projects** tile | `/foundry?tab=overview` | "Opens in Foundry →" |
| **View all in Foundry** link | `/foundry` | Brass color, ArrowRight icon |
| **View all projects** link | `/foundry?tab=overview` | Brass color, ArrowRight icon |
| **[Manage]** button (project card) | `/foundry?project={id}` | FolderOpen icon, neutral style |
| **[Write]** button (project card) | `/smithy?project={id}` | Flame icon, ember accent |

### On Foundry Page

| Element | Destination | Visual Cue |
|---------|-------------|------------|
| **Back to Hearth** breadcrumb | `/` | ArrowLeft icon, brass color |
| **Return to the Hearth** link (right panel) | `/` | Brass color, underline on hover |
| **Open in Smithy** button | `/smithy` | Ember accent, shadow-ember |

---

## Color Coding System

### 🔥 Ember (Orange) - Writing Actions
- Continue Writing hero card
- "Write" buttons on project cards
- "Open Smithy" buttons
- Primary CTAs for creative work

### 🟡 Brass (Gold) - Navigation & Management
- Navigation links ("View all in Foundry", "Back to Hearth")
- "Manage" buttons
- Workspace names in guides
- Secondary actions

### ⚙️ Steel (Gray) - Structure & Borders
- Card borders
- Neutral backgrounds
- Subtle dividers

---

## Icon Usage Guide

| Icon | Meaning | Used For |
|------|---------|----------|
| 🔥 `Flame` | Writing/Creating | Continue Writing, Write buttons |
| 📁 `FolderOpen` | Managing/Organizing | Manage buttons, Foundry references |
| ➕ `Plus` | Creating New | New Project action |
| ⬆️ `Upload` | Importing | Import Files action |
| ➡️ `ArrowRight` | Navigation Forward | "Opens in Foundry", "View all" links |
| ⬅️ `ArrowLeft` | Navigation Back | "Back to Hearth" breadcrumb |
| 🏠 `Home` | Home/Dashboard | (Available for future use) |

---

## User Mental Model

### The Forge Metaphor

```
┌─────────────────────────────────────────────────────────┐
│                    THE FORGE (App)                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  🔥 THE HEARTH                                          │
│  The warm fire where you gather and plan your day      │
│  "What am I working on today?"                          │
│  → Quick, welcoming, simple                             │
│                                                         │
│  📁 THE FOUNDRY                                         │
│  The workshop with tools and materials                  │
│  "Let me set up my materials and tools"                 │
│  → Technical, detailed, powerful                        │
│                                                         │
│  ⚒️ THE SMITHY                                          │
│  The anvil where you actually forge                     │
│  "I'm creating now"                                     │
│  → Focus, flow, writing                                 │
│                                                         │
│  📖 THE ANVIL                                           │
│  The shaping station for structure                      │
│  "I'm organizing my story"                              │
│  → Structure, arcs, beats                               │
│                                                         │
│  📚 THE LORE                                            │
│  The reference library                                  │
│  "I'm building my world"                                │
│  → Worldbuilding, characters, canon                     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Decision Tree: Which Workspace?

```
START: What do you want to do?
│
├─ "Continue writing where I left off"
│  └─> HEARTH → Continue Writing → SMITHY
│
├─ "Start a new project"
│  └─> HEARTH → New Project → FOUNDRY → SMITHY
│
├─ "Import an existing manuscript"
│  └─> HEARTH → Import Files → FOUNDRY (Ingest) → SMITHY
│
├─ "Manage/configure a project"
│  └─> HEARTH → Manage → FOUNDRY (Overview)
│
├─ "Check indexing status"
│  └─> HEARTH → View all projects → FOUNDRY (Overview)
│
├─ "Plan my story structure"
│  └─> HEARTH → Continue Writing → ANVIL
│
├─ "Build my world/characters"
│  └─> HEARTH → Continue Writing → LORE
│
└─ "Just browse my projects"
   └─> HEARTH → Recent Projects (stay on Hearth)
```

---

## Conclusion

The navigation system now provides:

✅ **Clear Purpose** - Each workspace has a distinct role
✅ **Explicit Hints** - "Opens in Foundry →" tells users where they're going
✅ **Easy Return** - "Back to Hearth" breadcrumb on Foundry
✅ **Visual Cues** - Icons and colors reinforce meaning
✅ **Mental Model** - Forge metaphor is consistent throughout
✅ **Efficient Paths** - Most common actions require fewest clicks

**Result:** Users can navigate confidently without confusion! 🎯✨

