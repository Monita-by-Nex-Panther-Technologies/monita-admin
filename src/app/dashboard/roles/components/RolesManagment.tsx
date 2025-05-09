"use client";

import { useState, useEffect } from "react";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import CreateRoleModal from "./CreateRoleModal";
import UpdateRoleModal from "./UpdateRoleModal";
import DeleteRoleModal from "./DeleteRoleModal";
import RolePermissionList from "./RolePermissionList";
import { usePermissionStore } from "@/store/permissionStore";

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
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<typeof MOCK_ROLES[0] | null>(null);
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState<typeof MOCK_ROLES>([]);
  const [permissions, setPermissions] = useState<typeof ALL_PERMISSIONS>([]);


  // const {
  //         getPermissions,
  //         getPermissionScopes,
  //     } = usePermissionStore();

  // useEffect(() => {
  //     getPermissions();
  //     getPermissionScopes();
  // }, []);


  
  // Simulate loading data
  useEffect(() => {
    const fetchData = async () => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setRoles(MOCK_ROLES);
      setPermissions(ALL_PERMISSIONS);
      setLoading(false);
      // Set default selected role to first role
      setSelectedRole(MOCK_ROLES[0]);
    };

    fetchData();
  }, []);

  // Modal handlers
  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => setIsCreateModalOpen(false);
  
  const openUpdateModal = () => setIsUpdateModalOpen(true);
  const closeUpdateModal = () => setIsUpdateModalOpen(false);
  
  const openDeleteModal = () => setIsDeleteModalOpen(true);
  const closeDeleteModal = () => setIsDeleteModalOpen(false);

  const handleRoleSelect = (role: typeof MOCK_ROLES[0]) => {
    setSelectedRole(role);
  };

  return (
    <section className="grid gap-6 mt-6 max-w-screen-xl mx-auto px-4">
      {/* Modals */}
      <CreateRoleModal 
        isOpen={isCreateModalOpen} 
        onClose={closeCreateModal} 
        permissions={permissions}
      />
      
      <UpdateRoleModal 
        isOpen={isUpdateModalOpen} 
        onClose={closeUpdateModal}
        role={selectedRole}
        permissions={permissions}
      />
      
      <DeleteRoleModal 
        isOpen={isDeleteModalOpen} 
        onClose={closeDeleteModal}
        role={selectedRole}
      />
      
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
              {roles.map((role) => (
                <li key={role._id}>
                  <button
                    className={`px-3 py-2.5 border border-black/10 block w-full text-left rounded ${
                      selectedRole?._id === role?._id
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

        {/* Role management table component */}
        <RolePermissionList
          selectedRole={selectedRole}
          roles={roles}
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