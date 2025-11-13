import { onCleanup, onMount } from "solid-js";
import { buildGraph, Hit } from "~/lib/lore/graph";
import { kindTheme } from "~/lib/lore/colors";

export default function LoreGraph(props: { text: string; hits: Hit[] }) {
  let container!: HTMLDivElement;
  let cy: any = null;

  onMount(async () => {
    const cytoscape = (await import("cytoscape")).default;
    const data = buildGraph(props.text, props.hits);
    cy = cytoscape({
      container,
      elements: [...data.nodes, ...data.edges],
      layout: { name: "cose", animate: false },
      style: [
        {
          selector: "node",
          style: {
            label: "data(label)",
            "font-size": 10,
            padding: 8,
            "background-color": (ele: any) => {
              const k = ele.data("kind") as string;
              return "#334155";
            },
            "text-valign": "center",
            color: "#e5e7eb",
            "border-width": 1,
            "border-color": "#475569",
          },
        },
        {
          selector: "edge",
          style: {
            width: (ele: any) => Math.min(6, 1 + (ele.data("weight") as number)),
            "line-color": "#475569",
            "target-arrow-shape": "triangle",
            "target-arrow-color": "#475569",
            "curve-style": "bezier",
          },
        },
      ],
    });
  });

  onCleanup(() => cy && cy.destroy());

  return <div ref={container!} class="w-full h-full" />;
}
