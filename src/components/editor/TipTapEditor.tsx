import { onCleanup, onMount, splitProps } from "solid-js";
import { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import { TextStyle, FontFamily, FontSize, LineHeight } from "@tiptap/extension-text-style";
import { Highlight } from "./extensions/Highlight";

type TipTapEditorProps = {
  value?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  autofocus?: boolean;
  editable?: boolean;
  onReady?: (editor: Editor) => void;
  class?: string;
};

export default function TipTapEditor(allProps: TipTapEditorProps) {
  const [props, rest] = splitProps(allProps, [
    "value",
    "onChange",
    "placeholder",
    "autofocus",
    "editable",
    "onReady",
    "class",
  ]);
  let element!: HTMLDivElement;
  let editor: Editor | null = null;

  onMount(() => {
    editor = new Editor({
      element,
      editable: props.editable ?? true,
      autofocus: props.autofocus ?? true,
      content: props.value ?? "<p></p>",
      extensions: [
        StarterKit.configure({
          heading: { levels: [1, 2, 3] }, // Support H1, H2, H3
          blockquote: {},
          codeBlock: false,
          history: {
            depth: 100,
            newGroupDelay: 500,
          },
          // Link and Underline are included in StarterKit by default
          link: {
            openOnClick: false,
            autolink: true,
          },
          underline: {},
        }),
        TextStyle, // Required for FontFamily, FontSize, and LineHeight
        Placeholder.configure({
          placeholder: props.placeholder ?? "Begin your scene…",
        }),
        CharacterCount.configure(),
        FontFamily.configure({
          types: ["textStyle"],
        }),
        FontSize.configure({
          types: ["textStyle"],
        }),
        LineHeight.configure({
          types: ["textStyle"],
        }),
        Highlight.configure({
          multicolor: true,
        }),
      ],
      onUpdate: ({ editor }) => props.onChange?.(editor.getHTML()),
    });
    props.onReady?.(editor);
  });

  onCleanup(() => {
    editor?.destroy();
    editor = null;
  });

  return <div ref={element} class={props.class} {...rest} />;
}
