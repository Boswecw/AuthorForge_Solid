# Smithy Editor Formatting Implementation

## Overview
This document describes how the SmithyToolbar formatting controls work with the TipTap rich text editor.

## Current Implementation (Updated)

### Architecture
The Smithy editor now uses **TipTap** (a ProseMirror-based rich text editor) with **inline formatting** support. The toolbar controls update the editor state using TipTap's command API, allowing formatting to be applied to selected text or at the cursor position.

### How It Works

1. **State Management** (`src/routes/smithy/index.tsx`)
   - `editor` signal stores the TipTap Editor instance
   - `format` signal tracks current formatting state
   - `handleFormatChange()` applies formatting via TipTap commands

2. **Toolbar Controls** (`src/routes/smithy/SmithyToolbar.tsx`)
   - User clicks toolbar buttons/dropdowns
   - `onFormatChange` callback triggers `handleFormatChange()`
   - TipTap commands apply formatting to current selection or cursor position

3. **TipTap Command Execution**
   The `handleFormatChange()` function maps format properties to TipTap commands:

   | Format Property | TipTap Command |
   |----------------|----------------|
   | `weight: "bold"` | `editor.chain().focus().toggleBold().run()` |
   | `italic: true` | `editor.chain().focus().toggleItalic().run()` |
   | `underline: true` | `editor.chain().focus().toggleUnderline().run()` |
   | `heading: "normal"` | `editor.chain().focus().setParagraph().run()` |
   | `heading: "h1"` | `editor.chain().focus().setHeading({ level: 1 }).run()` |
   | `heading: "h2"` | `editor.chain().focus().setHeading({ level: 2 }).run()` |
   | `heading: "h3"` | `editor.chain().focus().setHeading({ level: 3 }).run()` |

   **Note:** Font family, font size, line height, and indent controls would require custom TipTap extensions or CSS-based styling (planned for future enhancement).

### What Works ✅

- **Bold/Italic/Underline** - Applied to selected text or at cursor position
- **Heading levels (H1, H2, H3)** - Convert selected paragraph to heading
- **Inline formatting** - Can bold individual words, mix styles in same paragraph
- **Selection-based formatting** - Select text and apply formatting to selection only
- **Keyboard shortcuts** - Cmd+B (bold), Cmd+I (italic), Cmd+U (underline)
- **Rich text features** - Lists, links, blockquotes (via TipTap StarterKit)
- **Character count** - Real-time word and character counting
- **HTML storage** - Content stored as HTML for rich text preservation
- **Reactive updates** - Changes are immediate and visible

### Current Limitations ⚠️

1. **Font Family/Size/Line Height**
   - Not yet implemented (requires custom TipTap extensions)
   - Planned for future enhancement
   - Default font is EB Garamond (defined in tiptap.css)

2. **Indent Controls**
   - Not yet implemented (requires custom extension or list indentation)
   - Planned for future enhancement

## Why These Limitations Exist

HTML `<textarea>` elements only support **plain text** with **uniform styling**. They cannot render rich text or mixed formatting. This is a fundamental browser limitation, not a bug in our implementation.

## Future Enhancement: Rich Text Editor

To support inline formatting and rich text features, we would need to:

### 1. Replace the Textarea
Replace `<textarea>` with one of:
- **contenteditable div** (custom implementation)
- **Lexical** (Facebook's modern rich text framework)
- **ProseMirror** (powerful, schema-based editor)
- **Tiptap** (ProseMirror wrapper with better DX)
- **Slate** (React-based, would need SolidJS adapter)

### 2. Update Data Model
```typescript
// Instead of: string
const [draft, setDraft] = createSignal("");

// Use structured format:
const [draft, setDraft] = createSignal<EditorState | JSON | Markdown>(...);
```

### 3. Modify Toolbar Behavior
```typescript
// Instead of: applying classes to entire editor
const editorClass = createMemo(() => ...);

// Use: applying formatting to current selection
const applyFormatToSelection = (format: FormatType) => {
  const selection = editor.getSelection();
  editor.applyFormat(selection, format);
};
```

### 4. Implement Serialization
- Save/load as JSON, Markdown, or HTML
- Convert between formats for export
- Handle version compatibility

## Recommended Next Steps

If inline formatting is required:

1. **Evaluate editor libraries** - Lexical or Tiptap recommended for SolidJS
2. **Design data schema** - How will formatted content be stored?
3. **Update toolbar** - Make buttons apply to selection, not whole document
4. **Add keyboard shortcuts** - Cmd+B for bold, Cmd+I for italic, etc.
5. **Implement autosave** - Save structured content to backend
6. **Add export options** - PDF, DOCX, Markdown, plain text

## Testing the Current Implementation

To verify formatting works:

1. Open the Smithy editor
2. Type some text
3. Change font family dropdown → text font should change
4. Change font size → text should resize
5. Click Bold button → all text becomes bold
6. Click Italic button → all text becomes italic
7. Change heading level → text size and weight change
8. Adjust line height → spacing between lines changes
9. Use indent buttons → left padding increases/decreases

All changes should be **immediate** and **visible** in the textarea.

## Files Modified

- `src/routes/smithy/index.tsx` - Main editor component with editorClass() logic
- `src/routes/smithy/SmithyToolbar.tsx` - Toolbar controls with format state
- `src/routes/smithy/SmithyTextFormat.ts` - TypeScript type definition

## Related Configuration

- `tailwind.config.cjs` - Font family definitions (font-afBody, font-afHeading, etc.)
- `src/styles/fonts-authorforge.css` - @font-face declarations

