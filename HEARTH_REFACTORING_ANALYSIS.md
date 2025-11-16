# Hearth Dashboard Refactoring Analysis

## Current State Assessment

### ✅ What's Already Good

The current Hearth page (`src/routes/hearth/index.tsx`) already implements many of the requested features:

1. **✅ Hero Section**: "Continue Writing" card is prominently displayed
2. **✅ Quick Actions**: Three action tiles (New Project, Import Files, Open Foundry)
3. **✅ Recent Projects**: Grid layout with progress bars
4. **✅ Workflow Guidance**: Educational section about Draft → Revise → Validate
5. **✅ Right Sidebar**: Quick tools with tips and keyboard shortcuts
6. **✅ Font Size Control**: Global text size adjustment
7. **✅ Forge Theme**: Uses CSS variables (`--forge-*` colors)
8. **✅ Responsive Layout**: Grid system with proper spacing
9. **✅ SSR-Safe**: No browser-only code without guards

### 🔧 Recommended Enhancements

Based on the task requirements, here are the improvements that would elevate the Hearth page:

#### 1. **Enhanced Visual Hierarchy**

**Current**: All sections have similar visual weight
**Recommended**: Make the "Continue Writing" card more prominent

```tsx
{/* HERO SECTION: Continue Writing */}
{/* 
  Purpose: Get authors back to writing immediately
  UX Rationale: Most prominent card, shows last edited scene
  Data: Fetched from project history, sorted by lastEdited DESC
*/}
<section class="mb-8 rounded-2xl border-2 border-[rgb(var(--forge-ember))/0.4] 
                bg-gradient-to-br from-[rgb(var(--forge-ember))/0.1] to-transparent
                shadow-[0_0_20px_rgba(255,107,0,0.3)] p-8">
  <div class="flex items-center gap-3 mb-4">
    <Flame class="w-8 h-8 text-[rgb(var(--forge-ember))]" />
    <h2 class="text-2xl font-cinzel-decorative text-[rgb(var(--forge-ember))]">
      Continue Writing
    </h2>
  </div>
  <div class="flex items-center justify-between">
    <div>
      <p class="text-lg font-medium mb-1">Chapter 7 — The Storm's Return</p>
      <p class="text-sm text-[rgb(var(--fg))]/70">
        in <span class="font-semibold">Faith in a FireStorm</span>
      </p>
      <p class="text-xs text-[rgb(var(--fg))]/50 mt-2">Last edited 2 hours ago</p>
    </div>
    <A 
      href="/smithy?project=p1&chapter=7" 
      class="px-6 py-3 rounded-xl bg-gradient-to-b from-[rgb(var(--forge-ember))] to-[rgb(var(--forge-ember))/0.8]
             text-white font-semibold shadow-ember hover:scale-105 transition-transform"
    >
      Open Smithy →
    </A>
  </div>
</section>
```

#### 2. **Improved Page Header**

**Current**: Simple text header
**Recommended**: Forge-themed header with better typography

```tsx
{/* TOP AREA */}
<header class="mb-12 text-center">
  <h1 class="font-cinzel-decorative text-5xl text-[rgb(var(--fg))] mb-2">
    THE HEARTH
  </h1>
  <p class="text-lg text-[rgb(var(--fg))]/70">
    Welcome back, <span class="text-[rgb(var(--forge-brass))]">Author</span>
  </p>
  <p class="text-sm text-[rgb(var(--fg))]/50 mt-1">
    Ready to forge your story?
  </p>
</header>
```

#### 3. **Enhanced Action Tiles with Icons**

**Current**: Text-only action tiles
**Recommended**: Add Lucide icons for visual clarity

```tsx
{/* PRIMARY ACTION ROW */}
<section class="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
  <ActionTile
    icon={Plus}
    title="New Project"
    description="Start fresh with title, genre, defaults."
    href="/foundry/new"
  />
  <ActionTile
    icon={Upload}
    title="Import Files"
    description="Drag in DOCX, MD, or PDF and parse."
    href="/foundry/import"
  />
  <ActionTile
    icon={FolderOpen}
    title="Open Foundry"
    description="Manage projects and indexing."
    href="/foundry"
  />
</section>
```

#### 4. **Richer Project Cards**

**Current**: Basic project info with progress bar
**Recommended**: Add genre tags, word count, and better visual design

