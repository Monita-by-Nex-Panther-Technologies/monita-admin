"use client";
import type React from "react";
import { useState, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Search, MoreHorizontal, ListFilter } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

// Sample data for cashback recipients
const cashbackRecipients = [
  {
    id: "1",
    name: "Ade Johnson",
    email: "Adejohn@gmail.com",
    cashbackEarned: "₦10,500.00",
  },
  {
    id: "2",
    name: "Ade Johnson",
    email: "Adejohn@gmail.com",
    cashbackEarned: "₦10,500.00",
  },
  {
    id: "3",
    name: "Ade Johnson",
    email: "Adejohn@gmail.com",
    cashbackEarned: "₦10,500.00",
  },
  {
    id: "4",
    name: "Ade Johnson",
    email: "Adejohn@gmail.com",
    cashbackEarned: "₦10,500.00",
  },
  {
    id: "5",
    name: "Ade Johnson",
    email: "Adejohn@gmail.com",
    cashbackEarned: "₦10,500.00",
  },
  {
    id: "6",
    name: "Ade Johnson",
    email: "Adejohn@gmail.com",
    cashbackEarned: "₦10,500.00",
  },
  {
    id: "7",
    name: "Ade Johnson",
    email: "Adejohn@gmail.com",
    cashbackEarned: "₦10,500.00",
  },
  {
    id: "8",
    name: "Ade Johnson",
    email: "Adejohn@gmail.com",
    cashbackEarned: "₦10,500.00",
  },
];

const itemsPerPageOptions = [5, 10, 20, 50];

const CashbackRecipientsTable = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [selected, setSelected] = useState<string[]>([]);
  const [exportDropdownOpen, setExportDropdownOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const exportDropdownRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  const filteredRecipients = cashbackRecipients.filter((recipient) => {
    // Search filter
    return searchTerm
      ? recipient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          recipient.email.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
  });

  const totalPages = Math.ceil(filteredRecipients.length / itemsPerPage);
  const paginatedData = filteredRecipients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
      // Select all recipients in the current filtered view
      const allIds = filteredRecipients.map((recipient) => recipient.id);
      setSelected(allIds);
    } else {
      // Deselect all
      setSelected([]);
    }
  };

  const handleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((selectedId) => selectedId !== id)
        : [...prev, id]
    );
  };

  const exportData = (format: string) => {
    // Export functionality would go herefotma
    console.log(format);
    setExportDropdownOpen(false);
  };

  const renderPaginationItems = () => {
    const items: React.ReactNode[] = [];
    items.push(
      <PaginationItem key="page-1">
        <PaginationLink
          isActive={currentPage === 1}
          onClick={() => setCurrentPage(1)}
          className={
            currentPage === 1 ? "bg-primary text-white hover:bg-primary/90" : ""
          }
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
              className={
                currentPage === i
                  ? "bg-primary text-white hover:bg-primary/90"
                  : ""
              }
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
              className={
                currentPage === i
                  ? "bg-primary text-white hover:bg-primary/90"
                  : ""
              }
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
              className={
                currentPage === totalPages
                  ? "bg-primary text-white hover:bg-primary/90"
                  : ""
              }
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }
    return items;
  };

  return (
    <>
      <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center bg-background p-4 rounded-[8px] mt-6 gap-4">
        <h1 className="text-text-title text-xl font-semibold font-poppins">
          Cashback Recipients
        </h1>
        <div className="flex flex-row gap-x-4">
          <button className="justify-center items-center bg-primary text-text-body font-poppins font-medium px-3 sm:px-4 py-3 sm:py-4 w-full sm:w-[202px] rounded-[12px] active:bg-primary-foreground whitespace-nowrap">
            Cashback Settings
          </button>
        </div>
      </div>

      <div className="bg-background rounded-2xl my-6 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center my-4 px-3 sm:px-6 gap-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 w-full sm:w-auto">
            <button className="border border-primary bg-background flex gap-3 justify-center items-center px-6 py-3 rounded-[8px]">
              <ListFilter size={16} />
              <span className="text-text-title font-poppins text-base">
                Filter
              </span>
            </button>

            <div className="flex flex-row justify-center items-center w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search"
                className="bg-background-alt border-border rounded-l-[8px] p-4 w-full sm:w-auto"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <button className="bg-primary rounded-r-[8px] p-4 px-6">
                <Search size={24} className="text-text-body" />
              </button>
            </div>
          </div>

          {/* Export Dropdown Menu */}
          <div className="relative ml-auto sm:ml-0" ref={exportDropdownRef}>
            <button
              className="bg-[#010101CC] flex gap-3 justify-center items-center px-6 py-3 rounded-[12px] text-white"
              onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14 10V12.6667C14 13.0203 13.8595 13.3594 13.6095 13.6095C13.3594 13.8595 13.0203 14 12.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V10"
                  stroke="white"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M4.66699 6.66699L8.00033 10.0003L11.3337 6.66699"
                  stroke="white"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 10V2"
                  stroke="white"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
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

        <div className="overflow-x-auto relative" ref={tableRef}>
          <Table className="w-full rounded-2xl bg-background p-5">
            <TableHeader className="bg-primary-fade text-muted-foreground hover:bg-primary-fade ml-5">
              <TableRow>
                <TableHead className="p-4">
                  <input
                    type="checkbox"
                    className="w-6 h-6 mt-1 border-[#01010129] cursor-pointer"
                    checked={
                      selected.length === filteredRecipients.length &&
                      selected.length > 0
                    }
                    onChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead className="text-base font-poppins text-text-title whitespace-nowrap">
                  Name
                </TableHead>
                <TableHead className="text-base font-poppins text-text-title whitespace-nowrap">
                  Email Address
                </TableHead>
                <TableHead className="text-base font-poppins text-text-title whitespace-nowrap">
                  Cashback Earned
                </TableHead>
                <TableHead className="text-base font-poppins text-text-title whitespace-nowrap">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((recipient) => (
                <TableRow key={recipient.id} className="py-6">
                  <TableCell className="p-4">
                    <input
                      type="checkbox"
                      className="w-6 h-6 mt-1 cursor-pointer"
                      checked={selected.includes(recipient.id)}
                      onChange={() => handleSelect(recipient.id)}
                    />
                  </TableCell>
                  <TableCell className="text-text-body font-poppins text-base py-6 whitespace-nowrap">
                    {recipient.name}
                  </TableCell>
                  <TableCell className="text-text-body font-poppins text-base py-6 whitespace-nowrap">
                    {recipient.email}
                  </TableCell>
                  <TableCell className="text-text-body font-poppins text-base py-6 whitespace-nowrap">
                    {recipient.cashbackEarned}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <Button
                      variant="ghost"
                      className="cursor-pointer border border-primary-300 rounded-sm hover:bg-transparent"
                    >
                      <MoreHorizontal size={14} className="text-primary-300" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center mt-4 p-4 sm:p-8 gap-4">
        <div className="flex items-center gap-2 text-sm sm:text-base">
          <span>Showing</span>
          <Select
            onValueChange={(value) => {
              setItemsPerPage(Number(value));
              setCurrentPage(1);
            }}
          >
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

        <Pagination className="justify-center md:justify-end w-full md:w-auto overflow-auto">
          <PaginationContent className="flex-wrap">
            <PaginationItem>
              <PaginationPrevious
                onClick={handlePrevPage}
                className={
                  currentPage === 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>

            {renderPaginationItems()}

            <PaginationItem>
              <PaginationNext
                onClick={handleNextPage}
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </>
  );
};

export default CashbackRecipientsTable;
