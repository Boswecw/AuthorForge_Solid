import { createSignal, createResource, Show, onMount, createEffect } from "solid-js";
import { isServer } from "solid-js/web";
import ForgeShell from "~/components/ForgeShell";
import CharacterList from "./components/CharacterList";
import CharacterHeader from "./components/CharacterHeader";
import ArcCards from "./components/ArcCards";
import BeatTimeline from "./components/BeatTimeline";
import CrossLinks from "./components/CrossLinks";
import BeatEditor from "./components/BeatEditor";
import StoryArcGraph from "./components/graph/StoryArcGraph";
import type { CharacterArc, ArcBeat } from "./types";
import { getCharacterArcs, saveCharacterArc, deleteCharacterArc } from "./api/mockTauriCommands";
import { useToast } from "~/lib/hooks/useToast";
import { validateCharacterArc, getValidationErrorMessage } from "~/lib/validation/characterArcValidation";

type AnvilTab = 'arcs' | 'beats' | 'graph';

export default function Anvil() {
  // SSR guard for client-only operations
  onMount(() => {
    if (isServer) return;
  });

  const toast = useToast();

  // Tab state - persist in localStorage
  const [activeTab, setActiveTab] = createSignal<AnvilTab>('arcs');

  // Load active tab from localStorage on mount
  onMount(() => {
    if (isServer) return;
    const savedTab = localStorage.getItem('anvil-active-tab') as AnvilTab;
    if (savedTab && ['arcs', 'beats', 'graph'].includes(savedTab)) {
      setActiveTab(savedTab);
    }
  });

  // Save active tab to localStorage when it changes
  createEffect(() => {
    if (isServer) return;
    localStorage.setItem('anvil-active-tab', activeTab());
  });

  // State
  const [selectedCharacterId, setSelectedCharacterId] = createSignal<string | undefined>();
  const [editingBeat, setEditingBeat] = createSignal<ArcBeat | null>(null);
  const [isBeatEditorOpen, setIsBeatEditorOpen] = createSignal(false);

  // Load character arcs
  // TODO: Get projectId from route params or global state
  const projectId = "default-project";
  const [characterArcs, { refetch }] = createResource(() => getCharacterArcs(projectId));

  // Get selected character
  const selectedCharacter = () => {
    const id = selectedCharacterId();
    if (!id) return null;
    return characterArcs()?.find(arc => arc.id === id) || null;
  };

  // Auto-select first character on load
  onMount(() => {
    if (isServer) return;
    
    const checkAndSelect = () => {
      const arcs = characterArcs();
      if (arcs && arcs.length > 0 && !selectedCharacterId()) {
        setSelectedCharacterId(arcs[0].id);
      }
    };
    
    // Check immediately and after a short delay
    checkAndSelect();
    setTimeout(checkAndSelect, 100);
  });

  // Handle character updates
  const handleCharacterUpdate = async (updates: Partial<CharacterArc>) => {
    const character = selectedCharacter();
    if (!character) return;

    const updatedCharacter = { ...character, ...updates };

    // Validate before saving
    const validation = validateCharacterArc(updatedCharacter);
    if (!validation.valid) {
      const errorMsg = getValidationErrorMessage(validation);
      toast.error(errorMsg);
      return;
    }

    try {
      await saveCharacterArc(updatedCharacter);
      await refetch();
      toast.success("Character updated");
    } catch (error) {
      console.error("Failed to save character:", error);
      toast.error("Failed to save character");
    }
  };

  // Handle beat editing
  const handleEditBeat = (beat: ArcBeat) => {
    setEditingBeat(beat);
    setIsBeatEditorOpen(true);
  };

  const handleSaveBeat = async (updatedBeat: ArcBeat) => {
    const character = selectedCharacter();
    if (!character) return;

    const updatedBeats = character.beats.map(b => 
      b.id === updatedBeat.id ? updatedBeat : b
    );

    await handleCharacterUpdate({ beats: updatedBeats });
  };

  const handleDeleteBeat = async (beatId: string) => {
    const character = selectedCharacter();
    if (!character) return;

    const updatedBeats = character.beats.filter(b => b.id !== beatId);
    await handleCharacterUpdate({ beats: updatedBeats });
  };

  // Handle AI assist
  const handleAIAssist = (beat: ArcBeat) => {
    handleEditBeat(beat);
  };

  // Handle add new character
  const handleAddNewCharacter = async () => {
    const newCharacter: CharacterArc = {
      id: `char-${Date.now()}`,
      name: "New Character",
      bio: "",
      species: "Human",
      role: "Support",
      povStatus: "Non-POV",
      status: "Alive",
      emotionalTags: [],
      internalArc: { summary: "", notes: "", keyPoints: [] },
      externalArc: { summary: "", notes: "", keyPoints: [] },
      spiritualArc: { summary: "", notes: "", keyPoints: [] },
      beats: [],
      relationships: [],
      projectId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await saveCharacterArc(newCharacter);
      await refetch();
      setSelectedCharacterId(newCharacter.id);
      toast.success("New character created");
    } catch (error) {
      console.error("Failed to create character:", error);
      toast.error("Failed to create character");
    }
  };

  // Handle delete character
  const handleDeleteCharacter = async (characterId: string) => {
    try {
      const success = await deleteCharacterArc(characterId);
      if (success) {
        await refetch();
        // If deleted character was selected, clear selection
        if (selectedCharacterId() === characterId) {
          setSelectedCharacterId(undefined);
        }
        toast.success("Character deleted");
      } else {
        toast.error("Failed to delete character");
      }
    } catch (error) {
      console.error("Failed to delete character:", error);
      toast.error("Failed to delete character");
    }
  };

  // Right panel content
  const RightPanel = (
    <div class="space-y-4">
      <section>
        <h4 class="font-semibold mb-2">The Anvil</h4>
        <p class="text-sm opacity-90 mb-3">
          Track character arcs across internal, external, and spiritual dimensions.
          Map beats to chapters and use AI assistance for brainstorming.
        </p>
      </section>
      <section>
        <h4 class="font-semibold mb-2">Arc Types</h4>
        <ul class="space-y-2 text-sm opacity-90">
          <li><strong>Internal:</strong> Flaw → Belief → Transformation</li>
          <li><strong>External:</strong> Mission → Obstacles → Growth</li>
          <li><strong>Spiritual:</strong> Journey → Tension → Resolution</li>
        </ul>
      </section>
      <section>
        <h4 class="font-semibold mb-2">Tips</h4>
        <ul class="ml-5 list-disc space-y-1 text-sm opacity-90">
          <li>Use emotional tags to guide AI tone</li>
          <li>Link beats to specific chapters</li>
          <li>Track relationships for consistency</li>
          <li>Preserve spiritual arc details for faith themes</li>
        </ul>
      </section>
    </div>
  );

  // Tab navigation component
  const TabNav = () => (
    <div class="flex gap-2 mb-6 border-b border-[var(--forge-steel)]">
      <button
        class={`px-4 py-2 font-semibold transition-all ${
          activeTab() === 'arcs'
            ? 'border-b-2 border-[var(--forge-brass)] text-[var(--forge-brass)]'
            : 'text-[var(--fg)] opacity-60 hover:opacity-100'
        }`}
        onClick={() => setActiveTab('arcs')}
      >
        Character Arcs
      </button>
      <button
        class={`px-4 py-2 font-semibold transition-all ${
          activeTab() === 'beats'
            ? 'border-b-2 border-[var(--forge-brass)] text-[var(--forge-brass)]'
            : 'text-[var(--fg)] opacity-60 hover:opacity-100'
        }`}
        onClick={() => setActiveTab('beats')}
      >
        Beats
      </button>
      <button
        class={`px-4 py-2 font-semibold transition-all ${
          activeTab() === 'graph'
            ? 'border-b-2 border-[var(--forge-brass)] text-[var(--forge-brass)]'
            : 'text-[var(--fg)] opacity-60 hover:opacity-100'
        }`}
        onClick={() => setActiveTab('graph')}
      >
        Graph
      </button>
    </div>
  );

  // Character Arcs view (existing content)
  const CharacterArcsView = () => (
    <Show
      when={selectedCharacter()}
      fallback={
        <div class="flex items-center justify-center h-full">
          <div class="text-center opacity-50">
            <p class="text-lg mb-2">No character selected</p>
            <p class="text-sm">Select a character from the left panel or create a new one</p>
          </div>
        </div>
      }
    >
      {(character) => (
        <div class="space-y-6">
          <CharacterHeader
            character={character()}
            onChange={handleCharacterUpdate}
          />

          <ArcCards
            character={character()}
            onChange={handleCharacterUpdate}
          />

          <BeatTimeline
            character={character()}
            onChange={handleCharacterUpdate}
            onEditBeat={handleEditBeat}
            onAIAssist={handleAIAssist}
          />

          <CrossLinks character={character()} />
        </div>
      )}
    </Show>
  );

  // Beats view (placeholder for now)
  const BeatsView = () => (
    <div class="flex items-center justify-center h-full">
      <div class="text-center opacity-50">
        <p class="text-lg mb-2">Beats View</p>
        <p class="text-sm">Coming soon - Unified beat timeline across all characters</p>
      </div>
    </div>
  );

  // Graph view
  const GraphView = () => <StoryArcGraph projectId={projectId} />;

  return (
    <>
      <ForgeShell
        title="The Anvil"
        rightPanel={RightPanel}
        leftPanel={
          activeTab() === 'arcs' ? (
            <CharacterList
              characters={characterArcs() || []}
              selectedId={selectedCharacterId()}
              onSelect={setSelectedCharacterId}
              onAddNew={handleAddNewCharacter}
              onDelete={handleDeleteCharacter}
            />
          ) : null
        }
      >
        <TabNav />

        <Show when={activeTab() === 'arcs'}>
          <CharacterArcsView />
        </Show>

        <Show when={activeTab() === 'beats'}>
          <BeatsView />
        </Show>

        <Show when={activeTab() === 'graph'}>
          <GraphView />
        </Show>
      </ForgeShell>

      {/* Beat Editor Modal */}
      <Show when={selectedCharacter()}>
        {(character) => (
          <BeatEditor
            beat={editingBeat()}
            character={character()}
            isOpen={isBeatEditorOpen()}
            onClose={() => setIsBeatEditorOpen(false)}
            onSave={handleSaveBeat}
            onDelete={handleDeleteBeat}
          />
        )}
      </Show>
    </>
  );
}

