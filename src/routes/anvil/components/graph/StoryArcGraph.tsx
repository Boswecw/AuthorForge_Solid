/**
 * StoryArcGraph Component
 * 
 * Main container for the Story Arc Graph visualization
 */

import { createSignal, createResource, Show, onMount } from "solid-js";
import { isServer } from "solid-js/web";
import GraphToolsPanel from "./GraphToolsPanel";
import GraphCanvas from "./GraphCanvas";
import GraphContextPanel from "./GraphContextPanel";
import ArcAnalysisPanel from "./ArcAnalysisPanel";
import {
  getStoryArcGraph,
  analyzeArcGraph,
  integrateCharacterBeats,
  updateArcPoint,
  saveStoryArcGraph
} from "../../api/mockGraphCommands";
import { getCharacterArcs } from "../../api/mockTauriCommands";
import type { StoryArcPoint, IntensityLayer, ViewMode, SmoothingMode, LayerConfig } from "../../types/graph";
import { useToast } from "~/lib/hooks/useToast";

interface StoryArcGraphProps {
  projectId?: string;
}

export default function StoryArcGraph(props: StoryArcGraphProps) {
  const toast = useToast();
  const projectId = () => props.projectId || "default-project";

  // Load graph data
  const [graphData, { refetch }] = createResource(() => getStoryArcGraph(projectId()));

  // UI State
  const [selectedPoint, setSelectedPoint] = createSignal<StoryArcPoint | null>(null);
  const [hoveredPoint, setHoveredPoint] = createSignal<StoryArcPoint | null>(null);
  const [viewMode, setViewMode] = createSignal<ViewMode>('chapters');
  const [smoothingMode, setSmoothingMode] = createSignal<SmoothingMode>('curved');
  const [povFilter, setPovFilter] = createSignal<string | undefined>(undefined);
  const [showAnalysis, setShowAnalysis] = createSignal(false);

  // Layer configuration with default colors
  const [layers, setLayers] = createSignal<LayerConfig[]>([
    { key: 'emotional', label: 'Emotional Tension', color: '#ef4444', enabled: true },
    { key: 'stakes', label: 'Stakes', color: '#f59e0b', enabled: true },
    { key: 'worldPressure', label: 'World Pressure', color: '#3b82f6', enabled: false },
    { key: 'internalConflict', label: 'Internal Conflict', color: '#a855f7', enabled: true },
    { key: 'themeResonance', label: 'Theme Resonance', color: '#10b981', enabled: false },
    { key: 'spiritualIntensity', label: 'Spiritual Intensity', color: '#fbbf24', enabled: false },
    { key: 'actionCrisis', label: 'Action/Crisis', color: '#f97316', enabled: false }
  ]);

  // Toggle layer visibility
  const toggleLayer = (key: IntensityLayer) => {
    setLayers(prev => prev.map(layer =>
      layer.key === key ? { ...layer, enabled: !layer.enabled } : layer
    ));
  };

  // Handle export
  const handleExport = (format: 'pdf' | 'png') => {
    toast.info(`Export as ${format.toUpperCase()} - Coming soon!`);
  };

  // Integrate character beats on mount
  onMount(async () => {
    if (isServer) return;

    try {
      const characterArcs = await getCharacterArcs(projectId());
      await integrateCharacterBeats(projectId(), characterArcs);
      await refetch();
    } catch (error) {
      console.error('Failed to integrate character beats:', error);
    }
  });

  // Handle AI analysis
  const handleAnalyze = async () => {
    try {
      toast.info('Analyzing story arc...');
      const graph = graphData();
      const analysis = await analyzeArcGraph(projectId(), graph || undefined);
      setShowAnalysis(true);
      toast.success(`Arc analysis complete! Score: ${analysis.overallScore}/100`);
    } catch (error) {
      console.error('Analysis failed:', error);
      toast.error('Failed to analyze arc');
    }
  };

  // Handle point click
  const handlePointClick = (point: StoryArcPoint) => {
    setSelectedPoint(point);
  };

  // Handle point update
  const handlePointUpdate = async (chapter: number, updates: Partial<StoryArcPoint>) => {
    try {
      await updateArcPoint(projectId(), chapter, updates);
      await refetch();
      toast.success('Point updated');
    } catch (error) {
      console.error('Failed to update point:', error);
      toast.error('Failed to update point');
    }
  };

  // Handle quick actions
  const handleEditInSmithy = (chapter: number) => {
    toast.info(`Navigate to Smithy - Chapter ${chapter} (Coming soon)`);
  };

  const handleEditCharacterArc = (characterId: string) => {
    toast.info(`Navigate to Character Arc - ${characterId} (Coming soon)`);
  };

  const handleAISuggest = (chapter: number) => {
    toast.info(`AI suggestions for Chapter ${chapter} (Coming soon)`);
  };

  // Filter points by POV if needed
  const filteredPoints = () => {
    const graph = graphData();
    if (!graph) return [];
    
    const pov = povFilter();
    if (!pov) return graph.points;
    
    return graph.points.filter(p => p.povCharacterId === pov);
  };

  return (
    <div class="flex h-full">
      {/* Left Tools Panel */}
      <GraphToolsPanel
        layers={layers()}
        onToggleLayer={toggleLayer}
        viewMode={viewMode()}
        onViewModeChange={setViewMode}
        smoothingMode={smoothingMode()}
        onSmoothingModeChange={setSmoothingMode}
        povFilter={povFilter()}
        onPovFilterChange={setPovFilter}
        onExport={handleExport}
        onAnalyze={handleAnalyze}
      />

      {/* Main Graph Area */}
      <div class="flex-1 relative">
        <Show
          when={!graphData.loading && graphData()}
          fallback={
            <div class="flex items-center justify-center h-full">
              <div class="text-center opacity-50">
                <p class="text-lg mb-2">Loading graph data...</p>
              </div>
            </div>
          }
        >
          {(graph) => (
            <GraphCanvas
              points={filteredPoints()}
              plotBeats={graph().plotBeats}
              layers={layers()}
              viewMode={viewMode()}
              smoothingMode={smoothingMode()}
              onPointClick={handlePointClick}
              onPointHover={setHoveredPoint}
              hoveredPoint={hoveredPoint()}
            />
          )}
        </Show>

        {/* Analysis Panel Overlay */}
        <Show when={showAnalysis()}>
          <div class="absolute top-0 right-0 w-96 h-full">
            <ArcAnalysisPanel
              projectId={projectId()}
              onClose={() => setShowAnalysis(false)}
            />
          </div>
        </Show>
      </div>

      {/* Right Context Panel */}
      <Show when={selectedPoint()}>
        <GraphContextPanel
          point={selectedPoint()}
          layers={layers()}
          onClose={() => setSelectedPoint(null)}
          onEditInSmithy={handleEditInSmithy}
          onEditCharacterArc={handleEditCharacterArc}
          onAISuggest={handleAISuggest}
          onUpdatePoint={handlePointUpdate}
        />
      </Show>
    </div>
  );
}

