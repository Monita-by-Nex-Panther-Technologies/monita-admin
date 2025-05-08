import React from "react";
import { Button } from "@/components/ui/button";
import { Copy, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { formatedDate } from "@/utilities/utils";
import DataTable from "@/components/table/DataTable";
import { TableCell } from "@/components/ui/table";
import { Staff } from "@/store/staffStore";

interface Props {
    staffs: Staff[];
    selected: string[];
    handleSelectAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSelect: (id: string) => void;
    copyToClipboard: (text: string) => void;
    onEdit?: (staff: Staff) => void;
    onDelete?: (staff: Staff) => void; // Changed to accept full staff object instead of just ID
}

const StaffTableContent: React.FC<Props> = ({
    staffs,
    selected,
    handleSelectAll,
    handleSelect,
    copyToClipboard,
    onEdit,
    onDelete,
}) => {
    const headers = [
        "Name",
        "Email Address",
        "phoneNumber",
        "Role",
        // "Status",
        "Registration Date",
        "Actions",
    ];

    return (
        <DataTable
            headers={headers}
            data={staffs}
            selectable
            selectedItems={selected}
            onSelectAll={handleSelectAll}
            renderRow={(staff) => (
                <>
                    <TableCell className="p-4">
                        <input
                            type="checkbox"
                            className="w-6 h-6 mt-1 cursor-pointer"
                            checked={selected.includes(staff.id)}
                            onChange={() => handleSelect(staff.id)}
                        />
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
                    {/* <TableCell className="text-text-body font-poppins text-base py-6">
                        <span className={`px-3 py-1 rounded-full text-xs ${
                            staff.status === "ACTIVE" ? "bg-green-100 text-green-800" : 
                            staff.status === "INACTIVE" ? "bg-gray-100 text-gray-800" : 
                            "bg-red-100 text-red-800"
                        }`}>
                            {staff.status}
                        </span>
                    </TableCell> */}
                    <TableCell className="text-text-body font-poppins text-base py-6">
                        {formatedDate(staff.createdAt)}
                    </TableCell>
                    <TableCell className="py-6 flex gap-2">
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
                            onClick={() => onDelete && onDelete(staff)} // Pass the full staff object
                        >
                            <Trash2 size={18} className="text-red-500" />
                        </Button>
                        <Button
                            variant="ghost"
                            className="cursor-pointer border border-primary-300 rounded-sm hover:bg-transparent p-1"
                        >
                            <MoreHorizontal size={14} className="text-primary-300" />
                        </Button>
                    </TableCell>
                </>
            )}
        />
    );
};

export default StaffTableContent;