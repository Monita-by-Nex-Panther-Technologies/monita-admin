"use client";
import React, { useState, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
import { Search, MoreHorizontal, ListFilter, X } from "lucide-react";
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
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
// import { format } from "date-fns";
import FilterModal from "./KycFilterModal";
import { kycApplications } from "./data"; // Import data from data.ts

const itemsPerPageOptions = [5, 10, 20, 50];

interface FilterCriteria {
  username: string;
  status: string;
  kycLevel: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
}

const KycApplicationsTable = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [selected, setSelected] = useState<string[]>([]);
  const [exportDropdownOpen, setExportDropdownOpen] = useState<boolean>(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);
  const [filters, setFilters] = useState<FilterCriteria>({
    username: "",
    status: "",
    kycLevel: "",
    startDate: undefined,
    endDate: undefined,
  });
  const [searchTerm, setSearchTerm] = useState<string>(""); // State for search term

  const exportDropdownRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  const filteredApplications = kycApplications.filter((application) => {
    // Search filter
    const matchesSearch = searchTerm
      ? application.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        application.meansOfId.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    // Other filters
    const matchesUsername = filters.username
      ? application.username
          .toLowerCase()
          .includes(filters.username.toLowerCase())
      : true;

    const matchesStatus = filters.status
      ? application.kycStatus === filters.status
      : true;

    const matchesKycLevel = filters.kycLevel
      ? application.kycLevel === filters.kycLevel
      : true;

    const matchesStartDate = filters.startDate
      ? new Date(application.approvedDate) >= filters.startDate
      : true;

    const matchesEndDate = filters.endDate
      ? new Date(application.approvedDate) <= filters.endDate
      : true;

    return (
      matchesSearch &&
      matchesUsername &&
      matchesStatus &&
      matchesKycLevel &&
      matchesStartDate &&
      matchesEndDate
    );
  });

  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);
  const paginatedData = filteredApplications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleFilterApply = (newFilters: FilterCriteria) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to the first page after applying filters
    setSelected([]); // Clear selected items when filters change
  };

  const handleResetFilters = () => {
    setFilters({
      username: "",
      status: "",
      kycLevel: "",
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
      // Select all applications in the current filtered view
      const allIds = filteredApplications.map((application) => application.id);
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
        : [...prev, id],
    );
  };

  // const isSelected = (id: string) => selected.includes(id);

  const exportData = (format: string) => {
    const dataToExport =
      selected.length > 0
        ? filteredApplications.filter((application) =>
            selected.includes(application.id),
          )
        : filteredApplications;

    if (format === "DOC") {
      const docContent = dataToExport
        .map(
          (a) =>
            `${a.username}\t${a.kycLevel}\t${a.meansOfId}\t${a.kycStatus}\t${a.approvedDate}`,
        )
        .join("\n");
      const blob = new Blob([docContent], { type: "application/msword" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "kyc-applications.doc";
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === "XLS") {
      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "KYC Applications");
      XLSX.writeFile(workbook, "kyc-applications.xlsx");
    } else if (format === "PDF") {
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("KYC Applications", 14, 22);

      autoTable(doc, {
        head: [
          [
            "Username",
            "KYC Level",
            "Means of ID",
            "KYC Status",
            "Approved Date",
          ],
        ],
        body: dataToExport.map((application) => [
          application.username,
          application.kycLevel,
          application.meansOfId,
          application.kycStatus,
          application.approvedDate,
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
        didParseCell: function (data) {
          if (data.section === "body" && data.column.index === 3) {
            const status = data.cell.raw;
            if (status === "Approved") {
              data.cell.styles.textColor = [46, 204, 113];
            } else if (status === "Rejected") {
              data.cell.styles.textColor = [231, 76, 60];
            } else {
              data.cell.styles.textColor = [243, 156, 18];
            }
          }
        },
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
          { align: "center" },
        );
      }

      doc.save("kyc-applications.pdf");
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
      </PaginationItem>,
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
          </PaginationItem>,
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
          </PaginationItem>,
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
          </PaginationItem>,
        );
      }
      if (endPage < totalPages - 1) {
        items.push(
          <PaginationItem key="ellipsis-2">
            <PaginationEllipsis />
          </PaginationItem>,
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
          </PaginationItem>,
        );
      }
    }
    return items;
  };

  // Check if any filters are active
  const areFiltersActive =
    filters.username !== "" ||
    filters.status !== "" ||
    filters.kycLevel !== "" ||
    filters.startDate !== undefined ||
    filters.endDate !== undefined;

  return (
    <>
      <div className="w-full flex flex-row justify-between items-center bg-background p-4 rounded-[8px] mt-6">
        <h1 className="text-text-title text-xl font-semibold font-poppins">
          KYC Applications
        </h1>
        <div className="flex flex-row gap-x-4 ">
          <button className="justify-center items-center bg-background border border-primary-300 text-text-body font-poppins font-medium px-4 w-[132px] rounded-[12px] active:bg-primary-foreground">
            Reject
          </button>
          <button className="justify-center bg-primary items-center text-text-body font-poppins p-4 w-[132px] rounded-[12px] font-medium">
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
              <span className=" text-text-title font-poppins text-base">
                Filter
              </span>
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
                  d="M4.66667 6.66667L8 10L11.3333 6.66667"
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

        <div className="overflow-auto relative" ref={tableRef}>
          <Table className="w-full rounded-2xl bg-background p-5">
            <TableHeader className="bg-primary-fade text-muted-foreground hover:bg-primary-fade ml-5">
              <TableRow>
                <TableHead className="p-4">
                  <input
                    type="checkbox"
                    className="w-6 h-6 mt-1 border-[#01010129] cursor-pointer"
                    checked={
                      selected.length === filteredApplications.length &&
                      selected.length > 0
                    }
                    onChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead className="text-base font-poppins text-text-title">
                  Username
                </TableHead>
                <TableHead className="text-base font-poppins text-text-title">
                  KYC Level
                </TableHead>
                <TableHead className="text-base font-poppins text-text-title">
                  Means of ID
                </TableHead>
                <TableHead className="text-base font-poppins text-text-title">
                  KYC Status
                </TableHead>
                <TableHead className="text-base font-poppins text-text-title">
                  Approved Date
                </TableHead>
                <TableHead className="text-base font-poppins text-text-title">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((application) => (
                <TableRow key={application.id} className="py-6">
                  <TableCell className="p-4">
                    <input
                      type="checkbox"
                      className="w-6 h-6 mt-1 cursor-pointer"
                      checked={selected.includes(application.id)}
                      onChange={() => handleSelect(application.id)}
                    />
                  </TableCell>
                  <TableCell className="text-text-body font-poppins text-base py-6">
                    {application.username}
                  </TableCell>
                  <TableCell className="text-text-body font-poppins text-base py-6">
                    {application.kycLevel}
                  </TableCell>
                  <TableCell className="text-text-body font-poppins text-base py-6">
                    {application.meansOfId}
                  </TableCell>
                  <TableCell className="text-text-body font-poppins text-base py-6">
                    <span
                      className={`px-2 py-1 rounded-md w-full ${
                        application.kycStatus === "Approved"
                          ? "text-green-500"
                          : application.kycStatus === "Rejected"
                            ? "text-red-500"
                            : "text-yellow-500"
                      }`}
                    >
                      {application.kycStatus}
                    </span>
                  </TableCell>
                  <TableCell className="text-text-body font-poppins text-base py-6">
                    {application.approvedDate}
                  </TableCell>
                  <TableCell>
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

      <div className="flex justify-between items-center mt-4 p-8 ">
        <div className="flex items-center gap-2">
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

        <Pagination className=" justify-end">
          <PaginationContent>
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

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={handleFilterApply}
      />
    </>
  );
};

export default KycApplicationsTable;
