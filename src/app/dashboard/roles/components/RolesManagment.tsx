"use client";

import { useState, useEffect } from "react";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import CreateRoleModal from "./CreateRoleModal";
import UpdateRoleModal from "./UpdateRoleModal";
import DeleteRoleModal from "./DeleteRoleModal";
import RolePermissionList from "./RolePermissionList";
import { usePermissionStore } from "@/store/permissionStore";
import { useRolesStore, Role } from "@/store/rolesStore";
import { Permission } from "@/store/permissionStore";

const RoleManagement = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);
  const [updateCounter, setUpdateCounter] = useState(0);

  const { permissions, isLoading: permissionsLoading, getPermissions } = usePermissionStore();
  const { roles, isLoading: rolesLoading, getRoles } = useRolesStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([getPermissions(), getRoles()]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [getPermissions, getRoles]);

  useEffect(() => {
    if (roles?.length > 0 && !selectedRole) {
      setSelectedRole(roles[0]);
    }
  }, [roles, selectedRole]);

  useEffect(() => {
    if (selectedRole && roles) {
      const updatedRole = roles.find(role => role.id === selectedRole.id);
      if (updatedRole) {
        setSelectedRole(updatedRole);
      }
    }
  }, [roles, updateCounter]);

  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => setIsCreateModalOpen(false);
  
  const openUpdateModal = () => setIsUpdateModalOpen(true);
  const closeUpdateModal = () => setIsUpdateModalOpen(false);
  
  const openDeleteModal = () => setIsDeleteModalOpen(true);
  const closeDeleteModal = () => setIsDeleteModalOpen(false);

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
  };

  const handleRoleCreated = async () => {
    await getRoles();
    closeCreateModal();
  };

  const handleRoleUpdated = async () => {
    await getRoles();
    setUpdateCounter(prev => prev + 1);
    closeUpdateModal();
  };

  const handleRoleDeleted = async () => {
    await getRoles();
    closeDeleteModal();
    if (roles && roles.length > 0) {
      setSelectedRole(roles[0]);
    } else {
      setSelectedRole(null);
    }
  };

  return (
    <section className="grid gap-6 mt-6 max-w-screen-xl mx-auto px-4">
      {/* Modals */}
      <CreateRoleModal 
        isOpen={isCreateModalOpen} 
        onClose={closeCreateModal} 
        permissions={permissions}
        onSuccess={handleRoleCreated}
      />
      
      {selectedRole && (
        <>
          <UpdateRoleModal 
            isOpen={isUpdateModalOpen} 
            onClose={closeUpdateModal}
            role={selectedRole}
            permissions={permissions}
            onSuccess={handleRoleUpdated}
          />
          
          <DeleteRoleModal 
            isOpen={isDeleteModalOpen} 
            onClose={closeDeleteModal}
            role={selectedRole}
            onSuccess={handleRoleDeleted}
          />
        </>
      )}
      
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-8 lg:items-start xl:flex">
        <div className="grid gap-8 xl:w-1/3 xl:shrink-0 lg:col-span-5">
          <h3 className="text-brand-black/80 font-semibold text-lg">
            Created Roles
          </h3>

          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="rounded p-4 h-10 bg-gray-300 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <ul className="grid gap-2">
              {roles?.map((role) => (
                <li key={role.id}>
                  <button
                    className={`px-3 py-2.5 border border-black/10 block w-full text-left rounded ${
                      selectedRole?.id === role?.id
                        ? "bg-primary/40 text-brand-black "
                        : "text-brand-black hover:bg-primary/10"
                    }`}
                    type="button"
                    onClick={() => handleRoleSelect(role)}
                  >
                    {role.name}
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="grid gap-4 order-first md:order-last">
            <div className="grid gap-2">
              <h3 className="text-brand-black/80 font-semibold text-lg">
                Custom Roles
              </h3>
              <p className="text-sm text-brand-black/70">
                Get to create a custom role and choose what a team member is
                liable to do.
              </p>
            </div>

            <div className="w-full md:w-auto">
              <Button
                className="w-full mt-6 h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-text-body rounded-full"
                type="button"
                onClick={openCreateModal}
              >
                <PlusIcon size={16} />
                Create a custom role
              </Button>
            </div>
          </div>
        </div>

        {/* Role permission list component */}
        <RolePermissionList
          selectedRole={selectedRole}
          permissions={permissions}
          loading={loading}
          onUpdateClick={openUpdateModal}
          onDeleteClick={openDeleteModal}
        />
      </div>
    </section>
  );
};

export default RoleManagement;