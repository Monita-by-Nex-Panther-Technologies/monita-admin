"use client";

import { CheckCircle, XCircle } from "lucide-react";

interface RoleTableContentProps {
  selectedRole: any;
  permissions: any[];
  loading: boolean;
}

const RoleTableContent = ({
  selectedRole,
  permissions,
  loading,
}: RoleTableContentProps) => {
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
            {selectedRole?.permissions?.map(
              (permission: any) => (
                <li
                  className="px-3 py-2.5 block w-full"
                  key={permission.codename}
                >
                  {permission.name.replace(/&amp;/g, "&")}
                </li>
              )
            )}
          </ul>
        )}
      </div>

      <div>
        <p className="flex items-center gap-2 text-red-500 px-3 py-2.5 border border-black/10 w-full text-left font-medium rounded-t">
          <XCircle size={18} />
          Restricted Access
        </p>

        {loading || !selectedRole || !permissions ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded p-4 h-10 bg-gray-300 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <ul className="border border-black/10 rounded-b divide-y divide-black/10">
            {permissions
              ?.filter(
                (permission) =>
                  !selectedRole?.permissions?.some(
                    (rolePermission: any) =>
                      rolePermission.codename === permission.codename
                  )
              )
              .map(
                (permission) => (
                  <li
                    className="px-3 py-2.5 block w-full"
                    key={permission._id}
                  >
                    {permission.name.replace(/&amp;/g, "&")}
                  </li>
                )
              )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default RoleTableContent;