"use client";

import { useState, useEffect } from "react";

import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocalStorage } from "usehooks-ts";
import { Mail } from "lucide-react";
import { AddAccountButton } from "@/components/add-account-button";
import { SiGmail } from "react-icons/si";
import { PiMicrosoftOutlookLogo } from "react-icons/pi";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/server/client";

type Props = {
  isCollapsed: boolean;
}

export function AccountSwitcher({ isCollapsed }: Props) {
  const { data: accounts } = trpc.account.getAccounts.useQuery()
  const [accountId, setAccountId] = useLocalStorage("accountId", "");

  return (
    <>
      <Select value={accountId} onValueChange={setAccountId}>
        <SelectTrigger
          className={cn(
            "flex w-full items-center gap-2 [&>span]:line-clamp-1 [&>span]:flex [&>span]:w-full [&>span]:items-center [&>span]:gap-1 [&>span]:truncate [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0",
            isCollapsed &&
              "flex h-9 w-9 shrink-0 items-center justify-center p-0 [&>span]:w-auto [&>svg]:hidden"
          )}
          aria-label="Select account"
        >
          <SelectValue placeholder="Select an account">
            {accounts && accounts.length > 0 ? (
              <>
                {(() => {
                  const selected = accounts.find(
                    (account: any) => account.id === accountId
                  );
                  if (!selected) return <Mail className="h-4 w-4" />;
                  if (selected.provider === "Office365")
                    return <PiMicrosoftOutlookLogo className="h-4 w-4" />;
                  if (selected.provider === "Google")
                    return <SiGmail className="h-4 w-4" />;
                  return <Mail className="h-4 w-4" />;
                })()}
                <span className={cn("ml-2", isCollapsed && "hidden")}>
                  {
                    accounts.find(
                      (account: any) => account.id === accountId
                    )?.emailAddress
                  }
                </span>
              </>
            ) : (
              <span>No linked accounts</span>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {accounts && accounts.length > 0 ? (
            <>
              {accounts.map((account: any) => (
                <SelectItem
                  key={account.emailAddress}
                  value={account.id}
                >
                  <div className="flex items-center gap-3 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0 [&_svg]:text-foreground">
                    {(() => {
                      const selected = accounts.find(
                        (account: any) => account.id === accountId
                      );
                      if (!selected) return <Mail className="h-4 w-4" />;
                      if (selected.provider === "Office365")
                        return <PiMicrosoftOutlookLogo className="h-4 w-4" />;
                      if (selected.provider === "Google")
                        return <SiGmail className="h-4 w-4" />;
                      return <Mail className="h-4 w-4" />;
                    })()}
                    {account.emailAddress}
                  </div>
                </SelectItem>
              ))}
            </>
          ) : (
            <>
              <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                No linked accounts
              </div>
            </>
          )}
          <div className="mt-1 border-t pt-1">
            <AddAccountButton asDropdownItem />
          </div>
        </SelectContent>
      </Select>
    </>
  );
}
