"use client";

import React, { useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Check,
  Copy,
  Download,
  Filter,
  ListFilter,
  MoreHorizontal,
  Search,
  X,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import FilterModal from "../../transactions/components/TransactionFilterModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { icons } from "@/constants/icons";

// Sample data for recipient details - in a real app, this would come from an API
const recipientData = {
  id: "1",
  name: "Ade Johnson",
  email: "Adebayo10@gmail.com",
  address: "Ikeja, Lagos",
  balBefore: "₦10,000,000",
  balAfter: "₦9,999,900",
  imageVerified: true,
  match: "98%",
  totalCashback: "₦10,000,000",
  device: {
    name: "iPhone 14 Pro",
    os: "iOS 17",
    ipAddress: "192.168.1.1",
    location: "Lagos, Nigeria",
  },
  otherDetails: {
    providerResponse: "Failed",
    statusCode: "401",
    processTime: "60 minutes",
    providerDetails: "Nomiworld",
  },
  transactions: [
    {
      id: "10291112011111",
      amount: "₦5,000",
      type: "Data",
      status: "Pending",
      date: "Jan 03, 2024 10:00am",
      cashback: "₦5.00",
    },
    {
      id: "10291112011112",
      amount: "₦15,000",
      type: "Airtime",
      status: "Successful",
      date: "Jan 04, 2024 2:30pm",
      cashback: "₦15.00",
    },
    {
      id: "10291112011113",
      amount: "₦20,000",
      type: "Airtime",
      status: "Failed",
      date: "Jan 05, 2024 1:15pm",
      cashback: "₦0.00",
    },
  ],
};

const itemsPerPageOptions = [5, 10, 20, 50, 100];

const RecipientDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>(
    []
  );
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);
  const [filters, setFilters] = useState({
    username: "",
    status: "",
    transactionType: "",
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
  });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [exportDropdownOpen, setExportDropdownOpen] = useState<boolean>(false);
  const exportDropdownRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  // In a real app, fetch data based on ID

  const exportData = (format: string) => {
    // Export functionality would go here
    console.log(format);
    setExportDropdownOpen(false);
  };

  const recipient = recipientData;

  const handleSelectTransaction = (transactionId: string) => {
    setSelectedTransactions((prev) =>
      prev.includes(transactionId)
        ? prev.filter((id) => id !== transactionId)
        : [...prev, transactionId]
    );
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedTransactions(recipient.transactions.map((t) => t.id));
    } else {
      setSelectedTransactions([]);
    }
  };

  const handleFilterApply = (newFilters: any) => {
    setFilters(newFilters);
    setCurrentPage(1);
    setSelectedTransactions([]);
  };

  const handleResetFilters = () => {
    setFilters({
      username: "",
      status: "",
      transactionType: "",
      startDate: undefined,
      endDate: undefined,
    });
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              isActive={i === currentPage}
              onClick={() => setCurrentPage(i)}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      const half = Math.floor(maxVisiblePages / 2);
      let start = Math.max(1, currentPage - half);
      let end = Math.min(totalPages, start + maxVisiblePages - 1);

      if (end - start + 1 < maxVisiblePages) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }

      if (start > 1) {
        items.push(
          <PaginationItem key="start-ellipsis">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      for (let i = start; i <= end; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              isActive={i === currentPage}
              onClick={() => setCurrentPage(i)}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      if (end < totalPages) {
        items.push(
          <PaginationItem key="end-ellipsis">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    return items;
  };

  const filteredTransactions = recipient.transactions.filter((transaction) => {
    const matchesSearch = searchTerm
      ? transaction.id.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    const matchesUsername = filters.username
      ? (transaction as any).username
          ?.toLowerCase()
          .includes(filters.username.toLowerCase())
      : true;

    const matchesStatus = filters.status
      ? transaction.status === filters.status
      : true;

    const matchesTransactionType = filters.transactionType
      ? transaction.type === filters.transactionType
      : true;
    const matchesStartDate =
      filters.startDate instanceof Date
        ? new Date(transaction.date) >= filters.startDate
        : true;

    const matchesEndDate =
      filters.endDate instanceof Date
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
  const paginatedData = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const areFiltersActive =
    filters.username !== "" ||
    filters.status !== "" ||
    filters.transactionType !== "" ||
    filters.startDate !== undefined ||
    filters.endDate !== undefined;

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-6">
      {/* Header with back button and total cashback */}
      <div className="bg-white rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 shadow-sm gap-3">
        <Link
          href="/dashboard/cashback"
          className="flex items-center text-lg font-semibold gap-2"
        >
          <ArrowLeft size={20} />
          <span>{recipient.name}</span>
        </Link>

        <div className="flex items-center gap-2 text-gray-700">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19.5 14.25V11.625C19.5 9.76104 18.7625 7.97463 17.4497 6.6618C16.1368 5.34896 14.3507 4.61142 12.4873 4.60024C10.624 4.58906 8.82822 5.3086 7.49883 6.60223C6.16944 7.89587 5.41432 9.67375 5.3975 11.5375C5.38068 13.4013 6.10022 15.1971 7.39385 16.5265C8.68749 17.8559 10.4654 18.611 12.3292 18.6278C14.193 18.6446 15.9889 17.9251 17.3182 16.6314L14.2857 13.5989C13.6662 14.1402 12.8814 14.4298 12.0718 14.4188C11.2621 14.4078 10.4853 14.0971 9.87938 13.5404C9.27342 12.9836 8.88986 12.2214 8.8041 11.4139C8.71834 10.6063 8.93642 9.7949 9.41627 9.1397C9.89611 8.48449 10.6054 8.0329 11.4044 7.86929C12.2033 7.70567 13.0277 7.84033 13.7281 8.24938C14.4286 8.65843 14.9577 9.31245 15.2175 10.0814C15.4773 10.8503 15.4504 11.6854 15.1411 12.4364"
              stroke="#222222"
              strokeOpacity="0.8"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="font-normal text-[#010101A3]">Total Cashback:</span>
          <span className="font-bold">{recipient.totalCashback}</span>
        </div>
      </div>

      {/* User Info Section */}
      <div className="bg-white rounded-xl shadow-sm mb-4 sm:mb-6 overflow-hidden">
        {/* Verified Image Section */}
        <div className="border-b p-4 sm:p-6 flex items-center gap-4">
          <Avatar className="h-12 w-12 sm:h-14 sm:w-14">
            <AvatarImage
              src={`https://ui-avatars.com/api/?name=${recipient.name}&background=random`}
            />
            <AvatarFallback>{recipient.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-semibold">
                Image Verified
              </span>
              <Badge className="bg-green-500 text-white rounded-full p-0.5">
                <Check size={14} />
              </Badge>
            </div>
            <div className="text-gray-600">Match: {recipient.match}</div>
          </div>
        </div>

        {/* User Details Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 p-4 sm:p-6 border-b gap-4">
          <div>
            <div className="text-gray-500 mb-2">Name</div>
            <div className="font-medium">Adebayo10</div>
          </div>
          <div>
            <div className="text-gray-500 mb-2">Email Address</div>
            <div className="font-medium">{recipient.email}</div>
          </div>
          <div>
            <div className="text-gray-500 mb-2">Address</div>
            <div className="font-medium">{recipient.address}</div>
          </div>
          <div className="grid grid-cols-2">
            <div>
              <div className="text-gray-500 mb-2">Bal Before</div>
              <div className="font-medium">{recipient.balBefore}</div>
            </div>
            <div>
              <div className="text-gray-500 mb-2">Bal After</div>
              <div className="font-medium">{recipient.balAfter}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Device Info Section */}
      <Card className="mb-4 sm:mb-6 shadow-sm border-none">
        <CardContent className="p-0">
          <div className="p-4 sm:p-6 pb-2 sm:pb-4">
            <h2 className="text-lg font-semibold">Device Info</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 p-4 sm:p-6 pt-0 gap-4">
            <div>
              <div className="text-gray-500 mb-2">Name</div>
              <div className="font-medium">{recipient.device.name}</div>
            </div>
            <div>
              <div className="text-gray-500 mb-2">OS</div>
              <div className="font-medium">{recipient.device.os}</div>
            </div>
            <div>
              <div className="text-gray-500 mb-2">IP Address</div>
              <div className="font-medium text-blue-600">
                {recipient.device.ipAddress}
              </div>
            </div>
            <div>
              <div className="text-gray-500 mb-2">Location</div>
              <div className="font-medium">{recipient.device.location}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Other Details Section */}
      <Card className="mb-4 sm:mb-6 shadow-sm border-none">
        <CardContent className="p-0">
          <div className="p-4 sm:p-6 pb-2 sm:pb-4">
            <h2 className="text-lg font-semibold">Other Details</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 p-4 sm:p-6 pt-0 gap-4">
            <div>
              <div className="text-gray-500 mb-2">Provider response</div>
              <div className="bg-red-100 text-red-600 px-4 py-1 rounded-md inline-block font-medium">
                {recipient.otherDetails.providerResponse}
              </div>
            </div>
            <div>
              <div className="text-gray-500 mb-2">Status Code</div>
              <div className="font-medium">
                {recipient.otherDetails.statusCode}
              </div>
            </div>
            <div>
              <div className="text-gray-500 mb-2">Process Time</div>
              <div className="font-medium">
                {recipient.otherDetails.processTime}
              </div>
            </div>
            <div>
              <div className="text-gray-500 mb-2">Provider details</div>
              <div className="font-medium">
                {recipient.otherDetails.providerDetails}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table Section */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center my-4 px-3 sm:px-6 gap-3">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 mt-5 w-full sm:w-auto">
            <button
              className="border border-primary bg-background flex gap-3 justify-center items-center px-4 sm:px-10 py-3 rounded-[8px] w-full sm:w-auto"
              onClick={() => setIsFilterModalOpen(true)}
            >
              <ListFilter size={16} />
              <span className="text-text-title font-poppins text-base">
                Filter
              </span>
            </button>

            <div className="flex flex-row justify-center items-center w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search"
                className="bg-background-alt border-border rounded-l-[8px] p-3 sm:p-4 flex-grow sm:flex-grow-0"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <button className="bg-primary rounded-r-[8px] p-3 sm:p-4 px-4 sm:px-6">
                <Search size={20} className="text-text-body" />
              </button>
              {areFiltersActive && (
                <button
                  className="bg-background-alt border-border rounded-[8px] p-3 sm:p-4 ml-2"
                  onClick={handleResetFilters}
                >
                  <X size={20} className="text-text-body" />
                </button>
              )}
            </div>
          </div>

          {/* Export Dropdown Menu */}
          <div
            className="relative w-full sm:w-auto mt-3 sm:mt-0"
            ref={exportDropdownRef}
          >
            <button
              className="bg-[#010101CC] flex gap-3 justify-center items-center px-6 py-3 rounded-[12px] text-white w-full sm:w-auto"
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

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader className="bg-primary-fade text-muted-foreground hover:bg-primary-fade ml-5">
              <TableRow>
                <TableHead className="p-2 sm:p-4">
                  <input
                    type="checkbox"
                    className="w-5 h-5 sm:w-6 sm:h-6 mt-1 border-[#01010129] cursor-pointer"
                    checked={
                      selectedTransactions.length ===
                        recipient.transactions.length &&
                      selectedTransactions.length > 0
                    }
                    onChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead className="text-sm sm:text-base font-poppins text-text-title">
                  Username
                </TableHead>
                <TableHead className="text-sm sm:text-base font-poppins text-text-title">
                  Transaction ID
                </TableHead>
                <TableHead className="text-sm sm:text-base font-poppins text-text-title">
                  Amount
                </TableHead>
                <TableHead className="text-sm sm:text-base font-poppins text-text-title">
                  Type
                </TableHead>
                <TableHead className="text-sm sm:text-base font-poppins text-text-title">
                  Status
                </TableHead>
                <TableHead className="text-sm sm:text-base font-poppins text-text-title">
                  Date & Time
                </TableHead>
                <TableHead className="text-sm sm:text-base font-poppins text-text-title">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((transaction) => (
                <TableRow key={transaction.id} className="py-4 sm:py-6">
                  <TableCell className="p-2 sm:p-4">
                    <input
                      type="checkbox"
                      className="w-5 h-5 sm:w-6 sm:h-6 mt-1 cursor-pointer"
                      checked={selectedTransactions.includes(transaction.id)}
                      onChange={() => handleSelectTransaction(transaction.id)}
                    />
                  </TableCell>
                  <TableCell className="text-text-body font-poppins text-sm sm:text-base py-4 sm:py-6">
                    {(transaction as any).username || "-"}
                  </TableCell>
                  <TableCell className="text-text-body font-poppins text-sm sm:text-base py-4 sm:py-6 flex items-center gap-2">
                    <span className="truncate max-w-[80px] sm:max-w-none">
                      {transaction.id}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(transaction.id)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </TableCell>
                  <TableCell className="text-text-body font-poppins text-sm sm:text-base py-4 sm:py-6">
                    {transaction.amount}
                  </TableCell>
                  <TableCell className="text-text-body font-poppins text-sm sm:text-base py-4 sm:py-6">
                    {transaction.type}
                  </TableCell>
                  <TableCell className="text-text-body font-poppins text-sm sm:text-base py-4 sm:py-6">
                    <span
                      className={`px-2 py-1 rounded-md w-full ${
                        transaction.status === "Successful"
                          ? "bg-green-100 text-green-800"
                          : transaction.status === "Failed"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-text-body font-poppins text-sm sm:text-base py-4 sm:py-6">
                    {transaction.date}
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

      <div className="flex flex-col sm:flex-row justify-between items-center mt-4 p-4 sm:p-8 gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-sm sm:text-base">Showing</span>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => {
              setItemsPerPage(Number(value));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-16 bg-background">
              <SelectValue placeholder={itemsPerPage.toString()} />
            </SelectTrigger>
            <SelectContent>
              {itemsPerPageOptions.map((option) => (
                <SelectItem key={option} value={String(option)}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm sm:text-base">Entries</span>
        </div>

        <Pagination className="justify-end w-full sm:w-auto">
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

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={handleFilterApply}
      />
    </div>
  );
};

export default RecipientDetails;
