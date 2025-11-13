// src/routes/smithy/EditorToolbar.tsx
import type { Component } from "solid-js";

interface EditorToolbarProps {
  onUndo?: () => void;
  onRedo?: () => void;
}

const EditorToolbar: Component<EditorToolbarProps> = (props) => {
  return (
    <div class="flex items-center justify-between border-b border-[rgb(var(--forge-steel))/0.25] px-4 py-2 text-xs">
      <div class="flex items-center gap-2">
        <span class="uppercase tracking-[0.18em] text-[rgb(var(--forge-brass))/0.8]">
          Draft
        </span>
        <span class="h-3 w-px bg-[rgb(var(--forge-steel))/0.4]" />
        <button class="rounded px-2 py-1 hover:bg-white/5">Normal</button>
        <button class="rounded px-2 py-1 hover:bg-white/5">Dialogue</button>
        <button class="rounded px-2 py-1 hover:bg-white/5">Action</button>
      </div>
      <div class="flex items-center gap-2">
        <button
          class="rounded px-2 py-1 hover:bg-white/5"
          type="button"
          onClick={props.onUndo}
        >
          Undo
        </button>
        <button
          class="rounded px-2 py-1 hover:bg-white/5"
          type="button"
          onClick={props.onRedo}
        >
          Redo
        </button>
      </div>
    </div>
  );
};

export default EditorToolbar;
