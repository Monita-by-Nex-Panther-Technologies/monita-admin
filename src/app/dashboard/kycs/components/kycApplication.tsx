"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Search, MoreHorizontal, ListFilter, X, Eye } from "lucide-react";
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
  const [isMobile, setIsMobile] = useState(false);

  const exportDropdownRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkIfMobile();

    // Add event listener for resize
    window.addEventListener("resize", checkIfMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

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
      ? application.kycStatus === filters.status || filters.status === "all"
      : true;

    const matchesKycLevel = filters.kycLevel
      ? application.kycLevel === filters.kycLevel || filters.kycLevel === "all"
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
    currentPage * itemsPerPage
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
        : [...prev, id]
    );
  };

  const exportData = (format: string) => {
    const dataToExport =
      selected.length > 0
        ? filteredApplications.filter((application) =>
            selected.includes(application.id)
          )
        : filteredApplications;

    if (format === "DOC") {
      const docContent = dataToExport
        .map(
          (a) =>
            `${a.username}\t${a.kycLevel}\t${a.meansOfId}\t${a.kycStatus}\t${a.approvedDate}`
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
          { align: "center" }
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

  const renderMobileCard = (application: any) => {
    return (
      <div
        key={application.id}
        className="bg-background p-4 rounded-lg mb-4 border border-border"
      >
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center">
            <input
              type="checkbox"
              className="w-5 h-5 mr-3"
              checked={selected.includes(application.id)}
              onChange={() => handleSelect(application.id)}
            />
            <span className="font-semibold text-text-title">
              {application.username}
            </span>
          </div>
          <span
            className={`px-2 py-1 rounded-md text-sm ${
              application.kycStatus === "Approved"
                ? "text-green-500 bg-green-50"
                : application.kycStatus === "Rejected"
                ? "text-red-500 bg-red-50"
                : "text-yellow-500 bg-yellow-50"
            }`}
          >
            {application.kycStatus}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
          <div>
            <p className="text-muted-foreground">KYC Level</p>
            <p className="font-medium">{application.kycLevel}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Means of ID</p>
            <p className="font-medium">{application.meansOfId}</p>
          </div>
          <div className="col-span-2">
            <p className="text-muted-foreground">Approved Date</p>
            <p className="font-medium">{application.approvedDate}</p>
          </div>
        </div>

        <div className="flex justify-end mt-3">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center text-xs gap-1 border-primary text-primary"
          >
            <Eye size={14} /> View Details
          </Button>
        </div>
      </div>
    );
  };

  const areFiltersActive =
    filters.username !== "" ||
    filters.status !== "" ||
    filters.kycLevel !== "" ||
    filters.startDate !== undefined ||
    filters.endDate !== undefined;

  return (
    <>
      <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center bg-background p-4 rounded-[8px] mt-6">
        <h1 className="text-text-title text-xl font-semibold font-poppins mb-3 md:mb-0">
          KYC Applications
        </h1>
        <div className="flex flex-row gap-x-3 w-full md:w-auto">
          <button className="justify-center items-center bg-background border border-primary-300 text-text-body font-poppins font-medium px-2 md:px-4 py-2 flex-1 md:w-[132px] rounded-[12px] active:bg-primary-foreground">
            Reject
          </button>
          <button className="justify-center bg-primary items-center text-text-body font-poppins py-2 md:p-4 flex-1 md:w-[132px] rounded-[12px] font-medium">
            Approve
          </button>
        </div>
      </div>

      <div className="bg-background rounded-2xl my-6 py-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center my-4 px-3 md:px-6 gap-3">
          <div className="flex flex-col md:flex-row gap-3 md:gap-5 w-full md:w-auto">
            <button
              className="border border-primary bg-background flex gap-3 justify-center items-center px-4 md:px-10 py-3 rounded-[8px] w-full md:w-auto"
              onClick={() => setIsFilterModalOpen(true)}
            >
              <ListFilter size={16} />
              <span className="text-text-title font-poppins text-base">
                Filter
              </span>
            </button>

            <div className="flex flex-row justify-center items-center w-full md:w-auto">
              <input
                type="text"
                placeholder="Search"
                className="bg-background-alt border-border rounded-l-[8px] p-3 md:p-4 flex-1"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <button className="bg-primary rounded-r-[8px] p-3 md:p-4 px-4 md:px-6">
                <Search size={20} className="text-text-body" />
              </button>
              {areFiltersActive && (
                <button
                  className="bg-background-alt border-border rounded-[8px] p-3 md:p-4 ml-2"
                  onClick={handleResetFilters}
                >
                  <X size={20} className="text-text-body" />
                </button>
              )}
            </div>
          </div>

          {/* Export Dropdown Menu */}
          <div
            className="relative w-full md:w-auto mt-3 md:mt-0"
            ref={exportDropdownRef}
          >
            <button
              className="bg-[#010101CC] flex gap-3 justify-center items-center px-4 md:px-6 py-3 rounded-[12px] text-white w-full md:w-auto"
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

        {/* Mobile View */}
        {isMobile ? (
          <div className="px-3 py-2">
            {paginatedData.length > 0 ? (
              paginatedData.map((application) => renderMobileCard(application))
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground">
                  No matching KYC applications found
                </p>
              </div>
            )}
          </div>
        ) : (
          // Desktop Table View
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
                        <MoreHorizontal
                          size={14}
                          className="text-primary-300"
                        />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center mt-4 p-3 md:p-8 gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm md:text-base">Showing</span>
          <Select
            onValueChange={(value) => {
              setItemsPerPage(Number(value));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-16 bg-background text-sm md:text-base">
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
          <span className="text-sm md:text-base">Entries</span>
        </div>

        <Pagination className="justify-center md:justify-end w-full md:w-auto">
          <PaginationContent className="flex-wrap gap-1">
            <PaginationItem>
              <PaginationPrevious
                onClick={handlePrevPage}
                className={`${
                  currentPage === 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                } text-xs md:text-sm`}
              />
            </PaginationItem>

            {isMobile ? (
              <>
                <PaginationItem>
                  <PaginationLink
                    isActive={currentPage === 1}
                    onClick={() => setCurrentPage(1)}
                    className={`text-xs md:text-sm ${
                      currentPage === 1
                        ? "bg-primary text-white hover:bg-primary/90"
                        : ""
                    }`}
                  >
                    1
                  </PaginationLink>
                </PaginationItem>

                {currentPage > 3 && (
                  <PaginationItem>
                    <PaginationEllipsis className="text-xs md:text-sm" />
                  </PaginationItem>
                )}

                {currentPage !== 1 && currentPage !== totalPages && (
                  <PaginationItem>
                    <PaginationLink
                      isActive={true}
                      className="bg-primary text-white hover:bg-primary/90 text-xs md:text-sm"
                    >
                      {currentPage}
                    </PaginationLink>
                  </PaginationItem>
                )}

                {currentPage < totalPages - 2 && (
                  <PaginationItem>
                    <PaginationEllipsis className="text-xs md:text-sm" />
                  </PaginationItem>
                )}

                {totalPages > 1 && (
                  <PaginationItem>
                    <PaginationLink
                      isActive={currentPage === totalPages}
                      onClick={() => setCurrentPage(totalPages)}
                      className={`text-xs md:text-sm ${
                        currentPage === totalPages
                          ? "bg-primary text-white hover:bg-primary/90"
                          : ""
                      }`}
                    >
                      {totalPages}
                    </PaginationLink>
                  </PaginationItem>
                )}
              </>
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
                } text-xs md:text-sm`}
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
