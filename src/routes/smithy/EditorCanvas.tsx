import { Component, createMemo, createSignal } from "solid-js";
import SmithyToolbar from "./SmithyToolbar";
import type { SmithyTextFormat } from "./SmithyTextFormat";

const defaultFormat: SmithyTextFormat = {
  fontFamily: "body",
  fontSize: "16",
  lineHeight: "single",
  weight: "normal",
  italic: false,
  underline: false,
  heading: "normal",
  indentLevel: 0
};

const SmithyEditor: Component = () => {
  // formatting state
  const [format, setFormat] = createSignal<SmithyTextFormat>(defaultFormat);

  // dynamic computed style object
  const style = createMemo(() => {
    return {
      "font-family": resolveFont(format().fontFamily),
      "font-size": format().fontSize + "px",
      "line-height": resolveLineHeight(format().lineHeight),
      "font-weight": format().weight,
      "font-style": format().italic ? "italic" : "normal",
      "text-decoration": format().underline ? "underline" : "none",
      "margin-left": format().indentLevel * 2 + "rem"
    };
  });

  function resolveFont(key: SmithyTextFormat["fontFamily"]) {
    switch (key) {
      case "body": return "EB Garamond, serif";
      case "bodyAlt": return "Cormorant Garamond, serif";
      case "heading": return "Cinzel, serif";
      case "decor": return "Cinzel Decorative, serif";
      case "ui": return "Inter, sans-serif";
      case "system": return "system-ui, sans-serif";
      case "mono": return "JetBrains Mono, monospace";
      default: return "inherit";
    }
  }

  function resolveLineHeight(key: SmithyTextFormat["lineHeight"]) {
    switch (key) {
      case "single": return "1.2";
      case "oneHalf": return "1.5";
      case "double": return "2.0";
      default: return "1.2";
    }
  }

  // toolbar update handler
  function handleFormatChange(next: SmithyTextFormat) {
    setFormat(next);
  }

  return (
    <div class="w-full flex flex-col h-full">
      <SmithyToolbar
        format={format()}
        onFormatChange={handleFormatChange}
      />

      <div class="flex-1 mt-4 p-4 bg-neutral-900 text-neutral-200 rounded-lg shadow-inner overflow-auto">
        <div
          class="whitespace-pre-wrap outline-none"
          contentEditable
          style={style()}
        >
          Start writing…
        </div>
      </div>
    </div>
  );
};

export default SmithyEditor;
