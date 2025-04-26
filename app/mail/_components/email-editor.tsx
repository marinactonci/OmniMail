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
import { getEmailCompletion } from "@/lib/ai";
import UseThreads from "@/hooks/use-threads";
import AiPromptModal from "./ai-prompt-modal";

type Props = {};

export default function EmailEditor({}: Props) {
  const [value, setValue] = useState("");
  const [expended, setExpended] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { threadId, threads } = UseThreads();

  const currentThread = useMemo(
    () => threads?.find((t) => t.id === threadId),
    [threadId, threads]
  );

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

  const animateText = async (text: string, editor: any) => {
    const words = text.split(/\s+/);

    for (const word of words) {
      await new Promise((resolve) => setTimeout(resolve, 50)); // Adjust speed as needed
      editor.commands.insertContent(word + " ");
    }
  };

  const handleAiAutoComplete = async () => {
    if (!editor) return;

    setIsGenerating(true);
    const { state } = editor;
    const currentPosition = state.selection.$head.pos;
    const currentContent = editor.getText().slice(0, currentPosition);

    try {
      const completion = await getEmailCompletion(
        currentContent,
        currentThread?.emails?.at(-1)?.body || ""
      );
      await animateText(completion, editor);
    } catch (error) {
      console.error("Error getting AI completion:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: false,
        orderedList: false,
        blockquote: false,
      }),
      Text,
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
    editorProps: {
      handleKeyDown: (view, event) => {
        if ((event.metaKey || event.ctrlKey) && event.key === "j") {
          event.preventDefault();
          handleAiAutoComplete();
          return true;
        }
        return false;
      },
    },
  });

  const send = () => {
    console.log("Editor value: ", value);
  };

  const handleAiComplete = (content: string) => {
    if (editor) {
      editor.commands.setContent(content);
    }
  };

  return (
    <div>
      <EditorOptions editor={editor} />
      <Separator />
      <div className="py-4 space-y-4">
        <div
          className={`transition-all duration-300 ease-in-out ${
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
          <Button
            variant={"outline"}
            size="icon"
            onClick={() => setIsAiModalOpen(true)}
          >
            <BotMessageSquare className="size-4" />
          </Button>
        </div>
      </div>
      <div className="prose dark:prose-invert w-full max-h-[200px] overflow-y-scroll">
        <EditorContent editor={editor} />
      </div>
      <Separator />
      <div className="py-3 px-4 flex items-center justify-between">
        <span className="text-sm">
          {isGenerating ? (
            <span className="flex items-center gap-1">
              Generating
              <span className="inline-flex">
                <span className="animate-[bounce_1.4s_infinite_.1s]">.</span>
                <span className="animate-[bounce_1.4s_infinite_.2s]">.</span>
                <span className="animate-[bounce_1.4s_infinite_.3s]">.</span>
              </span>
            </span>
          ) : (
            <>
              Tip: Press{" "}
              <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">
                {modKey} + J
              </kbd>{" "}
              for AI autocomplete
            </>
          )}
        </span>
        <Button
          disabled={!editor || editor.isEmpty || isGenerating}
          onClick={() => send()}
        >
          <Send className="mr-2 h-4 w-4" />
          Send
        </Button>
      </div>
      <AiPromptModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onComplete={handleAiComplete}
      />
    </div>
  );
}
