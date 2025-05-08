"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon, CheckCircle, XCircle, Edit, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";

// Mock data for roles
const MOCK_ROLES = [
  {
    _id: "1",
    name: "superuser",
    description: "Manage website",
    permissions: [
      { codename: "view_metrics", name: "Can View Performance Metrics", module: "analytics" },
      { codename: "view_transactions", name: "Can View Transactions", module: "transactions" },
      { codename: "export_transactions", name: "Can Export Transactions", module: "transactions" },
      { codename: "manage_refunds", name: "Can Manage Refunds & Disputes", module: "transactions" },
      { codename: "view_customers", name: "Can View Customers", module: "customers" },
      { codename: "manage_customers", name: "Can Manage & Update Customers", module: "customers" },
      { codename: "credit_debit", name: "Can Credit & Debit Customers", module: "customers" },
      { codename: "view_plan", name: "Can View Plan", module: "plans" },
      { codename: "manage_plan", name: "Can Manage & Update Plan", module: "plans" },
      { codename: "view_product", name: "Can View Product", module: "products" },
      { codename: "manage_product", name: "Can Create and Manage Product", module: "products" },
      { codename: "view_group", name: "Can View Group", module: "groups" },
      { codename: "manage_group", name: "Can Create and Manage Group", module: "groups" },
      { codename: "view_service", name: "Can View Service", module: "services" },
    ]
  },
  {
    _id: "2",
    name: "Developer",
    description: "Technical access to developer tools and APIs",
    permissions: [
      { codename: "view_metrics", name: "Can View Performance Metrics", module: "analytics" },
      { codename: "view_transactions", name: "Can View Transactions", module: "transactions" },
      { codename: "export_transactions", name: "Can Export Transactions", module: "transactions" },
      { codename: "view_product", name: "Can View Product", module: "products" },
      { codename: "manage_product", name: "Can Create and Manage Product", module: "products" },
    ]
  },
  {
    _id: "3",
    name: "Custom Role",
    description: "Custom role with limited permissions",
    permissions: [
      { codename: "view_customers", name: "Can View Customers", module: "customers" },
      { codename: "view_plan", name: "Can View Plan", module: "plans" },
    ]
  },
  {
    _id: "4",
    name: "test",
    description: "Test role for QA purposes",
    permissions: [
      { codename: "view_transactions", name: "Can View Transactions", module: "transactions" },
    ]
  },
  {
    _id: "5",
    name: "Invest",
    description: "Role for investment team members",
    permissions: [
      { codename: "view_metrics", name: "Can View Performance Metrics", module: "analytics" },
      { codename: "view_transactions", name: "Can View Transactions", module: "transactions" },
      { codename: "export_transactions", name: "Can Export Transactions", module: "transactions" },
    ]
  },
  {
    _id: "6",
    name: "CCR",
    description: "Customer Care Representative",
    permissions: [
      { codename: "view_customers", name: "Can View Customers", module: "customers" },
      { codename: "view_transactions", name: "Can View Transactions", module: "transactions" },
    ]
  },
  {
    _id: "7",
    name: "Technical Team",
    description: "IT support and technical operations",
    permissions: [
      { codename: "view_metrics", name: "Can View Performance Metrics", module: "analytics" },
      { codename: "view_product", name: "Can View Product", module: "products" },
      { codename: "view_service", name: "Can View Service", module: "services" },
    ]
  },
];

