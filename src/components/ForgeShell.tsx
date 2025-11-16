// src/components/ForgeShell.tsx
import { JSX, Show, createSignal, onMount } from "solid-js";
import { A } from "@solidjs/router";
import Nav from "~/components/Nav";

type ForgeShellProps = {
  title?: string;
  /** Optional custom left rail (e.g. Smithy binder). */
  leftPanel?: JSX.Element;
  /** Optional right panel (context, metadata, etc.). */
  rightPanel?: JSX.Element;
  children: JSX.Element | ((railState: { leftOpen: boolean; rightOpen: boolean }) => JSX.Element);
};

export default function ForgeShell(props: ForgeShellProps) {
  const [leftOpen, setLeftOpen] = createSignal(true);
  const [rightOpen, setRightOpen] = createSignal(true);

  onMount(() => {
    const raw = localStorage.getItem("forge-shell");
    if (raw) {
      try {
        const { left, right } = JSON.parse(raw);
        setLeftOpen(left ?? true);
        setRightOpen(right ?? true);
      } catch {
        // ignore corrupt state
      }
    }
  });

  const persist = () =>
    localStorage.setItem(
      "forge-shell",
      JSON.stringify({ left: leftOpen(), right: rightOpen() })
    );

  return (
    <div class="min-h-screen w-full bg-[rgb(var(--bg))] text-[rgb(var(--fg))] font-ui">
      {/* Top bar */}
      <Nav />

      {/* Rails + Canvas */}
      <div class="grid grid-cols-[auto,1fr,auto]">
        {/* LEFT RAIL */}
        <Show when={leftOpen()}>
          <aside
            class="sticky top-14 h-[calc(100vh-3.5rem)] w-56 border-r
                   border-[rgb(var(--forge-steel))/0.3]
                   bg-[rgb(var(--bg))]/0.8 backdrop-blur"
            aria-label="Module navigation"
          >
            <div class="flex h-full flex-col">
              {/* main left content (binder OR default nav) */}
              <div class="flex-1 overflow-y-auto">
                {props.leftPanel ?? (
                  <div class="p-2">
                    {/* Primary Workspaces */}
                    <div class="mb-1">
                      <div class="px-2 pb-2 text-[0.65rem] uppercase tracking-wider text-[rgb(var(--forge-brass))]/60 font-semibold">
                        Workspaces
                      </div>
                      <ul class="space-y-1">
                        <RailLink href="/hearth" label="Hearth" />
                        <RailLink href="/foundry" label="Foundry" />
                        <RailLink href="/smithy" label="Smithy" />
                        <RailLink href="/anvil" label="Anvil" />
                        <RailLink href="/lore" label="Lore" />
                        <RailLink href="/bloom" label="Bloom" />
                      </ul>
                    </div>

                    {/* Utilities */}
                    <div class="mt-4 pt-4 border-t border-[rgb(var(--forge-steel))/0.2]">
                      <div class="px-2 pb-2 text-[0.65rem] uppercase tracking-wider text-[rgb(var(--forge-brass))]/60 font-semibold">
                        Utilities
                      </div>
                      <ul class="space-y-1">
                        <RailLink href="/tempering/p1" label="Tempering" />
                        <RailLink href="/boundary" label="Boundary" />
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* collapse button */}
              <div class="p-2 border-t border-[rgb(var(--forge-steel))/0.25]">
                <button
                  class="w-full rounded-md border border-[rgb(var(--forge-steel))/0.3] px-3 py-2 text-sm
                         hover:bg-white/5"
                  aria-label="Collapse left rail"
                  onClick={() => {
                    setLeftOpen(false);
                    persist();
                  }}
                >
                  Collapse rail
                </button>
              </div>
            </div>
          </aside>
        </Show>

        {/* MAIN CANVAS */}
        <main id="main" class="min-h-[calc(100vh-3.5rem)] p-6">
          {typeof props.children === "function"
            ? props.children({ leftOpen: leftOpen(), rightOpen: rightOpen() })
            : props.children}
        </main>

        {/* RIGHT RAIL */}
        <Show when={rightOpen()}>
          <aside
            class="sticky top-14 h-[calc(100vh-3.5rem)] w-80 border-l
                   border-[rgb(var(--forge-steel))/0.3]
                   bg-[rgb(var(--bg))]/0.8 backdrop-blur p-4"
            aria-label="Context panel"
          >
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-sm font-semibold tracking-wide">Context</h3>
              <button
                class="rounded-md border border-[rgb(var(--forge-steel))/0.3] px-2 py-1 text-xs hover:bg-white/5"
                aria-label="Collapse right rail"
                onClick={() => {
                  (document.activeElement as HTMLElement)?.blur?.();
                  setRightOpen(false);
                  persist();
                }}
              >
                Hide
              </button>
            </div>
            <div class="text-sm space-y-3">
              {props.rightPanel ?? <p>Open a project to see details.</p>}
            </div>
          </aside>
        </Show>
      </div>

      {/* Floating rail toggles */}
      <div class="fixed bottom-3 right-3 flex gap-2">
        <button
          class="rounded-md border border-[rgb(var(--forge-steel))/0.3] bg-white/60 dark:bg-white/5 px-3 py-2 text-sm hover:bg-white/80 dark:hover:bg-white/10"
          aria-pressed={!leftOpen()}
          onClick={() => {
            setLeftOpen(!leftOpen());
            persist();
          }}
        >
          Left rail
        </button>
        <button
          class="rounded-md border border-[rgb(var(--forge-steel))/0.3] bg-white/60 dark:bg-white/5 px-3 py-2 text-sm hover:bg-white/80 dark:hover:bg-white/10"
          aria-pressed={!rightOpen()}
          onClick={() => {
            setRightOpen(!rightOpen());
            persist();
          }}
        >
          Right rail
        </button>
      </div>
    </div>
  );
}

function RailLink(props: { href: string; label: string }) {
  return (
    <li>
      <A
        href={props.href}
        class="block rounded-md px-3 py-2 text-sm hover:bg-white/5
               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--forge-brass))]/40"
      >
        {props.label}
      </A>
    </li>
  );
}
