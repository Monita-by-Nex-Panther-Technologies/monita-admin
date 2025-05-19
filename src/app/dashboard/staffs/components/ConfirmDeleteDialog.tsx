"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Loading from "@/components/ui/Loading";

interface ConfirmDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

const ConfirmDeleteDialog: React.FC<ConfirmDeleteDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Delete",
  cancelText = "Cancel",
  isLoading = false,
}) => {

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <Loading />
      </div>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] p-0 overflow-auto">
        <div className="p-6 pb-0">
          <div className="flex justify-between items-center">
            <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
          </div>
        </div>

        <div className="h-[1px] bg-gray-200 w-full my-6"></div>

        <div className="p-6 pt-0">
          <p className="text-sm text-gray-600 mb-6">{description}</p>

          <div className="flex flex-row gap-4 justify-end">
            <Button 
              variant="outline" 
              onClick={onClose} 
              className="h-10 rounded-lg text-sm"
            >
              {cancelText}
            </Button>
            <Button
              onClick={(e) => {
                e.preventDefault();
                onConfirm();
              }}
              variant="destructive"
              className="h-10 rounded-lg text-sm"
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDeleteDialog;
