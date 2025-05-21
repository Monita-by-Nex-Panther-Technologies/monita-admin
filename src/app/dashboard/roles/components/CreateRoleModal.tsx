"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useRolesStore } from "@/store/rolesStore";
import { Permission } from "@/store/permissionStore";
import Loading from "@/components/ui/Loading";

// Define types for the component props
interface CreateRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  permissions: Permission[] | undefined;
  onSuccess?: () => void;
}

const CreateRoleModal = ({ 
  isOpen, 
  onClose, 
  permissions,
  onSuccess 
}: CreateRoleModalProps) => {
  const [roleName, setRoleName] = useState("");
  const [roleDescription, setRoleDescription] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<Record<string, boolean>>({});
  const [selectedScopes, setSelectedScopes] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { createRole } = useRolesStore();

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

  // Reset form when modal is opened/closed
  useEffect(() => {
    if (isOpen) {
      setRoleName("");
      setRoleDescription("");
      setSelectedPermissions({});
      setSelectedScopes([]);
    }
  }, [isOpen]);

  // Toggle permission selection
  const handlePermissionToggle = (permissionValue: string) => {
    setSelectedPermissions(prev => {
      const updated = { ...prev };
      
      if (updated[permissionValue]) {
        // If permission is already selected, unselect it
        delete updated[permissionValue];
      } else {
        // Add new permission
        updated[permissionValue] = true;
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
        updated[scopeWildcard] = true;
      }
      
      return updated;
    });
  };

  // Check if a permission is selected
  const isPermissionSelected = (permissionValue: string): boolean => {
    return !!selectedPermissions[permissionValue];
  };

  // Check if a scope is selected
  const isScopeSelected = (scope: string): boolean => {
    return selectedScopes.includes(scope);
  };

  const handleCreateRole = async () => {
    // Validate form data
    if (!roleName) {
      toast.error("Please enter a role name");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Create the definitions array from selected permissions
      const definitions = Object.keys(selectedPermissions)
        .filter(key => selectedPermissions[key])
        .map(value => ({ value }));
      
      // Create role data object that matches the expected format
      const roleData = {
        name: roleName,
        description: roleDescription || undefined,
        definitions
      };
      
      // Call the create role function from the store
      await createRole(roleData);
      
      toast.success(`Role "${roleName}" created successfully!`);
      
      // Close modal and notify parent component
      onClose();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast.error((error as Error).message || "Failed to create role");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitting) {
    return <Loading />;
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[550px] p-0 overflow-auto max-h-[90vh]">
        <div className="p-6 pb-0">
          <div className="flex justify-between items-center">
            <DialogTitle className="text-2xl font-bold">Create New Role</DialogTitle>
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
                      checked={isPermissionSelected("*.*")}
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
                                isPermissionSelected(permission.value)
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
              onClick={handleCreateRole}
              className="h-12 rounded-md bg-yellow-100 hover:bg-yellow-200 text-black font-medium"
            >
              Create Role
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRoleModal;