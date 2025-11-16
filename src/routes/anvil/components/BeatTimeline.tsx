import { createSignal, For, Show } from "solid-js";
import { ChevronDown, ChevronRight, Plus, Edit, Sparkles } from "lucide-solid";
import type { CharacterArc, ArcBeat, ActNumber } from "../types";

interface BeatTimelineProps {
  character: CharacterArc;
  onChange: (updates: Partial<CharacterArc>) => void;
  onEditBeat: (beat: ArcBeat) => void;
  onAIAssist: (beat: ArcBeat) => void;
}

export default function BeatTimeline(props: BeatTimelineProps) {
  const [expandedActs, setExpandedActs] = createSignal<Set<ActNumber>>(new Set([1, 2, 3]));

  const toggleAct = (actNumber: ActNumber) => {
    const expanded = new Set(expandedActs());
    if (expanded.has(actNumber)) {
      expanded.delete(actNumber);
    } else {
      expanded.add(actNumber);
    }
    setExpandedActs(expanded);
  };

  const getBeatsForAct = (actNumber: ActNumber) => {
    return props.character.beats.filter(beat => beat.actNumber === actNumber);
  };

  const addBeat = (actNumber: ActNumber) => {
    const newBeat: ArcBeat = {
      id: `beat-${Date.now()}`,
      actNumber,
      title: "New Beat",
      description: "",
      chapterLinks: []
    };
    props.onChange({
      beats: [...props.character.beats, newBeat]
    });
  };

  const acts = [
    {
      number: 1 as ActNumber,
      title: "Act I - Setup",
      description: "Establish character, world, and inciting incident",
      defaultBeats: ["Want vs Need", "Inciting Wound Reactivation", "Relationship Setup"]
    },
    {
      number: 2 as ActNumber,
      title: "Act II - Struggle",
      description: "Rising tension, midpoint revelation, escalation",
      defaultBeats: ["Midpoint Clarity", "Escalation/Transformation Moments", "Sacrifices"]
    },
    {
      number: 3 as ActNumber,
      title: "Act III - Resolution",
      description: "Climax, resolution, and character transformation",
      defaultBeats: ["Truth Acceptance", "Final Moral Choice", "Aftermath State"]
    }
  ];

  return (
    <div class="rounded-xl border border-[rgb(var(--forge-steel))/0.3] bg-white/60 dark:bg-white/5 p-6 shadow-card">
      <h2 class="font-display text-xl font-semibold mb-4">Beat Timeline</h2>

      <div class="space-y-3">
        <For each={acts}>
          {(act) => {
            const isExpanded = () => expandedActs().has(act.number);
            const beats = () => getBeatsForAct(act.number);

            return (
              <div class="rounded-lg border border-[rgb(var(--forge-brass))/0.3] overflow-hidden">
                {/* Act Header */}
                <button
                  onClick={() => toggleAct(act.number)}
                  class="w-full flex items-center justify-between p-4 
                         bg-gradient-to-r from-[rgb(var(--forge-ember))/0.1] to-transparent
                         hover:from-[rgb(var(--forge-ember))/0.15] transition-all"
                >
                  <div class="flex items-center gap-3">
                    {isExpanded() ? (
                      <ChevronDown class="w-5 h-5 text-[rgb(var(--forge-brass))]" />
                    ) : (
                      <ChevronRight class="w-5 h-5 text-[rgb(var(--forge-brass))]" />
                    )}
                    <div class="text-left">
                      <h3 class="font-display font-semibold">{act.title}</h3>
                      <p class="text-xs opacity-70">{act.description}</p>
                    </div>
                  </div>
                  <span class="text-xs px-2 py-1 rounded bg-[rgb(var(--forge-brass))/0.2]">
                    {beats().length} beats
                  </span>
                </button>

                {/* Act Content */}
                <Show when={isExpanded()}>
                  <div class="p-4 space-y-3 bg-white/30 dark:bg-black/10">
                    <For each={beats()}>
                      {(beat) => (
                        <BeatCard
                          beat={beat}
                          onEdit={() => props.onEditBeat(beat)}
                          onAIAssist={() => props.onAIAssist(beat)}
                        />
                      )}
                    </For>

                    {/* Add Beat Button */}
                    <button
                      onClick={() => addBeat(act.number)}
                      class="w-full flex items-center justify-center gap-2 p-3 rounded-md
                             border border-dashed border-[rgb(var(--forge-brass))/0.3]
                             hover:bg-white/5 transition-colors text-sm"
                    >
                      <Plus class="w-4 h-4" />
                      <span>Add Beat to {act.title}</span>
                    </button>
                  </div>
                </Show>
              </div>
            );
          }}
        </For>
      </div>
    </div>
  );
}

interface BeatCardProps {
  beat: ArcBeat;
  onEdit: () => void;
  onAIAssist: () => void;
}

function BeatCard(props: BeatCardProps) {
  return (
    <div class="rounded-md border border-[rgb(var(--forge-steel))/0.3] bg-white/60 dark:bg-white/5 p-4">
      <div class="flex items-start justify-between mb-2">
        <h4 class="font-semibold">{props.beat.title}</h4>
        <div class="flex gap-1">
          <button
            onClick={props.onAIAssist}
            class="p-1 rounded hover:bg-[rgb(var(--forge-ember))/0.2] transition-colors"
            title="AI Brainstorm Assist"
          >
            <Sparkles class="w-4 h-4 text-[rgb(var(--forge-ember))]" />
          </button>
          <button
            onClick={props.onEdit}
            class="p-1 rounded hover:bg-white/10 transition-colors"
            title="Edit Beat"
          >
            <Edit class="w-4 h-4" />
          </button>
        </div>
      </div>

      <p class="text-sm opacity-80 mb-3">{props.beat.description || "No description yet..."}</p>

      {/* Chapter Links */}
      <Show when={props.beat.chapterLinks.length > 0}>
        <div class="flex items-center gap-2 text-xs">
          <span class="opacity-60">Appears in:</span>
          <div class="flex gap-1">
            <For each={props.beat.chapterLinks}>
              {(chapterId) => (
                <span class="px-2 py-0.5 rounded bg-[rgb(var(--forge-brass))/0.15] border border-[rgb(var(--forge-brass))/0.3]">
                  {chapterId}
                </span>
              )}
            </For>
          </div>
        </div>
      </Show>

      {/* AI Suggestions */}
      <Show when={props.beat.aiSuggestions}>
        <div class="mt-3 p-3 rounded-md bg-[rgb(var(--forge-ember))/0.05] border border-[rgb(var(--forge-ember))/0.2]">
          <div class="flex items-center gap-2 mb-2">
            <Sparkles class="w-3 h-3 text-[rgb(var(--forge-ember))]" />
            <span class="text-xs font-semibold text-[rgb(var(--forge-ember))]">AI Suggestion</span>
          </div>
          <p class="text-xs opacity-90">{props.beat.aiSuggestions}</p>
        </div>
      </Show>
    </div>
  );
}

