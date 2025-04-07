"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import { MailPlus } from "lucide-react";

interface AccountSwitcherProps {
  isCollapsed: boolean;
  accounts: {
    label: string;
    email: string;
    icon: string;
  }[];
  onAddAccount?: () => void;
}

export function AccountSwitcher({
  isCollapsed,
  accounts,
  onAddAccount,
}: AccountSwitcherProps) {
  const [selectedAccount, setSelectedAccount] = React.useState<string>(
    accounts.length > 0 ? accounts[0].email : ""
  );

  return (
    <Select
      defaultValue={selectedAccount}
      onValueChange={setSelectedAccount}
    >
      <SelectTrigger
        className={cn(
          "flex w-full items-center gap-2 [&>span]:line-clamp-1 [&>span]:flex [&>span]:w-full [&>span]:items-center [&>span]:gap-1 [&>span]:truncate [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0",
          isCollapsed &&
            "flex h-9 w-9 shrink-0 items-center justify-center p-0 [&>span]:w-auto [&>svg]:hidden"
        )}
        aria-label="Select account"
      >
        <SelectValue placeholder="Select an account">
          {accounts.length > 0 ? (
            <>
              <div dangerouslySetInnerHTML={{ __html: accounts.find((account) => account.email === selectedAccount)?.icon || "" }} />
              <span className={cn("ml-2", isCollapsed && "hidden")}>
                {
                  accounts.find((account) => account.email === selectedAccount)
                    ?.label
                }
              </span>
            </>
          ) : (
            <span>No linked accounts</span>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {accounts.length > 0 ? (
          <>
            {accounts.map((account) => (
              <SelectItem key={account.email} value={account.email}>
                <div className="flex items-center gap-3 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0 [&_svg]:text-foreground">
                  <div dangerouslySetInnerHTML={{ __html: account.icon }} />
                  {account.email}
                </div>
              </SelectItem>
            ))}
            <div className="mt-2 px-2 py-1.5">
              <Button
                variant="ghost"
                className="w-full justify-center"
                onClick={onAddAccount}
              >
                <MailPlus className="h-4 w-4" />
                Add another email
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="px-2 py-4 text-center text-sm text-muted-foreground">
              No linked accounts
            </div>
            <div className="px-2 py-1.5">
              <Button
                variant="ghost"
                className="w-full justify-center"
                onClick={onAddAccount}
              >
                <MailPlus className="h-4 w-4" />
                Add an email
              </Button>
            </div>
          </>
        )}
      </SelectContent>
    </Select>
  );
}
