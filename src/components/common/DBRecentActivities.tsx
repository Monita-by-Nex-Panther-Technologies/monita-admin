"use client";

import React, { useEffect, useState } from "react";
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
import Image from "next/image";
import { useTransactionStore } from "@/store/transactionStore";
import TransactionTableContent from "@/app/dashboard/transactions/components/TransactionTableContent";
import Empty from "../table/Empty";
import TableLoading from "../table/TableLoading";
import { toast } from "sonner";

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
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const {
          getTransactions,
          isLoading,
          transactions
          } = useTransactionStore()
  
          useEffect(() => {
              getTransactions({ page: 1, limit: 10 }); // Replace with appropriate values for TransactionQueryParams
            }, []);
                       

            const copyToClipboard = (text: string) => {
              navigator.clipboard.writeText(text);
              toast.success("Copied to clipboard: " + text);
          };
  return (
    <div className="w-full  px-4">
      {/* Recent Activities Section */}
      <div className="w-full flex flex-col lg:flex-row justify-between items-start lg:items-center bg-background p-4 rounded-[8px]">
        <h1 className="text-text-title text-sm font-semibold font-poppins mb-3 lg:mb-0">
          Recent 
        </h1>
        <div className="flex flex-col lg:flex-row w-full lg:w-auto overflow-x-auto bg-background-alt gap-y-2 lg:gap-x-1.5 px-3 py-2 rounded-[8px]">
          <button className="bg-primary  text-sm  md:text-md text-black px-4 py-3 w-full lg:w-[186px] min-w-[100px] rounded-[8px] active:bg-primary-foreground">
            Transactions
          </button>
          <button className="bg-background text-sm  md:text-md text-text-body px-4 py-3 w-full lg:w-[186px] min-w-[100px] rounded-[8px]">
            KYC Updates
          </button>
          <button className="bg-background text-sm  md:text-md text-text-body px-4 py-3 w-full lg:w-[186px] min-w-[100px] rounded-[8px]">
            Recent Logins
          </button>
        </div>
      </div>

      {/* Filters and Search */}

      {/* Transactions Table */}
      <div className="w-full overflow-x-auto bg-background rounded-2xl my-6">
      {
                isLoading ? <TableLoading
                    row={11}
                    col={20}
                /> :

                    transactions.length === 0 ? (
                        <Empty
                            title="No Transactions"
                            description="Once a transaction is made, it will appear here with all the details you need to track and manage it easily."
                        />
                    ) : (

                            <TransactionTableContent
                                transactions={transactions}
                                handleSelectAll={handleSelectAll}
                                copyToClipboard={copyToClipboard}
                            />

                       

                    )
            }
      </div>
    </div>
  );
};

export default DBRecentActivities;
