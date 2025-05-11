"use client";

import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import RoleTableContent from "./RoleTableContent";
import { Role } from "@/store/rolesStore";
import { Permission } from "@/store/permissionStore";

interface RolePermissionListProps {
  selectedRole: Role | null;
  permissions: Permission[] | {
    scope: string;
    name: string;
    value: string;
  }[];
  loading: boolean;
  onUpdateClick: () => void;
  onDeleteClick: () => void;
}

/**
 * Component to display a selected role and its permissions
 */
const RolePermissionList = ({
  selectedRole,
  permissions,
  loading,
  onUpdateClick,
  onDeleteClick,
}: RolePermissionListProps) => {
  return (
    <div className="grid gap-6 lg:col-span-7">
      <div className="grid gap-3">
        <div className="flex items-center gap-4 justify-between flex-wrap">
          <h3 className="text-brand-black/80 font-semibold text-lg">
            {selectedRole?.name || "Select a role"}
          </h3>

          {loading || !permissions ? (
            <div className="flex items-center gap-2">
              <div className="animate-pulse px-8 py-2 rounded bg-gray-300"></div>
              <div className="animate-pulse px-8 py-2 rounded bg-gray-300"></div>
            </div>
          ) : selectedRole ? (
            <div className="flex items-center gap-4">
              <Button
                className="rounded-lg px-4 py-2 text-sm font-medium bg-transparent border border-primary/40 text-gray-700 hover:bg-primary/40 flex items-center gap-1"
                type="button"
                onClick={onUpdateClick}
              >
                <Edit size={16} />
                Update
              </Button>
            
              <Button
                className="rounded-lg px-4 py-2 text-sm font-medium border border-primary/40 text-gray-700 bg-red-100 hover:bg-red-200 flex items-center gap-1"
                type="button"
                onClick={onDeleteClick}
              >
                <Trash2 size={16} />
                Delete
              </Button>
            </div>
          ) : null}
        </div>

        {/* <p className="text-gray-600">{selectedRole?.description}</p> */}
      </div>

      {/* Role table content component */}
      {selectedRole && (
        <RoleTableContent
          selectedRole={selectedRole}
          permissions={permissions}
          loading={loading}
        />
      )}
    </div>
  );
};

export default RolePermissionList;