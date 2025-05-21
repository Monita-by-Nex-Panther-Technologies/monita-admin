"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRolesStore, Role } from "@/store/rolesStore";
import Loading from "@/components/ui/Loading";

// Define types for the component props
interface DeleteRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: Role | null;
  onSuccess?: () => void;
}

const DeleteRoleModal = ({ 
  isOpen, 
  onClose, 
  role,
  onSuccess 
}: DeleteRoleModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { deleteRole } = useRolesStore();

  const handleDeleteRole = async () => {
    if (!role) {
      toast.error("No role selected for deletion");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Call the delete role function from the store
      await deleteRole(role.id);
      
      toast.success(`Role "${role.name}" deleted successfully!`);
      
      // Close modal and notify parent component
      onClose();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast.error((error as Error).message || "Failed to delete role");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitting) {
    return <Loading />;
  }

  if (!role) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] p-0">
        <div className="p-6 pb-0">
          <div className="flex justify-between items-center">
            <DialogTitle className="text-2xl font-bold">Delete Role</DialogTitle>
          </div>
        </div>

        <div className="h-[1px] bg-gray-200 w-full my-6"></div>

        <div className="p-6 pt-0">
          <div className="bg-white rounded-lg">
            <div className="space-y-4">
              <p className="text-gray-700">
                Are you sure you want to delete the role <span className="font-semibold">"{role.name}"</span>? 
              </p>
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                <p className="text-sm text-yellow-800">
                  This action cannot be undone. All permissions associated with this role will be permanently removed.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button
                onClick={onClose}
                variant="outline"
                className="h-12 rounded-md"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteRole}
                disabled={isSubmitting}
                className="h-12 rounded-md bg-red-600 hover:bg-red-700 text-white font-medium"
              >
                Delete Role
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteRoleModal;