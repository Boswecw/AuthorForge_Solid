/**
 * AuthorForge - Error Boundary Component
 *
 * Catches errors in child components and displays a fallback UI.
 * Prevents entire app crashes from component errors.
 */

import { ErrorBoundary as SolidErrorBoundary } from "solid-js";
import type { JSX } from "solid-js";

interface ErrorBoundaryProps {
  children: JSX.Element;
  fallback?: (error: Error, reset: () => void) => JSX.Element;
  onError?: (error: Error) => void;
}

/**
 * Default error fallback UI
 */
function DefaultErrorFallback(props: { error: Error; reset: () => void }) {
  return (
    <div class="bg-red-900/20 border border-red-500 rounded-lg p-6 my-4">
      <div class="flex items-start gap-4">
        <div class="text-red-500 text-2xl">⚠️</div>
        <div class="flex-1">
          <h3 class="text-lg font-semibold text-red-400 mb-2">
            Something went wrong
          </h3>
          <p class="text-sm text-red-300 mb-4">
            {props.error.message || "An unexpected error occurred"}
          </p>
          <details class="text-xs text-red-400/70 mb-4">
            <summary class="cursor-pointer hover:text-red-400">
              Technical details
            </summary>
            <pre class="mt-2 p-2 bg-black/30 rounded overflow-x-auto">
              {props.error.stack}
            </pre>
          </details>
          <button
            onClick={props.reset}
            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Error Boundary wrapper component
 *
 * Usage:
 * ```tsx
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 * ```
 *
 * With custom fallback:
 * ```tsx
 * <ErrorBoundary
 *   fallback={(error, reset) => <CustomError error={error} onReset={reset} />}
 *   onError={(error) => console.error('Caught error:', error)}
 * >
 *   <YourComponent />
 * </ErrorBoundary>
 * ```
 */
export function ErrorBoundary(props: ErrorBoundaryProps) {
  const handleError = (error: Error) => {
    // Log to console for debugging
    console.error("[ErrorBoundary] Caught error:", error);

    // Call custom error handler if provided
    props.onError?.(error);
  };

  return (
    <SolidErrorBoundary
      fallback={(error, reset) => {
        handleError(error);
        return props.fallback ? (
          props.fallback(error, reset)
        ) : (
          <DefaultErrorFallback error={error} reset={reset} />
        );
      }}
    >
      {props.children}
    </SolidErrorBoundary>
  );
}

/**
 * Compact error boundary for inline use
 */
export function InlineErrorBoundary(props: {
  children: JSX.Element;
  message?: string;
}) {
  return (
    <ErrorBoundary
      fallback={(error) => (
        <div class="text-red-400 text-sm p-2 bg-red-900/10 rounded border border-red-500/30">
          ⚠️ {props.message || "Error loading component"}: {error.message}
        </div>
      )}
    >
      {props.children}
    </ErrorBoundary>
  );
}

