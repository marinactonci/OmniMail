"use client";

import { useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { Nav } from "./nav";
import { Inbox, Pencil } from "lucide-react";
import { trpc } from "@/server/client";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import EmailEditor from "./email-editor";
import UseThreads from "@/hooks/use-threads";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Props = {
  isCollapsed: boolean;
};

function Sidebar({ isCollapsed }: Props) {
  const { account, accountId } = UseThreads();
  const [isComposeOpen, setIsComposeOpen] = useLocalStorage(
    "isComposeOpen",
    false
  );

  const { data: threads } = trpc.thread.getNumThreads.useQuery({
    accountId,
  });

  const [subject, setSubject] = useState("");
  const [toValues, setToValues] = useState<{ label: string; value: string }[]>(
    []
  );
  const [ccValues, setCcValues] = useState<{ label: string; value: string }[]>(
    []
  );
  const [bccValues, setBccValues] = useState<{ label: string; value: string }[]>([]);

  const sendEmail = trpc.email.sendEmail.useMutation();

  const handleSubmit = async (value: string) => {
    sendEmail.mutate(
      {
        accountId,
        threadId: undefined,
        body: value,
        subject: String(subject),
        from: {
          name: account?.name ?? "",
          address: account?.emailAddress ?? "",
        },
        to: toValues.map((to) => ({
          address: String(to.value),
          name: String(to.label ?? ""),
        })),
        cc: ccValues.map((cc) => ({
          address: String(cc.value),
          name: String(cc.label ?? ""),
        })),
        bcc: bccValues.map((bcc) => ({
          address: String(bcc.value),
          name: String(bcc.label ?? ""),
        })),
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
    <div className="flex flex-col gap-2">
      <div className="p-2 border-b grid place-items-center">
        <Button
          className={cn(!isCollapsed && "w-full justify-center gap-2")}
          size={isCollapsed ? "icon" : "default"}
          variant="default"
          onClick={() => setIsComposeOpen(true)}
        >
          <Pencil className="size-4" />
          {!isCollapsed && "Compose"}
        </Button>
      </div>
      <Drawer open={isComposeOpen} onOpenChange={setIsComposeOpen}>
        <DrawerContent className="px-50">
          <DrawerHeader>
            <DrawerTitle>New Message</DrawerTitle>
          </DrawerHeader>
          <div className="mt-2">
            <EmailEditor
              subject={subject}
              setSubject={setSubject}
              // @ts-expect-error This is a workaround for the type error
              toValues={toValues}
              // @ts-expect-error This is a workaround for the type error
              setToValues={setToValues}
              // @ts-expect-error This is a workaround for the type error
              ccValues={ccValues}
              // @ts-expect-error This is a workaround for the type error
              bccValues={bccValues}
              // @ts-expect-error This is a workaround for the type error
              setBccValues={setBccValues}
              // @ts-expect-error This is a workaround for the type error
              setCcValues={setCcValues}
              handleSend={handleSubmit}
              to={toValues.map((to) => to.value)}
              hasBcc
              defaultToolbarExpended
              isSending={sendEmail.isPending}
            />
          </div>
        </DrawerContent>
      </Drawer>
      <Nav
        isCollapsed={isCollapsed}
        links={[
          {
            title: "Inbox",
            label: threads?.toString() ?? "0",
            icon: Inbox,
            variant: "default",
          },
        ]}
      />
    </div>
  );
}

export default Sidebar;
