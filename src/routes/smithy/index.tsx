// src/routes/smithy/index.tsx
/**
 * The Smithy - AuthorForge's primary writing workspace
 *
 * IMPLEMENTATION:
 * - Uses TipTap rich text editor (ProseMirror-based)
 * - Formatting controls apply to current selection or cursor position
 * - Supports inline formatting (bold, italic, underline on selected text)
 * - Content stored as HTML for rich text preservation
 * - Full keyboard shortcut support (Cmd+B, Cmd+I, etc.)
 */
import { createSignal, createMemo } from "solid-js";
import type { Editor } from "@tiptap/core";
import ForgeShell from "~/components/ForgeShell";
import TipTapEditor from "~/components/editor/TipTapEditor";
import SmithyToolbar from "./SmithyToolbar";
import type { SmithyTextFormat } from "./SmithyTextFormat";
import { Binder } from "~/components/Binder";

export default function Smithy() {
  const [activeDocId, setActiveDocId] = createSignal<string | null>(null);
  const [activeTitle, setActiveTitle] = createSignal<string>("Untitled Scene");
  const [html, setHtml] = createSignal("<p></p>");
  const [editor, setEditor] = createSignal<Editor | null>(null);

  // Format state - now used to track current editor state and apply commands
  const [format, setFormat] = createSignal<SmithyTextFormat>({
    fontFamily: "body",
    fontSize: "16",
    lineHeight: "oneHalf",
    weight: "normal",
    italic: false,
    underline: false,
    heading: "normal",
    indentLevel: 0,
  });

  // Stats from Tiptap's CharacterCount extension
  const stats = createMemo(() => {
    const ed = editor();
    if (!ed) return { words: 0, chars: 0, paragraphs: 0, readingMinutes: 0 };

    const storage = ed.storage.characterCount;
    const words = storage?.words?.() || 0;
    const chars = storage?.characters?.() || 0;

    return {
      words,
      chars,
      paragraphs: 0, // TODO: calculate from editor content
      readingMinutes: Math.ceil(words / 200),
    };
  });

  // Handle format changes from toolbar - apply to Tiptap editor
  const handleFormatChange = (newFormat: SmithyTextFormat) => {
    const ed = editor();
    if (!ed) return;

    const oldFormat = format();
    setFormat(newFormat);

    // Apply bold
    if (newFormat.weight !== oldFormat.weight) {
      if (newFormat.weight === "bold") {
        ed.chain().focus().toggleBold().run();
      } else {
        ed.chain().focus().unsetBold().run();
      }
    }

    // Apply italic
    if (newFormat.italic !== oldFormat.italic) {
      ed.chain().focus().toggleItalic().run();
    }

    // Apply underline
    if (newFormat.underline !== oldFormat.underline) {
      ed.chain().focus().toggleUnderline().run();
    }

    // Apply heading level
    if (newFormat.heading !== oldFormat.heading) {
      if (newFormat.heading === "normal") {
        ed.chain().focus().setParagraph().run();
      } else if (newFormat.heading === "h1") {
        ed.chain().focus().setHeading({ level: 1 }).run();
      } else if (newFormat.heading === "h2") {
        ed.chain().focus().setHeading({ level: 2 }).run();
      } else if (newFormat.heading === "h3") {
        ed.chain().focus().setHeading({ level: 3 }).run();
      }
    }

    // Apply font family
    if (newFormat.fontFamily !== oldFormat.fontFamily) {
      const fontMap: Record<string, string> = {
        body: "'EB Garamond', serif",
        bodyAlt: "'Cormorant Garamond', serif",
        heading: "'Cinzel', serif",
        decor: "'Cinzel Decorative', serif",
        ui: "'Inter', sans-serif",
        system: "system-ui, sans-serif",
        mono: "'JetBrains Mono', monospace",
      };
      const fontFamily = fontMap[newFormat.fontFamily] || fontMap.body;
      ed.chain().focus().setFontFamily(fontFamily).run();
    }

    // Apply font size
    if (newFormat.fontSize !== oldFormat.fontSize) {
      ed.chain().focus().setFontSize(`${newFormat.fontSize}px`).run();
    }

    // Apply line height
    if (newFormat.lineHeight !== oldFormat.lineHeight) {
      const lineHeightMap: Record<string, string> = {
        single: "1.2",
        oneHalf: "1.5",
        double: "2.0",
      };
      const lineHeight = lineHeightMap[newFormat.lineHeight] || "normal";
      ed.chain().focus().setLineHeight(lineHeight).run();
    }

    // Apply indent level (using list indentation or custom logic)
    if (newFormat.indentLevel !== oldFormat.indentLevel) {
      // For now, we'll use a simple approach with padding
      // A more sophisticated approach would use list indentation
      const indentDelta = newFormat.indentLevel - oldFormat.indentLevel;
      if (indentDelta > 0) {
        // Increase indent - could use sinkListItem for lists
        // For paragraphs, we'd need a custom extension
        // For now, this is a placeholder
      } else if (indentDelta < 0) {
        // Decrease indent
      }
    }
  };

  // Undo/Redo handlers
  const handleUndo = () => {
    const ed = editor();
    if (ed?.can().undo()) {
      ed.chain().focus().undo().run();
    }
  };

  const handleRedo = () => {
    const ed = editor();
    if (ed?.can().redo()) {
      ed.chain().focus().redo().run();
    }
  };

  return (
    <ForgeShell
      title="The Smithy"
      leftPanel={
        <Binder
          onSelect={(id: string) => {
            setActiveDocId(id);
            setActiveTitle(id || "Untitled Scene");
          }}
        />
      }
      rightPanel={
        <div class="space-y-3 text-sm">
          <p class="text-xs uppercase tracking-[0.18em] text-[rgb(var(--forge-brass))/0.8]">
            Context
          </p>
          <p>
            Use the binder on the left to switch chapters and scenes. Project
            notes, scene beats, and AI suggestions will show up here later.
          </p>
          <p class="text-xs text-[rgb(var(--muted))]">
            Current doc:{" "}
            <span class="font-medium text-[rgb(var(--forge-brass))]">
              {activeTitle()}
            </span>
          </p>
        </div>
      }
    >
      <div class="flex h-full flex-col">
        {/* Toolbar directly under the navbar */}
        <SmithyToolbar
          format={format()}
          onFormatChange={handleFormatChange}
          onUndo={handleUndo}
          onRedo={handleRedo}
        />

        {/* Main Smithy layout */}
        <div class="flex-1 pt-4 grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-4">
          {/* LEFT: Writing area */}
          <section
            class="rounded-2xl border border-[rgb(var(--forge-steel))/0.3]
                   bg-[rgb(var(--bg))]/0.95 shadow-af-soft flex flex-col"
          >
            <div class="flex items-center justify-between border-b border-[rgb(var(--forge-steel))/0.25] px-4 py-2 text-xs">
              <div class="space-y-1">
                <div class="text-[0.7rem] uppercase tracking-[0.18em] text-[rgb(var(--forge-brass))]/80">
                  Scene
                </div>
                <div class="text-sm font-medium">{activeTitle()}</div>
              </div>
              <div class="flex items-center gap-2">
                <span class="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[0.65rem] text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300">
                  Autosave
                </span>
              </div>
            </div>

            <div class="flex-1 overflow-y-auto">
              <TipTapEditor
                placeholder="Write your scene here. Use the toolbar to format selected text."
                onReady={(ed) => setEditor(ed)}
                class="min-h-[calc(100vh-16rem)]"
              />
            </div>

            <div class="flex items-center justify-between border-t border-[rgb(var(--forge-steel))/0.25] px-4 py-2 text-[0.7rem] text-[rgb(var(--muted))]">
              <span>Ln 1, Col 1</span>
              <span>{stats().words} words • Draft v0</span>
            </div>
          </section>

          {/* RIGHT: Stats panel */}
          <section
            class="rounded-2xl border border-[rgb(var(--forge-steel))/0.3]
                   bg-[rgb(var(--bg))]/0.9 p-4 text-xs"
          >
            <div class="text-[0.7rem] uppercase tracking-[0.18em] text-[rgb(var(--forge-brass))]/80 mb-2">
              Stats
            </div>
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <span>Words</span>
                <span class="font-mono text-[0.8rem]">{stats().words}</span>
              </div>
              <div class="flex items-center justify-between">
                <span>Characters</span>
                <span class="font-mono text-[0.8rem]">{stats().chars}</span>
              </div>
              <div class="flex items-center justify-between">
                <span>Paragraphs</span>
                <span class="font-mono text-[0.8rem]">{stats().paragraphs}</span>
              </div>
              <div class="flex items-center justify-between">
                <span>Read time</span>
                <span class="font-mono text-[0.8rem]">
                  {stats().readingMinutes} min
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </ForgeShell>
  );
}
