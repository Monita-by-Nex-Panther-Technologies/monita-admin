"use client";

import type React from "react";
import { useState } from "react";
import { Calendar } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import DateFilter from "./DateFilter";
import UsageStatistics from "./UsageStatistics";
import SpendingOverview from "./SpendingOverview";
import UserCardsSection from "./UserCardsSection";

export default function OneCardDashboard() {
  const [activeFilter, setActiveFilter] = useState("Today");
  const [selected, setSelected] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal states
  const [exchangeRateOpen, setExchangeRateOpen] = useState(false);
  const [cardFeesOpen, setCardFeesOpen] = useState(false);
  const [filterTransactionOpen, setFilterTransactionOpen] = useState(false);

  // Form states
  const [exchangeRate, setExchangeRate] = useState("");
  const [transactionFee, setTransactionFee] = useState("");
  const [maintenanceFee, setMaintenanceFee] = useState("");
  const [declineFee, setDeclineFee] = useState("");
  const [foreignTransactionFee, setForeignTransactionFee] = useState("");

  // Filter transaction states
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState("");
  const [amount, setAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Handler functions for UserCardsSection
  const handleOpenExchangeRate = () => setExchangeRateOpen(true);
  const handleOpenCardFees = () => setCardFeesOpen(true);
  const handleOpenFilter = () => setFilterTransactionOpen(true);

  return (
    <div className="p-3 sm:p-6 bg-gray-50 min-h-screen w-full overflow-x-hidden">
      <div className="grid gap-4 sm:gap-6 max-w-full">
        {/* Filter by Date */}
        <DateFilter
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Usage Statistics */}
          <div className="w-full overflow-x-hidden">
            <UsageStatistics />
          </div>

          {/* Spending Overview */}
          <div className="w-full overflow-x-hidden">
            <SpendingOverview />
          </div>
        </div>

        {/* Manage User Cards */}
        <div className="w-full overflow-x-hidden">
          <UserCardsSection
            onSetExchangeRate={handleOpenExchangeRate}
            onSetCardFees={handleOpenCardFees}
            onFilter={handleOpenFilter}
          />
        </div>
      </div>

      {/* Set Exchange Rate Modal */}
      <Dialog open={exchangeRateOpen} onOpenChange={setExchangeRateOpen}>
        <DialogContent className="p-0 gap-0 w-[95%] max-w-full sm:max-w-md mx-auto overflow-hidden">
          <DialogHeader className="p-4 sm:p-6 pb-2">
            <DialogTitle className="text-lg sm:text-xl font-semibold">
              Set Exchange Rate
            </DialogTitle>
          </DialogHeader>
          <div className="border-t border-gray-200 my-2"></div>
          <div className="p-4 sm:p-6">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Provider Exchange Rate
              </label>
              <div className="w-full p-2 sm:p-3 bg-gray-100 rounded-md">
                ₦2.00
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Set Exchange Rate
              </label>
              <input
                type="text"
                placeholder="Enter Rate"
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-md"
                value={exchangeRate}
                onChange={(e) => setExchangeRate(e.target.value)}
              />
            </div>
            <button
              className="w-full bg-primary-light border border-primary text-text-body font-medium py-2 sm:py-3 rounded-md mt-4 text-sm sm:text-base"
              onClick={() => setExchangeRateOpen(false)}
            >
              Save Changes
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Set Card Fees Modal */}
      <Dialog open={cardFeesOpen} onOpenChange={setCardFeesOpen}>
        <DialogContent className="p-0 gap-0 w-[95%] max-w-full sm:max-w-md mx-auto overflow-hidden">
          <DialogHeader className="p-4 sm:p-6 pb-2">
            <DialogTitle className="text-lg sm:text-xl font-semibold">
              Set Card Fees
            </DialogTitle>
          </DialogHeader>
          <div className="border-t border-gray-200 my-2"></div>
          <div className="p-4 sm:p-6">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Enter Transaction Fee
              </label>
              <input
                type="text"
                placeholder="Enter Fee"
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-md"
                value={transactionFee}
                onChange={(e) => setTransactionFee(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Monthly Maintenance Fee
              </label>
              <input
                type="text"
                placeholder="Enter Fee"
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-md"
                value={maintenanceFee}
                onChange={(e) => setMaintenanceFee(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Decline Fee
              </label>
              <input
                type="text"
                placeholder="Enter Fee"
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-md"
                value={declineFee}
                onChange={(e) => setDeclineFee(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Foreign Transaction Fee
              </label>
              <input
                type="text"
                placeholder="Enter Fee"
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-md"
                value={foreignTransactionFee}
                onChange={(e) => setForeignTransactionFee(e.target.value)}
              />
            </div>
            <button
              className="w-full bg-primary-light border border-primary text-text-body font-medium py-2 sm:py-3 rounded-md mt-4 text-sm sm:text-base"
              onClick={() => setCardFeesOpen(false)}
            >
              Save Changes
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Filter Transaction Modal */}
      <Dialog
        open={filterTransactionOpen}
        onOpenChange={setFilterTransactionOpen}
      >
        <DialogContent className="p-0 gap-0 w-[95%] max-w-full sm:max-w-md mx-auto overflow-hidden">
          <DialogHeader className="p-4 sm:p-6 pb-2">
            <DialogTitle className="text-lg sm:text-xl font-semibold">
              Filter Transaction
            </DialogTitle>
          </DialogHeader>
          <div className="border-t border-gray-200 my-2"></div>
          <div className="p-4 sm:p-6">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Username</label>
              <input
                type="text"
                placeholder="@Adebayo100"
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-md"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Select Status
              </label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-full p-2 sm:p-3 border border-gray-300 rounded-md bg-white text-sm sm:text-base">
                  <span>{status || "Select"}</span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">
                    <div className="flex justify-between items-center w-full">
                      <span>Active</span>
                      <span>›</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="Blocked">
                    <div className="flex justify-between items-center w-full">
                      <span>Blocked</span>
                      <span>›</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="Stolen">
                    <div className="flex justify-between items-center w-full">
                      <span>Stolen</span>
                      <span>›</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="Lost">
                    <div className="flex justify-between items-center w-full">
                      <span>Lost</span>
                      <span>›</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Amount</label>
              <input
                type="text"
                placeholder="Enter amount"
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-md"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Start Date
                </label>
                <div className="relative">
                  <Select value={startDate} onValueChange={setStartDate}>
                    <SelectTrigger className="w-full p-2 sm:p-3 border border-gray-300 rounded-md bg-white text-sm sm:text-base">
                      <span>{startDate || "Select"}</span>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024-01-01">Jan 1, 2024</SelectItem>
                      <SelectItem value="2024-01-15">Jan 15, 2024</SelectItem>
                      <SelectItem value="2024-02-01">Feb 1, 2024</SelectItem>
                    </SelectContent>
                  </Select>
                  <Calendar
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  End Date
                </label>
                <div className="relative">
                  <Select value={endDate} onValueChange={setEndDate}>
                    <SelectTrigger className="w-full p-2 sm:p-3 border border-gray-300 rounded-md bg-white text-sm sm:text-base">
                      <span>{endDate || "Select"}</span>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024-01-31">Jan 31, 2024</SelectItem>
                      <SelectItem value="2024-02-15">Feb 15, 2024</SelectItem>
                      <SelectItem value="2024-02-29">Feb 29, 2024</SelectItem>
                    </SelectContent>
                  </Select>
                  <Calendar
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                </div>
              </div>
            </div>

            <button
              className="w-full bg-[#CCFF00] text-text-body font-medium py-2 sm:py-3 rounded-md mt-4 text-sm sm:text-base"
              onClick={() => setFilterTransactionOpen(false)}
            >
              Filter Cards
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
