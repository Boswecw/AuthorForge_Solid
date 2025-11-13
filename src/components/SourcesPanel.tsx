import { createSignal, For, Show } from "solid-js";
import { sourcesForDoc, type SourceMeta } from "~/lib/provenance";

export default function SourcesPanel() {
  const [isOpen, setIsOpen] = createSignal(false);
  const documentSources = () => sourcesForDoc();

  return (
    <>
      {/* Floating toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen())}
        class="fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full bg-forge-brass text-white shadow-forge hover:bg-forge-ember transition-all duration-300 flex items-center justify-center"
        title="Toggle Sources Panel (Ctrl+Shift+S)"
        aria-label="Toggle sources panel"
      >
        <span class="text-xl">📚</span>
      </button>

      {/* Slide-out panel */}
      <Show when={isOpen()}>
        <div class="fixed inset-y-0 right-0 z-40 w-96 surface-right-2 transform transition-transform duration-300 overflow-y-auto">
          <div class="p-6">
            {/* Header */}
            <div class="flex items-center justify-between mb-6">
              <h2 class="font-display text-2xl text-forge-brass">Sources</h2>
              <button
                onClick={() => setIsOpen(false)}
                class="text-fg/60 hover:text-fg transition-colors"
                aria-label="Close panel"
              >
                <span class="text-2xl">×</span>
              </button>
            </div>

            {/* Sources list */}
            <Show
              when={documentSources().length > 0}
              fallback={
                <div class="text-center py-12 text-subtle">
                  <p class="text-lg mb-2">No sources yet</p>
                  <p class="text-sm">
                    Tag passages to track their sources
                  </p>
                </div>
              }
            >
              <div class="space-y-4">
                <For each={documentSources()}>
                  {(source) => <SourceCard source={source} />}
                </For>
              </div>
            </Show>

            {/* Footer info */}
            <div class="mt-8 pt-4 border-t border-fg/10">
              <p class="text-xs text-subtle text-center">
                {documentSources().length} source{documentSources().length !== 1 ? "s" : ""} referenced
              </p>
            </div>
          </div>
        </div>

        {/* Backdrop */}
        <div
          class="fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
          onClick={() => setIsOpen(false)}
        />
      </Show>
    </>
  );
}

// Individual source card component
function SourceCard(props: { source: SourceMeta }) {
  return (
    <div class="card p-4 space-y-2">
      {/* Title */}
      <h3 class="font-serif font-semibold text-forge-brass">
        {props.source.title}
      </h3>

      {/* Publisher */}
      <Show when={props.source.publisher}>
        <p class="text-sm text-fg/70">
          Published by: {props.source.publisher}
        </p>
      </Show>

      {/* License */}
      <Show when={props.source.license}>
        <span class="badge text-xs">
          {props.source.license}
        </span>
      </Show>

      {/* Domain */}
      <div class="flex items-center gap-2 text-xs text-subtle">
        <span class="badge bg-forge-steel/10 text-forge-steel">
          {props.source.domain}
        </span>
      </div>

      {/* Contributors */}
      <Show when={props.source.contributors.length > 0}>
        <div class="text-sm text-fg/80 pt-2">
          <span class="font-semibold">Contributors:</span>
          <ul class="mt-1 space-y-1">
            <For each={props.source.contributors}>
              {(contributor) => (
                <li class="text-xs">
                  {contributor.name}
                  <Show when={contributor.role}>
                    {" "}
                    <span class="text-subtle">({contributor.role})</span>
                  </Show>
                </li>
              )}
            </For>
          </ul>
        </div>
      </Show>

      {/* URL */}
      <Show when={props.source.url}>
        <a
          href={props.source.url}
          target="_blank"
          rel="noopener noreferrer"
          class="text-xs text-forge-brass hover:text-forge-ember transition-colors inline-flex items-center gap-1"
        >
          View source →
        </a>
      </Show>
    </div>
  );
}
