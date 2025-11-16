import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense, onMount } from "solid-js";
import { useFontScale } from "~/state/fontScale";
import { ToastContainer } from "~/components/ToastContainer";


/* --- Global Style Imports --- */
// Design tokens first (variables, fonts)
import "~/styles/tokens.css";

// Tailwind next (uses those vars)
import "~/styles/tailwind.css";

// App-specific overrides (if you still need them)
import "./app.css";

/* --- Main App --- */
export default function App() {
  // Initialize font scale on mount
  const { fontScaleKey } = useFontScale();

  onMount(() => {
    // Font scale is automatically applied via createEffect in fontScale.ts
    console.log("Font scale initialized:", fontScaleKey());
  });

  return (
    <Router
      root={(props) => (
        <>
          <main class="min-h-screen bg-[rgb(var(--bg))] text-[rgb(var(--fg))] transition-colors duration-300">
            <Suspense>{props.children}</Suspense>
          </main>
          <ToastContainer />
        </>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
