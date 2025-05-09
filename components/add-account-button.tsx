import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getAurinkoAuthUrl } from "@/lib/aurinko";
import { Plus } from "lucide-react";
import { PiMicrosoftOutlookLogo } from "react-icons/pi";
import { SiGmail } from "react-icons/si";

type Props = {
  asDropdownItem?: boolean;
}

export function AddAccountButton({
  asDropdownItem = false,
}: Props) {
  const handleAddAccount = async (provider: "Google" | "Office365") => {
    const authUrl = await getAurinkoAuthUrl(provider);
    window.location.href = authUrl;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {asDropdownItem ? (
          <Button
            variant="ghost"
            className="w-full justify-start text-sm p-2" // Adjusted styling for dropdown
          >
            <Plus className="mr-2 h-4 w-4" />
            Add account
          </Button>
        ) : (
          <Button variant="outline" size="icon" className="ml-auto shrink-0">
            <Plus className="h-4 w-4" />
            <span className="sr-only">Add account</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Email Account</DialogTitle>
          <DialogDescription>
            Choose the provider for the account you want to add.
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-4">
          <div className="relative w-1/2">
            <Button
              className="w-full py-6 h-auto flex flex-col gap-2 items-center"
              variant="outline"
              onClick={() => handleAddAccount("Google")}
              disabled
            >
              <SiGmail className="h-6 w-6" />
              Gmail
            </Button>
            <div className="absolute inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center rounded-md hover:cursor-default">
              <span className="text-white text-sm font-semibold">Coming soon</span>
            </div>
          </div>
          <Button
            className="w-1/2 py-6 h-auto flex flex-col gap-2 items-center"
            variant="outline"
            onClick={() => handleAddAccount("Office365")}
          >
            <PiMicrosoftOutlookLogo className="h-6 w-6" />
            Outlook
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
