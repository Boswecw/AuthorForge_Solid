/**
 * GraphCanvas Component
 *
 * Renders the actual graph using Recharts
 */

import { createMemo, For, Show } from "solid-js";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Dot
} from "recharts";
import type { StoryArcPoint, PlotBeat, LayerConfig, ViewMode } from "../../types/graph";

interface GraphCanvasProps {
  points: StoryArcPoint[];
  plotBeats: PlotBeat[];
  layers: LayerConfig[];
  viewMode: ViewMode;
  smoothingMode: 'linear' | 'curved' | 'stepped';
  onPointClick: (point: StoryArcPoint) => void;
  onPointHover: (point: StoryArcPoint | null) => void;
  hoveredPoint: StoryArcPoint | null;
}

export default function GraphCanvas(props: GraphCanvasProps) {
  // Transform data for Recharts
  const chartData = createMemo(() => {
    return props.points.map(point => {
      let xValue: number | string;
      if (props.viewMode === 'chapters') {
        xValue = point.chapter;
      } else if (props.viewMode === 'acts') {
        xValue = `Act ${point.act}`;
      } else {
        xValue = Math.round(point.wordCountPercent);
      }

      return {
        x: xValue,
        chapter: point.chapter,
        emotional: point.emotional,
        stakes: point.stakes,
        worldPressure: point.worldPressure,
        internalConflict: point.internalConflict,
        themeResonance: point.themeResonance,
        spiritualIntensity: point.spiritualIntensity,
        actionCrisis: point.actionCrisis,
        _originalPoint: point
      };
    });
  });

  // Get enabled layers
  const enabledLayers = createMemo(() => props.layers.filter(l => l.enabled));

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const point = data._originalPoint as StoryArcPoint;

      return (
        <div class="bg-[var(--bg)] border border-[var(--forge-steel)] p-3 rounded shadow-lg">
          <p class="font-semibold text-[var(--forge-brass)] mb-2">
            {point.chapterTitle || `Chapter ${point.chapter}`}
          </p>
          <p class="text-xs opacity-70 mb-2">Act {point.act}</p>
          <div class="space-y-1">
            <For each={payload}>
              {(entry: any) => (
                <div class="flex items-center justify-between gap-4 text-sm">
                  <div class="flex items-center gap-2">
                    <div
                      class="w-3 h-3 rounded-full"
                      style={{ "background-color": entry.color }}
                    />
                    <span>{entry.name}</span>
                  </div>
                  <span class="font-semibold">{entry.value}/100</span>
                </div>
              )}
            </For>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom dot for plot beats
  const CustomDot = (dotProps: any) => {
    const { cx, cy, payload } = dotProps;
    const point = payload._originalPoint as StoryArcPoint;
    const plotBeat = props.plotBeats.find(b => b.chapter === point.chapter);

    if (plotBeat) {
      return (
        <g>
          <circle
            cx={cx}
            cy={cy}
            r={8}
            fill="var(--forge-brass)"
            stroke="var(--bg)"
            stroke-width={2}
            class="cursor-pointer"
          />
          <text
            x={cx}
            y={cy - 15}
            text-anchor="middle"
            fill="var(--forge-brass)"
            font-size="10"
            font-weight="bold"
          >
            {plotBeat.icon === 'zap' ? '⚡' :
             plotBeat.icon === 'arrow-right' ? '→' :
             plotBeat.icon === 'rotate-cw' ? '↻' :
             plotBeat.icon === 'moon' ? '🌙' :
             plotBeat.icon === 'flame' ? '🔥' :
             plotBeat.icon === 'check-circle' ? '✓' : '●'}
          </text>
        </g>
      );
    }

    return (
      <circle
        cx={cx}
        cy={cy}
        r={4}
        fill={dotProps.fill}
        opacity={0.6}
        class="cursor-pointer hover:opacity-100 transition-opacity"
      />
    );
  };

  // Curve type based on smoothing mode
  const curveType = createMemo(() => {
    if (props.smoothingMode === 'curved') return 'monotone';
    if (props.smoothingMode === 'stepped') return 'step';
    return 'linear';
  });

  // X-axis label
  const xAxisLabel = createMemo(() => {
    if (props.viewMode === 'chapters') return 'Chapters';
    if (props.viewMode === 'acts') return 'Acts';
    return '% Word Count';
  });

  return (
    <div class="w-full h-full bg-[var(--bg)] p-8">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData()}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          onClick={(data) => {
            if (data && data.activePayload && data.activePayload[0]) {
              const point = data.activePayload[0].payload._originalPoint;
              props.onPointClick(point);
            }
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--forge-steel)" opacity={0.2} />

          <XAxis
            dataKey="x"
            stroke="var(--fg)"
            tick={{ fill: 'var(--fg)' }}
            label={{ value: xAxisLabel(), position: 'insideBottom', offset: -10, fill: 'var(--fg)' }}
          />

          <YAxis
            domain={[0, 100]}
            stroke="var(--fg)"
            tick={{ fill: 'var(--fg)' }}
            label={{ value: 'Intensity (0-100)', angle: -90, position: 'insideLeft', fill: 'var(--fg)' }}
          />

          <Tooltip content={<CustomTooltip />} />

          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="line"
          />

          {/* Act dividers */}
          <Show when={props.viewMode === 'chapters'}>
            <ReferenceLine
              x={7}
              stroke="var(--forge-brass)"
              strokeDasharray="8 4"
              strokeWidth={2}
              opacity={0.5}
              label={{ value: 'Act I → II', position: 'top', fill: 'var(--forge-brass)', fontSize: 12 }}
            />
            <ReferenceLine
              x={22}
              stroke="var(--forge-brass)"
              strokeDasharray="8 4"
              strokeWidth={2}
              opacity={0.5}
              label={{ value: 'Act II → III', position: 'top', fill: 'var(--forge-brass)', fontSize: 12 }}
            />
          </Show>

          {/* Lines for each enabled layer */}
          <For each={enabledLayers()}>
            {(layer) => (
              <Line
                type={curveType()}
                dataKey={layer.key}
                name={layer.label}
                stroke={layer.color}
                strokeWidth={2}
                dot={<CustomDot />}
                activeDot={{ r: 6 }}
              />
            )}
          </For>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

