import { For, Show, createSignal } from "solid-js";
import { Heart, Sword, Flame, Plus, X } from "lucide-solid";
import type { CharacterArc, ArcSection } from "../types";

interface ArcCardsProps {
  character: CharacterArc;
  onChange: (updates: Partial<CharacterArc>) => void;
}

export default function ArcCards(props: ArcCardsProps) {
  return (
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Internal Arc Card */}
      <ArcCard
        title="Internal Arc"
        subtitle="Flaw → Belief → Transformation"
        icon={Heart}
        iconColor="text-[rgb(var(--forge-ember))]"
        arc={props.character.internalArc}
        onChange={(arc) => props.onChange({ internalArc: arc })}
        description="Wound/Lie → Truth progression"
      />

      {/* External Arc Card */}
      <ArcCard
        title="External Arc"
        subtitle="Mission → Obstacles → Growth"
        icon={Sword}
        iconColor="text-[rgb(var(--forge-brass))]"
        arc={props.character.externalArc}
        onChange={(arc) => props.onChange({ externalArc: arc })}
        description="Power level, skills, relationships"
      />

      {/* Spiritual Arc Card */}
      <ArcCard
        title="Spiritual Arc"
        subtitle="Journey → Tension → Resolution"
        icon={Flame}
        iconColor="text-[rgb(var(--forge-ember))]"
        arc={props.character.spiritualArc}
        onChange={(arc) => props.onChange({ spiritualArc: arc })}
        description="Faith journey, moral choices, redemption"
      />
    </div>
  );
}

interface ArcCardProps {
  title: string;
  subtitle: string;
  icon: any;
  iconColor: string;
  arc: ArcSection;
  onChange: (arc: ArcSection) => void;
  description: string;
}

function ArcCard(props: ArcCardProps) {
  const [newKeyPoint, setNewKeyPoint] = createSignal("");

  const addKeyPoint = () => {
    const point = newKeyPoint().trim();
    if (point) {
      props.onChange({
        ...props.arc,
        keyPoints: [...props.arc.keyPoints, point]
      });
      setNewKeyPoint("");
    }
  };

  const removeKeyPoint = (index: number) => {
    props.onChange({
      ...props.arc,
      keyPoints: props.arc.keyPoints.filter((_, i) => i !== index)
    });
  };

  return (
    <div class="rounded-xl border border-[rgb(var(--forge-steel))/0.3] bg-white/60 dark:bg-white/5 p-5 shadow-card">
      {/* Header */}
      <div class="flex items-start gap-3 mb-4">
        <div class={`p-2 rounded-lg bg-gradient-to-br from-[rgb(var(--forge-ember))/0.2] to-transparent ${props.iconColor}`}>
          <props.icon class="w-5 h-5" />
        </div>
        <div class="flex-1">
          <h3 class="font-display text-lg font-semibold">{props.title}</h3>
          <p class="text-xs opacity-70">{props.subtitle}</p>
        </div>
      </div>

      {/* Summary */}
      <div class="mb-3">
        <label class="block text-xs font-semibold mb-1 opacity-70">Summary</label>
        <input
          type="text"
          value={props.arc.summary}
          onInput={(e) => props.onChange({ ...props.arc, summary: e.currentTarget.value })}
          class="w-full px-3 py-2 rounded-md border border-[rgb(var(--forge-steel))/0.3] 
                 bg-white/5 text-sm focus:outline-none focus:border-[rgb(var(--forge-brass))/0.5]"
          placeholder={props.description}
        />
      </div>

      {/* Notes */}
      <div class="mb-3">
        <label class="block text-xs font-semibold mb-1 opacity-70">Notes</label>
        <textarea
          value={props.arc.notes}
          onInput={(e) => props.onChange({ ...props.arc, notes: e.currentTarget.value })}
          rows={4}
          class="w-full px-3 py-2 rounded-md border border-[rgb(var(--forge-steel))/0.3] 
                 bg-white/5 text-sm focus:outline-none focus:border-[rgb(var(--forge-brass))/0.5] resize-none"
          placeholder="Detailed development notes..."
        />
      </div>

      {/* Key Points */}
      <div>
        <label class="block text-xs font-semibold mb-2 opacity-70">Key Transformation Points</label>
        <div class="space-y-2 mb-2">
          <For each={props.arc.keyPoints}>
            {(point, index) => (
              <div class="flex items-start gap-2 p-2 rounded-md bg-white/5 border border-[rgb(var(--forge-steel))/0.2]">
                <span class="flex-1 text-sm">{point}</span>
                <button
                  onClick={() => removeKeyPoint(index())}
                  class="flex-shrink-0 opacity-50 hover:opacity-100 hover:text-[rgb(var(--forge-ember))]"
                >
                  <X class="w-3 h-3" />
                </button>
              </div>
            )}
          </For>
        </div>

        {/* Add Key Point */}
        <div class="flex gap-2">
          <input
            type="text"
            value={newKeyPoint()}
            onInput={(e) => setNewKeyPoint(e.currentTarget.value)}
            onKeyPress={(e) => e.key === "Enter" && addKeyPoint()}
            class="flex-1 px-2 py-1 rounded-md border border-[rgb(var(--forge-steel))/0.3] 
                   bg-white/5 text-xs focus:outline-none focus:border-[rgb(var(--forge-brass))/0.5]"
            placeholder="Add key point..."
          />
          <button
            onClick={addKeyPoint}
            class="px-2 py-1 rounded-md border border-[rgb(var(--forge-brass))/0.3] 
                   hover:bg-white/5 transition-colors"
          >
            <Plus class="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