// All available permissions
const ALL_PERMISSIONS = [
  { _id: "1", codename: "view_metrics", name: "Can View Performance Metrics", module: "analytics" },
  { _id: "2", codename: "view_transactions", name: "Can View Transactions", module: "transactions" },
  { _id: "3", codename: "export_transactions", name: "Can Export Transactions", module: "transactions" },
  { _id: "4", codename: "manage_refunds", name: "Can Manage Refunds & Disputes", module: "transactions" },
  { _id: "5", codename: "view_customers", name: "Can View Customers", module: "customers" },
  { _id: "6", codename: "manage_customers", name: "Can Manage & Update Customers", module: "customers" },
  { _id: "7", codename: "credit_debit", name: "Can Credit & Debit Customers", module: "customers" },
  { _id: "8", codename: "view_plan", name: "Can View Plan", module: "plans" },
  { _id: "9", codename: "manage_plan", name: "Can Manage & Update Plan", module: "plans" },
  { _id: "10", codename: "view_product", name: "Can View Product", module: "products" },
  { _id: "11", codename: "manage_product", name: "Can Create and Manage Product", module: "products" },
  { _id: "12", codename: "view_group", name: "Can View Group", module: "groups" },
  { _id: "13", codename: "manage_group", name: "Can Create and Manage Group", module: "groups" },
  { _id: "14", codename: "view_service", name: "Can View Service", module: "services" },
  { _id: "15", codename: "manage_referrals", name: "Can Manage Referrals", module: "referrals" },
  { _id: "16", codename: "view_referrals", name: "Can View Referrals", module: "referrals" },
  { _id: "17", codename: "manage_testimonials", name: "Can Manage Testimonials", module: "testimonials" },
  { _id: "18", codename: "view_testimonials", name: "Can View Testimonials", module: "testimonials" },
  { _id: "19", codename: "edit_testimonials", name: "Can Edit Testimonials", module: "testimonials" },
  { _id: "20", codename: "add_testimonials", name: "Can Add Testimonials", module: "testimonials" },
  { _id: "21", codename: "delete_testimonials", name: "Can Delete Testimonials", module: "testimonials" },
  { _id: "22", codename: "delete_faq", name: "Can Delete Faq", module: "faq" },
  { _id: "23", codename: "manage_faq", name: "Can Manage Faq", module: "faq" },
  { _id: "24", codename: "view_faq", name: "Can View Faq", module: "faq" },
  { _id: "25", codename: "edit_faq", name: "Can Edit Faq", module: "faq" },
  { _id: "26", codename: "add_faq", name: "Can Add Faq", module: "faq" },
  { _id: "27", codename: "manage_program", name: "Can Manage Program", module: "program" },
  { _id: "28", codename: "view_program", name: "Can View Program", module: "program" },
];

