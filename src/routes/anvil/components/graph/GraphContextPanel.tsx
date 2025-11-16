/**
 * GraphContextPanel Component
 * 
 * Right panel that displays details when a graph point is clicked
 */

import { Show, For, createSignal, createMemo } from "solid-js";
import { X, Edit2, Save } from "lucide-solid";
import type { StoryArcPoint, LayerConfig } from "../../types/graph";

interface GraphContextPanelProps {
  point: StoryArcPoint | null;
  layers: LayerConfig[];
  onClose: () => void;
  onEditInSmithy: (chapter: number) => void;
  onEditCharacterArc: (characterId: string) => void;
  onAISuggest: (chapter: number) => void;
  onUpdatePoint?: (chapter: number, updates: Partial<StoryArcPoint>) => void;
}

export default function GraphContextPanel(props: GraphContextPanelProps) {
  const [isEditingNotes, setIsEditingNotes] = createSignal(false);
  const [notes, setNotes] = createSignal("");

  // Filter enabled layers reactively
  const enabledLayers = createMemo(() => props.layers.filter(l => l.enabled));

  const handleSaveNotes = () => {
    const point = props.point;
    if (!point || !props.onUpdatePoint) return;

    props.onUpdatePoint(point.chapter, { notes: notes() });
    setIsEditingNotes(false);
  };

  return (
    <Show when={props.point}>
      {(point) => {
        // Initialize notes when point changes
        if (notes() !== point().notes) {
          setNotes(point().notes || "");
        }

        return (
          <div class="w-80 bg-[var(--bg)] border-l border-[var(--forge-steel)] p-6 space-y-6 overflow-y-auto">
          {/* Header */}
          <div class="flex items-start justify-between">
            <div>
              <h3 class="text-xl font-bold text-[var(--forge-brass)]">
                {point().chapterTitle || `Chapter ${point().chapter}`}
              </h3>
              <p class="text-sm opacity-70">Act {point().act}</p>
            </div>
            <button
              onClick={props.onClose}
              class="p-1 hover:bg-[var(--forge-steel)] hover:bg-opacity-20 rounded transition-all"
            >
              <X size={20} />
            </button>
          </div>

          {/* POV Character */}
          <Show when={point().povCharacterId}>
            <section>
              <h4 class="font-semibold mb-2 text-sm uppercase tracking-wide opacity-70">
                POV Character
              </h4>
              <p class="text-sm">
                {point().povCharacterId === 'char-1' ? 'Rawn Mortisimus' : 'Father Aldric'}
              </p>
            </section>
          </Show>

          {/* Intensity Values */}
          <section>
            <h4 class="font-semibold mb-3 text-sm uppercase tracking-wide opacity-70">
              Intensity Values
            </h4>
            <div class="space-y-2">
              <For each={enabledLayers()}>
                {(layer) => {
                  const value = point()[layer.key];
                  return (
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <div
                          class="w-3 h-3 rounded-full"
                          style={{ "background-color": layer.color }}
                        />
                        <span class="text-sm">{layer.label}</span>
                      </div>
                      <span class="text-sm font-semibold">{value}/100</span>
                    </div>
                  );
                }}
              </For>
            </div>
          </section>

          {/* Arc Beats */}
          <section>
            <h4 class="font-semibold mb-3 text-sm uppercase tracking-wide opacity-70">
              Arc Beats in This Chapter
            </h4>
            <Show
              when={point().arcBeatIds.length > 0}
              fallback={
                <p class="text-sm opacity-50 italic">No arc beats in this chapter</p>
              }
            >
              <ul class="space-y-2">
                <For each={point().arcBeatIds}>
                  {(beatId) => (
                    <li class="text-sm p-2 bg-[var(--forge-steel)] bg-opacity-10 rounded">
                      Beat: {beatId}
                    </li>
                  )}
                </For>
              </ul>
            </Show>
          </section>

          {/* Notes */}
          <section>
            <div class="flex items-center justify-between mb-2">
              <h4 class="font-semibold text-sm uppercase tracking-wide opacity-70">
                Notes
              </h4>
              <Show when={props.onUpdatePoint}>
                <button
                  onClick={() => setIsEditingNotes(!isEditingNotes())}
                  class="p-1 hover:bg-[var(--forge-steel)] hover:bg-opacity-20 rounded transition-all"
                  title={isEditingNotes() ? "Cancel" : "Edit notes"}
                >
                  {isEditingNotes() ? <X size={14} /> : <Edit2 size={14} />}
                </button>
              </Show>
            </div>
            <Show
              when={isEditingNotes()}
              fallback={
                <p class="text-sm opacity-90">
                  {point().notes || <span class="italic opacity-50">No notes yet</span>}
                </p>
              }
            >
              <div class="space-y-2">
                <textarea
                  value={notes()}
                  onInput={(e) => setNotes(e.currentTarget.value)}
                  class="w-full px-3 py-2 bg-[var(--bg)] border border-[var(--forge-steel)] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[var(--forge-brass)] min-h-[100px]"
                  placeholder="Add notes about this chapter..."
                />
                <button
                  onClick={handleSaveNotes}
                  class="w-full px-3 py-1.5 bg-[var(--forge-brass)] text-[var(--bg)] rounded text-sm font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  <Save size={14} />
                  Save Notes
                </button>
              </div>
            </Show>
          </section>

          {/* Quick Actions */}
          <section class="space-y-2 pt-4 border-t border-[var(--forge-steel)]">
            <button
              onClick={() => props.onEditInSmithy(point().chapter)}
              class="w-full px-4 py-2 bg-[var(--forge-brass)] text-[var(--bg)] rounded font-semibold hover:opacity-90 transition-opacity text-sm"
            >
              ✏️ Edit in Smithy
            </button>
            
            <Show when={point().povCharacterId}>
              <button
                onClick={() => props.onEditCharacterArc(point().povCharacterId!)}
                class="w-full px-4 py-2 border border-[var(--forge-steel)] rounded font-semibold hover:bg-[var(--forge-steel)] hover:bg-opacity-20 transition-all text-sm"
              >
                👤 Edit Character Arc
              </button>
            </Show>
            
            <button
              onClick={() => props.onAISuggest(point().chapter)}
              class="w-full px-4 py-2 border border-[var(--forge-steel)] rounded font-semibold hover:bg-[var(--forge-steel)] hover:bg-opacity-20 transition-all text-sm"
            >
              ✨ AI Suggest Improvements
            </button>
          </section>
          </div>
        );
      }}
    </Show>
  );
}

