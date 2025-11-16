import { For, Show } from "solid-js";
import { MapPin, Wand2, Users, CheckCircle, AlertCircle } from "lucide-solid";
import type { CharacterArc } from "../types";

interface CrossLinksProps {
  character: CharacterArc;
}

export default function CrossLinks(props: CrossLinksProps) {
  // Mock data - in production, this would come from the Lore database
  const linkedLocations = () => [
    { id: "loc-1", name: "The Ember Citadel", relevance: "Home base, appears in Acts 1 & 3" },
    { id: "loc-2", name: "Shadowfen Marshes", relevance: "Site of past failure (Act 1 flashback)" }
  ];

  const linkedMagicSystems = () => [
    { id: "mag-1", name: "Flame Binding", relevance: "Character's primary ability" },
    { id: "mag-2", name: "Soul Resonance", relevance: "Discovered in Act 2" }
  ];

  const canonConsistency = () => ({
    status: "verified" as "verified" | "warning",
    lastChecked: "2025-01-15",
    issues: [] as string[]
  });

  return (
    <div class="rounded-xl border border-[rgb(var(--forge-steel))/0.3] bg-white/60 dark:bg-white/5 p-6 shadow-card">
      <h2 class="font-display text-xl font-semibold mb-4">Cross-Links & Lore Integration</h2>

      <div class="space-y-4">
        {/* Relationships */}
        <Section
          title="Relationships"
          icon={Users}
          iconColor="text-[rgb(var(--forge-brass))]"
        >
          <Show
            when={props.character.relationships.length > 0}
            fallback={<EmptyState message="No relationships defined yet" />}
          >
            <div class="space-y-2">
              <For each={props.character.relationships}>
                {(relation) => (
                  <div class="p-3 rounded-md bg-white/30 dark:bg-black/10 border border-[rgb(var(--forge-steel))/0.2]">
                    <div class="flex items-center justify-between mb-1">
                      <span class="font-semibold text-sm">Character ID: {relation.characterId}</span>
                      <span class="text-xs px-2 py-0.5 rounded bg-[rgb(var(--forge-brass))/0.15]">
                        {relation.relationshipType}
                      </span>
                    </div>
                    <p class="text-xs opacity-80">{relation.description}</p>
                    <Show when={relation.evolution}>
                      <p class="text-xs opacity-60 mt-1 italic">Evolution: {relation.evolution}</p>
                    </Show>
                  </div>
                )}
              </For>
            </div>
          </Show>
        </Section>

        {/* Linked Locations */}
        <Section
          title="Linked Locations"
          icon={MapPin}
          iconColor="text-[rgb(var(--forge-ember))]"
        >
          <Show
            when={linkedLocations().length > 0}
            fallback={<EmptyState message="No locations linked yet" />}
          >
            <div class="space-y-2">
              <For each={linkedLocations()}>
                {(location) => (
                  <div class="p-3 rounded-md bg-white/30 dark:bg-black/10 border border-[rgb(var(--forge-steel))/0.2]">
                    <div class="font-semibold text-sm">{location.name}</div>
                    <p class="text-xs opacity-70">{location.relevance}</p>
                  </div>
                )}
              </For>
            </div>
          </Show>
        </Section>

        {/* Magic Systems / World Rules */}
        <Section
          title="Magic Systems & World Rules"
          icon={Wand2}
          iconColor="text-[rgb(var(--forge-brass))]"
        >
          <Show
            when={linkedMagicSystems().length > 0}
            fallback={<EmptyState message="No magic systems linked yet" />}
          >
            <div class="space-y-2">
              <For each={linkedMagicSystems()}>
                {(system) => (
                  <div class="p-3 rounded-md bg-white/30 dark:bg-black/10 border border-[rgb(var(--forge-steel))/0.2]">
                    <div class="font-semibold text-sm">{system.name}</div>
                    <p class="text-xs opacity-70">{system.relevance}</p>
                  </div>
                )}
              </For>
            </div>
          </Show>
        </Section>

        {/* Canon Consistency */}
        <Section
          title="Canon Consistency"
          icon={canonConsistency().status === "verified" ? CheckCircle : AlertCircle}
          iconColor={canonConsistency().status === "verified" ? "text-green-500" : "text-yellow-500"}
        >
          <div class="p-3 rounded-md bg-white/30 dark:bg-black/10 border border-[rgb(var(--forge-steel))/0.2]">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-semibold">
                {canonConsistency().status === "verified" ? "✓ Verified" : "⚠ Needs Review"}
              </span>
              <span class="text-xs opacity-60">Last checked: {canonConsistency().lastChecked}</span>
            </div>
            <Show
              when={canonConsistency().issues.length > 0}
              fallback={
                <p class="text-xs opacity-70">No consistency issues detected</p>
              }
            >
              <ul class="text-xs space-y-1">
                <For each={canonConsistency().issues}>
                  {(issue) => (
                    <li class="text-yellow-600 dark:text-yellow-400">• {issue}</li>
                  )}
                </For>
              </ul>
            </Show>
          </div>
        </Section>
      </div>
    </div>
  );
}

interface SectionProps {
  title: string;
  icon: any;
  iconColor: string;
  children: any;
}

function Section(props: SectionProps) {
  return (
    <div>
      <div class="flex items-center gap-2 mb-2">
        <props.icon class={`w-4 h-4 ${props.iconColor}`} />
        <h3 class="font-semibold text-sm">{props.title}</h3>
      </div>
      {props.children}
    </div>
  );
}

function EmptyState(props: { message: string }) {
  return (
    <div class="p-4 rounded-md bg-white/20 dark:bg-black/5 border border-dashed border-[rgb(var(--forge-steel))/0.3] text-center">
      <p class="text-xs opacity-50">{props.message}</p>
    </div>
  );
}

