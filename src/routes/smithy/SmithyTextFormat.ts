// src/routes/smithy/SmithyTextFormat.ts

export type SmithyTextFormat = {
  fontFamily:
    | "body"      // EB Garamond (main prose)
    | "bodyAlt"   // Cormorant Garamond (lore)
    | "heading"   // Cinzel (H1/H2/H3)
    | "decor"     // Cinzel Decorative (chapter titles)
    | "ui"        // Inter (UI style text)
    | "system"    // system-ui fallback
    | "mono";     // monospace

  fontSize: "12" | "14" | "16" | "18";

  lineHeight: "single" | "oneHalf" | "double";

  weight: "normal" | "bold";

  italic: boolean;
  underline: boolean;

  heading: "normal" | "h1" | "h2" | "h3";

  indentLevel: 0 | 1 | 2 | 3;
};
