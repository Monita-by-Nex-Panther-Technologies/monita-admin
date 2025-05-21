"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Staff } from "@/store/staffStore";
import { Mail } from "lucide-react";
import Loading from "@/components/ui/Loading";

interface ResendInviteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  staff: Staff | null;
  isLoading?: boolean;
}
 
const ResendInviteDialog: React.FC<ResendInviteDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  staff,
  isLoading = false,
}) => {
  if (!staff) return null;

  // Show loading overlay when isLoading is true
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <Loading />
      </div>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-col items-center">
          <div className="bg-blue-50 rounded-full p-3 mb-4">
            <Mail className="h-6 w-6 text-primary-300" />
          </div>
          <DialogTitle>Resend Invitation</DialogTitle>
          <DialogDescription className="text-center mt-2">
            Resend invitation email to {staff.firstName} {staff.lastName} ({staff.email})
          </DialogDescription>
        </DialogHeader>
        <div className="my-2 text-sm text-gray-600">
          A new invitation email will be sent to this staff member with instructions to set up their account.
        </div>
        <DialogFooter className="sm:justify-center gap-2 mt-4">
          <Button 
            variant="outline" 
            onClick={() => onClose()}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            variant="default"
            className="w-full sm:w-auto bg-primary-300 hover:bg-primary-400"
          >
            Resend Invitation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ResendInviteDialog;