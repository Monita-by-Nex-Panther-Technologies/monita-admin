import React from "react";
import { Button } from "@/components/ui/button";
import { Copy, MoreHorizontal } from "lucide-react";
import { formatAmount, formatedDate } from "@/utilities/utils";
import DataTable from "@/components/table/DataTable";
import { TableCell } from "@/components/ui/table";
import { Transaction } from "@/store/transactionStore";
import { useRouter } from "next/navigation";


interface Props {
    transactions: Transaction[];
    selected?: string[];
    handleSelectAll?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSelect?: (id: string) => void;
    copyToClipboard?: (text: string) => void;
}



const TransactionTableContent: React.FC<Props> = ({
    transactions,
    selected,
    handleSelectAll,
    handleSelect,
    copyToClipboard,
}) => {
    const headers = [
        // "User",
        "Reference",
        "Category",
        "Remarks",
        "Beneficiary",
        "Amount",
        "Type",
        "Status",
        "Date & Time",
        "Actions",
    ];

    const router = useRouter()

    return (
        <DataTable
            headers={headers}
            data={transactions}
            selectable
            selectedItems={selected}
            onSelectAll={handleSelectAll}
            renderRow={(transaction) => (
                <>
                    <TableCell className="p-4">
                        <input
                            type="checkbox"
                            className="w-6 h-6 mt-1 cursor-pointer"
                            checked={selected?.includes(transaction.id)}
                            onChange={() => handleSelect && handleSelect(transaction.id)}
                        />
                    </TableCell>
                    {/* <TableCell className="text-text-body font-poppins text-base py-6">{transaction.userId}</TableCell> */}
                    <TableCell className="text-text-body font-poppins text-base py-6 flex items-center gap-2 cursor-pointer" >
                       <span onClick={() => router.push(`/dashboard/transactions/${transaction.id}`)}>  {transaction.reference} </span>
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard && copyToClipboard(transaction.reference)}>
                            <Copy className="w-4 h-4" />
                        </Button>
                    </TableCell>
                    <TableCell className="text-text-body font-poppins text-base py-6">{transaction.category}</TableCell>
                    <TableCell className="text-text-body font-poppins text-base py-6">{transaction.desc}</TableCell>
                    <TableCell className="text-text-body font-poppins text-base py-6">
                        {transaction.beneficiary !== "" ? transaction.beneficiary : "N/A"}
                    </TableCell>
                    <TableCell className="text-text-body font-poppins text-base py-6">
                        {formatAmount(transaction.amount, false, true)}
                    </TableCell>
                    <TableCell className="text-text-body font-poppins text-base py-6">{transaction.type}</TableCell>
                    <TableCell className="text-text-body font-poppins text-base py-6">
                        <span
                            className={`px-2 py-1 rounded-md w-full ${
                                transaction.status === "SUCCESS"
                                    ? "status-success"
                                    : transaction.status === "FAILED"
                                    ? "status-error"
                                    : "status-pending"
                            }`}
                        >
                            {transaction.status}
                        </span>
                    </TableCell>
                    <TableCell className="text-text-body font-poppins text-base py-6">
                        {formatedDate(transaction.createdAt)}
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

export default TransactionTableContent;