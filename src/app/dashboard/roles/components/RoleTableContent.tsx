"use client";

import { CheckCircle, XCircle } from "lucide-react";
import { Role } from "@/store/rolesStore";

interface PermissionLike {
  scope?: string;
  name?: string;
  value?: string;
}

interface RoleTableContentProps {
  selectedRole: Role | null;
  permissions: PermissionLike[];
  loading: boolean;
}

/**
 * Component to display granted and restricted permissions for a role
 */
const RoleTableContent = ({
  selectedRole,
  permissions,
  loading,
}: RoleTableContentProps) => {
  const getPermissionName = (permissionValue: string) => {
    if (permissionValue === "*.*") {
      return "All Permissions";
    }
    
    if (permissionValue.endsWith(".*")) {
      const scope = permissionValue.split(".")[0];
      return `All ${scope} Permissions`;
    }
    
    const permission = permissions?.find(p => p.value === permissionValue);
    if (permission && permission.name) {
      return permission.name === "*" ? `All ${permission.scope} Permissions` : permission.name;
    }
    
    const parts = permissionValue.split(".");
    return parts.length > 1 ? parts[1] : permissionValue;
  };

  const rolePermissions = selectedRole?.permissions ? 
    Object.entries(selectedRole.permissions)
      .map(([_, permission]) => permission.value)
      .filter((value): value is string => typeof value === 'string') :
    [];
  
  // Separate permissions into granted and restricted
  const grantedPermissions = rolePermissions;
  
  // Get all available permissions that aren't explicitly granted
  const otherPermissions = permissions
    ?.filter(permission => 
      typeof permission.value === 'string' && 
      !grantedPermissions.includes(permission.value)
    )
    .map(p => p.value)
    .filter((value): value is string => typeof value === 'string') || [];

  return (
    <div className="grid gap-4 items-start xl:grid-cols-2">
      <div>
        <p className="flex items-center gap-2 text-green-500 px-3 py-2.5 border border-black/10 w-full text-left font-medium rounded-t">
          <CheckCircle size={18} />
          Permissions Granted
        </p>

        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded p-4 h-10 bg-gray-300 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <ul className="border border-black/10 rounded-b divide-y divide-black/10">
            {grantedPermissions.length > 0 ? (
              grantedPermissions.map((permissionValue) => (
                <li
                  className="px-3 py-2.5 block w-full"
                  key={permissionValue}
                >
                  {getPermissionName(permissionValue)}
                </li>
              ))
            ) : (
              <li className="px-3 py-2.5 block w-full text-gray-500 italic">
                No granted permissions
              </li>
            )}
          </ul>
        )}
      </div>

      <div>
        <p className="flex items-center gap-2 text-red-500 px-3 py-2.5 border border-black/10 w-full text-left font-medium rounded-t">
          <XCircle size={18} />
          Restricted Access
        </p>

        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded p-4 h-10 bg-gray-300 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <ul className="border border-black/10 rounded-b divide-y divide-black/10">
            {otherPermissions.length > 0 ? (
              otherPermissions.map((permissionValue) => (
                <li
                  className="px-3 py-2.5 block w-full"
                  key={permissionValue}
                >
                  {getPermissionName(permissionValue)}
                </li>
              ))
            ) : (
              <li className="px-3 py-2.5 block w-full text-gray-500 italic">
                No restricted permissions
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default RoleTableContent;