import type { Editor } from "@tiptap/react";
import {
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Italic,
  List,
  ListOrdered,
  Quote,
  Redo,
  Strikethrough,
  Type,
  Undo,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const EditorOptions = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null;
  }

  const isMac = () => {
    if (typeof window === "undefined") return false;
    return navigator.platform.toUpperCase().indexOf("MAC") >= 0 ? "⌘" : "Ctrl";
  }

  const modKey = isMac();

  return (
    <TooltipProvider>
      <div className="flex flex-wrap gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => editor.chain().focus().toggleBold().run()}
              disabled={!editor.can().chain().focus().toggleBold().run()}
              variant="ghost"
              size="icon"
              className={cn(
                editor.isActive("bold") && "bg-accent text-accent-foreground"
              )}
            >
              <Bold className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Bold ({modKey}+B)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              disabled={!editor.can().chain().focus().toggleItalic().run()}
              variant="ghost"
              size="icon"
              className={cn(
                editor.isActive("italic") && "bg-accent text-accent-foreground"
              )}
            >
              <Italic className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Italic ({modKey}+I)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => editor.chain().focus().toggleStrike().run()}
              disabled={!editor.can().chain().focus().toggleStrike().run()}
              variant="ghost"
              size="icon"
              className={cn(
                editor.isActive("strike") && "bg-accent text-accent-foreground"
              )}
            >
              <Strikethrough className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Strikethrough</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => editor.chain().focus().toggleCode().run()}
              disabled={!editor.can().chain().focus().toggleCode().run()}
              variant="ghost"
              size="icon"
              className={cn(
                editor.isActive("code") && "bg-accent text-accent-foreground"
              )}
            >
              <Code className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Code</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => editor.chain().focus().setParagraph().run()}
              variant="ghost"
              size="icon"
              className={cn(
                editor.isActive("paragraph") &&
                  "bg-accent text-accent-foreground"
              )}
            >
              <Type className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Paragraph</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
              variant="ghost"
              size="icon"
              className={cn(
                editor.isActive("heading", { level: 1 }) &&
                  "bg-accent text-accent-foreground"
              )}
            >
              <Heading1 className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Heading 1</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              variant="ghost"
              size="icon"
              className={cn(
                editor.isActive("heading", { level: 2 }) &&
                  "bg-accent text-accent-foreground"
              )}
            >
              <Heading2 className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Heading 2</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
              variant="ghost"
              size="icon"
              className={cn(
                editor.isActive("heading", { level: 3 }) &&
                  "bg-accent text-accent-foreground"
              )}
            >
              <Heading3 className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Heading 3</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 4 }).run()
              }
              variant="ghost"
              size="icon"
              className={cn(
                editor.isActive("heading", { level: 4 }) &&
                  "bg-accent text-accent-foreground"
              )}
            >
              <Heading4 className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Heading 4</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 5 }).run()
              }
              variant="ghost"
              size="icon"
              className={cn(
                editor.isActive("heading", { level: 5 }) &&
                  "bg-accent text-accent-foreground"
              )}
            >
              <Heading5 className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Heading 5</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 6 }).run()
              }
              variant="ghost"
              size="icon"
              className={cn(
                editor.isActive("heading", { level: 6 }) &&
                  "bg-accent text-accent-foreground"
              )}
            >
              <Heading6 className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Heading 6</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              variant="ghost"
              size="icon"
              className={cn(
                editor.isActive("bulletList") &&
                  "bg-accent text-accent-foreground"
              )}
            >
              <List className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Bullet List</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              variant="ghost"
              size="icon"
              className={cn(
                editor.isActive("orderedList") &&
                  "bg-accent text-accent-foreground"
              )}
            >
              <ListOrdered className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Numbered List</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              variant="ghost"
              size="icon"
              className={cn(
                editor.isActive("blockquote") &&
                  "bg-accent text-accent-foreground"
              )}
            >
              <Quote className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Quote</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().chain().focus().undo().run()}
              variant="ghost"
              size="icon"
            >
              <Undo className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Undo ({modKey}+Z)</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().chain().focus().redo().run()}
              variant="ghost"
              size="icon"
            >
              <Redo className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Redo ({modKey}+⇧+Z)</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};

export default EditorOptions;
