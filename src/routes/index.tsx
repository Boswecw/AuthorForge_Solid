import { A } from "@solidjs/router";
import { createSignal, onMount } from "solid-js";
import Counter from "~/components/Counter";

export default function Home() {
  const [theme, setTheme] = createSignal<"light" | "dark">("light");

  onMount(() => {
    // Access localStorage only on the client side
    const savedTheme = (localStorage.getItem("theme") as "light" | "dark") || "light";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  });

  const toggleTheme = () => {
    const next = theme() === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    localStorage.setItem("theme", next);
  };

  return (
    <main class="mx-auto max-w-5xl p-6 text-fg">
      {/* Top bar */}
      <header class="surface-top-1 sticky top-0 z-40 mb-8 flex items-center justify-between rounded-b-[var(--radius)] px-4 py-3">
        <h1 class="font-display text-xl tracking-wide text-forge-brass">
          Author<span class="text-forge-ember">Forge</span>
        </h1>
        <div class="flex items-center gap-3">
          <A href="/" class="text-fg/80 hover:text-fg">Home</A>
          <A href="/about" class="text-fg/80 hover:text-fg">About</A>
          <button class="btn-ghost" onClick={toggleTheme}>
            {theme() === "dark" ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </header>

      {/* Hero card demonstrating accent swap + glow */}
      <section class="accent-[forge.brass]">
        <div class="surface-2 rounded-[var(--radius-lg)] p-6 shadow-forge animate-af-fade">
          <h2 class="font-display text-3xl tracking-wide">Welcome</h2>
          <p class="mt-2 text-fg/90">
            Tailwind + tokens + AuthorForge plugin are active.
          </p>
          <div class="mt-4 flex items-center gap-3">
            {/* Uses accent (brass) + explicit glow from ember */}
            <button class="btn glow-[forge.ember]">Primary</button>
            <button class="btn-ghost">Ghost</button>
          </div>
        </div>
      </section>

      {/* Demo: default scaffold content (kept for reference) */}
      <section class="mt-10">
        <h3 class="font-display text-2xl tracking-wide">Scaffold</h3>
        <div class="mt-4">
          <Counter />
        </div>
        <p class="mt-6">
          Visit{" "}
          <a
            href="https://solidjs.com"
            target="_blank"
            rel="noreferrer"
            class="text-fg hover:underline"
          >
            solidjs.com
          </a>{" "}
          to learn how to build Solid apps.
        </p>
        <p class="my-4">
          <span>Home</span>
          {" - "}
          <A href="/about" class="text-fg hover:underline">
            About Page
          </A>
        </p>
      </section>

      {/* Sample utility panel */}
      <section class="mt-10">
        <div class="surface rounded-[var(--radius-lg)] p-6">
          <h4 class="font-display text-xl">Utilities</h4>
          <div class="mt-3 flex flex-wrap items-center gap-3">
            <span class="badge">badge</span>
            <kbd class="kbd">Ctrl</kbd>
            <input class="input max-w-xs" placeholder="Input field" />
          </div>
        </div>
      </section>
    </main>
  );
}
