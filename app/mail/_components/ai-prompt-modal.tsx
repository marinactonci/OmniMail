import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { generateEmailContent } from "@/lib/ai";
import { Loader2 } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (content: string) => void;
}

export default function AiPromptModal({ isOpen, onClose, onComplete }: Props) {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    try {
      setIsLoading(true);
      const content = await generateEmailContent(prompt);
      onComplete(content);
      onClose();
      setPrompt("");
    } catch (error) {
      console.error("Error generating email:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate Email with AI</DialogTitle>
          <DialogDescription>
            Describe what you want to say in your email, and AI will help you write it professionally.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Textarea
            placeholder="E.g., Write an email to schedule a meeting with the team next week to discuss project progress"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleGenerate} disabled={isLoading || !prompt.trim()}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Generate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}