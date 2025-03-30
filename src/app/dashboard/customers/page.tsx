"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, MoreHorizontal, Filter } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
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
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface User {
  id: string;
  name: string;
  email: string;
  kycStatus: string;
  registrationDate: string;
}

export default function UserManagement() {
  const [activeTab, setActiveTab] = useState<"all" | "blocked">("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(20);
  const [selected, setSelected] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [exportDropdownOpen, setExportDropdownOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const exportDropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();

    window.addEventListener("resize", checkIfMobile);

    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  const users: User[] = Array(8)
    .fill(null)
    .map((_, index) => ({
      id: `user-${index + 1}`,
      name: "Ade Johnson",
      email: "Adejohn@gmail.com",
      kycStatus: "Approved",
      registrationDate: "Jan 02, 2024 4:30pm",
    }));

  const filteredUsers = users.filter((user) => {
    if (activeTab === "blocked") {
      return false;
    }

    const matchesSearch = searchTerm
      ? user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedData = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allIds = filteredUsers.map((user) => user.id);
      setSelected(allIds);
    } else {
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
    const dataToExport =
      selected.length > 0
        ? filteredUsers.filter((user) => selected.includes(user.id))
        : filteredUsers;

    if (format === "DOC") {
      const docContent = dataToExport
        .map(
          (u) => `${u.name}\t${u.email}\t${u.kycStatus}\t${u.registrationDate}`
        )
        .join("\n");
      const blob = new Blob([docContent], { type: "application/msword" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "users.doc";
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === "XLS") {
      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
      XLSX.writeFile(workbook, "users.xlsx");
    } else if (format === "PDF") {
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("User Management", 14, 22);

      autoTable(doc, {
        head: [["Name", "Email Address", "KYC Status", "Registration Date"]],
        body: dataToExport.map((user) => [
          user.name,
          user.email,
          user.kycStatus,
          user.registrationDate,
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
            fontStyle: "bold",
          },
        },
        didParseCell: (data) => {
          if (data.section === "body" && data.column.index === 2) {
            const status = data.cell.raw;
            if (status === "Approved") {
              data.cell.styles.textColor = [46, 204, 113];
            } else if (status === "Pending") {
              data.cell.styles.textColor = [243, 156, 18];
            } else if (status === "Rejected") {
              data.cell.styles.textColor = [231, 76, 60];
            }
          }
        },
      });

      doc.save("users.pdf");
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

  const handleViewUser = (id: string) => {
    router.push(`/dashboard/customers/${id}`);
  };

  return (
    <div className="container mx-auto p-2 md:p-4">
      <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-0 bg-background p-3 md:p-4 rounded-[8px]">
        <h1 className="text-xl font-semibold">User Management</h1>
        <div className="flex w-full md:w-auto space-x-2">
          <button
            className={`py-2 px-3 md:px-4 text-sm md:text-base rounded-lg ${
              activeTab === "all"
                ? "bg-[#DDFF00] text-black font-medium"
                : "bg-white text-gray-600"
            }`}
            onClick={() => setActiveTab("all")}
          >
            All Users
          </button>
          <button
            className={`py-2 px-3 md:px-4 text-sm md:text-base rounded-lg ${
              activeTab === "blocked"
                ? "bg-[#DDFF00] text-black font-medium"
                : "bg-white text-gray-600"
            }`}
            onClick={() => setActiveTab("blocked")}
          >
            Blocked Users
          </button>
        </div>
      </div>

      <div className="bg-background rounded-2xl my-4 md:my-6 py-3 md:py-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-0 my-2 md:my-4 px-3 md:px-6">
          <div className="flex flex-col md:flex-row gap-3 md:gap-5 w-full md:w-auto">
            <button className="border border-[#CCCCCC] bg-background flex gap-2 justify-center items-center px-4 md:px-10 py-2 md:py-3 rounded-[8px]">
              <Filter size={isMobile ? 16 : 20} />
              <span className="text-sm md:text-base">Filter</span>
            </button>

            <div className="flex flex-row justify-center items-center w-full md:w-auto">
              <input
                type="text"
                placeholder="Search"
                className="bg-[#F5F5F5] border border-[#CCCCCC] rounded-l-[8px] p-2 md:p-4 w-full md:w-auto text-sm md:text-base"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <button className="bg-[#DDFF00] rounded-r-[8px] p-2 md:p-4 px-3 md:px-6">
                <Search size={isMobile ? 18 : 24} className="text-black" />
              </button>
            </div>
          </div>

          <div className="relative w-full md:w-auto" ref={exportDropdownRef}>
            <button
              className="bg-[#010101CC] flex gap-2 justify-center items-center px-4 md:px-6 py-2 md:py-3 rounded-[12px] text-white w-full md:w-auto"
              onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
            >
              <svg
                width={isMobile ? "14" : "16"}
                height={isMobile ? "14" : "16"}
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
              <span className="font-medium text-sm md:text-base">Export</span>
            </button>

            {exportDropdownOpen && (
              <div className="absolute right-0 mt-2 w-32 rounded-md shadow-xl py-1 bg-white z-10">
                <button
                  className="block px-4 py-2 text-sm text-gray-700 w-full border-border hover:bg-gray-100 text-left border-b"
                  onClick={() => exportData("PDF")}
                >
                  Export as PDF
                </button>
                <button
                  className="block px-4 py-2 text-sm text-gray-700 w-full border-border hover:bg-gray-100 text-left border-b"
                  onClick={() => exportData("XLS")}
                >
                  Export as XLS
                </button>
                <button
                  className="block px-4 py-2 text-sm text-nowrap text-gray-700 w-full border-border hover:bg-gray-100 text-left border-b"
                  onClick={() => exportData("DOC")}
                >
                  Export as DOC
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table className="w-full rounded-2xl bg-background p-2 md:p-5">
            <TableHeader className="bg-[#F5F5F5] hover:bg-[#F5F5F5]">
              <TableRow>
                <TableHead className="p-2 md:p-4 hidden md:table-cell">
                  <input
                    type="checkbox"
                    className="w-4 h-4 md:w-6 md:h-6 mt-1 border-[#01010129] cursor-pointer"
                    checked={
                      selected.length === filteredUsers.length &&
                      selected.length > 0
                    }
                    onChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead className="text-sm md:text-base font-medium">
                  Name
                </TableHead>
                <TableHead className="text-sm md:text-base font-medium hidden md:table-cell">
                  Email Address
                </TableHead>
                <TableHead className="text-sm md:text-base font-medium">
                  KYC Status
                </TableHead>
                <TableHead className="text-sm md:text-base font-medium hidden md:table-cell">
                  Registration Date
                </TableHead>
                <TableHead className="text-sm md:text-base font-medium">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((user, index) => (
                <TableRow key={index} className="py-3 md:py-6">
                  <TableCell className="p-2 md:p-4 hidden md:table-cell">
                    <input
                      type="checkbox"
                      className="w-4 h-4 md:w-6 md:h-6 mt-1 cursor-pointer"
                      checked={selected.includes(user.id)}
                      onChange={() => handleSelect(user.id)}
                    />
                  </TableCell>
                  <TableCell className="text-sm md:text-base py-3 md:py-6">
                    <div>
                      {user.name}
                      <div className="md:hidden text-xs text-gray-500">
                        {user.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm md:text-base hidden md:table-cell py-3 md:py-6">
                    {user.email}
                  </TableCell>
                  <TableCell className="text-sm md:text-base py-3 md:py-6">
                    <span className="px-2 md:px-4 py-1 md:py-2 rounded-md bg-[#E6F7EF] text-[#00A85A] text-xs md:text-sm">
                      {user.kycStatus}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm md:text-base py-3 md:py-6 hidden md:table-cell">
                    {user.registrationDate}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      className="cursor-pointer border border-[#DDFF00] rounded-sm hover:bg-transparent p-1 md:p-2 h-auto"
                      onClick={() => handleViewUser(user.id)}
                    >
                      <MoreHorizontal
                        size={isMobile ? 12 : 14}
                        className="text-[#DDFF00]"
                      />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center mt-2 md:mt-4 p-3 md:p-8 gap-3 md:gap-0">
        <div className="flex items-center gap-1 md:gap-2 text-sm md:text-base">
          <span>Showing</span>
          <Select
            onValueChange={(value) => {
              setItemsPerPage(Number(value));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-12 md:w-16 bg-background h-8 md:h-10">
              {itemsPerPage}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
          <span>Entries</span>
        </div>

        <Pagination className="justify-end">
          <PaginationContent className="flex-wrap">
            <PaginationItem>
              <PaginationPrevious
                onClick={handlePrevPage}
                className={`${
                  currentPage === 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                } h-8 md:h-10 w-8 md:w-10 p-0 flex items-center justify-center`}
              />
            </PaginationItem>

            {isMobile ? (
              <PaginationItem>
                <PaginationLink
                  isActive={true}
                  className="bg-primary text-white hover:bg-primary/90 h-8 md:h-10 w-8 md:w-10 p-0 flex items-center justify-center"
                >
                  {currentPage}{" "}
                  <span className="ml-1 text-xs">of {totalPages}</span>
                </PaginationLink>
              </PaginationItem>
            ) : (
              renderPaginationItems()
            )}

            <PaginationItem>
              <PaginationNext
                onClick={handleNextPage}
                className={`${
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                } h-8 md:h-10 w-8 md:w-10 p-0 flex items-center justify-center`}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
