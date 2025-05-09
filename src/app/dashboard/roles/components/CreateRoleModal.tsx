"use client";
import React, { useState, useEffect, type ChangeEvent } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface Permission {
  _id: string;
  codename: string;
  name: string;
  module: string;
}

interface CreateRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  permissions: Permission[];
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
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Group permissions by module
  const groupPermissionsByModule = () => {
    const modules: Record<string, Permission[]> = {};
    
    permissions.forEach(permission => {
      if (!modules[permission.module]) {
        modules[permission.module] = [];
      }
      modules[permission.module].push(permission);
    });
    
    return modules;
  };

  const permissionsByModule = groupPermissionsByModule();

  // Update selected modules whenever selected permissions change
  useEffect(() => {
    const modules = Object.keys(permissionsByModule);
    const selected = modules.filter(module => {
      const modulePermissions = permissionsByModule[module].map(p => p.codename);
      return modulePermissions.every(p => selectedPermissions.includes(p));
    });
    
    setSelectedModules(selected);
  }, [selectedPermissions]);

  // Toggle permission selection
  const handlePermissionToggle = (permissionCodename: string) => {
    setSelectedPermissions(prev =>
      prev.includes(permissionCodename)
        ? prev.filter(p => p !== permissionCodename)
        : [...prev, permissionCodename]
    );
  };

  // Toggle all permissions for a module
  const handleModuleToggle = (module: string) => {
    const modulePermissions = permissionsByModule[module].map(p => p.codename);
    const allSelected = modulePermissions.every(p => selectedPermissions.includes(p));
    
    if (allSelected) {
      // Remove all module permissions
      setSelectedPermissions(prev => 
        prev.filter(p => !modulePermissions.includes(p))
      );
    } else {
      // Add all module permissions
      setSelectedPermissions(prev => {
        const newPerms = [...prev];
        modulePermissions.forEach(p => {
          if (!newPerms.includes(p)) {
            newPerms.push(p);
          }
        });
        return newPerms;
      });
    }
  };

  // Check if all permissions in a module are selected
  const isModuleSelected = (module: string) => {
    const modulePermissions = permissionsByModule[module].map(p => p.codename);
    return modulePermissions.every(p => selectedPermissions.includes(p));
  };

  const handleCreateRole = async () => {
    // Validate form data
    if (!roleName) {
      toast.error("Please enter a role name");
      return;
    }
    
    try {
      setIsSubmitting(true);
      // Here you would implement the actual creation logic
      console.log("Creating role:", {
        name: roleName,
        description: roleDescription,
        permissions: selectedPermissions
      });
      
      // Simulate API call success
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast.success(`Role "${roleName}" created successfully!`);
      
      // Reset form and close modal
      setRoleName("");
      setRoleDescription("");
      setSelectedPermissions([]);
      
      // Close modal and notify parent component
      onClose();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create role");
    } finally {
      setIsSubmitting(false);
    }
  };

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
                onChange={(e: ChangeEvent<HTMLInputElement>) => setRoleName(e.target.value)}
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
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setRoleDescription(e.target.value)}
                placeholder="Enter role description"
                className="min-h-[100px] text-sm rounded-lg border-gray-300 resize-none"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Permissions*
              </Label>
              <div className="border border-gray-300 rounded-lg max-h-[60vh] overflow-y-auto p-3">
                {Object.keys(permissionsByModule).map((module) => (
                  <div key={module} className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        type="checkbox"
                        id={`module-${module}`}
                        checked={isModuleSelected(module)}
                        onChange={() => handleModuleToggle(module)}
                        className="rounded text-brand-red focus:ring-brand-red"
                      />
                      <Label htmlFor={`module-${module}`} className="text-sm font-medium capitalize">
                        {module}
                      </Label>
                    </div>
                    <div className="ml-6 space-y-1">
                      {permissionsByModule[module].map((permission) => (
                        <div key={permission._id} className="flex items-center gap-2 py-1">
                          <input
                            type="checkbox"
                            id={`perm-${permission._id}`}
                            checked={selectedPermissions.includes(permission.codename)}
                            onChange={() => handlePermissionToggle(permission.codename)}
                            className="rounded text-brand-red focus:ring-brand-red"
                          />
                          <Label htmlFor={`perm-${permission._id}`} className="text-sm font-normal">
                            {permission.name}
                          </Label>
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
              onClick={handleCreateRole}
              disabled={isSubmitting}
              className="w-full h-12 mt-4 rounded-md bg-yellow-100 hover:bg-yellow-200 text-black font-medium"
              variant="ghost"
            >
              {isSubmitting ? "Creating Role..." : "Create Role"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRoleModal;