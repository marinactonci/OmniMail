import { Letter } from "react-letter";
import UseThreads from "@/hooks/use-threads";
import { RouterOutputs } from "@/server/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

type Props = {
  email: RouterOutputs["thread"]["getAllThreads"][0]["emails"][0];
};

export default function EmailDisplay({ email }: Props) {
  const { account } = UseThreads();
  const isMe: boolean = email.from.address === account?.emailAddress;
  const initials =
    email.from.name
      ?.split(" ")
      .map((n) => n[0])
      .join("") || "?";

  return (
    <Card
      className={cn(
        "mb-4 overflow-hidden border",
        isMe ? "bg-primary/5" : "bg-card"
      )}
    >
      <CardHeader className="flex flex-row items-center gap-4 p-4">
        <Avatar>
          <AvatarImage alt={email.from.name || "Unknown"} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold">
              {email.from.name || "Unknown"}
            </span>
            <span className="text-xs text-muted-foreground">{`<${email.from.address}>`}</span>
          </div>
          <div className="text-xs text-muted-foreground">
            {formatDistanceToNow(email.sentAt, { addSuffix: true })}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <Letter html={email?.body ?? ""} />
      </CardContent>
    </Card>
  );
}
