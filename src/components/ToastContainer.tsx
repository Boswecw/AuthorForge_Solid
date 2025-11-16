/**
 * AuthorForge - Toast Container Component
 *
 * Displays toast notifications in a fixed position on screen.
 */

import { For, Show } from "solid-js";
import { useToast, type Toast, type ToastType } from "~/lib/hooks/useToast";

const TOAST_ICONS: Record<ToastType, string> = {
  success: "✓",
  error: "✕",
  warning: "⚠",
  info: "ℹ",
};

const TOAST_COLORS: Record<
  ToastType,
  { bg: string; border: string; text: string }
> = {
  success: {
    bg: "bg-green-900/90",
    border: "border-green-500",
    text: "text-green-100",
  },
  error: {
    bg: "bg-red-900/90",
    border: "border-red-500",
    text: "text-red-100",
  },
  warning: {
    bg: "bg-yellow-900/90",
    border: "border-yellow-500",
    text: "text-yellow-100",
  },
  info: {
    bg: "bg-blue-900/90",
    border: "border-blue-500",
    text: "text-blue-100",
  },
};

function ToastItem(props: { toast: Toast; onRemove: (id: string) => void }) {
  const colors = TOAST_COLORS[props.toast.type];
  const icon = TOAST_ICONS[props.toast.type];

  return (
    <div
      class={`
        ${colors.bg} ${colors.border} ${colors.text}
        border rounded-lg shadow-lg p-4 mb-3
        flex items-center gap-3
        animate-slide-in-right
        backdrop-blur-sm
        min-w-[300px] max-w-[500px]
      `}
      role="alert"
    >
      <div class="text-xl font-bold flex-shrink-0">{icon}</div>
      <div class="flex-1 text-sm">{props.toast.message}</div>
      <button
        onClick={() => props.onRemove(props.toast.id)}
        class="flex-shrink-0 text-lg opacity-70 hover:opacity-100 transition-opacity"
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  );
}

/**
 * Toast Container - Place once in your app root
 *
 * Usage in app.tsx or root layout:
 * ```tsx
 * <ToastContainer />
 * ```
 */
export function ToastContainer() {
  const toast = useToast();

  return (
    <div
      class="fixed top-4 right-4 z-50 pointer-events-none"
      aria-live="polite"
      aria-atomic="true"
    >
      <div class="pointer-events-auto">
        <For each={toast.toasts()}>
          {(t) => <ToastItem toast={t} onRemove={toast.remove} />}
        </For>
      </div>
    </div>
  );
}

/**
 * Alternative: Bottom-left position
 */
export function ToastContainerBottomLeft() {
  const toast = useToast();

  return (
    <div
      class="fixed bottom-4 left-4 z-50 pointer-events-none"
      aria-live="polite"
      aria-atomic="true"
    >
      <div class="pointer-events-auto">
        <For each={toast.toasts()}>
          {(t) => <ToastItem toast={t} onRemove={toast.remove} />}
        </For>
      </div>
    </div>
  );
}

/**
 * Alternative: Bottom-center position
 */
export function ToastContainerBottomCenter() {
  const toast = useToast();

  return (
    <div
      class="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
      aria-live="polite"
      aria-atomic="true"
    >
      <div class="pointer-events-auto">
        <For each={toast.toasts()}>
          {(t) => <ToastItem toast={t} onRemove={toast.remove} />}
        </For>
      </div>
    </div>
  );
}

