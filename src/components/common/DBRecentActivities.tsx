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
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  return (
    <div className="w-full py-6 px-4">
      {/* Recent Activities Section */}
      <div className="w-full flex justify-between items-center bg-background p-4 rounded-[8px]">
        <h1 className="text-text-title text-xl font-semibold font-poppins">
          Recent Activities
        </h1>
        <div className="flex bg-background-alt gap-x-1.5 px-3 py-2 rounded-[8px]">
          <button className="bg-background text-text-body px-4 py-3 w-[186px] rounded-[8px] active:bg-primary-foreground">
            Transactions
          </button>
          <button className="bg-background text-text-body px-4 py-3 w-[186px] rounded-[8px]">
            KYC Updates
          </button>
          <button className="bg-background text-text-body px-4 py-3 w-[186px] rounded-[8px]">
            Recent Logins
          </button>
        </div>
      </div>

      {/* Filters and Search */}

      {/* Transactions Table */}
      <div className="w-full overflow-x-auto bg-background rounded-2xl my-6">
        <div className="flex justify-between items-center my-4 px-6">
          <div className="flex flex-row gap-5 ">
            <button className=" border border-primary bg-background flex gap-3 justify-center items-center px-10 py-3 rounded-[8px]">
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
              />
              <button className=" bg-primary rounded-r-[8px] p-4">
                <Search size={24} className="text-text-body" />
              </button>
            </div>
          </div>
          <button className="bg-[#010101CC] flex gap-3 justify-center items-center px-4 py-3 rounded-[12px]">
            <icons.exportIcon size={16} className="text-white" />
            <span className="  font-poppins text-base text-white">Export</span>
          </button>
        </div>
        <Table className="rounded-2xl bg-background">
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
              <TableHead className="text-base font-poppins text-text-title">
                Username
              </TableHead>
              <TableHead className="text-base font-poppins text-text-title">
                ID
              </TableHead>
              <TableHead className="text-base font-poppins text-text-title">
                Amount
              </TableHead>
              <TableHead className="text-base font-poppins text-text-title">
                Type
              </TableHead>
              <TableHead className="text-base font-poppins text-text-title">
                Status
              </TableHead>
              <TableHead className="text-base font-poppins text-text-title">
                Date
              </TableHead>
              <TableHead className="text-base font-poppins text-text-title">
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
                <TableCell className=" text-text-body font-poppins text-base">
                  {transaction.username}
                </TableCell>
                <TableCell className=" text-text-body font-poppins text-base">
                  {transaction.id}
                </TableCell>
                <TableCell className=" text-text-body font-poppins text-base">
                  {transaction.amount}
                </TableCell>
                <TableCell className=" text-text-body font-poppins text-base">
                  {transaction.type}
                </TableCell>
                <TableCell className=" text-text-body font-poppins text-base">
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
                <TableCell className=" text-text-body font-poppins text-base">
                  {transaction.date}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    className=" cursor-pointer border border-primary-300 rounded-sm hover:bg-transparent"
                  >
                    <MoreHorizontal size={14} className=" text-primary-300" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DBRecentActivities;
