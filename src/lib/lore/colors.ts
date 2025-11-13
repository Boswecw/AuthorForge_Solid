export type Kind =
  | "Person"
  | "Place"
  | "Faction"
  | "Item"
  | "Creature"
  | "Magic"
  | "Date"
  | { Custom: string };

export const KIND_THEME: Record<string, { badge: string; ring: string; text: string; bg: string; icon: string }> = {
  Person:   { badge: "bg-rose-600/20 text-rose-300",   ring: "ring-rose-500/40",   text: "text-rose-300",   bg: "bg-rose-900/10",   icon: "👤" },
  Place:    { badge: "bg-sky-600/20 text-sky-300",     ring: "ring-sky-500/40",    text: "text-sky-300",    bg: "bg-sky-900/10",    icon: "🗺️" },
  Faction:  { badge: "bg-violet-600/20 text-violet-300", ring: "ring-violet-500/40", text: "text-violet-300", bg: "bg-violet-900/10", icon: "🏰" },
  Item:     { badge: "bg-amber-600/20 text-amber-300",  ring: "ring-amber-500/40",  text: "text-amber-300",  bg: "bg-amber-900/10",  icon: "🗡️" },
  Creature: { badge: "bg-emerald-600/20 text-emerald-300", ring: "ring-emerald-500/40", text: "text-emerald-300", bg: "bg-emerald-900/10", icon: "🐉" },
  Magic:    { badge: "bg-indigo-600/20 text-indigo-300", ring: "ring-indigo-500/40", text: "text-indigo-300", bg: "bg-indigo-900/10", icon: "✨" },
  Date:     { badge: "bg-stone-600/20 text-stone-300", ring: "ring-stone-500/40", text: "text-stone-300", bg: "bg-stone-900/10", icon: "🕰️" },
};

export function kindTheme(kind: string) {
  return KIND_THEME[kind] ?? { badge: "bg-zinc-600/20 text-zinc-300", ring: "ring-zinc-500/40", text: "text-zinc-300", bg: "bg-zinc-900/10", icon: "🏷️" };
}

