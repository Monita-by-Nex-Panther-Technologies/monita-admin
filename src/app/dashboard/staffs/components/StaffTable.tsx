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

const StaffTable = () => {
    const {
        staffs,
        page,
        totalPages,
        isFilterResult,
        limit,
        filterData,
        isLoading,
        setField,
        isQueryResult,
        getStaffs,
        deleteStaff,
    } = useStaffStore();

    const [selected, setSelected] = useState<string[]>([]);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);
    const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState<boolean>(false);
    const [searchValue, setSearchValue] = useState("");
    
    // State for delete confirmation
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [staffToDelete, setStaffToDelete] = useState<Staff | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // Fetch staff on initial load
    useEffect(() => {
        getStaffs({ page: 1, limit: 10 });
    }, []);

    const handleFilterApply = (newFilters: Partial<FilterCriteria>) => {
        setField("filterData", newFilters);
        getStaffs({ page, limit, ...newFilters });
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            // Select all staff in the current filtered view
            const allIds = staffs.map((staff) => staff.id);
            setSelected(allIds);
        } else {
            // Deselect all
            setSelected([]);
        }
    };

    const handleSelect = (id: string) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id]
        );
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard: " + text);
    };

    const exportData = (format: string) => {
        // Implement export functionality
        toast.info(`Exporting data as ${format}`);
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

    const handleEdit = (staff: Staff) => {
        // Implement edit functionality
        toast.info(`Editing staff: ${staff.firstName} ${staff.lastName}`);
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

    // Handle successful staff creation
    const handleStaffAdded = () => {
        // Refresh the staff list with the first page
        getStaffs({ page: 1, limit });
    };

    return (
        <>
            <div className="w-full flex flex-row justify-between items-center bg-background p-4 rounded-[8px]">
                <h1 className="text-text-title text-xl font-semibold font-poppins">Staff Management</h1>
                <div className="flex flex-row gap-x-4">
                    <button className="justify-center items-center bg-background border border-primary-300 text-text-body font-poppins font-medium px-4 py-2 rounded-[12px] active:bg-primary-foreground">
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
                    exportOptions={[
                        { label: "Export as PDF", format: "PDF" },
                        { label: "Export as XLS", format: "XLS" },
                        { label: "Export as DOC", format: "DOC" },
                    ]}
                    onExport={exportData}
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
                        selected={selected}
                        handleSelectAll={handleSelectAll}
                        handleSelect={handleSelect}
                        copyToClipboard={copyToClipboard}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
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
                onSuccess={handleStaffAdded}
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
        </>
    );
};

export default StaffTable;