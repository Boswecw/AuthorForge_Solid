import { A, useLocation } from "@solidjs/router";
import { createMemo, createSignal, For, onMount, Show } from "solid-js";
import { useTheme } from "~/lib/useTheme";
import logoIcon from "~/assets/icons/AnvilBadge.webp?url";

type Item = { name: string; href: string; key: string };
const items: Item[] = [
  { name: "The Hearth",  href: "/hearth",  key: "hearth" },
  { name: "The Foundry", href: "/foundry", key: "foundry" },
  { name: "The Smithy",  href: "/smithy",  key: "smithy" },
  { name: "The Anvil",   href: "/anvil",   key: "anvil" },
  { name: "Lore",        href: "/lore",    key: "lore" },
  { name: "The Bloom",   href: "/bloom",   key: "bloom" },
  { name: "Help",        href: "/help",    key: "help" },
];

export default function Nav() {
  const loc = useLocation();
  const { theme, toggle } = useTheme();

  const path = createMemo(() => loc.pathname);
  const isActive = (href: string) =>
    path() === href || path().startsWith(href + "/");

  // Mobile menu (optional)
  const [menuOpen, setMenuOpen] = createSignal(false);

  // Client-only FA icons
  const [mounted, setMounted] = createSignal(false);
  const [icons, setIcons] = createSignal<{
    Fa: any; faSun: any; faMoon: any; faBars: any;
  } | null>(null);

  onMount(async () => {
    const Fa = (await import("solid-fa")).default;
    const { faSun, faMoon, faBars } = await import("@fortawesome/free-solid-svg-icons");
    setIcons({ Fa, faSun, faMoon, faBars });
    setMounted(true);
  });

  return (
    <header
      class="sticky top-0 z-40 border-b border-[rgb(var(--forge-steel))/0.3]
             bg-[rgb(var(--bg))/0.8] dark:bg-[rgb(var(--forge-ink))/0.7] backdrop-blur"
    >
      {/* Skip link for accessibility */}
      <a
        href="#main"
        class="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2
               rounded-md px-3 py-2 text-sm bg-white/90 dark:bg-black/60"
      >
        Skip to content
      </a>

      <nav class="w-full h-14 flex items-center" aria-label="Primary">
        <div class="w-full flex items-center gap-3">
          {/* LEFT: Logo + Wordmark (flush-left) */}
          <A href="/hearth" class="flex items-center gap-2 pl-2 no-underline">
            <img
              src={logoIcon}
              alt="AuthorForge logo"
              class="h-8 w-8 shrink-0 object-contain"
              draggable={false}
            />
            <span
              class="font-display uppercase tracking-wider text-[1.25rem] md:text-[1.5rem]
                     bg-gradient-to-r from-forge-brass to-forge-ember bg-clip-text text-transparent"
            >
              AUTHORFORGE
            </span>
          </A>

          {/* RIGHT: Nav links + Theme toggle */}
          <div class="ml-auto flex items-center gap-2 pr-4 sm:pr-6 lg:pr-8">

            {/* Desktop nav */}
            <ul class="hidden md:flex items-center gap-2">
              <For each={items}>
                {(item) => (
                  <li>
                    <A
                      href={item.href}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      class={
                        isActive(item.href)
                          ? [
                              "px-3 h-9 inline-flex items-center rounded-md border text-xs uppercase tracking-wider font-semibold transition",
                              "text-white border-white/10",
                              // Ember glow for active state
                              "bg-gradient-to-b from-[rgb(var(--forge-ember))]/25 to-transparent shadow-ember"
                            ].join(" ")
                          : [
                              "px-3 h-9 inline-flex items-center rounded-md border text-xs uppercase tracking-wider font-semibold transition",
                              "text-[rgb(var(--fg))]/0.85 dark:text-[rgb(var(--fg))]/0.85",
                              "border-transparent hover:border-[rgb(var(--forge-brass))]/30",
                              "hover:bg-white/5 dark:hover:bg-white/5",
                              "hover:underline hover:underline-offset-4 hover:decoration-[rgb(var(--forge-brass))]/40",
                              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--forge-brass))]/40"
                            ].join(" ")
                      }
                    >
                      {item.name}
                    </A>
                  </li>
                )}
              </For>
            </ul>

            {/* Theme toggle */}
            <button
              type="button"
              onClick={toggle}
              class="h-9 px-3 inline-flex items-center gap-2 rounded-md border
                     border-[rgb(var(--forge-steel))/0.3]
                     bg-white/60 dark:bg-white/5
                     hover:bg-white/80 dark:hover:bg-white/10 text-sm
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--forge-brass))]/40"
              aria-label="Toggle color theme"
              aria-pressed={theme() === "dark"}
            >
              <Show when={mounted() && icons()}>
                {(icns) => {
                  const Fa = icns().Fa;
                  const icon = theme() === "dark" ? icns().faSun : icns().faMoon;
                  return <Fa icon={icon} class="h-4 w-4" />;
                }}
              </Show>
              <span>{theme() === "dark" ? "Light" : "Dark"}</span>
            </button>

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen())}
              class="md:hidden h-9 w-9 inline-flex items-center justify-center rounded-md
                     border border-[rgb(var(--forge-steel))/0.3]
                     bg-white/60 dark:bg-white/5
                     hover:bg-white/80 dark:hover:bg-white/10
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--forge-brass))]/40"
              aria-label="Open menu"
              aria-expanded={menuOpen()}
              aria-controls="primary-menu"
            >
              <Show when={mounted() && icons()}>
                {(icns) => {
                  const Fa = icns().Fa;
                  return <Fa icon={icns().faBars} class="h-4 w-4" />;
                }}
              </Show>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu container (optional; fill as needed) */}
      <Show when={menuOpen()}>
        <div id="primary-menu" class="md:hidden px-3 pb-3">
          <ul class="flex flex-col gap-1">
            <For each={items}>
              {(item) => (
                <li>
                  <A
                    href={item.href}
                    class="block px-3 py-2 rounded-md text-sm
                           hover:bg-white/5 hover:underline underline-offset-4"
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.name}
                  </A>
                </li>
              )}
            </For>
          </ul>
        </div>
      </Show>
    </header>
  );
}
