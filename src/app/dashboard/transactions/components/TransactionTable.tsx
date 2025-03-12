"use client";
import React, { useState, useRef } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
import { Search, MoreHorizontal, ListFilter, Copy, X } from "lucide-react";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    PaginationEllipsis,
} from "@/components/ui/pagination";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { icons } from "@/constants/icons";
// import { format } from "date-fns";
import FilterModal from "./TransactionFilterModal";
import { transactions } from "./data"; // Import data from data.ts

const itemsPerPageOptions = [5, 10, 20, 50];

interface FilterCriteria {
    username: string;
    status: string;
    transactionType: string;
    startDate: Date | undefined;
    endDate: Date | undefined;
}

const TransactionsTable = () => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(10);
    const [selected, setSelected] = useState<string[]>([]);
    const [exportDropdownOpen, setExportDropdownOpen] = useState<boolean>(false);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);
    const [filters, setFilters] = useState<FilterCriteria>({
        username: "",
        status: "",
        transactionType: "",
        startDate: undefined,
        endDate: undefined,
    });
    const [searchTerm, setSearchTerm] = useState<string>(""); // State for search term

    const exportDropdownRef = useRef<HTMLDivElement>(null);
    const tableRef = useRef<HTMLDivElement>(null);

    const filteredTransactions = transactions.filter((transaction) => {
        // Search filter
        const matchesSearch = searchTerm
            ? transaction.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.id.toLowerCase().includes(searchTerm.toLowerCase())
            : true;

        // Other filters
        const matchesUsername = filters.username
            ? transaction.username.toLowerCase().includes(filters.username.toLowerCase())
            : true;

        const matchesStatus = filters.status
            ? transaction.status === filters.status
            : true;

        const matchesTransactionType = filters.transactionType
            ? transaction.type === filters.transactionType
            : true;

        const matchesStartDate = filters.startDate
            ? new Date(transaction.date) >= filters.startDate
            : true;

        const matchesEndDate = filters.endDate
            ? new Date(transaction.date) <= filters.endDate
            : true;

        return (
            matchesSearch &&
            matchesUsername &&
            matchesStatus &&
            matchesTransactionType &&
            matchesStartDate &&
            matchesEndDate
        );
    });

    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
    const paginatedData = filteredTransactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleFilterApply = (newFilters: FilterCriteria) => {
        setFilters(newFilters);
        setCurrentPage(1); // Reset to the first page after applying filters
        setSelected([]); // Clear selected items when filters change
    };

    const handleResetFilters = () => {
        setFilters({
            username: "",
            status: "",
            transactionType: "",
            startDate: undefined,
            endDate: undefined,
        });
        setSearchTerm(""); // Clear search term
        setCurrentPage(1); // Reset to the first page after resetting filters
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to the first page when search term changes
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            // Select all transactions in the current filtered view
            const allIds = filteredTransactions.map((transaction) => transaction.id);
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

    // const isSelected = (id: string) => selected.includes(id);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert("Copied to clipboard: " + text);
    };

    const cleanAmount = (amount: string): string => {
        return amount.replace(/[^\d.,-]/g, '');
    };

    const exportData = (format: string) => {
        const dataToExport = selected.length > 0
            ? filteredTransactions.filter((transaction) => selected.includes(transaction.id))
            : filteredTransactions;

        if (format === "DOC") {
            const docContent = dataToExport.map(t => `${t.username}\t${t.id}\t${t.amount}\t${t.type}\t${t.status}\t${t.date} ${t.time}`).join("\n");
            const blob = new Blob([docContent], { type: "application/msword" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "transactions.doc";
            a.click();
            URL.revokeObjectURL(url);
        } else if (format === "XLS") {
            const worksheet = XLSX.utils.json_to_sheet(dataToExport);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");
            XLSX.writeFile(workbook, "transactions.xlsx");
        } else if (format === "PDF") {
            const doc = new jsPDF();
            doc.setFontSize(18);
            doc.setFont("helvetica", "bold");
            doc.text("Transaction History", 14, 22);

            const cleanedData = dataToExport.map(transaction => ({
                ...transaction,
                amount: cleanAmount(transaction.amount)
            }));

            autoTable(doc, {
                head: [['Username', 'Transaction ID', 'Amount', 'Type', 'Status', 'Date', 'Time']],
                body: cleanedData.map(transaction => [
                    transaction.username,
                    transaction.id,
                    transaction.amount,
                    transaction.type,
                    transaction.status,
                    transaction.date,
                    transaction.time
                ]),
                startY: 30,
                styles: {
                    fontSize: 10,
                    cellPadding: 3,
                    font: "helvetica",
                    fontStyle: "normal",
                    textColor: [0, 0, 0],
                    halign: "left",
                },
                headStyles: {
                    fillColor: [41, 128, 185],
                    textColor: 255,
                    fontStyle: "bold",
                },
                columnStyles: {
                    2: {
                        fontStyle: "normal",
                        halign: "right",
                        cellWidth: "wrap",
                    },
                    4: {
                        fontStyle: 'bold',
                    }
                },
                didParseCell: function (data) {
                    if (data.section === 'body' && data.column.index === 4) {
                        const status = data.cell.raw;
                        if (status === 'Successful') {
                            data.cell.styles.textColor = [46, 204, 113];
                        } else if (status === 'Failed') {
                            data.cell.styles.textColor = [231, 76, 60];
                        } else {
                            data.cell.styles.textColor = [243, 156, 18];
                        }
                    }
                }
            });

            const pageCount = doc.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(8);
                doc.setFont("helvetica", "normal");
                doc.text(
                    `Generated on ${new Date().toLocaleString()} - Page ${i} of ${pageCount}`,
                    doc.internal.pageSize.getWidth() / 2,
                    doc.internal.pageSize.getHeight() - 10,
                    { align: 'center' }
                );
            }

            doc.save("transactions.pdf");
        }

        setExportDropdownOpen(false);
    };

    const renderPaginationItems = () => {
        const items = [];
        items.push(
            <PaginationItem key="page-1">
                <PaginationLink
                    isActive={currentPage === 1}
                    onClick={() => setCurrentPage(1)}
                    className={currentPage === 1 ? "bg-primary text-white hover:bg-primary/90" : ""}
                >
                    1
                </PaginationLink>
            </PaginationItem>
        );
        if (totalPages <= 7) {
            for (let i = 2; i <= totalPages; i++) {
                items.push(
                    <PaginationItem key={`page-${i}`}>
                        <PaginationLink
                            isActive={currentPage === i}
                            onClick={() => setCurrentPage(i)}
                            className={currentPage === i ? "bg-primary text-white hover:bg-primary/90" : ""}
                        >
                            {i}
                        </PaginationLink>
                    </PaginationItem>
                );
            }
        } else {
            let startPage = Math.max(2, currentPage - 1);
            let endPage = Math.min(totalPages - 1, currentPage + 1);
            if (currentPage <= 3) {
                startPage = 2;
                endPage = 4;
            } else if (currentPage >= totalPages - 2) {
                startPage = totalPages - 3;
                endPage = totalPages - 1;
            }
            if (startPage > 2) {
                items.push(
                    <PaginationItem key="ellipsis-1">
                        <PaginationEllipsis />
                    </PaginationItem>
                );
            }
            for (let i = startPage; i <= endPage; i++) {
                items.push(
                    <PaginationItem key={`page-${i}`}>
                        <PaginationLink
                            isActive={currentPage === i}
                            onClick={() => setCurrentPage(i)}
                            className={currentPage === i ? "bg-primary text-white hover:bg-primary/90" : ""}
                        >
                            {i}
                        </PaginationLink>
                    </PaginationItem>
                );
            }
            if (endPage < totalPages - 1) {
                items.push(
                    <PaginationItem key="ellipsis-2">
                        <PaginationEllipsis />
                    </PaginationItem>
                );
            }
            if (totalPages > 1) {
                items.push(
                    <PaginationItem key={`page-${totalPages}`}>
                        <PaginationLink
                            isActive={currentPage === totalPages}
                            onClick={() => setCurrentPage(totalPages)}
                            className={currentPage === totalPages ? "bg-primary text-white hover:bg-primary/90" : ""}
                        >
                            {totalPages}
                        </PaginationLink>
                    </PaginationItem>
                );
            }
        }
        return items;
    };

    // Check if any filters are active
    const areFiltersActive =
        filters.username !== "" ||
        filters.status !== "" ||
        filters.transactionType !== "" ||
        filters.startDate !== undefined ||
        filters.endDate !== undefined;

    return (
        <>
            <div className='w-full flex flex-row justify-between items-center bg-background p-4 rounded-[8px] mt-6'>
                <h1 className='text-text-title text-xl font-semibold font-poppins'>
                    Transaction History
                </h1>
                <div className='flex flex-row gap-x-4 '>
                    <button className='justify-center items-center bg-background border border-primary-300 text-text-body font-poppins font-medium px-4 w-[132px] rounded-[12px] active:bg-primary-foreground'>
                        Retry
                    </button>
                    <button className='justify-center bg-primary items-center text-text-body font-poppins p-4 w-[132px] rounded-[12px] font-medium'>
                        Approve
                    </button>
                </div>
            </div>

            <div className="bg-background rounded-2xl my-6 py-4">
                <div className="flex justify-between items-center my-4 px-6">
                    <div className="flex flex-row gap-5 ">
                        <button
                            className=" border border-primary bg-background flex gap-3 justify-center items-center px-10 py-3 rounded-[8px]"
                            onClick={() => setIsFilterModalOpen(true)}
                        >
                            <ListFilter size={16} />
                            <span className=" text-text-title font-poppins text-base">Filter</span>
                        </button>

                        <div className=" flex flex-row justify-center items-center">
                            <input
                                type="text"
                                placeholder="Search"
                                className=" bg-background-alt border-border rounded-l-[8px] p-4"
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                            <button className=" bg-primary rounded-r-[8px] p-4 px-6">
                                <Search size={24} className="text-text-body" />
                            </button>
                            {areFiltersActive && (
                                <button
                                    className="bg-background-alt border-border rounded-[8px] p-4 ml-2"
                                    onClick={handleResetFilters}
                                >
                                    <X size={24} className="text-text-body" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Export Dropdown Menu */}
                    <div className="relative" ref={exportDropdownRef}>
                        <button
                            className="bg-[#010101CC] flex gap-3 justify-center items-center px-6 py-3 rounded-[12px] text-white"
                            onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
                        >
                            <icons.exportIcon size={16} className="text-white" />
                            <span className="font-poppins text-base">Export</span>
                        </button>

                        {exportDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-32 rounded-md shadow-xl py-1 bg-white z-10">
                                <button
                                    className="block px-4 py-2 text-sm text-gray-700 w-full border-border hover:bg-primary-alpha-8 text-left border-b"
                                    onClick={() => exportData("PDF")}
                                >
                                    Export as PDF
                                </button>
                                <button
                                    className="block px-4 py-2 text-sm text-gray-700 w-full border-border hover:bg-primary-alpha-8 text-left border-b"
                                    onClick={() => exportData("XLS")}
                                >
                                    Export as XLS
                                </button>
                                <button
                                    className="block px-4 py-2 text-sm text-nowrap text-gray-700 w-full border-border hover:bg-primary-alpha-8 text-left border-b"
                                    onClick={() => exportData("DOC")}
                                >
                                    Export as DOC
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="overflow-auto relative" ref={tableRef}>
                    <Table className="w-full rounded-2xl bg-background p-5">
                        <TableHeader className="bg-primary-fade text-muted-foreground hover:bg-primary-fade ml-5">
                            <TableRow>
                                <TableHead className="p-4">
                                    <input
                                        type="checkbox"
                                        className="w-6 h-6 mt-1 border-[#01010129] cursor-pointer"
                                        checked={selected.length === filteredTransactions.length && selected.length > 0}
                                        onChange={handleSelectAll}
                                    />
                                </TableHead>
                                <TableHead className="text-base font-poppins text-text-title">Username</TableHead>
                                <TableHead className="text-base font-poppins text-text-title">Transaction ID</TableHead>
                                <TableHead className="text-base font-poppins text-text-title">Amount</TableHead>
                                <TableHead className="text-base font-poppins text-text-title">Type</TableHead>
                                <TableHead className="text-base font-poppins text-text-title">Status</TableHead>
                                <TableHead className="text-base font-poppins text-text-title">Date & Time</TableHead>
                                <TableHead className="text-base font-poppins text-text-title">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedData.map((transaction) => (
                                <TableRow key={transaction.id} className="py-6">
                                    <TableCell className="p-4">
                                        <input
                                            type="checkbox"
                                            className="w-6 h-6 mt-1 cursor-pointer"
                                            checked={selected.includes(transaction.id)}
                                            onChange={() => handleSelect(transaction.id)}
                                        />
                                    </TableCell>
                                    <TableCell className="text-text-body font-poppins text-base py-6">{transaction.username}</TableCell>
                                    <TableCell className="text-text-body font-poppins text-base py-6 flex items-center gap-2">
                                        {transaction.id}
                                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(transaction.id)}>
                                            <Copy className="w-4 h-4" />
                                        </Button>
                                    </TableCell>
                                    <TableCell className="text-text-body font-poppins text-base py-6">{transaction.amount}</TableCell>
                                    <TableCell className="text-text-body font-poppins text-base py-6">{transaction.type}</TableCell>
                                    <TableCell className="text-text-body font-poppins text-base py-6">
                                        <span
                                            className={`px-2 py-1 rounded-md w-full ${transaction.status === "Successful"
                                                ? "status-success"
                                                : transaction.status === "Failed"
                                                    ? "status-error"
                                                    : "status-pending"
                                                }`}
                                        >
                                            {transaction.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-text-body font-poppins text-base py-6">{transaction.date} {transaction.time}</TableCell>
                                    <TableCell>
                                        <Button variant="ghost" className="cursor-pointer border border-primary-300 rounded-sm hover:bg-transparent">
                                            <MoreHorizontal size={14} className="text-primary-300" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <div className="flex justify-between items-center mt-4 p-8 ">
                <div className="flex items-center gap-2">
                    <span>Showing</span>
                    <Select onValueChange={(value) => {
                        setItemsPerPage(Number(value));
                        setCurrentPage(1);
                    }}>
                        <SelectTrigger className="w-16 bg-background">
                            {itemsPerPage}
                        </SelectTrigger>
                        <SelectContent>
                            {itemsPerPageOptions.map((option) => (
                                <SelectItem key={option} value={String(option)}>
                                    {option}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <span>Entries</span>
                </div>

                <Pagination className=" justify-end">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                onClick={handlePrevPage}
                                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                            />
                        </PaginationItem>

                        {renderPaginationItems()}

                        <PaginationItem>
                            <PaginationNext
                                onClick={handleNextPage}
                                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>

            <FilterModal
                isOpen={isFilterModalOpen}
                onClose={() => setIsFilterModalOpen(false)}
                onApply={handleFilterApply}
            />
        </>
    );
};

export default TransactionsTable;