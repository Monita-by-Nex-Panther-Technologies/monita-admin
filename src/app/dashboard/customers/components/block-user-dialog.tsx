"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface BlockUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BlockUserDialog({ open, onOpenChange }: BlockUserDialogProps) {
  const handleCancel = () => {
    onOpenChange(false);
  };

  const handleConfirm = () => {
    // Here you would handle the block user logic
    alert("User blocked successfully");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] p-6 gap-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-red-100 p-2 rounded-full">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 9V11M12 15H12.01M5.07183 19H18.9282C20.4678 19 21.4301 17.3333 20.6603 16L13.7321 4C12.9623 2.66667 11.0378 2.66667 10.268 4L3.33978 16C2.56998 17.3333 3.53223 19 5.07183 19Z"
                  stroke="#FF0000"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold">Block User</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={handleCancel}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <p className="text-gray-600">
          Are you sure you want to block this user? This action can be undone
          but it may affect their related transactions.
        </p>

        <div className="flex gap-4 justify-between">
          <Button
            variant="outline"
            className="flex-1 rounded-full border-gray-300"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 bg-[#DDFF00] hover:bg-[#DDFF00]/90 text-black font-medium rounded-full"
            onClick={handleConfirm}
          >
            Confirm Block
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