```tsx
<ProjectCard
  project={{
    id: "p1",
    name: "Faith in a FireStorm",
    progress: 0.62,
    wordCount: 82000,
    targetWordCount: 120000,
    genre: "Christian Fiction",
    tags: ["Drama", "Faith"],
    updatedAt: "2025-11-10"
  }}
/>

// ProjectCard component
function ProjectCard(props: { project: Project }) {
  const progress = () => Math.round(props.project.progress * 100);
  const wordCount = () => formatWordCount(props.project.wordCount);
  const target = () => props.project.targetWordCount 
    ? formatWordCount(props.project.targetWordCount) 
    : null;

  return (
    <A 
      href={`/foundry?project=${props.project.id}`}
      class="rounded-2xl border border-[rgb(var(--forge-steel))/0.3] p-6
             hover:border-[rgb(var(--forge-brass))/0.5] hover:shadow-card
             transition-all bg-white/60 dark:bg-white/5"
    >
      <div class="flex items-start justify-between mb-4">
        <div class="flex-1">
          <h3 class="font-semibold text-lg mb-1">{props.project.name}</h3>
          <p class="text-xs text-[rgb(var(--fg))]/60">
            Last edited {formatRelativeTime(props.project.updatedAt)}
          </p>
        </div>
        <Show when={props.project.genre}>
          <span class="px-2 py-1 rounded-md bg-[rgb(var(--forge-brass))/0.2] 
                       text-xs text-[rgb(var(--forge-brass))]">
            {props.project.genre}
          </span>
        </Show>
      </div>

      {/* Progress Bar */}
      <div class="mb-3">
        <div class="flex justify-between text-xs mb-1">
          <span>{wordCount()} words</span>
          <span>{progress()}%</span>
        </div>
        <div class="h-2 w-full rounded-full bg-[rgb(var(--forge-steel))/0.2]">
          <div 
            class="h-2 rounded-full bg-gradient-to-r from-[rgb(var(--forge-ember))] to-[rgb(var(--forge-brass))]"
            style={{ width: `${progress()}%` }}
          />
        </div>
        <Show when={target()}>
          <p class="text-xs text-[rgb(var(--fg))]/50 mt-1">
            Target: {target()} words
          </p>
        </Show>
      </div>

      {/* Tags */}
      <Show when={props.project.tags && props.project.tags.length > 0}>
        <div class="flex gap-2 flex-wrap">
          <For each={props.project.tags}>
            {(tag) => (
              <span class="px-2 py-0.5 rounded text-xs bg-[rgb(var(--forge-steel))/0.2]">
                {tag}
              </span>
            )}
          </For>
        </div>
      </Show>
    </A>
  );
}
```

#### 5. **Data Integration with createResource**

**Current**: Static mock data
**Recommended**: Use SolidJS createResource for async data loading

```tsx
// Data fetching functions
async function fetchRecentScene(): Promise<RecentScene> {
  // TODO: Replace with real API call or IndexedDB query
  // Example: return await characterArcDB.getRecentScene();
  return mockRecentScene;
}

async function fetchRecentProjects(): Promise<Project[]> {
  // TODO: Replace with IndexedDB query
  // Example: return await projectDB.getRecent(6);
  return mockRecentProjects;
}

// In component
export default function TheHearth() {
  const [recentScene] = createResource(fetchRecentScene);
  const [recentProjects] = createResource(fetchRecentProjects);

  return (
    <ForgeShell title="The Hearth" rightPanel={QuickToolsPanel()}>
      <main class="max-w-7xl mx-auto px-6 py-8 space-y-12">
        {/* Hero Section with loading state */}
        <Show 
          when={!recentScene.loading} 
          fallback={<HeroSectionSkeleton />}
        >
          <HeroSection scene={recentScene()} />
        </Show>

        {/* Recent Projects with loading state */}
        <Show 
          when={!recentProjects.loading} 
          fallback={<ProjectGridSkeleton />}
        >
          <RecentProjects projects={recentProjects()} />
        </Show>
      </main>
    </ForgeShell>
  );
}
```

#### 6. **Empty States**

**Current**: No empty state handling
**Recommended**: Show helpful messages when no data exists

```tsx
function HeroSection(props: { scene: RecentScene | undefined }) {
  return (
    <Show
      when={props.scene}
      fallback={
        <div class="rounded-2xl border border-[rgb(var(--forge-steel))/0.3] 
                    bg-white/60 dark:bg-white/5 p-12 text-center">
          <Flame class="w-16 h-16 mx-auto mb-4 opacity-30" />
          <h3 class="text-xl font-semibold mb-2">No recent work</h3>
          <p class="text-[rgb(var(--fg))]/60 mb-6">
            Start a new project to begin writing!
          </p>
          <A 
            href="/foundry/new"
            class="inline-block px-6 py-3 rounded-xl bg-gradient-to-b 
                   from-[rgb(var(--forge-ember))] to-[rgb(var(--forge-ember))/0.8]
                   text-white font-semibold shadow-ember"
          >
            Create Your First Project
          </A>
        </div>
      }
    >
      {/* Existing hero content */}
    </Show>
  );
}
```

---

## Implementation Priority

### Phase 1: Visual Enhancements (High Impact, Low Effort)
1. ✅ Add Lucide icons to action tiles
2. ✅ Enhance hero section styling (ember glow, larger size)
3. ✅ Improve page header typography
4. ✅ Add genre tags and word counts to project cards

### Phase 2: Data Integration (Medium Impact, Medium Effort)
1. ✅ Replace mock data with `createResource`
2. ✅ Add loading states and skeletons
3. ✅ Implement empty states
4. ✅ Add relative time formatting

### Phase 3: Advanced Features (Lower Priority)
1. ⏳ Collapsible quick tools sidebar
2. ⏳ Writing streak counter
3. ⏳ Daily word count goal tracker
4. ⏳ Workflow diagram visualization

---

## Conclusion

The current Hearth page is already well-structured and functional. The recommended enhancements focus on:
- **Visual polish**: Better use of Forge theme colors and typography
- **User experience**: Clearer hierarchy, better empty states
- **Data integration**: Real async data loading instead of static mocks
- **Accessibility**: Proper ARIA labels, semantic HTML

All changes should maintain SSR compatibility and preserve existing functionality.

