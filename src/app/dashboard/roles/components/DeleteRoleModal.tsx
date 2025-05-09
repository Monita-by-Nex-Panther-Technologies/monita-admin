"use client";

interface DeleteRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: any;
}

const DeleteRoleModal = ({ isOpen, onClose, role }: DeleteRoleModalProps) => {
  const handleDeleteRole = () => {
    // Here you would implement the actual deletion logic
    console.log("Deleting role:", role?._id);
    
    onClose();
  };

  if (!isOpen || !role) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="grid gap-4">
          <h3 className="text-xl font-bold">Delete Role</h3>
          <p>Are you sure you want to delete the role "{role?.name}"? This action cannot be undone.</p>
          <div className="flex justify-end gap-3 mt-4">
            <button 
              className="px-4 py-2 border border-gray-300 rounded"
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              className="px-4 py-2 bg-brand-red text-white rounded"
              onClick={handleDeleteRole}
            >
              Delete Role
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteRoleModal;