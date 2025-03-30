"use client";

import React, { useState } from "react";
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
import { icons } from "@/constants/icons";

// Define transaction type
interface Transaction {
  username: string;
  id: string;
  amount: string;
  type: string;
  status: string;
  date: string;
}

// Transaction data
const transactions: Transaction[] = [
  {
    username: "Adebayo10",
    id: "102911120111",
    amount: "₦10,000",
    type: "Airtime",
    status: "Successful",
    date: "Jan 02, 2024 4:30pm",
  },
  {
    username: "Inijohn1000",
    id: "102911120111",
    amount: "₦10,000",
    type: "Airtime",
    status: "Failed",
    date: "Jan 02, 2024 4:30pm",
  },
  {
    username: "Adebayo10",
    id: "102911120111",
    amount: "₦10,000",
    type: "Airtime",
    status: "Successful",
    date: "Jan 02, 2024 4:30pm",
  },
  {
    username: "Adebayo10",
    id: "102911120311",
    amount: "₦10,000",
    type: "Airtime",
    status: "Pending",
    date: "Jan 02, 2024 4:30pm",
  },
  {
    username: "Adebayo10",
    id: "102916120111",
    amount: "₦10,000",
    type: "Airtime",
    status: "Successful",
    date: "Jan 02, 2024 4:30pm",
  },
];

const DBRecentActivities: React.FC = () => {
  const [selected, setSelected] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<string>("Transactions");

  // Handle Select All
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelected(transactions.map((_, index) => index));
    } else {
      setSelected([]);
    }
  };

  // Handle Single Checkbox Toggle
  const handleSelect = (index: number) => {
    setSelected((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="w-full py-3 sm:py-6 px-2 sm:px-4">
      {/* Recent Activities Section */}
      <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center bg-background p-3 sm:p-4 rounded-[8px] gap-3 sm:gap-0">
        <h1 className="text-text-title text-lg sm:text-xl font-semibold font-poppins">
          Recent Activities
        </h1>
        <div className="flex w-full sm:w-auto flex-wrap bg-background-alt gap-1 sm:gap-x-1.5 px-2 py-1 sm:px-3 sm:py-2 rounded-[8px]">
          <button
            className={`bg-background text-text-body px-2 sm:px-4 py-2 sm:py-3 flex-1 sm:w-[186px] rounded-[8px] text-xs sm:text-sm ${
              activeTab === "Transactions" ? "bg-primary-foreground" : ""
            }`}
            onClick={() => setActiveTab("Transactions")}
          >
            Transactions
          </button>
          <button
            className={`bg-background text-text-body px-2 sm:px-4 py-2 sm:py-3 flex-1 sm:w-[186px] rounded-[8px] text-xs sm:text-sm ${
              activeTab === "KYC Updates" ? "bg-primary-foreground" : ""
            }`}
            onClick={() => setActiveTab("KYC Updates")}
          >
            KYC Updates
          </button>
          <button
            className={`bg-background text-text-body px-2 sm:px-4 py-2 sm:py-3 flex-1 sm:w-[186px] rounded-[8px] text-xs sm:text-sm ${
              activeTab === "Recent Logins" ? "bg-primary-foreground" : ""
            }`}
            onClick={() => setActiveTab("Recent Logins")}
          >
            Recent Logins
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="w-full overflow-x-auto bg-background rounded-2xl my-3 sm:my-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center my-2 sm:my-4 px-3 sm:px-6 gap-3 sm:gap-0">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-5 w-full sm:w-auto">
            <button className="border border-primary bg-background flex gap-2 sm:gap-3 justify-center items-center px-4 sm:px-10 py-2 sm:py-3 rounded-[8px] text-sm sm:text-base">
              <ListFilter size={14} className="sm:size-16" />
              <span className="text-text-title font-poppins text-sm sm:text-base">
                Filter
              </span>
            </button>

            <div className="flex flex-row justify-center items-center w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search"
                className="bg-background-alt border-border rounded-l-[8px] p-2 sm:p-4 w-full sm:w-auto text-sm"
              />
              <button className="bg-primary rounded-r-[8px] p-2 sm:p-4">
                <Search size={20} className="sm:size-24 text-text-body" />
              </button>
            </div>
          </div>
          <button className="bg-[#010101CC] flex gap-2 sm:gap-3 justify-center items-center px-3 sm:px-4 py-2 sm:py-3 rounded-[12px] text-sm sm:text-base w-full sm:w-auto">
            <icons.exportIcon size={14} className="sm:size-16 text-white" />
            <span className="font-poppins text-white">Export</span>
          </button>
        </div>

        {/* Responsive Table Container */}
        <div className="overflow-x-auto pb-2">
          <Table className="rounded-2xl bg-background min-w-[800px]">
            <TableHeader>
              <TableRow className="bg-primary-fade text-muted-foreground hover:bg-primary-fade">
                <TableHead>
                  <input
                    type="checkbox"
                    className="w-4 h-4 cursor-pointer"
                    checked={selected.length === transactions.length}
                    onChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead className="text-sm sm:text-base font-poppins text-text-title">
                  Username
                </TableHead>
                <TableHead className="text-sm sm:text-base font-poppins text-text-title">
                  ID
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
                  Date
                </TableHead>
                <TableHead className="text-sm sm:text-base font-poppins text-text-title">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction, index) => (
                <TableRow
                  key={index}
                  className="bg-transparent hover:bg-transparent"
                >
                  <TableCell>
                    <input
                      type="checkbox"
                      className="w-4 h-4 cursor-pointer"
                      checked={selected.includes(index)}
                      onChange={() => handleSelect(index)}
                    />
                  </TableCell>
                  <TableCell className="text-text-body font-poppins text-xs sm:text-base">
                    {transaction.username}
                  </TableCell>
                  <TableCell className="text-text-body font-poppins text-xs sm:text-base">
                    {transaction.id}
                  </TableCell>
                  <TableCell className="text-text-body font-poppins text-xs sm:text-base">
                    {transaction.amount}
                  </TableCell>
                  <TableCell className="text-text-body font-poppins text-xs sm:text-base">
                    {transaction.type}
                  </TableCell>
                  <TableCell className="text-text-body font-poppins text-xs sm:text-base">
                    <span
                      className={`px-1 sm:px-2 py-0.5 sm:py-1 rounded-md text-xs sm:text-sm font-semibold ${
                        transaction.status === "Successful"
                          ? "status-success"
                          : transaction.status === "Failed"
                          ? "status-error"
                          : "status-pending"
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-text-body font-poppins text-xs sm:text-base">
                    {transaction.date}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      className="cursor-pointer border border-primary-300 rounded-sm hover:bg-transparent p-1 sm:p-2"
                    >
                      <MoreHorizontal
                        size={12}
                        className="sm:size-14 text-primary-300"
                      />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default DBRecentActivities;
