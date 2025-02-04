import { ReactNode } from "react";

import {Copy} from 'lucide-react'

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function SheetInfo(props: { children: ReactNode }) {
  const url = window.location.origin + window.location.pathname;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
  };
  return (
    <Sheet>
      <SheetTrigger>{props.children}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Meeting details</SheetTitle>
          <div className="flex flex-col gap-y-3">
            <p className="font-semibold">Joining info</p>
            <p>{url}</p>

            <Button onClick={copyToClipboard} variant={"outline"}>
              <Copy />Copy joining info
            </Button>
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
