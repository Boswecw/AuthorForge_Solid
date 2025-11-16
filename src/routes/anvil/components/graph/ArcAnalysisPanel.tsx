/**
 * ArcAnalysisPanel Component
 * 
 * Displays AI diagnostic results and suggestions
 */

import { createResource, Show, For } from "solid-js";
import { X, AlertCircle, TrendingUp, Zap } from "lucide-solid";
import { analyzeArcGraph } from "../../api/mockGraphCommands";

interface ArcAnalysisPanelProps {
  projectId?: string;
  onClose: () => void;
}

export default function ArcAnalysisPanel(props: ArcAnalysisPanelProps) {
  const projectId = () => props.projectId || "default-project";
  const [analysis] = createResource(() => analyzeArcGraph(projectId()));

  return (
    <div class="h-full bg-[var(--bg)] border-l border-[var(--forge-steel)] p-6 space-y-6 overflow-y-auto shadow-2xl">
      {/* Header */}
      <div class="flex items-start justify-between">
        <div>
          <h3 class="text-xl font-bold text-[var(--forge-brass)] flex items-center gap-2">
            <Zap size={24} />
            Arc Analysis
          </h3>
          <p class="text-sm opacity-70 mt-1">AI-powered story structure insights</p>
        </div>
        <button
          onClick={props.onClose}
          class="p-1 hover:bg-[var(--forge-steel)] hover:bg-opacity-20 rounded transition-all"
        >
          <X size={20} />
        </button>
      </div>

      <Show
        when={!analysis.loading && analysis()}
        fallback={
          <div class="flex items-center justify-center h-64">
            <div class="text-center opacity-50">
              <p class="text-sm">Analyzing your story arc...</p>
            </div>
          </div>
        }
      >
        {(data) => (
          <>
            {/* Overall Score */}
            <section class="p-4 bg-[var(--forge-brass)] bg-opacity-10 rounded border border-[var(--forge-brass)]">
              <div class="flex items-center justify-between mb-2">
                <h4 class="font-semibold text-[var(--forge-brass)]">Overall Score</h4>
                <span class="text-3xl font-bold text-[var(--forge-brass)]">
                  {data().overallScore}/100
                </span>
              </div>
              <div class="w-full bg-[var(--bg)] rounded-full h-2">
                <div
                  class="bg-[var(--forge-brass)] h-2 rounded-full transition-all"
                  style={{ width: `${data().overallScore}%` }}
                />
              </div>
            </section>

            {/* Summary */}
            <section>
              <h4 class="font-semibold mb-2 text-sm uppercase tracking-wide opacity-70">
                Summary
              </h4>
              <p class="text-sm opacity-90 leading-relaxed">{data().summary}</p>
            </section>

            {/* Flat Arcs */}
            <Show when={data().flatArcs.length > 0}>
              <section>
                <h4 class="font-semibold mb-3 text-sm uppercase tracking-wide opacity-70 flex items-center gap-2">
                  <TrendingUp size={16} />
                  Flat Arc Sections
                </h4>
                <div class="space-y-3">
                  <For each={data().flatArcs}>
                    {(issue) => (
                      <div class="p-3 bg-[var(--forge-steel)] bg-opacity-10 rounded border border-[var(--forge-steel)]">
                        <p class="text-sm font-semibold mb-1 capitalize">
                          {issue.layer.replace(/([A-Z])/g, ' $1').trim()}
                        </p>
                        <p class="text-xs opacity-70 mb-2">
                          Chapters: {issue.chapters.join(', ')}
                        </p>
                        <p class="text-sm opacity-90">{issue.suggestion}</p>
                      </div>
                    )}
                  </For>
                </div>
              </section>
            </Show>

            {/* Low Stakes */}
            <Show when={data().lowStakes.length > 0}>
              <section>
                <h4 class="font-semibold mb-3 text-sm uppercase tracking-wide opacity-70 flex items-center gap-2">
                  <AlertCircle size={16} />
                  Low Stakes Sections
                </h4>
                <div class="space-y-3">
                  <For each={data().lowStakes}>
                    {(issue) => (
                      <div class="p-3 bg-orange-500 bg-opacity-10 rounded border border-orange-500">
                        <p class="text-xs opacity-70 mb-2">
                          Chapters: {issue.chapters.join(', ')}
                        </p>
                        <p class="text-sm opacity-90">{issue.suggestion}</p>
                      </div>
                    )}
                  </For>
                </div>
              </section>
            </Show>

            {/* Pacing Issues */}
            <Show when={data().pacingIssues.length > 0}>
              <section>
                <h4 class="font-semibold mb-3 text-sm uppercase tracking-wide opacity-70">
                  Pacing Issues
                </h4>
                <div class="space-y-3">
                  <For each={data().pacingIssues}>
                    {(issue) => (
                      <div class="p-3 bg-red-500 bg-opacity-10 rounded border border-red-500">
                        <p class="text-sm font-semibold mb-1 capitalize">
                          {issue.type.replace(/-/g, ' ')} - Chapter {issue.chapter}
                        </p>
                        <p class="text-sm opacity-90">{issue.suggestion}</p>
                      </div>
                    )}
                  </For>
                </div>
              </section>
            </Show>

            {/* Emotional Disconnects */}
            <Show when={data().emotionalDisconnects.length > 0}>
              <section>
                <h4 class="font-semibold mb-3 text-sm uppercase tracking-wide opacity-70">
                  Emotional Disconnects
                </h4>
                <div class="space-y-3">
                  <For each={data().emotionalDisconnects}>
                    {(issue) => (
                      <div class="p-3 bg-purple-500 bg-opacity-10 rounded border border-purple-500">
                        <p class="text-sm font-semibold mb-1">
                          Chapter {issue.chapter}
                        </p>
                        <p class="text-xs opacity-70 mb-2">{issue.issue}</p>
                        <p class="text-sm opacity-90">{issue.suggestion}</p>
                      </div>
                    )}
                  </For>
                </div>
              </section>
            </Show>
          </>
        )}
      </Show>
    </div>
  );
}

