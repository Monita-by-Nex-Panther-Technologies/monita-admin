"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useRolesStore, Role } from "@/store/rolesStore";
import { Permission } from "@/store/permissionStore";

// Define types for the component props
interface UpdateRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: Role | null;
  permissions: Permission[] | undefined;
  onSuccess?: () => void;
}

// Define the type for selected permissions
interface SelectedPermission {
  value: string;
  action: "Accept" | "Reject";
}

const UpdateRoleModal = ({ 
  isOpen, 
  onClose, 
  role, 
  permissions,
  onSuccess 
}: UpdateRoleModalProps) => {
  const [roleName, setRoleName] = useState("");
  const [roleDescription, setRoleDescription] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<Record<string, SelectedPermission>>({});
  const [selectedScopes, setSelectedScopes] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { updateRole } = useRolesStore();

  // Group permissions by scope
  const groupPermissionsByScope = () => {
    const scopes: Record<string, Permission[]> = {};
    
    permissions?.forEach(permission => {
      if (!scopes[permission.scope]) {
        scopes[permission.scope] = [];
      }
      scopes[permission.scope].push(permission);
    });
    
    return scopes;
  };

  const permissionsByScope = groupPermissionsByScope();

  // Update form when role changes
  useEffect(() => {
    if (role && isOpen) {
      setRoleName(role.name || "");
      // setRoleDescription(role.description || "");
      
      // Initialize selected permissions from role data
      const permissionsData: Record<string, SelectedPermission> = {};
      if (role.permissions) {
        Object.entries(role.permissions).forEach(([key, value]) => {
          permissionsData[key] = {
            value: key,
            action: value.action as "Accept" | "Reject"
          };
        });
      }
      setSelectedPermissions(permissionsData);
      
      // Initialize selected scopes based on permissions
      const scopes = new Set<string>();
      Object.keys(permissionsData).forEach(key => {
        if (key.endsWith(".*")) {
          const scope = key.split(".")[0];
          scopes.add(scope);
        }
      });
      setSelectedScopes(Array.from(scopes));
    }
  }, [role, isOpen]);

  // Toggle permission selection
  const handlePermissionToggle = (permissionValue: string) => {
    setSelectedPermissions(prev => {
      const updated = { ...prev };
      
      if (updated[permissionValue]) {
        // If permission exists, remove it (we're only using Accept now as requested)
        delete updated[permissionValue];
      } else {
        // Add new permission with Accept action (always Accept as requested)
        updated[permissionValue] = { value: permissionValue, action: "Accept" };
      }
      
      return updated;
    });
  };

  // Toggle all permissions for a scope
  const handleScopeToggle = (scope: string) => {
    const isSelected = selectedScopes.includes(scope);
    
    // Update selected scopes list
    if (isSelected) {
      setSelectedScopes(prev => prev.filter(s => s !== scope));
    } else {
      setSelectedScopes(prev => [...prev, scope]);
    }
    
    // Update permissions based on scope selection
    setSelectedPermissions(prev => {
      const updated = { ...prev };
      const scopeWildcard = `${scope}.*`;
      
      if (isSelected) {
        // Remove scope wildcard permission
        delete updated[scopeWildcard];
      } else {
        // Add scope wildcard permission
        updated[scopeWildcard] = { value: scopeWildcard, action: "Accept" };
      }
      
      return updated;
    });
  };

  // Check if a permission is selected with Accept action
  const isPermissionAccepted = (permissionValue: string): boolean => {
    return selectedPermissions[permissionValue]?.action === "Accept";
  };

  // Check if a permission is selected with Reject action
  const isPermissionRejected = (permissionValue: string): boolean => {
    return selectedPermissions[permissionValue]?.action === "Reject";
  };

  // Check if a scope is selected (all permissions in scope are accepted)
  const isScopeSelected = (scope: string): boolean => {
    return selectedScopes.includes(scope);
  };

  const handleUpdateRole = async () => {
    // Validate form data
    if (!roleName) {
      toast.error("Please enter a role name");
      return;
    }

    if (!role) {
      toast.error("No role selected for update");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Convert the selected permissions to the required format
      const definitions = Object.keys(selectedPermissions).map(key => ({
        value: key,
        action: selectedPermissions[key].action
      }));
      
      // Create updated role data object
      const updatedData = {
        name: roleName,
        // Note: Ignoring description as requested
        definitions: definitions
      };
      
      // Call the update role function from the store with separate roleId and updatedData
      await updateRole(role.id, updatedData);
      
      toast.success(`Role "${roleName}" updated successfully!`);
      
      // Close modal and notify parent component
      onClose();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast.error((error as Error).message || "Failed to update role");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!role) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[550px] p-0 overflow-auto max-h-[90vh]">
        <div className="p-6 pb-0">
          <div className="flex justify-between items-center">
            <DialogTitle className="text-2xl font-bold">Update Role</DialogTitle>
          </div>
        </div>

        <div className="h-[1px] bg-gray-200 w-full my-6"></div>

        <div className="p-6 pt-0">
          <div className="bg-white rounded-lg space-y-6">
            <div className="space-y-2">
              <Label htmlFor="roleName" className="text-sm font-medium">
                Role Name*
              </Label>
              <Input
                id="roleName"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                placeholder="Enter role name"
                className="h-10 text-sm rounded-lg border-gray-300"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="roleDescription" className="text-sm font-medium">
                Description
              </Label>
              <Textarea
                id="roleDescription"
                value={roleDescription}
                onChange={(e) => setRoleDescription(e.target.value)}
                placeholder="Enter role description"
                className="min-h-[100px] text-sm rounded-lg border-gray-300 resize-none"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">
                  Permissions*
                </Label>
                <div className="flex items-center gap-2 text-xs">
                  <span className="inline-block w-4 h-4 bg-green-100 border border-green-400 rounded-sm"></span>
                  <span className="text-gray-600">Selected</span>
                </div>
              </div>
              
              <div className="border border-gray-300 rounded-lg max-h-[60vh] overflow-y-auto p-3">
                {/* All permissions option */}
                <div className="mb-4 pb-2 border-b border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="checkbox"
                      id="all-permissions"
                      checked={isPermissionAccepted("*.*")}
                      onChange={() => handlePermissionToggle("*.*")}
                      className="rounded text-brand-red focus:ring-brand-red"
                    />
                    <Label htmlFor="all-permissions" className="text-sm font-medium">
                      All Permissions
                    </Label>
                  </div>
                </div>
                
                {/* Permissions by scope */}
                {Object.keys(permissionsByScope).map((scope) => (
                  <div key={scope} className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        type="checkbox"
                        id={`scope-${scope}`}
                        checked={isScopeSelected(scope)}
                        onChange={() => handleScopeToggle(scope)}
                        className="rounded text-brand-red focus:ring-brand-red"
                      />
                      <Label htmlFor={`scope-${scope}`} className="text-sm font-medium capitalize">
                        {scope}
                      </Label>
                    </div>
                    <div className="ml-6 space-y-1">
                      {permissionsByScope[scope].map((permission) => (
                        <div key={permission.value} className="flex items-center py-1">
                          <div className="flex-1 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handlePermissionToggle(permission.value)}
                              className={`w-4 h-4 rounded-sm border ${
                                isPermissionAccepted(permission.value)
                                  ? "bg-green-100 border-green-400"
                                  : "bg-white border-gray-300"
                              }`}
                            ></button>
                            <Label htmlFor={`perm-${permission.value}`} className="text-sm font-normal">
                              {permission.name}
                            </Label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
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
              onClick={handleUpdateRole}
              disabled={isSubmitting}
              className="h-12 rounded-md bg-yellow-100 hover:bg-yellow-200 text-black font-medium"
              variant="ghost"
            >
              {isSubmitting ? "Updating Role..." : "Update Role"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateRoleModal;