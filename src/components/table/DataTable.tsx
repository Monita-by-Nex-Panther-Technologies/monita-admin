import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";


interface DataTableProps<T> {
    headers: string[];
    data: T[];
    renderRow: (item: T) => React.ReactNode;
    selectable?: boolean;
    selectedItems?: string[];
    onSelectAll?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSelectItem?: (id: string) => void;
}

const DataTable = <T extends { id: string }>({
    headers,
    data,
    renderRow,
    selectable = false,
    selectedItems = [],
    onSelectAll,
    onSelectItem,
}: DataTableProps<T>) => {
    return (
        <div className="w-full overflow-x-auto max-w-full min-w-0">
            <div className="min-w-[900px]">
                <Table className="w-full table-auto border-collapse rounded-2xl bg-background p-5">
                    <TableHeader className="bg-primary-fade text-muted-foreground hover:bg-primary-fade ml-5">
                        <TableRow>
                            {selectable && (
                                <TableHead className="p-4">
                                    <input
                                        type="checkbox"
                                        className="w-6 h-6 mt-1 border-[#01010129] cursor-pointer"
                                        checked={selectedItems.length === data.length && selectedItems.length > 0}
                                        onChange={onSelectAll}
                                    />
                                </TableHead>
                            )}
                            {headers.map((header, index) => (
                                <TableHead key={index} className="text-base font-poppins text-text-title">
                                    {header}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((item) => (
                            <TableRow key={item.id} className="py-6">
                                {renderRow(item)}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default DataTable;