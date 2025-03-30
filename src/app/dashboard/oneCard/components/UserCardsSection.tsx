"use client";

import { useState } from "react";
import { Search, MoreHorizontal, ListFilter } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const userCardsData = [
  {
    id: 1,
    username: "Ade John",
    email: "Adejohn@gmail.com",
    cardType: "USD Card",
    status: "Active",
    issuedDate: "Jan 02, 2024 4:30pm",
  },
  {
    id: 2,
    username: "Max Jose",
    email: "Maxjose@gmail.com",
    cardType: "USD Card",
    status: "Active",
    issuedDate: "Jan 03, 2024 4:30pm",
  },
  {
    id: 3,
    username: "Ini James",
    email: "Inijames@gmail.com",
    cardType: "USD Card",
    status: "Active",
    issuedDate: "Jan 04, 2024 4:30pm",
  },
  {
    id: 4,
    username: "Ayo Steves",
    email: "Ayosteve@gmail.com",
    cardType: "USD Card",
    status: "Active",
    issuedDate: "Jan 05, 2024 4:30pm",
  },
];

export default function UserCardsSection({
  onSetExchangeRate,
  onSetCardFees,
  onFilter,
}: {
  onSetExchangeRate: () => void;
  onSetCardFees: () => void;
  onFilter: () => void;
}) {
  const [selected, setSelected] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allIds = userCardsData.map((user) => user.id);
      setSelected(allIds);
    } else {
      setSelected([]);
    }
  };

  const handleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((selectedId) => selectedId !== id)
        : [...prev, id]
    );
  };

  const filteredUsers = userCardsData.filter((user) => {
    return searchTerm
      ? user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
  });

  return (
    <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm">
      <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
        <h1 className="text-text-title text-lg sm:text-xl font-semibold font-poppins">
          Manage User Cards
        </h1>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
          <Button
            variant="outline"
            className="justify-center items-center bg-background border border-primary text-text-body font-poppins px-4 sm:px-6 py-2 sm:py-3 rounded-[8px] text-sm sm:text-base"
            onClick={onSetExchangeRate}
          >
            Set Exchange Rate
          </Button>
          <Button
            className="justify-center items-center bg-primary text-text-body font-poppins px-4 sm:px-6 py-2 sm:py-3 rounded-[8px] text-sm sm:text-base"
            onClick={onSetCardFees}
          >
            Set Card Fees
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center my-4 px-2 sm:px-6 gap-3 sm:gap-0">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 w-full sm:w-auto">
          <Button
            variant="outline"
            className="border border-primary bg-background flex gap-2 sm:gap-3 justify-center items-center px-4 sm:px-10 py-2 sm:py-3 rounded-[8px] w-full sm:w-auto"
            onClick={onFilter}
          >
            <ListFilter size={16} />
            <span className="text-text-title font-poppins text-sm sm:text-base">
              Filter
            </span>
          </Button>

          <div className="flex flex-row justify-center items-center w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search"
              className="bg-background-alt border-border rounded-l-[8px] p-2 sm:p-4 flex-grow"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="bg-primary rounded-r-[8px] p-2 sm:p-4 px-3 sm:px-6">
              <Search size={20} className="text-text-body" />
            </button>
          </div>
        </div>

        <Button className="bg-[#010101CC] flex gap-2 sm:gap-3 justify-center items-center px-4 sm:px-6 py-2 sm:py-3 rounded-[12px] text-white text-sm sm:text-base w-full sm:w-auto mt-3 sm:mt-0">
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
          <span className="font-poppins text-sm sm:text-base">Export</span>
        </Button>
      </div>

      <div className="overflow-x-auto relative">
        <Table className="w-full rounded-2xl bg-background p-2 sm:p-5 min-w-[650px]">
          <TableHeader className="bg-primary-fade text-muted-foreground hover:bg-primary-fade ml-2 sm:ml-5">
            <TableRow>
              <TableHead className="p-2 sm:p-4">
                <input
                  type="checkbox"
                  className="w-4 h-4 sm:w-6 sm:h-6 mt-1 border-[#01010129] cursor-pointer"
                  checked={
                    selected.length === filteredUsers.length &&
                    selected.length > 0
                  }
                  onChange={handleSelectAll}
                />
              </TableHead>
              <TableHead className="text-sm sm:text-base font-poppins text-text-title whitespace-nowrap">
                Username
              </TableHead>
              <TableHead className="text-sm sm:text-base font-poppins text-text-title whitespace-nowrap">
                Email Address
              </TableHead>
              <TableHead className="text-sm sm:text-base font-poppins text-text-title whitespace-nowrap">
                Card Type
              </TableHead>
              <TableHead className="text-sm sm:text-base font-poppins text-text-title whitespace-nowrap">
                Status
              </TableHead>
              <TableHead className="text-sm sm:text-base font-poppins text-text-title whitespace-nowrap">
                Issued Date
              </TableHead>
              <TableHead className="text-sm sm:text-base font-poppins text-text-title whitespace-nowrap">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id} className="py-4 sm:py-6">
                <TableCell className="p-2 sm:p-4">
                  <input
                    type="checkbox"
                    className="w-4 h-4 sm:w-6 sm:h-6 mt-1 cursor-pointer"
                    checked={selected.includes(user.id)}
                    onChange={() => handleSelect(user.id)}
                  />
                </TableCell>
                <TableCell className="text-text-body font-poppins text-sm sm:text-base py-4 sm:py-6 whitespace-nowrap">
                  {user.username}
                </TableCell>
                <TableCell className="text-text-body font-poppins text-sm sm:text-base py-4 sm:py-6 whitespace-nowrap">
                  {user.email}
                </TableCell>
                <TableCell className="text-text-body font-poppins text-sm sm:text-base py-4 sm:py-6 whitespace-nowrap">
                  {user.cardType}
                </TableCell>
                <TableCell className="text-text-body font-poppins text-sm sm:text-base py-4 sm:py-6 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 rounded-md w-full ${
                      user.status === "Active"
                        ? "status-success"
                        : "status-error"
                    }`}
                  >
                    {user.status}
                  </span>
                </TableCell>
                <TableCell className="text-text-body font-poppins text-sm sm:text-base py-4 sm:py-6 whitespace-nowrap">
                  {user.issuedDate}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <Button
                    variant="ghost"
                    className="cursor-pointer border border-primary-300 rounded-sm hover:bg-transparent p-1"
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
  );
}
