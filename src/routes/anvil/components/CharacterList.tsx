import { createSignal, For, Show } from "solid-js";
import { Search, Plus, Filter, Trash2 } from "lucide-solid";
import type { CharacterArc, CharacterFilter, ArcRole, POVStatus, CharacterStatus } from "../types";

interface CharacterListProps {
  characters: CharacterArc[];
  selectedId?: string;
  onSelect: (id: string) => void;
  onAddNew: () => void;
  onDelete?: (id: string) => void;
}

export default function CharacterList(props: CharacterListProps) {
  const [searchQuery, setSearchQuery] = createSignal("");
  const [showFilters, setShowFilters] = createSignal(false);
  const [filters, setFilters] = createSignal<CharacterFilter>({});

  // Filter characters based on search and filters
  const filteredCharacters = () => {
    let result = props.characters;
    
    // Search filter
    const query = searchQuery().toLowerCase();
    if (query) {
      result = result.filter(char => 
        char.name.toLowerCase().includes(query) ||
        char.alias?.toLowerCase().includes(query) ||
        char.bio.toLowerCase().includes(query)
      );
    }
    
    // Role filter
    if (filters().role) {
      result = result.filter(char => char.role === filters().role);
    }
    
    // POV filter
    if (filters().povStatus) {
      result = result.filter(char => char.povStatus === filters().povStatus);
    }
    
    // Status filter
    if (filters().status) {
      result = result.filter(char => char.status === filters().status);
    }
    
    // Species filter
    if (filters().species) {
      result = result.filter(char => char.species === filters().species);
    }
    
    // Faction filter
    if (filters().faction) {
      result = result.filter(char => char.faction === filters().faction);
    }
    
    return result;
  };

  return (
    <div class="flex flex-col h-full bg-[rgb(var(--bg))] border-r border-[rgb(var(--forge-steel))/0.2]">
      {/* Header */}
      <div class="p-4 border-b border-[rgb(var(--forge-steel))/0.2]">
        <h2 class="font-display text-lg mb-3 text-[rgb(var(--forge-brass))]">Characters</h2>
        
        {/* Search */}
        <div class="relative mb-2">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" />
          <input
            type="text"
            placeholder="Search characters..."
            value={searchQuery()}
            onInput={(e) => setSearchQuery(e.currentTarget.value)}
            class="w-full pl-10 pr-3 py-2 rounded-md border border-[rgb(var(--forge-steel))/0.3] 
                   bg-white/5 text-sm focus:outline-none focus:border-[rgb(var(--forge-brass))/0.5]"
          />
        </div>
        
        {/* Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters())}
          class="flex items-center gap-2 text-sm opacity-70 hover:opacity-100 transition-opacity"
        >
          <Filter class="w-4 h-4" />
          <span>Filters</span>
        </button>
        
        {/* Filter Panel */}
        <Show when={showFilters()}>
          <div class="mt-3 p-3 rounded-md bg-white/5 border border-[rgb(var(--forge-steel))/0.2] space-y-2">
            <FilterSelect
              label="Role"
              value={filters().role}
              options={["Protagonist", "Antagonist", "Support", "Mentor", "Foil", "Love Interest", "Comic Relief", "Other"]}
              onChange={(val) => setFilters({ ...filters(), role: val as ArcRole })}
            />
            <FilterSelect
              label="POV"
              value={filters().povStatus}
              options={["POV", "Non-POV", "Occasional POV"]}
              onChange={(val) => setFilters({ ...filters(), povStatus: val as POVStatus })}
            />
            <FilterSelect
              label="Status"
              value={filters().status}
              options={["Alive", "Dead", "Unknown", "Undead"]}
              onChange={(val) => setFilters({ ...filters(), status: val as CharacterStatus })}
            />
            <button
              onClick={() => setFilters({})}
              class="text-xs text-[rgb(var(--forge-brass))] hover:underline"
            >
              Clear Filters
            </button>
          </div>
        </Show>
      </div>

      {/* Character List */}
      <div class="flex-1 overflow-y-auto p-2">
        <For each={filteredCharacters()}>
          {(character) => (
            <div class="relative group mb-1">
              <button
                onClick={() => props.onSelect(character.id)}
                class={[
                  "w-full text-left p-3 rounded-md transition-all",
                  props.selectedId === character.id
                    ? "bg-gradient-to-r from-[rgb(var(--forge-ember))/0.2] to-transparent border border-[rgb(var(--forge-brass))/0.3] shadow-ember"
                    : "hover:bg-white/5 border border-transparent"
                ].join(" ")}
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1 min-w-0 pr-8">
                    <h3 class="font-semibold truncate">{character.name}</h3>
                    <Show when={character.alias}>
                      <p class="text-xs opacity-60 truncate">"{character.alias}"</p>
                    </Show>
                    <p class="text-xs opacity-70 mt-1">{character.role} • {character.species}</p>
                  </div>
                  <Show when={character.povStatus === "POV"}>
                    <span class="text-[0.65rem] px-2 py-0.5 rounded bg-[rgb(var(--forge-brass))/0.2] text-[rgb(var(--forge-brass))]">
                      POV
                    </span>
                  </Show>
                </div>
              </button>

              {/* Delete Button */}
              <Show when={props.onDelete}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`Delete "${character.name}"?`)) {
                      props.onDelete?.(character.id);
                    }
                  }}
                  class="absolute top-2 right-2 p-1.5 rounded opacity-0 group-hover:opacity-100
                         hover:bg-red-500/20 hover:text-red-400 transition-all"
                  title="Delete character"
                >
                  <Trash2 class="w-3.5 h-3.5" />
                </button>
              </Show>
            </div>
          )}
        </For>
        
        <Show when={filteredCharacters().length === 0}>
          <div class="text-center py-8 opacity-50 text-sm">
            No characters found
          </div>
        </Show>
      </div>

      {/* Add New Button */}
      <div class="p-4 border-t border-[rgb(var(--forge-steel))/0.2]">
        <button
          onClick={props.onAddNew}
          class="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md
                 bg-gradient-to-b from-[rgb(var(--forge-ember))/0.2] to-transparent
                 border border-[rgb(var(--forge-brass))/0.3] shadow-ember
                 hover:from-[rgb(var(--forge-ember))/0.3] transition-all"
        >
          <Plus class="w-4 h-4" />
          <span class="font-semibold">Add Character</span>
        </button>
      </div>
    </div>
  );
}

function FilterSelect(props: {
  label: string;
  value?: string;
  options: string[];
  onChange: (value: string | undefined) => void;
}) {
  return (
    <div>
      <label class="text-xs opacity-70 mb-1 block">{props.label}</label>
      <select
        value={props.value || ""}
        onChange={(e) => props.onChange(e.currentTarget.value || undefined)}
        class="w-full px-2 py-1 rounded text-sm border border-[rgb(var(--forge-steel))/0.3] 
               bg-white/5 focus:outline-none focus:border-[rgb(var(--forge-brass))/0.5]"
      >
        <option value="">All</option>
        <For each={props.options}>
          {(option) => <option value={option}>{option}</option>}
        </For>
      </select>
    </div>
  );
}

