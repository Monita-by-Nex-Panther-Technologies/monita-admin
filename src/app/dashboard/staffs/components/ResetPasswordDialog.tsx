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
import { KeyRound } from "lucide-react";

interface ResetPasswordDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  staff: Staff | null;
  isLoading?: boolean;
}

const ResetPasswordDialog: React.FC<ResetPasswordDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  staff,
  isLoading = false,
}) => {
  if (!staff) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-col items-center">
          <div className="bg-blue-50 rounded-full p-3 mb-4">
            <KeyRound className="h-6 w-6 text-primary-300" />
          </div>
          <DialogTitle>Reset Password</DialogTitle>
          <DialogDescription className="text-center mt-2">
            Send password reset email to {staff.firstName} {staff.lastName} ({staff.email})
          </DialogDescription>
        </DialogHeader>
        <div className="my-2 text-sm text-gray-600">
          This will send a password reset link to the staff member's email address. The link will expire after 24 hours.
        </div>
        <DialogFooter className="sm:justify-center gap-2 mt-4">
          <Button 
            variant="outline" 
            onClick={() => onClose()}
            disabled={isLoading}
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
            disabled={isLoading}
            className="w-full sm:w-auto bg-primary-300 hover:bg-primary-400"
          >
            {isLoading ? "Sending..." : "Reset Password"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ResetPasswordDialog;