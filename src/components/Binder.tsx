// src/components/Binder.tsx
import { For, createSignal } from "solid-js";

type BinderNode = {
  id: string;
  title: string;
  depth: number;
  kind: "folder" | "scene";
};

const initialNodes: BinderNode[] = [
  { id: "manuscript", title: "Manuscript", depth: 0, kind: "folder" },
  { id: "ch1", title: "Chapter 1 – Embers", depth: 0, kind: "folder" },
  { id: "ch1-s1", title: "Scene 1.1 – Alleyway", depth: 1, kind: "scene" },
  { id: "ch1-s2", title: "Scene 1.2 – The Inn", depth: 1, kind: "scene" },
  { id: "ch2", title: "Chapter 2 – Ashfall", depth: 0, kind: "folder" },
];

export function Binder(props: { onSelect?: (id: string) => void }) {
  const [nodes, setNodes] = createSignal<BinderNode[]>(initialNodes);
  const [activeId, setActiveId] = createSignal<string>(initialNodes[0]?.id ?? "manuscript");

  const select = (id: string) => {
    setActiveId(id);
    props.onSelect?.(id);
  };

  const addFolder = () => {
    const id = `folder-${Date.now()}`;
    const newNode: BinderNode = {
      id,
      title: "New Folder",
      depth: 0,
      kind: "folder",
    };
    setNodes([...nodes(), newNode]);
    select(id);
  };

  const addScene = () => {
    const id = `scene-${Date.now()}`;
    // super simple default: child of the last folder, depth 1
    const lastFolderIndex = [...nodes()].map((n, i) => (n.kind === "folder" ? i : -1)).filter(i => i >= 0).pop();
    const insertIndex = lastFolderIndex != null ? lastFolderIndex + 1 : nodes().length;

    const newNode: BinderNode = {
      id,
      title: "New Scene",
      depth: 1,
      kind: "scene",
    };

    const arr = [...nodes()];
    arr.splice(insertIndex, 0, newNode);
    setNodes(arr);
    select(id);
  };

  return (
    <div class="flex h-full flex-col text-sm">
      {/* Header + actions */}
      <div class="border-b border-[rgb(var(--forge-steel))/0.25] px-2 py-2">
        <div class="flex items-center justify-between gap-2">
          <div class="text-[0.65rem] uppercase tracking-[0.18em] text-[rgb(var(--forge-brass))/0.8]">
            Project Binder
          </div>
        </div>
        <div class="mt-2 flex gap-2">
          <button
            type="button"
            class="flex-1 rounded-md border border-[rgb(var(--forge-steel))/0.3] px-2 py-1 text-[0.7rem] hover:bg-white/5"
            onClick={addFolder}
          >
            + Add folder
          </button>
          <button
            type="button"
            class="flex-1 rounded-md border border-[rgb(var(--forge-steel))/0.3] px-2 py-1 text-[0.7rem] hover:bg-white/5"
            onClick={addScene}
          >
            + Add scene
          </button>
        </div>
      </div>

      {/* Node list */}
      <div class="flex-1 overflow-y-auto px-2 py-2">
        <For each={nodes()}>
          {(node) => (
            <button
              type="button"
              onClick={() => select(node.id)}
              class={`flex w-full items-center rounded-md px-2 py-1.5 text-left transition
                ${
                  activeId() === node.id
                    ? "bg-[rgb(var(--forge-ember))/0.18] text-[rgb(var(--forge-ember))] shadow-inner"
                    : "text-[rgb(var(--forge-brass))/0.8] hover:bg-white/5"
                }`}
              style={{ "padding-left": `${node.depth * 1.25}rem` }}
            >
              <span class="mr-2 inline-block w-4 text-xs opacity-60">
                {node.kind === "folder" ? "▸" : "–"}
              </span>
              <span class="truncate">{node.title}</span>
            </button>
          )}
        </For>
      </div>
    </div>
  );
}
