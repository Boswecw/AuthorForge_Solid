import { createSignal, For, Show, onMount, onCleanup } from "solid-js";
import { X, Sparkles, Plus, Trash2 } from "lucide-solid";
import type { ArcBeat, CharacterArc } from "../types";
import { generateAIBeatSuggestion } from "../api/mockTauriCommands";

interface BeatEditorProps {
  beat: ArcBeat | null;
  character: CharacterArc;
  isOpen: boolean;
  onClose: () => void;
  onSave: (beat: ArcBeat) => void;
  onDelete: (beatId: string) => void;
}

export default function BeatEditor(props: BeatEditorProps) {
  const [editedBeat, setEditedBeat] = createSignal<ArcBeat | null>(null);
  const [isLoadingAI, setIsLoadingAI] = createSignal(false);
  const [newChapterLink, setNewChapterLink] = createSignal("");

  // Initialize edited beat when props.beat changes
  onMount(() => {
    if (props.beat) {
      setEditedBeat({ ...props.beat });
    }
  });

  // Update when beat changes
  const updateEditedBeat = () => {
    if (props.beat && (!editedBeat() || editedBeat()!.id !== props.beat.id)) {
      setEditedBeat({ ...props.beat });
    }
  };
  updateEditedBeat();

  const handleSave = () => {
    const beat = editedBeat();
    if (beat) {
      props.onSave(beat);
      props.onClose();
    }
  };

  const handleAIAssist = async () => {
    const beat = editedBeat();
    if (!beat) return;

    setIsLoadingAI(true);
    try {
      const result = await generateAIBeatSuggestion({
        beat,
        character: props.character
      });

      setEditedBeat({
        ...beat,
        aiSuggestions: result.suggestion,
        aiPrompts: result.prompts
      });
    } catch (error) {
      console.error("AI assist failed:", error);
    } finally {
      setIsLoadingAI(false);
    }
  };

  const addChapterLink = () => {
    const link = newChapterLink().trim();
    const beat = editedBeat();
    if (link && beat && !beat.chapterLinks.includes(link)) {
      setEditedBeat({
        ...beat,
        chapterLinks: [...beat.chapterLinks, link]
      });
      setNewChapterLink("");
    }
  };

  const removeChapterLink = (link: string) => {
    const beat = editedBeat();
    if (beat) {
      setEditedBeat({
        ...beat,
        chapterLinks: beat.chapterLinks.filter(l => l !== link)
      });
    }
  };

  if (!props.isOpen || !editedBeat()) return null;

  const beat = editedBeat()!;

  return (
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div class="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[rgb(var(--bg))] rounded-xl 
                  border border-[rgb(var(--forge-steel))/0.3] shadow-2xl m-4">
        {/* Header */}
        <div class="sticky top-0 bg-[rgb(var(--bg))] border-b border-[rgb(var(--forge-steel))/0.2] p-4 flex items-center justify-between">
          <h2 class="font-display text-xl font-semibold">Edit Beat</h2>
          <button
            onClick={props.onClose}
            class="p-2 rounded-md hover:bg-white/10 transition-colors"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div class="p-6 space-y-4">
          {/* Title */}
          <div>
            <label class="block text-sm font-semibold mb-1">Beat Title</label>
            <input
              type="text"
              value={beat.title}
              onInput={(e) => setEditedBeat({ ...beat, title: e.currentTarget.value })}
              class="w-full px-3 py-2 rounded-md border border-[rgb(var(--forge-steel))/0.3] 
                     bg-white/5 focus:outline-none focus:border-[rgb(var(--forge-brass))/0.5]"
              placeholder="e.g., Want vs Need, Midpoint Clarity"
            />
          </div>

          {/* Description */}
          <div>
            <label class="block text-sm font-semibold mb-1">Description</label>
            <textarea
              value={beat.description}
              onInput={(e) => setEditedBeat({ ...beat, description: e.currentTarget.value })}
              rows={6}
              class="w-full px-3 py-2 rounded-md border border-[rgb(var(--forge-steel))/0.3] 
                     bg-white/5 text-sm focus:outline-none focus:border-[rgb(var(--forge-brass))/0.5] resize-none"
              placeholder="Describe what happens in this beat..."
            />
          </div>

          {/* AI Assist Button */}
          <button
            onClick={handleAIAssist}
            disabled={isLoadingAI()}
            class="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md
                   bg-gradient-to-b from-[rgb(var(--forge-ember))/0.2] to-transparent
                   border border-[rgb(var(--forge-ember))/0.3] shadow-ember
                   hover:from-[rgb(var(--forge-ember))/0.3] transition-all
                   disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Sparkles class="w-4 h-4" />
            <span>{isLoadingAI() ? "Generating..." : "AI Brainstorm Assist"}</span>
          </button>

          {/* AI Suggestions */}
          <Show when={beat.aiSuggestions}>
            <div class="p-4 rounded-md bg-[rgb(var(--forge-ember))/0.05] border border-[rgb(var(--forge-ember))/0.2]">
              <div class="flex items-center gap-2 mb-2">
                <Sparkles class="w-4 h-4 text-[rgb(var(--forge-ember))]" />
                <span class="text-sm font-semibold text-[rgb(var(--forge-ember))]">AI Suggestion</span>
              </div>
              <p class="text-sm opacity-90 mb-3">{beat.aiSuggestions}</p>

              <Show when={beat.aiPrompts && beat.aiPrompts.length > 0}>
                <div class="space-y-1">
                  <p class="text-xs font-semibold opacity-70">Directional Prompts:</p>
                  <For each={beat.aiPrompts}>
                    {(prompt) => (
                      <div class="text-xs p-2 rounded bg-white/10 border border-[rgb(var(--forge-steel))/0.2]">
                        • {prompt}
                      </div>
                    )}
                  </For>
                </div>
              </Show>
            </div>
          </Show>

          {/* Chapter Links */}
          <div>
            <label class="block text-sm font-semibold mb-2">Chapter Links</label>
            <div class="flex flex-wrap gap-2 mb-2">
              <For each={beat.chapterLinks}>
                {(link) => (
                  <span class="inline-flex items-center gap-1 px-2 py-1 rounded-md 
                               bg-[rgb(var(--forge-brass))/0.15] text-sm border border-[rgb(var(--forge-brass))/0.3]">
                    {link}
                    <button
                      onClick={() => removeChapterLink(link)}
                      class="hover:text-[rgb(var(--forge-ember))]"
                    >
                      <X class="w-3 h-3" />
                    </button>
                  </span>
                )}
              </For>
            </div>
            <div class="flex gap-2">
              <input
                type="text"
                value={newChapterLink()}
                onInput={(e) => setNewChapterLink(e.currentTarget.value)}
                onKeyPress={(e) => e.key === "Enter" && addChapterLink()}
                class="flex-1 px-3 py-1 rounded-md border border-[rgb(var(--forge-steel))/0.3] 
                       bg-white/5 text-sm focus:outline-none focus:border-[rgb(var(--forge-brass))/0.5]"
                placeholder="e.g., Ch 7, Ch 12"
              />
              <button
                onClick={addChapterLink}
                class="px-3 py-1 rounded-md border border-[rgb(var(--forge-brass))/0.3] 
                       hover:bg-white/5 transition-colors"
              >
                <Plus class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div class="sticky bottom-0 bg-[rgb(var(--bg))] border-t border-[rgb(var(--forge-steel))/0.2] p-4 flex items-center justify-between">
          <button
            onClick={() => {
              if (confirm("Delete this beat?")) {
                props.onDelete(beat.id);
                props.onClose();
              }
            }}
            class="flex items-center gap-2 px-4 py-2 rounded-md text-red-500 hover:bg-red-500/10 transition-colors"
          >
            <Trash2 class="w-4 h-4" />
            <span>Delete Beat</span>
          </button>

          <div class="flex gap-2">
            <button
              onClick={props.onClose}
              class="px-4 py-2 rounded-md border border-[rgb(var(--forge-steel))/0.3] hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              class="px-4 py-2 rounded-md bg-gradient-to-b from-[rgb(var(--forge-ember))/0.2] to-transparent
                     border border-[rgb(var(--forge-brass))/0.3] shadow-ember hover:from-[rgb(var(--forge-ember))/0.3]"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

