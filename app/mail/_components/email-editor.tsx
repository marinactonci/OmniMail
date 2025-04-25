import React, { useMemo, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { Text } from "@tiptap/extension-text";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Blockquote from "@tiptap/extension-blockquote";
import Placeholder from "@tiptap/extension-placeholder";
import EditorOptions from "./editor-options";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { BotMessageSquare, File, Send } from "lucide-react";
import { MultiSelect } from "@/components/ui/multi-select";
import { Input } from "@/components/ui/input";

type Props = {};

export default function EmailEditor({}: Props) {
  const [value, setValue] = useState("");
  const [expended, setExpended] = useState(false);

  const frameworks = [
    {
      value: "next.js",
      label: "Next.js",
    },
    {
      value: "sveltekit",
      label: "SvelteKit",
    },
    {
      value: "nuxt.js",
      label: "Nuxt.js",
    },
    {
      value: "remix",
      label: "Remix",
    },
    {
      value: "astro",
      label: "Astro",
    },
  ];

  const isMac = useMemo(() => {
    if (typeof window === "undefined") return false;
    return navigator.platform.toUpperCase().indexOf("MAC") >= 0;
  }, []);

  const modKey = isMac ? "⌘" : "Ctrl";

  const CustomText = Text.extend({
    addKeyboardShortcuts() {
      return {
        "Meta-j": () => {
          console.log("Meta-j pressed");
          return true;
        },
      };
    },
  });
  const editor = useEditor({
    autofocus: false,
    extensions: [
      StarterKit.configure({
        bulletList: false,
        orderedList: false,
        blockquote: false,
      }),
      CustomText,
      BulletList.configure({
        keepMarks: true,
        HTMLAttributes: {
          class: "list-disc ml-4",
        },
      }),
      OrderedList.configure({
        keepMarks: true,
        HTMLAttributes: {
          class: "list-decimal ml-4",
        },
      }),
      ListItem,
      Blockquote.configure({
        HTMLAttributes: {
          class: "border-l-4 border-gray-300 dark:border-gray-700 pl-4 my-4",
        },
      }),
      Placeholder.configure({
        placeholder: "Write your message here...",
        emptyEditorClass: "is-editor-empty",
      }),
    ],
    onUpdate: ({ editor }) => {
      setValue(editor.getHTML());
    },
  });

  const send = () => {
    console.log("Editor value: ", value);
  };

  return (
    <div>
      <EditorOptions editor={editor} />
      <Separator />
      <div className="py-4 space-y-4">
        <div
          className={`transition-all duration-700 ease-in-out ${
            expended
              ? "opacity-100 max-h-60"
              : "opacity-0 max-h-0 overflow-hidden"
          }`}
        >
          <div className="space-y-4">
            <MultiSelect options={frameworks} label="To" />
            <MultiSelect options={frameworks} label="Cc" />
            <Input type="text" placeholder="Subject" />
          </div>
          <Separator className="mt-4" />
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant={"outline"}
            className="cursor-pointer gap-1"
            onClick={() => setExpended(!expended)}
          >
            <File className="size-4 text-green-600" />
            <span className="font-medium text-green-600">Draft </span>
            to Tonči
          </Button>
          <Button variant={"outline"} size="icon">
            <BotMessageSquare className="size-4" />
          </Button>
        </div>
      </div>
      <div className="prose dark:prose-invert w-full">
        <EditorContent editor={editor} value={value} />
      </div>
      <Separator />
      <div className="py-3 px-4 flex items-center justify-between">
        <span className="text-sm">
          Tip: Press{" "}
          <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">
            {modKey} + J
          </kbd>{" "}
          for AI autocomplete.
        </span>
        <Button disabled={!value} onClick={() => send()}>
          <Send />
          Send
        </Button>
      </div>
    </div>
  );
}
