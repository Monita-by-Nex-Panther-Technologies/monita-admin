"use client";

import { useState, useEffect } from "react";

interface UpdateRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: any;
  permissions: any[];
}

const UpdateRoleModal = ({ isOpen, onClose, role, permissions }: UpdateRoleModalProps) => {
  const [roleName, setRoleName] = useState("");
  const [roleDescription, setRoleDescription] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  // Update form values when role changes
  useEffect(() => {
    if (role) {
      setRoleName(role.name || "");
      setRoleDescription(role.description || "");
      setSelectedPermissions(role.permissions?.map((p: any) => p.codename) || []);
    }
  }, [role]);

  const handlePermissionToggle = (permissionCodename: string) => {
    setSelectedPermissions(prev => 
      prev.includes(permissionCodename)
        ? prev.filter(p => p !== permissionCodename)
        : [...prev, permissionCodename]
    );
  };

  const handleUpdateRole = () => {
    // Here you would implement the actual update logic
    console.log("Updating role:", {
      id: role?._id,
      name: roleName,
      description: roleDescription,
      permissions: selectedPermissions
    });
    
    onClose();
  };

  if (!isOpen || !role) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="grid gap-4">
          <h3 className="text-xl font-bold">Update Role</h3>
          <div className="grid gap-2">
            <label htmlFor="updateRoleName" className="text-sm font-medium">Role Name</label>
            <input 
              id="updateRoleName" 
              type="text" 
              className="border border-gray-300 rounded px-3 py-2" 
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="updateRoleDescription" className="text-sm font-medium">Description</label>
            <textarea 
              id="updateRoleDescription" 
              className="border border-gray-300 rounded px-3 py-2" 
              rows={3}
              value={roleDescription}
              onChange={(e) => setRoleDescription(e.target.value)}
            ></textarea>
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Permissions</label>
            <div className="border border-gray-300 rounded max-h-60 overflow-y-auto p-2">
              {permissions.map((permission) => (
                <div key={permission._id} className="flex items-center gap-2 py-1">
                  <input 
                    type="checkbox" 
                    id={`update-perm-${permission._id}`}
                    checked={selectedPermissions.includes(permission.codename)}
                    onChange={() => handlePermissionToggle(permission.codename)}
                  />
                  <label htmlFor={`update-perm-${permission._id}`}>{permission.name}</label>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button 
              className="px-4 py-2 border border-gray-300 rounded"
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              className="px-4 py-2 bg-blue-600 text-white rounded"
              onClick={handleUpdateRole}
            >
              Update Role
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateRoleModal;