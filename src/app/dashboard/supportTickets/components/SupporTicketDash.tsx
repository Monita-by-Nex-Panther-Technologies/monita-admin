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
import { Search, MoreHorizontal, ListFilter, Copy } from "lucide-react";
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
import { AssignTicketDialog } from "./assign-ticket-dialog";
import { useRouter } from "next/navigation";

const itemsPerPageOptions = [20, 50, 100];

interface Ticket {
  id: string;
  name: string;
  issue: string;
  status: string;
}

const SupportTicketTable = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(20);
  const [selected, setSelected] = useState<string[]>([]);
  const [exportDropdownOpen, setExportDropdownOpen] = useState<boolean>(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [assignDialogOpen, setAssignDialogOpen] = useState<boolean>(false);

  const exportDropdownRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Mock data for tickets
  const tickets: Ticket[] = Array(8)
    .fill(null)
    .map(() => ({
      id: "102911120111",
      name: "Ade Johnson",
      issue: "Delay in transaction...",
      status: "Open",
    }));

  const filteredTickets = tickets.filter((ticket) => {
    // Search filter
    const matchesSearch = searchTerm
      ? ticket.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.issue.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);
  const paginatedData = filteredTickets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
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
      const allIds = filteredTickets.map((ticket) => ticket.id);
      setSelected(allIds);
    } else {
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const exportData = (format: string) => {
    const dataToExport =
      selected.length > 0
        ? filteredTickets.filter((ticket) => selected.includes(ticket.id))
        : filteredTickets;

    if (format === "DOC") {
      const docContent = dataToExport
        .map((t) => `${t.name}\t${t.id}\t${t.issue}\t${t.status}`)
        .join("\n");
      const blob = new Blob([docContent], { type: "application/msword" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "tickets.doc";
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === "XLS") {
      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Tickets");
      XLSX.writeFile(workbook, "tickets.xlsx");
    } else if (format === "PDF") {
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("Ticket Management", 14, 22);

      autoTable(doc, {
        head: [["Name", "Ticket ID", "Issue Summary", "Status"]],
        body: dataToExport.map((ticket) => [
          ticket.name,
          ticket.id,
          ticket.issue,
          ticket.status,
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
          3: {
            fontStyle: "bold",
          },
        },
        didParseCell: (data) => {
          if (data.section === "body" && data.column.index === 3) {
            const status = data.cell.raw;
            if (status === "Open") {
              data.cell.styles.textColor = [46, 204, 113];
            } else if (status === "Closed") {
              data.cell.styles.textColor = [231, 76, 60];
            } else {
              data.cell.styles.textColor = [243, 156, 18];
            }
          }
        },
      });

      doc.save("tickets.pdf");
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

  const handleViewTicket = (id: string) => {
    router.push(`/dashboard/supportTickets/${id}`);
  };

  return (
    <>
      <div className="w-full flex flex-row justify-between items-center bg-background p-4 rounded-[8px]">
        <h1 className="text-xl font-semibold">Ticket Management</h1>
        <div className="flex flex-row gap-x-4">
          <button
            className="justify-center items-center bg-white border border-red-500 text-red-500 font-medium px-4 py-2 w-[132px] rounded-[12px]"
            onClick={() => setAssignDialogOpen(false)}
          >
            Close
          </button>
          <button
            className="justify-center bg-green-500 items-center text-white font-medium px-4 py-2 w-[132px] rounded-[12px]"
            onClick={() => setAssignDialogOpen(true)}
          >
            Assign
          </button>
        </div>
      </div>

      <div className="bg-background rounded-2xl my-6 py-4">
        <div className="flex justify-between items-center my-4 px-6">
          <div className="flex flex-row gap-5">
            <button
              className="border border-[#CCCCCC] bg-background flex gap-3 justify-center items-center px-10 py-3 rounded-[8px]"
              onClick={() => setIsFilterModalOpen(true)}
            >
              <ListFilter size={16} />
              <span className="text-base">Filter</span>
            </button>

            <div className={`${isFilterModalOpen ? "" : ""}`}></div>

            <div className="flex flex-row justify-center items-center">
              <input
                type="text"
                placeholder="Search"
                className="bg-[#F5F5F5] border border-[#CCCCCC] rounded-l-[8px] p-4"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <button className="bg-[#DDFF00] rounded-r-[8px] p-4 px-6">
                <Search size={24} className="text-black" />
              </button>
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
              <span className="font-medium text-base">Export</span>
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

        <div className="overflow-auto relative" ref={tableRef}>
          <Table className="w-full rounded-2xl bg-background p-5">
            <TableHeader className="bg-[#F5F5F5] hover:bg-[#F5F5F5]">
              <TableRow>
                <TableHead className="p-4">
                  <input
                    type="checkbox"
                    className="w-6 h-6 mt-1 border-[#01010129] cursor-pointer"
                    checked={
                      selected.length === filteredTickets.length &&
                      selected.length > 0
                    }
                    onChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead className="text-base font-medium">Name</TableHead>
                <TableHead className="text-base font-medium">
                  Issue Summary
                </TableHead>
                <TableHead className="text-base font-medium">
                  Ticket Status
                </TableHead>
                <TableHead className="text-base font-medium">
                  Ticket ID
                </TableHead>
                <TableHead className="text-base font-medium">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((ticket, index) => (
                <TableRow key={index} className="py-6">
                  <TableCell className="p-4">
                    <input
                      type="checkbox"
                      className="w-6 h-6 mt-1 cursor-pointer"
                      checked={selected.includes(ticket.id)}
                      onChange={() => handleSelect(ticket.id)}
                    />
                  </TableCell>
                  <TableCell className="text-base py-6">
                    {ticket.name}
                  </TableCell>
                  <TableCell className="text-base py-6">
                    {ticket.issue}
                  </TableCell>
                  <TableCell className="text-base py-6">
                    <span className="px-4 py-2 rounded-md bg-[#E6F7EF] text-[#00A85A]">
                      {ticket.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-base py-6 flex items-center gap-2">
                    {ticket.id}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(ticket.id)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      className="cursor-pointer border border-[#DDFF00] rounded-sm hover:bg-transparent"
                      onClick={() => handleViewTicket(ticket.id)}
                    >
                      <MoreHorizontal size={14} className="text-[#DDFF00]" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex justify-between items-center mt-4 p-8">
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

        <Pagination className="justify-end">
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

      <AssignTicketDialog
        open={assignDialogOpen}
        onOpenChange={setAssignDialogOpen}
      />
    </>
  );
};

export default SupportTicketTable;
