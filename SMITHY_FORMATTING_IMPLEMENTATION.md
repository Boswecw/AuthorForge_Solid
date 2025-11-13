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
   | `fontFamily: "body"` | `editor.chain().focus().setFontFamily("'EB Garamond', serif").run()` |
   | `fontSize: "16"` | `editor.chain().focus().setFontSize("16px").run()` |
   | `lineHeight: "oneHalf"` | `editor.chain().focus().setLineHeight("1.5").run()` |
   | Undo | `editor.chain().focus().undo().run()` |
   | Redo | `editor.chain().focus().redo().run()` |

### What Works ✅

- **Bold/Italic/Underline** - Applied to selected text or at cursor position
- **Heading levels (H1, H2, H3)** - Convert selected paragraph to heading
- **Font Family** - Change font for selected text (EB Garamond, Cinzel, Inter, etc.)
- **Font Size** - Adjust text size (12px, 14px, 16px, 18px)
- **Line Height** - Control line spacing (single/1.2, 1.5, double/2.0)
- **Text Highlight** - Highlight selected text with background color
- **Undo/Redo** - Full undo/redo support with keyboard shortcuts (Cmd+Z, Cmd+Shift+Z)
- **Inline formatting** - Can bold individual words, mix styles in same paragraph
- **Selection-based formatting** - Select text and apply formatting to selection only
- **Keyboard shortcuts** - Cmd+B (bold), Cmd+I (italic), Cmd+U (underline), Cmd+Z (undo), Cmd+Shift+Z (redo)
- **Rich text features** - Lists, links, blockquotes (via TipTap StarterKit)
- **Character count** - Real-time word and character counting
- **HTML storage** - Content stored as HTML for rich text preservation
- **Reactive updates** - Changes are immediate and visible
- **Dark mode support** - Proper contrast and visibility in both light and dark themes

### Current Limitations ⚠️

1. **Indent Controls**
   - Basic implementation in place
   - Advanced paragraph indentation requires additional work
   - List indentation works via TipTap's built-in list features

## TipTap Extensions Used

The editor is configured with the following TipTap extensions:

1. **StarterKit** - Provides basic formatting (bold, italic, lists, etc.)
   - Headings: H1, H2, H3 support
   - Blockquotes enabled
   - Code blocks disabled
   - Built-in history disabled (using separate History extension)
2. **History** - Undo/redo functionality with 100-level depth
3. **TextStyle** - Base extension required for font styling
4. **FontFamily** - Font family switching (from @tiptap/extension-text-style)
5. **FontSize** - Font size control (from @tiptap/extension-text-style)
6. **LineHeight** - Line height adjustment (from @tiptap/extension-text-style)
7. **Underline** - Adds underline formatting support
8. **Link** - Hyperlink support with autolink detection
9. **Placeholder** - Shows placeholder text when editor is empty
10. **CharacterCount** - Tracks word and character count
11. **Highlight** - Text highlighting with background color (custom extension)

## Future Enhancements

### Planned Features

1. **Font Family Control**
   - Create custom TipTap extension for font family switching
   - Support all AuthorForge fonts (EB Garamond, Cinzel, Inter, etc.)
   - Apply to selected text or entire paragraphs

2. **Font Size Control**
   - Custom extension for dynamic font sizing
   - Support 12px, 14px, 16px, 18px options
   - Preserve size in HTML output

3. **Line Height Control**
   - Custom extension for line-height adjustment
   - Single, 1.5x, and double spacing options

4. **Indent Controls**
   - Leverage TipTap's list indentation
   - Add custom paragraph indentation
   - Support increase/decrease indent buttons

5. **Advanced Features**
   - Comments and annotations
   - Track changes / revision history
   - Collaborative editing (via Y.js)
   - Export to PDF, DOCX, Markdown

## Testing the Current Implementation

To verify formatting works:

1. **Open the Smithy editor** at http://localhost:3000/smithy
2. **Type some text** in the editor
3. **Select a word or phrase**
4. **Click Bold button** → Selected text becomes bold
5. **Click Italic button** → Selected text becomes italic
6. **Click Underline button** → Selected text becomes underlined
7. **Select a paragraph**
8. **Change heading level** → Paragraph converts to H1/H2/H3
9. **Use keyboard shortcuts**:
   - Cmd+B (Mac) / Ctrl+B (Windows) → Toggle bold
   - Cmd+I / Ctrl+I → Toggle italic
   - Cmd+U / Ctrl+U → Toggle underline
10. **Mix formatting** → Bold some words, italicize others in same paragraph

All changes should be **immediate** and **visible** in the editor.

### Known Working Features

✅ **Inline bold/italic/underline** - Works on selections
✅ **Heading conversion** - H1, H2, H3 support
✅ **Keyboard shortcuts** - Standard text editing shortcuts
✅ **Word count** - Real-time statistics
✅ **Dark mode** - Proper contrast and visibility

### Not Yet Implemented

⏳ **Font family switching** - Requires custom extension
⏳ **Font size control** - Requires custom extension
⏳ **Line height adjustment** - Requires custom extension
⏳ **Indent controls** - Requires custom extension

## Files Modified

### Core Implementation
- **`src/routes/smithy/index.tsx`** - Main editor component using TipTapEditor
  - Replaced `<textarea>` with `<TipTapEditor>` component
  - Added `handleFormatChange()` to apply TipTap commands
  - Integrated CharacterCount for word/character statistics

- **`src/components/editor/TipTapEditor.tsx`** - TipTap wrapper component
  - Updated heading levels to support H1, H2, H3
  - Configured extensions (StarterKit, Underline, Link, etc.)
  - Exposes editor instance via `onReady` callback

- **`src/routes/smithy/SmithyToolbar.tsx`** - Toolbar controls
  - No changes needed (already compatible)
  - Calls `onFormatChange` with updated format state

- **`src/routes/smithy/SmithyTextFormat.ts`** - TypeScript type definition
  - No changes needed (type definition remains the same)

### Styling
- **`src/styles/tiptap.css`** - TipTap/ProseMirror styling
  - Added H1 heading styles
  - Improved H2 and H3 heading styles
  - Made background transparent for better dark mode support
  - Added smooth color transitions

## Related Configuration

- **`tailwind.config.cjs`** - Font family definitions (font-afBody, font-afHeading, etc.)
- **`src/styles/fonts-authorforge.css`** - @font-face declarations
- **`package.json`** - TipTap dependencies already installed

