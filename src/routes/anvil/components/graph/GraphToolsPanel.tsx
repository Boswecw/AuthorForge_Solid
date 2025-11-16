/**
 * GraphToolsPanel Component
 * 
 * Left panel with layer toggles, filters, view mode, and export controls
 */

import { For } from "solid-js";
import type { IntensityLayer, ViewMode, SmoothingMode, LayerConfig } from "../../types/graph";

interface GraphToolsPanelProps {
  layers: LayerConfig[];
  onToggleLayer: (key: IntensityLayer) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  smoothingMode: SmoothingMode;
  onSmoothingModeChange: (mode: SmoothingMode) => void;
  povFilter?: string;
  onPovFilterChange: (povId: string | undefined) => void;
  onExport: (format: 'pdf' | 'png') => void;
  onAnalyze: () => void;
}

export default function GraphToolsPanel(props: GraphToolsPanelProps) {
  return (
    <div class="space-y-6 p-4 bg-[var(--bg)] border-r border-[var(--forge-steel)]">
      {/* Layer Toggles */}
      <section>
        <h4 class="font-semibold mb-3 text-sm uppercase tracking-wide opacity-70">
          Intensity Layers
        </h4>
        <div class="space-y-2">
          <For each={props.layers}>
            {(layer) => (
              <label class="flex items-center gap-2 cursor-pointer hover:opacity-100 transition-opacity">
                <input
                  type="checkbox"
                  checked={layer.enabled}
                  onChange={() => props.onToggleLayer(layer.key)}
                  class="w-4 h-4 rounded border-[var(--forge-steel)] bg-[var(--bg)] checked:bg-[var(--forge-brass)] focus:ring-2 focus:ring-[var(--forge-brass)]"
                />
                <div
                  class="w-3 h-3 rounded-full"
                  style={{ "background-color": layer.color }}
                />
                <span class="text-sm">{layer.label}</span>
              </label>
            )}
          </For>
        </div>
      </section>

      {/* View Mode */}
      <section>
        <h4 class="font-semibold mb-3 text-sm uppercase tracking-wide opacity-70">
          X-Axis View
        </h4>
        <div class="space-y-2">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="viewMode"
              checked={props.viewMode === 'chapters'}
              onChange={() => props.onViewModeChange('chapters')}
              class="w-4 h-4"
            />
            <span class="text-sm">Chapters</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="viewMode"
              checked={props.viewMode === 'acts'}
              onChange={() => props.onViewModeChange('acts')}
              class="w-4 h-4"
            />
            <span class="text-sm">Acts</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="viewMode"
              checked={props.viewMode === 'wordCount'}
              onChange={() => props.onViewModeChange('wordCount')}
              class="w-4 h-4"
            />
            <span class="text-sm">% Word Count</span>
          </label>
        </div>
      </section>

      {/* Arc Smoothing */}
      <section>
        <h4 class="font-semibold mb-3 text-sm uppercase tracking-wide opacity-70">
          Arc Smoothing
        </h4>
        <select
          value={props.smoothingMode}
          onChange={(e) => props.onSmoothingModeChange(e.currentTarget.value as SmoothingMode)}
          class="w-full px-3 py-2 bg-[var(--bg)] border border-[var(--forge-steel)] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[var(--forge-brass)]"
        >
          <option value="linear">Linear</option>
          <option value="curved">Curved (Smooth)</option>
          <option value="stepped">Stepped</option>
        </select>
      </section>

      {/* POV Filter */}
      <section>
        <h4 class="font-semibold mb-3 text-sm uppercase tracking-wide opacity-70">
          POV Filter
        </h4>
        <select
          value={props.povFilter || 'all'}
          onChange={(e) => {
            const value = e.currentTarget.value;
            props.onPovFilterChange(value === 'all' ? undefined : value);
          }}
          class="w-full px-3 py-2 bg-[var(--bg)] border border-[var(--forge-steel)] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[var(--forge-brass)]"
        >
          <option value="all">All POVs</option>
          <option value="char-1">Rawn Mortisimus</option>
          <option value="char-2">Father Aldric</option>
        </select>
      </section>

      {/* Actions */}
      <section class="space-y-2">
        <button
          onClick={props.onAnalyze}
          class="w-full px-4 py-2 bg-[var(--forge-brass)] text-[var(--bg)] rounded font-semibold hover:opacity-90 transition-opacity text-sm"
        >
          🔍 Analyze Arc
        </button>
        
        <button
          onClick={() => props.onExport('png')}
          class="w-full px-4 py-2 border border-[var(--forge-steel)] rounded font-semibold hover:bg-[var(--forge-steel)] hover:bg-opacity-20 transition-all text-sm"
        >
          📊 Export as PNG
        </button>
        
        <button
          onClick={() => props.onExport('pdf')}
          class="w-full px-4 py-2 border border-[var(--forge-steel)] rounded font-semibold hover:bg-[var(--forge-steel)] hover:bg-opacity-20 transition-all text-sm"
        >
          📄 Export as PDF
        </button>
      </section>
    </div>
  );
}

