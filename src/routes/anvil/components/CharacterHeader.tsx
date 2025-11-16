import { createSignal, For, Show } from "solid-js";
import { User, X, Plus } from "lucide-solid";
import type { CharacterArc, ArcRole, POVStatus, CharacterStatus } from "../types";

interface CharacterHeaderProps {
  character: CharacterArc;
  onChange: (updates: Partial<CharacterArc>) => void;
}

export default function CharacterHeader(props: CharacterHeaderProps) {
  const [newTag, setNewTag] = createSignal("");

  const addEmotionalTag = () => {
    const tag = newTag().trim();
    if (tag && !props.character.emotionalTags.includes(tag)) {
      props.onChange({
        emotionalTags: [...props.character.emotionalTags, tag]
      });
      setNewTag("");
    }
  };

  const removeEmotionalTag = (tag: string) => {
    props.onChange({
      emotionalTags: props.character.emotionalTags.filter(t => t !== tag)
    });
  };

  return (
    <div class="rounded-xl border border-[rgb(var(--forge-steel))/0.3] bg-white/60 dark:bg-white/5 p-6 shadow-card">
      <div class="flex gap-6">
        {/* Portrait */}
        <div class="flex-shrink-0">
          <div class="w-32 h-32 rounded-lg border-2 border-[rgb(var(--forge-brass))/0.3] 
                      bg-gradient-to-br from-[rgb(var(--forge-ember))/0.1] to-transparent
                      flex items-center justify-center overflow-hidden">
            <Show
              when={props.character.portraitUrl}
              fallback={<User class="w-16 h-16 opacity-30" />}
            >
              <img 
                src={props.character.portraitUrl} 
                alt={props.character.name}
                class="w-full h-full object-cover"
              />
            </Show>
          </div>
          <button class="mt-2 text-xs text-[rgb(var(--forge-brass))] hover:underline w-full text-center">
            Upload Portrait
          </button>
        </div>

        {/* Metadata Fields */}
        <div class="flex-1 grid grid-cols-2 gap-4">
          {/* Name */}
          <div class="col-span-2">
            <label class="block text-sm font-semibold mb-1">Name</label>
            <input
              type="text"
              value={props.character.name}
              onInput={(e) => props.onChange({ name: e.currentTarget.value })}
              class="w-full px-3 py-2 rounded-md border border-[rgb(var(--forge-steel))/0.3] 
                     bg-white/5 font-display text-lg focus:outline-none focus:border-[rgb(var(--forge-brass))/0.5]"
              placeholder="Character name"
            />
          </div>

          {/* Alias */}
          <div>
            <label class="block text-sm font-semibold mb-1">Alias</label>
            <input
              type="text"
              value={props.character.alias || ""}
              onInput={(e) => props.onChange({ alias: e.currentTarget.value })}
              class="w-full px-3 py-2 rounded-md border border-[rgb(var(--forge-steel))/0.3] 
                     bg-white/5 text-sm focus:outline-none focus:border-[rgb(var(--forge-brass))/0.5]"
              placeholder="Nickname or alias"
            />
          </div>

          {/* Title */}
          <div>
            <label class="block text-sm font-semibold mb-1">Title</label>
            <input
              type="text"
              value={props.character.title || ""}
              onInput={(e) => props.onChange({ title: e.currentTarget.value })}
              class="w-full px-3 py-2 rounded-md border border-[rgb(var(--forge-steel))/0.3] 
                     bg-white/5 text-sm focus:outline-none focus:border-[rgb(var(--forge-brass))/0.5]"
              placeholder="e.g., Captain, King"
            />
          </div>

          {/* Species */}
          <div>
            <label class="block text-sm font-semibold mb-1">Species</label>
            <input
              type="text"
              value={props.character.species}
              onInput={(e) => props.onChange({ species: e.currentTarget.value })}
              class="w-full px-3 py-2 rounded-md border border-[rgb(var(--forge-steel))/0.3] 
                     bg-white/5 text-sm focus:outline-none focus:border-[rgb(var(--forge-brass))/0.5]"
              placeholder="e.g., Human, Elf"
            />
          </div>

          {/* Age */}
          <div>
            <label class="block text-sm font-semibold mb-1">Age</label>
            <input
              type="number"
              value={props.character.age || ""}
              onInput={(e) => props.onChange({ age: parseInt(e.currentTarget.value) || undefined })}
              class="w-full px-3 py-2 rounded-md border border-[rgb(var(--forge-steel))/0.3] 
                     bg-white/5 text-sm focus:outline-none focus:border-[rgb(var(--forge-brass))/0.5]"
              placeholder="Age"
            />
          </div>

          {/* Faction */}
          <div>
            <label class="block text-sm font-semibold mb-1">Faction</label>
            <input
              type="text"
              value={props.character.faction || ""}
              onInput={(e) => props.onChange({ faction: e.currentTarget.value })}
              class="w-full px-3 py-2 rounded-md border border-[rgb(var(--forge-steel))/0.3] 
                     bg-white/5 text-sm focus:outline-none focus:border-[rgb(var(--forge-brass))/0.5]"
              placeholder="Group or organization"
            />
          </div>

          {/* Role */}
          <div>
            <label class="block text-sm font-semibold mb-1">Role</label>
            <select
              value={props.character.role}
              onChange={(e) => props.onChange({ role: e.currentTarget.value as ArcRole })}
              class="w-full px-3 py-2 rounded-md border border-[rgb(var(--forge-steel))/0.3] 
                     bg-white/5 text-sm focus:outline-none focus:border-[rgb(var(--forge-brass))/0.5]"
            >
              <option value="Protagonist">Protagonist</option>
              <option value="Antagonist">Antagonist</option>
              <option value="Support">Support</option>
              <option value="Mentor">Mentor</option>
              <option value="Foil">Foil</option>
              <option value="Love Interest">Love Interest</option>
              <option value="Comic Relief">Comic Relief</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bio */}
      <div class="mt-4">
        <label class="block text-sm font-semibold mb-1">Biography</label>
        <textarea
          value={props.character.bio}
          onInput={(e) => props.onChange({ bio: e.currentTarget.value })}
          rows={3}
          class="w-full px-3 py-2 rounded-md border border-[rgb(var(--forge-steel))/0.3] 
                 bg-white/5 text-sm focus:outline-none focus:border-[rgb(var(--forge-brass))/0.5] resize-none"
          placeholder="Character backstory and summary..."
        />
      </div>

      {/* Emotional Tags */}
      <div class="mt-4">
        <label class="block text-sm font-semibold mb-2">Emotional Keywords (for AI tone guidance)</label>
        <div class="flex flex-wrap gap-2 mb-2">
          <For each={props.character.emotionalTags}>
            {(tag) => (
              <span class="inline-flex items-center gap-1 px-2 py-1 rounded-md 
                           bg-[rgb(var(--forge-brass))/0.15] text-sm border border-[rgb(var(--forge-brass))/0.3]">
                {tag}
                <button
                  onClick={() => removeEmotionalTag(tag)}
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
            value={newTag()}
            onInput={(e) => setNewTag(e.currentTarget.value)}
            onKeyPress={(e) => e.key === "Enter" && addEmotionalTag()}
            class="flex-1 px-3 py-1 rounded-md border border-[rgb(var(--forge-steel))/0.3] 
                   bg-white/5 text-sm focus:outline-none focus:border-[rgb(var(--forge-brass))/0.5]"
            placeholder="Add tag (e.g., brooding, hopeful)"
          />
          <button
            onClick={addEmotionalTag}
            class="px-3 py-1 rounded-md border border-[rgb(var(--forge-brass))/0.3] 
                   hover:bg-white/5 transition-colors"
          >
            <Plus class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

