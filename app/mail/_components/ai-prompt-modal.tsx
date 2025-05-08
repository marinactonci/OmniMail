import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react"; // Import useEffect
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
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen && generatedContent) {
      onComplete(generatedContent);
      setGeneratedContent(null); // Reset for next time
      setPrompt(""); // Clear prompt after completion
    }
  }, [isOpen, generatedContent, onComplete]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    try {
      setIsLoading(true);
      const content = await generateEmailContent(prompt);
      setGeneratedContent(content);
      onClose(); // Close the modal, useEffect will call onComplete
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