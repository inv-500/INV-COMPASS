"use client";

import { Download, MoreHorizontal, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Overlays open outside the theme frames, so they follow the page theme. Use the theme switch at the top to try both.
export function InteractiveDemos() {
  return (
    <TooltipProvider>
      <div className="flex flex-wrap items-center gap-3">
        <Button
          variant="outline"
          onClick={() =>
            toast("Snag archived", {
              description: "VLA01-LIV-PN-02 moved to archive.",
              action: { label: "Undo", onClick: () => toast("Snag restored") },
            })
          }
        >
          Show a toast with Undo
        </Button>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive">
              <Trash2 className="size-4" aria-hidden="true" />
              Delete drafts
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete 3 drafts?</DialogTitle>
              <DialogDescription>
                Drafts have not been shared with anyone. This cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Keep drafts</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button variant="destructive">Delete 3 drafts</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <MoreHorizontal className="size-4" aria-hidden="true" />
              Row actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>VLA01-MBR-WD-01</DropdownMenuLabel>
            <DropdownMenuItem>Open</DropdownMenuItem>
            <DropdownMenuItem>Assign</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Archive</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Download BOQ as PDF"
            >
              <Download className="size-4" aria-hidden="true" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Download BOQ as PDF</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
