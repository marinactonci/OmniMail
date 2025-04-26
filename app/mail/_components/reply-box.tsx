import React, { useState } from "react";
import EmailEditor from "./email-editor";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

export default function ReplyBox() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <Separator className="relative">
        <div className="absolute left-1/2 -translate-x-1/2 -top-3 bg-background px-2">
          <Button
            variant="outline"
            size="sm"
            className="h-7 gap-1 hover:bg-accent"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <>
                <span className="text-xs">Hide reply</span>
                <ChevronDown className="h-3 w-3" />
              </>
            ) : (
              <>
                <span className="text-xs">Show reply</span>
                <ChevronUp className="h-3 w-3" />
              </>
            )}
          </Button>
        </div>
      </Separator>
      <div
        className={cn(
          "transition-all duration-300 ease-in-out",
          isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        )}
      >
        <div className="p-4">
          <EmailEditor />
        </div>
      </div>
    </>
  );
}
