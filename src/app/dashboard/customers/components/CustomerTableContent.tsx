import React from "react";
import { Button } from "@/components/ui/button";
import { Copy, MoreHorizontal } from "lucide-react";
import { formatAmount, formatedDate } from "@/utilities/utils";
import DataTable from "@/components/table/DataTable";
import { TableCell } from "@/components/ui/table";
import { Customer } from "@/store/customerStore";


interface Props {
    customers: Customer[];
    selected: string[];
    handleSelectAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSelect: (id: string) => void;
    copyToClipboard: (text: string) => void;
}

const CustomerTableContent: React.FC<Props> = ({
    customers,
    selected,
    handleSelectAll,
    handleSelect,
    copyToClipboard,
}) => {
    const headers = [
        "Name",
        "Monitag",
        "Email Address",
        "Phone",
        "KYC Level",
        "Registration Date",
        "Actions",
    ];

    return (
        <DataTable
            headers={headers}
            data={customers}
            selectable
            selectedItems={selected}
            onSelectAll={handleSelectAll}
            renderRow={(customer) => (
                <>
                    <TableCell className="p-4">
                        <input
                            type="checkbox"
                            className="w-6 h-6 mt-1 cursor-pointer"
                            checked={selected.includes(customer.id)}
                            onChange={() => handleSelect(customer.id)}
                        />
                    </TableCell>
                    {/* <TableCell className="text-text-body font-poppins text-base py-6">{customer.userId}</TableCell> */}
                    
                    <TableCell className="text-text-body font-poppins text-base py-6">{customer.lastName} {customer.firstName}</TableCell>
                    <TableCell className="text-text-body font-poppins text-base py-6">{customer.monitag ?? "N/A"}</TableCell>
                    <TableCell className="text-text-body font-poppins text-base py-6">{customer.email ?? "N/A"}</TableCell>
                    <TableCell className="text-text-body font-poppins text-base py-6">
                        {customer.phone ?? "N/A"}
                         <Button variant="ghost" size="sm" onClick={() => copyToClipboard(customer.phone)}>
                                                    <Copy className="w-4 h-4" />
                                                </Button>
                    </TableCell>
                    <TableCell className="text-text-body font-poppins text-base py-6">
                    {`Tier ${customer.tier}`}
                    </TableCell>
                    
                    <TableCell className="text-text-body font-poppins text-base py-6">
                        {formatedDate(customer.createdAt)}
                    </TableCell>
                    <TableCell>
                        <Button
                            variant="ghost"
                            className="cursor-pointer border border-primary-300 rounded-sm hover:bg-transparent"
                        >
                            <MoreHorizontal size={14} className="text-primary-300" />
                        </Button>
                    </TableCell>
                </>
            )}
        />
    );
};

export default CustomerTableContent;