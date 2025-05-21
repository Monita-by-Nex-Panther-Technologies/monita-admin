"use client";
import React, { useState, useEffect } from "react";
import FilterModal, { FilterCriteria } from "./StaffFilterModal";
import AddStaffModal from "./AddStaffModal";
import { Staff, StaffQueryParams, useStaffStore } from "@/store/staffStore";
import TableLoading from "@/components/table/TableLoading";
import GetPagination from "@/components/table/pagination";
import Empty from "@/components/table/Empty";
import StaffTableContent from "./StaffTableContent";
import TableActions from "@/components/table/TableActions";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";
import { toast } from "sonner";
import { formatedDate, isEmail, replacePrefix } from "@/utilities/utils";
import { Plus } from "lucide-react";
import EditStaffModal from "./EditStaff";
import { useRouter } from "next/navigation";
import ResendInviteDialog from "./ResendInviteDialog";
import ResetPasswordDialog from "./ResetPasswordDialog";

const StaffTable = () => {
    const {
        staffs,
        page,
        totalPages,
        isFilterResult,
        limit,
        filterData,
        isLoading,
        isSubmitting,
        setField,
        isQueryResult,
        getStaffs,
        deleteStaff,
        resendInvite, // Uncommented
        resetPassword, // Uncommented
    } = useStaffStore();

    const [selected, setSelected] = useState<string[]>([]);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);
    const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState<boolean>(false);
    const [isEditStaffModalOpen, setIsEditStaffModalOpen] = useState<boolean>(false);
    const [staffToEdit, setStaffToEdit] = useState<Staff | null>(null);
    const [searchValue, setSearchValue] = useState("");
    
    // State for delete confirmation
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [staffToDelete, setStaffToDelete] = useState<Staff | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    
    // State for resend invite dialog
    const [resendInviteOpen, setResendInviteOpen] = useState(false);
    const [staffToResendInvite, setStaffToResendInvite] = useState<Staff | null>(null);
    const [resendInviteLoading, setResendInviteLoading] = useState(false);
    
    // State for reset password dialog
    const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
    const [staffToResetPassword, setStaffToResetPassword] = useState<Staff | null>(null);
    const [resetPasswordLoading, setResetPasswordLoading] = useState(false);
    
    const router = useRouter();
    
    // Fetch staff on initial load
    useEffect(() => {
        getStaffs({ page: 1, limit: 10 });
    }, []);

    const handleFilterApply = (newFilters: Partial<FilterCriteria>) => {
        setField("filterData", newFilters);
        getStaffs({ page, limit, ...newFilters });
    };

    const copyToClipboard = (text: string) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard");
    };

    const onChangePage = (page: number, limit: number) => {
        getStaffs({ page, limit, ...filterData });
    };

    const handleSearchChange = () => {
        const payload: StaffQueryParams = { page, limit };

        if (isEmail(searchValue)) {
            payload.email = searchValue;
        } else {
            payload.phoneNumber = replacePrefix(searchValue);
        }

        getStaffs(payload);
    };

    const onResetSearch = () => {
        setSearchValue("");
        setField("isQueryResult", false);
        setField("filterData", null);
        setField("isFilterResult", false);
        setField("staffs", []);
        getStaffs({ page: 1, limit });
    };

    // Update edit functionality
    const handleEdit = (staff: Staff) => {
        setStaffToEdit(staff);
        setIsEditStaffModalOpen(true);
    };

    // Initiate delete process
    const handleDelete = (staff: Staff) => {
        setStaffToDelete(staff);
        setDeleteConfirmOpen(true);
    };

    // Confirm and execute delete
    const confirmDelete = async () => {
        if (!staffToDelete) return;
        
        setDeleteLoading(true);
        try {
            await deleteStaff(staffToDelete.id);
            toast.success(`Staff member ${staffToDelete.firstName} ${staffToDelete.lastName} has been deleted`);
            
            // Clear selection if the deleted staff was selected
            if (selected.includes(staffToDelete.id)) {
                setSelected(prev => prev.filter(id => id !== staffToDelete.id));
            }
        } catch (error: any) {
            toast.error(`Failed to delete staff: ${error.message}`);
        } finally {
            setDeleteLoading(false);
            setDeleteConfirmOpen(false);
            setStaffToDelete(null);
        }
    };

    // Handle initiating resend invite
    const handleResendInvite = (staff: Staff) => {
        setStaffToResendInvite(staff);
        setResendInviteOpen(true);
    };

    // Handle confirming resend invite
    const confirmResendInvite = async () => {
        if (!staffToResendInvite) return;
        
        setResendInviteLoading(true);
        try {
            // Implementation now active
            await resendInvite(staffToResendInvite.id);
            toast.success(`Invitation email sent to ${staffToResendInvite.email}`);
        } catch (error: any) {
            toast.error(`Failed to send invitation: ${error.message}`);
        } finally {
            setResendInviteLoading(false);
            setResendInviteOpen(false);
            setStaffToResendInvite(null);
        }
    };

    // Handle initiating reset password
    const handleResetPassword = (staff: Staff) => {
        setStaffToResetPassword(staff);
        setResetPasswordOpen(true);
    };

    // Handle confirming reset password
    const confirmResetPassword = async () => {
        if (!staffToResetPassword) return;
        
        setResetPasswordLoading(true);
        try {
            // Implementation now active
            await resetPassword(staffToResetPassword.id);
            toast.success(`Password reset email sent to ${staffToResetPassword.email}`);
        } catch (error: any) {
            toast.error(`Failed to send password reset: ${error.message}`);
        } finally {
            setResetPasswordLoading(false);
            setResetPasswordOpen(false);
            setStaffToResetPassword(null);
        }
    };

    const handleStaffChange = () => {
        getStaffs({ page, limit, ...filterData });
    };

    return (
        <>
            <div className="w-full flex flex-row justify-between items-center bg-background p-4 rounded-[8px]">
                <h1 className="text-text-title text-xl font-semibold font-poppins">Staff Management</h1>
                <div className="flex flex-row gap-x-4">
                    <button 
                        className="justify-center items-center bg-background border border-primary-300 text-text-body font-poppins font-medium px-4 py-2 rounded-[12px] active:bg-primary-foreground"
                        onClick={() => router.push("/dashboard/roles")}
                    >
                        Manage Roles
                    </button>
                    <button 
                        className="justify-center bg-primary items-center text-text-body font-poppins px-4 py-2 rounded-[12px] font-medium flex gap-2"
                        onClick={() => setIsAddStaffModalOpen(true)}
                    >
                        <Plus size={16} />
                        Add Staff
                    </button>
                </div>
            </div>

            <div className="bg-background rounded-2xl my-6 py-4">
                <TableActions
                    searchValue={searchValue}
                    onSearch={handleSearchChange}
                    onSearchChange={setSearchValue}
                    onFilterClick={() => setIsFilterModalOpen(true)}
                    areFiltersActive={isFilterResult}
                    onResetFilters={onResetSearch}
                    showExport={false}
                    onResetSearch={onResetSearch}
                    isSearchActive={isQueryResult}
                />

                <div className="mx-4">
                    {isFilterResult && (
                        <div className="flex items-center flex-wrap gap-4 mb-3">
                            {filterData?.startDate && (
                                <span className="bg-primary text-black text-xs p-2 rounded-2xl font-light">
                                    From: {formatedDate(filterData.startDate.toDateString())}
                                </span>
                            )}
                            {filterData?.endDate && (
                                <span className="bg-primary text-black text-xs p-2 rounded-2xl font-light">
                                    To: {formatedDate(filterData.endDate.toDateString())}
                                </span>
                            )}
            
                            {filterData?.status && (
                                <span className="bg-primary text-black text-xs p-2 rounded-2xl font-light">
                                    Status: {filterData?.status}
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {isLoading ? (
                    <TableLoading row={10} col={6} />
                ) : staffs.length === 0 ? (
                    <Empty
                        title="No Staff Members"
                        description="Once staff members are added, they will appear here with all the details you need to manage them easily."
                    />
                ) : (
                    <StaffTableContent
                        staffs={staffs}
                        copyToClipboard={copyToClipboard}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onResendInvite={handleResendInvite}
                        onResetPassword={handleResetPassword}
                    />
                )}
            </div>

            {staffs.length > 0 && (
                <GetPagination
                    page={page}
                    totalPages={totalPages}
                    limit={limit}
                    isLoading={isLoading}
                    handleChangePerPage={onChangePage}
                />
            )}

            {/* Filter Modal */}
            <FilterModal
                isOpen={isFilterModalOpen}
                onClose={() => setIsFilterModalOpen(false)}
                onApply={handleFilterApply}
            />

            {/* Add Staff Modal */}
            <AddStaffModal 
                open={isAddStaffModalOpen}
                onOpenChange={setIsAddStaffModalOpen}
                onSuccess={handleStaffChange}
            />

            {/* Edit Staff Modal */}
            <EditStaffModal
                open={isEditStaffModalOpen}
                onOpenChange={setIsEditStaffModalOpen}
                staffToEdit={staffToEdit}
                onSuccess={handleStaffChange}
            />

            {/* Delete Confirmation Dialog */}
            <ConfirmDeleteDialog
                isOpen={deleteConfirmOpen}
                onClose={() => {
                    setDeleteConfirmOpen(false);
                    setStaffToDelete(null);
                }}
                onConfirm={confirmDelete}
                title="Delete Staff Member"
                description={staffToDelete ? 
                    `Are you sure you want to delete ${staffToDelete.firstName} ${staffToDelete.lastName}? This action cannot be undone.` : 
                    "Are you sure you want to delete this staff member? This action cannot be undone."
                }
                confirmText="Delete"
                cancelText="Cancel"
                isLoading={deleteLoading}
            />

            {/* Resend Invite Dialog */}
            <ResendInviteDialog
                isOpen={resendInviteOpen}
                onClose={() => {
                    setResendInviteOpen(false);
                    setStaffToResendInvite(null);
                }}
                onConfirm={confirmResendInvite}
                staff={staffToResendInvite}
                isLoading={resendInviteLoading}
            />
            
            {/* Reset Password Dialog */}
            <ResetPasswordDialog
                isOpen={resetPasswordOpen}
                onClose={() => {
                    setResetPasswordOpen(false);
                    setStaffToResetPassword(null);
                }}
                onConfirm={confirmResetPassword}
                staff={staffToResetPassword}
                isLoading={resetPasswordLoading}
            />
        </>
    );
};

export default StaffTable;