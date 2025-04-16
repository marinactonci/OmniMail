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
import { Button } from "@/components/ui/button";
import { MailPlus } from "lucide-react";
import { getAurinkoAuthUrl } from "@/lib/aurinko";
import { useLocalStorage } from "usehooks-ts";
import { Mail } from "lucide-react";
import { SiGmail } from "react-icons/si";
import { PiMicrosoftOutlookLogo } from "react-icons/pi";

interface AccountSwitcherProps {
  isCollapsed: boolean;
}

export function AccountSwitcher({ isCollapsed }: AccountSwitcherProps) {
  const [accountId, setAccountId] = useLocalStorage("accountId", "");
  const [accounts, setAccounts] = useState<any>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    fetch("/api/account")
      .then((res) => res.json())
      .then((data) => {
        setAccounts(data.data || []);
        if (!accountId && data.data && data.data.length > 0) {
          setAccountId(data.data[0].email);
        }
      })
      .catch((error) => console.error(error));

      setMounted(true);
  }, []);

  if (!mounted) {
    // Optionally, you can return a skeleton or null
    return null;
  }

  const onAddAccount = async () => {
    const authUrl = await getAurinkoAuthUrl("Office365");
    window.location.href = authUrl;
  };

  return (
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
          {accounts.length > 0 ? (
            <>
              {(() => {
                const selected = accounts.find(
                  (account: any) => account.emailAddress === accountId
                );
                if (!selected) return <Mail className="h-4 w-4" />;
                if (selected.provider === "Office365")
                  return (
                    <PiMicrosoftOutlookLogo className="h-4 w-4" />
                  );
                if (selected.provider === "Google")
                  return <SiGmail className="h-4 w-4" />;
                return <Mail className="h-4 w-4" />;
              })()}
              <span className={cn("ml-2", isCollapsed && "hidden")}>
                {
                  accounts.find((account: any) => account.emailAddress === accountId)
                    ?.emailAddress
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
            {accounts.map((account: any) => (
              <SelectItem key={account.emailAddress} value={account.emailAddress}>
                <div className="flex items-center gap-3 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0 [&_svg]:text-foreground">
                  {/* Replace the dangerouslySetInnerHTML with provider-based icon */}
                  {(() => {
                    const selected = accounts.find(
                      (account: any) => account.emailAddress === accountId
                    );
                    if (!selected) return <Mail className="h-4 w-4" />;
                    if (selected.provider === "Office365")
                      return (
                        <PiMicrosoftOutlookLogo className="h-4 w-4" />
                      );
                    if (selected.provider === "Google")
                      return <SiGmail className="h-4 w-4" />;
                    return <Mail className="h-4 w-4" />;
                  })()}
                  {account.emailAddress}
                </div>
              </SelectItem>
            ))}
            <div className="mt-2">
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
            <div>
              <Button
                variant="ghost"
                className="w-full justify-center"
                onClick={onAddAccount}
              >
                <MailPlus className="h-4 w-4" />
                Add an email
oun           </Button>
            </div>
          </>
        )}
      </SelectContent>
    </Select>
  );
}
