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

interface Transaction {
  username: string;
  id: string;
  amount: string;
  type: string;
  status: string;
  date: string;
}

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

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelected(transactions.map((_, index) => index));
    } else {
      setSelected([]);
    }
  };

  const handleSelect = (index: number) => {
    setSelected((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="w-full py-6 px-6 md:px-10 lg:px-16 xl:px-24 mb-6">
      {/* Recent Activities Section */}
      <div className="w-full flex flex-col lg:flex-row justify-between items-start lg:items-center bg-background p-4 lg:p-6 rounded-lg gap-4 lg:gap-0 mb-6">
        <h1 className="text-text-title text-xl lg:text-2xl font-semibold font-poppins">
          Recent Activities
        </h1>
        <div className="flex w-full lg:w-auto bg-background-alt gap-2 px-3 py-2 rounded-lg">
          <button
            className={`px-4 py-2 lg:px-6 lg:py-3 w-full lg:w-48 rounded-lg text-sm lg:text-base ${
              activeTab === "Transactions"
                ? "bg-primary-foreground text-text-title"
                : "bg-background text-text-body"
            }`}
            onClick={() => setActiveTab("Transactions")}
          >
            Transactions
          </button>
          <button
            className={`px-4 py-2 lg:px-6 lg:py-3 w-full lg:w-48 rounded-lg text-sm lg:text-base ${
              activeTab === "KYC Updates"
                ? "bg-primary-foreground text-text-title"
                : "bg-background text-text-body"
            }`}
            onClick={() => setActiveTab("KYC Updates")}
          >
            KYC Updates
          </button>
          <button
            className={`px-4 py-2 lg:px-6 lg:py-3 w-full lg:w-48 rounded-lg text-sm lg:text-base ${
              activeTab === "Recent Logins"
                ? "bg-primary-foreground text-text-title"
                : "bg-background text-text-body"
            }`}
            onClick={() => setActiveTab("Recent Logins")}
          >
            Recent Logins
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="w-full overflow-x-auto bg-background rounded-xl lg:rounded-2xl p-4 lg:p-6 mx-2 md:mx-4">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4 lg:gap-0">
          <div className="flex flex-col lg:flex-row gap-3 lg:gap-4 w-full lg:w-auto">
            <button className="border border-primary bg-background flex gap-2 justify-center items-center px-4 py-2 lg:px-6 lg:py-3 rounded-lg text-sm lg:text-base">
              <ListFilter size={16} />
              <span className="text-text-title font-poppins">Filter</span>
            </button>

            <div className="flex flex-row justify-center items-center w-full lg:w-auto">
              <input
                type="text"
                placeholder="Search"
                className="bg-background-alt border-border rounded-l-lg p-3 lg:p-4 w-full lg:w-64 text-sm lg:text-base"
              />
              <button className="bg-primary rounded-r-lg p-3 lg:p-4">
                <Search size={20} className="text-text-body" />
              </button>
            </div>
          </div>
          <button className="bg-[#010101CC] flex gap-2 justify-center items-center px-4 py-2 lg:px-6 lg:py-3 rounded-lg text-sm lg:text-base w-full lg:w-auto mt-2 lg:mt-0">
            <icons.exportIcon size={16} className="text-white" />
            <span className="font-poppins text-white">Export</span>
          </button>
        </div>

        {/* Responsive Table Container */}
        <div className="overflow-x-auto pb-2">
          <Table className="rounded-xl bg-background min-w-[800px] lg:min-w-full">
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
                <TableHead className="font-poppins text-text-title">
                  Username
                </TableHead>
                <TableHead className="font-poppins text-text-title">
                  ID
                </TableHead>
                <TableHead className="font-poppins text-text-title">
                  Amount
                </TableHead>
                <TableHead className="font-poppins text-text-title">
                  Type
                </TableHead>
                <TableHead className="font-poppins text-text-title">
                  Status
                </TableHead>
                <TableHead className="font-poppins text-text-title">
                  Date
                </TableHead>
                <TableHead className="font-poppins text-text-title">
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
                  <TableCell className="text-text-body font-poppins">
                    {transaction.username}
                  </TableCell>
                  <TableCell className="text-text-body font-poppins">
                    {transaction.id}
                  </TableCell>
                  <TableCell className="text-text-body font-poppins">
                    {transaction.amount}
                  </TableCell>
                  <TableCell className="text-text-body font-poppins">
                    {transaction.type}
                  </TableCell>
                  <TableCell className="text-text-body font-poppins">
                    <span
                      className={`px-2 py-1 rounded-md text-sm font-semibold ${
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
                  <TableCell className="text-text-body font-poppins">
                    {transaction.date}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      className="cursor-pointer border border-primary-300 rounded-sm hover:bg-transparent p-2"
                    >
                      <MoreHorizontal size={16} className="text-primary-300" />
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