const RoleManagement = () => {
  const [popupIsActive, setPopupIsActive] = useState(false);
  const [activePopup, setActivePopup] = useState("");
  const [selectedRole, setSelectedRole] = useState<typeof MOCK_ROLES[0] | null>(null);
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState<{ roles: typeof MOCK_ROLES } | null>(null);
  const [permissions, setPermissions] = useState<{ permissions: typeof ALL_PERMISSIONS } | null>(null);

  // Simulate loading data
  useEffect(() => {
    const fetchData = async () => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setRoles({ roles: MOCK_ROLES });
      setPermissions({ permissions: ALL_PERMISSIONS });
      setLoading(false);
      // Set default selected role to first role
      setSelectedRole(MOCK_ROLES[0]);
    };

    fetchData();
  }, []);
  
  // Modal dialogs for create, update, delete actions
  const renderPopup = () => {
    if (!popupIsActive) return null;
    
    let content;
    switch (activePopup) {
      case "Create New Role":
        content = (
          <div className="grid gap-4">
            <h3 className="text-xl font-bold">Create New Role</h3>
            <div className="grid gap-2">
              <label htmlFor="roleName" className="text-sm font-medium">Role Name</label>
              <input id="roleName" type="text" className="border border-gray-300 rounded px-3 py-2" placeholder="Enter role name" />
            </div>
            <div className="grid gap-2">
              <label htmlFor="roleDescription" className="text-sm font-medium">Description</label>
              <textarea id="roleDescription" className="border border-gray-300 rounded px-3 py-2" rows={3} placeholder="Enter role description"></textarea>
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Permissions</label>
              <div className="border border-gray-300 rounded max-h-60 overflow-y-auto p-2">
                {ALL_PERMISSIONS.map((permission) => (
                  <div key={permission._id} className="flex items-center gap-2 py-1">
                    <input type="checkbox" id={`perm-${permission._id}`} />
                    <label htmlFor={`perm-${permission._id}`}>{permission.name}</label>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button 
                className="px-4 py-2 border border-gray-300 rounded"
                onClick={() => setPopupIsActive(false)}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-brand-red text-white rounded"
                onClick={() => setPopupIsActive(false)}
              >
                Create Role
              </button>
            </div>
          </div>
        );
        break;
      
      case "Update Role":
        content = (
          <div className="grid gap-4">
            <h3 className="text-xl font-bold">Update Role</h3>
            <div className="grid gap-2">
              <label htmlFor="updateRoleName" className="text-sm font-medium">Role Name</label>
              <input 
                id="updateRoleName" 
                type="text" 
                className="border border-gray-300 rounded px-3 py-2"
                defaultValue={selectedRole?.name}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="updateRoleDescription" className="text-sm font-medium">Description</label>
              <textarea 
                id="updateRoleDescription" 
                className="border border-gray-300 rounded px-3 py-2" 
                rows={3}
                defaultValue={selectedRole?.description}
              ></textarea>
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Permissions</label>
              <div className="border border-gray-300 rounded max-h-60 overflow-y-auto p-2">
                {ALL_PERMISSIONS.map((permission) => {
                  const isChecked = selectedRole?.permissions?.some(
                    p => p.codename === permission.codename
                  );
                  return (
                    <div key={permission._id} className="flex items-center gap-2 py-1">
                      <input 
                        type="checkbox" 
                        id={`update-perm-${permission._id}`}
                        defaultChecked={isChecked}
                      />
                      <label htmlFor={`update-perm-${permission._id}`}>{permission.name}</label>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button 
                className="px-4 py-2 border border-gray-300 rounded"
                onClick={() => setPopupIsActive(false)}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={() => setPopupIsActive(false)}
              >
                Update Role
              </button>
            </div>
          </div>
        );
        break;
      
      case "Delete Role":
        content = (
          <div className="grid gap-4">
            <h3 className="text-xl font-bold">Delete Role</h3>
            <p>Are you sure you want to delete the role "{selectedRole?.name}"? This action cannot be undone.</p>
            <div className="flex justify-end gap-3 mt-4">
              <button 
                className="px-4 py-2 border border-gray-300 rounded"
                onClick={() => setPopupIsActive(false)}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-brand-red text-white rounded"
                onClick={() => setPopupIsActive(false)}
              >
                Delete Role
              </button>
            </div>
          </div>
        );
        break;
      
      default:
        content = null;
    }
    
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
          {content}
        </div>
      </div>
    );
  };

  return (
    <section className="grid gap-6 mt-6 max-w-screen-xl mx-auto px-4">
      {renderPopup()}
      
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
              {roles?.roles?.map((role) => (
                <li key={role._id}>
                  <button
                    className={`px-3 py-2.5 border border-black/10 block w-full text-left rounded ${
                      selectedRole?._id === role?._id
                        ? "bg-primary/40 text-brand-black "
                        : "text-brand-black hover:bg-primary/10"
                    }`}
                    type="button"
                    onClick={() => setSelectedRole(role)}
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
                onClick={() => {
                  setPopupIsActive(true);
                  setActivePopup("Create New Role");
                }}
              >
                <PlusIcon size={16} />
                Create a custom role
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:col-span-7">
          <div className="grid gap-3">
            <div className="flex items-center gap-4 justify-between flex-wrap">
              <h3 className="text-brand-black/80 font-semibold text-lg">
                {selectedRole?.name || "Select a role"}
              </h3>

              {loading || !permissions || !roles ? (
                <div className="flex items-center gap-2">
                  <div className="animate-pulse px-8 py-2 rounded bg-gray-300"></div>
                  <div className="animate-pulse px-8 py-2 rounded bg-gray-300"></div>
                </div>
              ) : selectedRole ? (
                <div className="flex items-center gap-4">
                  <Button
                    className="rounded-lg px-4 py-2 text-sm font-medium bg-transparent border border-primary/40 text-gray-700 hover:bg-primary/40 flex items-center gap-1"
                    type="button"
                    onClick={() => {
                      setPopupIsActive(true);
                      setActivePopup("Update Role");
                    }}
                  >
                    <Edit size={16} />
                    Update
                  </Button>
                
                  <Button
                    className="rounded-lg px-4 py-2 text-sm font-mediumborder border border-primary/40 text-gray-700 bg-red/70 hover:bg-red/40 flex items-center gap-1"
                    type="button"
                    onClick={() => {
                      setPopupIsActive(true); 
                      setActivePopup("Delete Role");
                    }}
                  >
                    <Trash2 size={16} />
                    Delete
                  </Button>
                </div>
              ) : null}
            </div>

            <p className="text-gray-600">{selectedRole?.description}</p>
          </div>

          {selectedRole && (
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
                      (permission) => (
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
                    {permissions?.permissions
                      ?.filter(
                        (permission) =>
                          !selectedRole?.permissions?.some(
                            (rolePermission) =>
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
          )}
        </div>
      </div>
    </section>
  );
};

export default RoleManagement;