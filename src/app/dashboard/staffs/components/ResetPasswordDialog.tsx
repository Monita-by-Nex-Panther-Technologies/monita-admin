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
import Loading from "@/components/ui/Loading";

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
            Reset Password
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
 
export default ResetPasswordDialog;