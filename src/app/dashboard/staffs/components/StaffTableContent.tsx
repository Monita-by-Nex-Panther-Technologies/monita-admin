import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Copy, MoreHorizontal, Pencil, Trash2, Mail, KeyRound } from "lucide-react";
import { formatedDate } from "@/utilities/utils";
import DataTable from "@/components/table/DataTable";
import { TableCell } from "@/components/ui/table";
import { Staff } from "@/store/staffStore";

interface Props {
    staffs: Staff[];
    copyToClipboard: (text: string) => void;
    onEdit?: (staff: Staff) => void;
    onDelete?: (staff: Staff) => void;
    onResendInvite?: (staff: Staff) => void;
    onResetPassword?: (staff: Staff) => void;
}

const StaffTableContent: React.FC<Props> = ({
    staffs,
    copyToClipboard,
    onEdit,
    onDelete,
    onResendInvite,
    onResetPassword,
}) => {
    const headers = [
        "Name",
        "Email Address",
        "phoneNumber",
        "Role",
        "Registration Date",
        "Actions",
    ];

    // Track which dropdown menu is currently open
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
    const dropdownRefs = useRef<Map<string, HTMLDivElement | null>>(new Map());

    // Toggle dropdown visibility
    const toggleDropdown = (e: React.MouseEvent, staffId: string) => {
        e.preventDefault();
        e.stopPropagation();
        
        // This will close the dropdown if it's already open, or open it if it's closed
        setOpenDropdownId(prevId => prevId === staffId ? null : staffId);
    };

    // Handle clicks outside the dropdown to close it
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (openDropdownId && 
                dropdownRefs.current.has(openDropdownId) && 
                dropdownRefs.current.get(openDropdownId) && 
                !dropdownRefs.current.get(openDropdownId)?.contains(event.target as Node)) {
                setOpenDropdownId(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [openDropdownId]);

    return (
        <DataTable
            headers={headers}
            data={staffs}
            selectable
            showSelectAllCheckbox={false}
            renderRow={(staff) => (
                <>
                    <TableCell className="p-4">
                    </TableCell>
                    
                    <TableCell className="text-text-body font-poppins text-base py-6">{staff.lastName} {staff.firstName}</TableCell>
                    <TableCell className="text-text-body font-poppins text-base py-6">{staff.email ?? "N/A"}</TableCell>
                    <TableCell className="text-text-body font-poppins text-base py-6">
                        {staff.phoneNumber ?? "N/A"}
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(staff.phoneNumber)}>
                            <Copy className="w-4 h-4" />
                        </Button>
                    </TableCell>
                    <TableCell className="text-text-body font-poppins text-base py-6">
                        {staff.role?.name ?? "N/A"}
                    </TableCell>
                    <TableCell className="text-text-body font-poppins text-base py-6">
                        {formatedDate(staff.createdAt)}
                    </TableCell>
                    <TableCell className="py-6 flex gap-2 relative">
                        <Button
                            variant="ghost"
                            className="cursor-pointer hover:bg-transparent p-1"
                            onClick={() => onEdit && onEdit(staff)}
                        >
                            <Pencil size={18} className="text-gray-600" />
                        </Button>
                        <Button
                            variant="ghost"
                            className="cursor-pointer hover:bg-transparent p-1"
                            onClick={() => onDelete && onDelete(staff)}
                        >
                            <Trash2 size={18} className="text-red-500" />
                        </Button>
                        <div 
                            className="relative" 
                            ref={(el) => {
                                dropdownRefs.current.set(staff.id, el);
                            }}
                        >
                            <Button
                                variant="ghost"
                                className="cursor-pointer border border-primary-300 rounded-sm hover:bg-transparent p-1"
                                onClick={(e) => toggleDropdown(e, staff.id)}
                            >
                                <MoreHorizontal size={14} className="text-primary-300" />
                            </Button>
                            
                            {openDropdownId === staff.id && (
                                <div 
                                    className="absolute right-0 top-full min-w-[160px] bg-white rounded-md shadow-lg border border-gray-200 z-50"
                                >
                                    <div className="py-1">
                                        <button 
                                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            onClick={() => {
                                                setOpenDropdownId(null);
                                                if (onResendInvite) onResendInvite(staff);
                                            }}
                                        >
                                            <Mail size={16} className="mr-2 text-primary-300" />
                                            Resend Invite
                                        </button>
                                        <button 
                                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            onClick={() => {
                                                setOpenDropdownId(null);
                                                if (onResetPassword) onResetPassword(staff);
                                            }}
                                        >
                                            <KeyRound size={16} className="mr-2 text-primary-300" />
                                            Reset Password
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </TableCell>
                </>
            )}
        />
    );
};

export default StaffTableContent;