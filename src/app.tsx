import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";


/* --- Global Style Imports --- */
// Design tokens first (variables, fonts)
import "~/styles/tokens.css";

// Tailwind next (uses those vars)
import "~/styles/tailwind.css";

// App-specific overrides (if you still need them)
import "./app.css";

/* --- Main App --- */
export default function App() {
  return (
    <Router
      root={(props) => (
        <>
          <main class="min-h-screen bg-[rgb(var(--bg))] text-[rgb(var(--fg))] transition-colors duration-300">
            <Suspense>{props.children}</Suspense>
          </main>
        </>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
