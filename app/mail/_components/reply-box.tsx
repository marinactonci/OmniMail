import React, { useEffect, useState } from "react";
import EmailEditor from "./email-editor";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { RouterOutputs, trpc } from "@/server/client";
import UseThreads from "@/hooks/use-threads";
import { toast } from "sonner";

export default function ReplyBox() {
  const { accountId, threadId } = UseThreads();
  const { data: replyDetails } = trpc.account.getReplyDetails.useQuery({
    accountId,
    threadId: threadId ?? "",
  });
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="pb-4">
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
          isExpanded
            ? "max-h-[500px] opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        )}
      >
        <div className="p-4 pb-0">
          <Component replyDetails={replyDetails} />
        </div>
      </div>
    </div>
  );
}

const Component = ({
  replyDetails,
}: {
  replyDetails: RouterOutputs["account"]["getReplyDetails"] | undefined;
}) => {
  const { accountId, threadId } = UseThreads();

  const [subject, setSubject] = useState("");
  const [toValues, setToValues] = useState<{ label: string; value: string }[]>(
    []
  );
  const [ccValues, setCcValues] = useState<{ label: string; value: string }[]>(
    []
  );

  useEffect(() => {
    if (!threadId || !replyDetails) return;

    if (replyDetails.subject) {
      if (!replyDetails.subject.startsWith("Re:")) {
        setSubject(`Re: ${replyDetails.subject}`);
      } else {
        setSubject(replyDetails.subject);
      }
    }

    setToValues(
      replyDetails.to.map((to) => ({ label: to.address, value: to.address }))
    );
    setCcValues(
      replyDetails.cc.map((cc) => ({ label: cc.address, value: cc.address }))
    );
  }, [accountId, threadId, replyDetails]);

  const sendEmail = trpc.email.sendEmail.useMutation();

  const handleSubmit = async (value: string) => {
    if (!replyDetails) return;

    sendEmail.mutate(
      {
        accountId,
        threadId: threadId ?? undefined,
        body: value,
        subject,
        from: replyDetails.from,
        to: replyDetails.to.map((to) => ({
          address: to.address,
          name: to.name ?? "",
        })),
        cc: replyDetails.cc.map((cc) => ({
          address: cc.address,
          name: cc.name ?? "",
        })),
        replyTo: replyDetails.from,
        inReplyTo: replyDetails.id,
      },
      {
        onSuccess: () => {
          toast.success("Email Sent!");
        },
        onError: (error) => {
          console.log(error);
          toast.error("Error sending email");
        },
      }
    );
  };

  return (
    <EmailEditor
      subject={subject}
      setSubject={setSubject}
      // @ts-ignore
      toValues={toValues}
      // @ts-ignore
      setToValues={setToValues}
      // @ts-ignore
      ccValues={ccValues}
      // @ts-ignore
      setCcValues={setCcValues}
      handleSend={handleSubmit}
      to={replyDetails?.to.map((to) => to.address) ?? []}
      isSending={sendEmail.isPending}
      hasBcc={false}
    />
  );
};
