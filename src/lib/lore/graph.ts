export type Hit = {
  id?: string;
  kind: string;
  span: { text: string; start: number; end: number };
  score: number;
};

// naive sentence split; good enough for graph prototypes
function splitSentences(text: string): { start: number; end: number }[] {
  const parts: { start: number; end: number }[] = [];
  const re = /[^.!?]+[.!?\n]+/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    parts.push({ start: m.index, end: m.index + m[0].length });
  }
  if (!parts.length) parts.push({ start: 0, end: text.length });
  return parts;
}

export function buildGraph(text: string, hits: Hit[]) {
  // nodes are unique by label+kind; edges connect co-occurrences per sentence
  const nodes: Record<string, { data: { id: string; label: string; kind: string } }> = {};
  const edges: { data: { id: string; source: string; target: string; weight: number } }[] = [];

  const sentences = splitSentences(text);
  const bySentence = sentences.map((s) =>
    hits.filter((h) => h.span.start >= s.start && h.span.end <= s.end)
  );

  const nodeId = (label: string, kind: string) => `${kind}:${label}`;

  for (const h of hits) {
    const id = nodeId(h.span.text, h.kind);
    nodes[id] ||= { data: { id, label: h.span.text, kind: h.kind } };
  }

  const edgeKey = (a: string, b: string) => (a < b ? `${a}__${b}` : `${b}__${a}`);
  const weights: Record<string, number> = {};

  for (const group of bySentence) {
    for (let i = 0; i < group.length; i++) {
      for (let j = i + 1; j < group.length; j++) {
        const a = nodeId(group[i].span.text, group[i].kind);
        const b = nodeId(group[j].span.text, group[j].kind);
        if (a === b) continue;
        const k = edgeKey(a, b);
        weights[k] = (weights[k] || 0) + 1;
      }
    }
  }

  Object.entries(weights).forEach(([k, w], idx) => {
    const [a, b] = k.split("__");
    edges.push({ data: { id: `e${idx}`, source: a, target: b, weight: w } });
  });

  return { nodes: Object.values(nodes), edges };
}

