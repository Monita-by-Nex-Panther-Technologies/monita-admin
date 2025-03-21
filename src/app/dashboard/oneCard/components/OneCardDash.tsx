"use client";

import type React from "react";
import { useState } from "react";
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Search, MoreHorizontal, ListFilter, Calendar } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const cardUsageData = [
  { name: "Jan", value: 200000 },
  { name: "Feb", value: 270000 },
  { name: "Mar", value: 250000 },
  { name: "Apr", value: 350000 },
  { name: "May", value: 300000 },
  { name: "Jun", value: 310000 },
  { name: "Jul", value: 380000 },
  { name: "Aug", value: 350000 },
  { name: "Sep", value: 380000 },
  { name: "Oct", value: 400000 },
  { name: "Nov", value: 420000 },
  { name: "Dec", value: 380000 },
];

const spendingOverviewData = [
  { name: "Subscriptions: 40%", value: 40, color: "#2D3748" },
  { name: "Entertainment: 10%", value: 10, color: "#FFBB28" },
  { name: "Shopping: 20%", value: 20, color: "#0088FE" },
  { name: "Travel: 20%", value: 20, color: "#FF4560" },
  { name: "Food: 10%", value: 10, color: "#00C49F" },
];

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

export default function OneCardDashboard() {
  const [activeFilter, setActiveFilter] = useState("Today");
  const [selected, setSelected] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal states
  const [spendingLimitOpen, setSpendingLimitOpen] = useState(false);
  const [exchangeRateOpen, setExchangeRateOpen] = useState(false);
  const [cardFeesOpen, setCardFeesOpen] = useState(false);
  const [filterTransactionOpen, setFilterTransactionOpen] = useState(false);

  // Form states
  const [spendingLimit, setSpendingLimit] = useState("");
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
        : [...prev, id],
    );
  };

  const filteredUsers = userCardsData.filter((user) => {
    return searchTerm
      ? user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="grid gap-6">
        {/* Filter by Date */}
        <div className="w-full flex flex-row justify-between items-center bg-background p-4 rounded-[8px]">
          <h1 className="text-text-title text-xl font-semibold font-poppins">
            Filter by Date
          </h1>
          <div className="flex flex-row bg-background-alt gap-x-1.5 px-3 py-2 rounded-[8px]">
            <button
              className={`justify-center items-center ${activeFilter === "Today" ? "bg-primary-light border border-primary" : "bg-background"} text-text-body font-poppins px-4 py-3 w-[186px] rounded-[8px]`}
              onClick={() => setActiveFilter("Today")}
            >
              Today
            </button>
            <button
              className={`justify-center items-center ${activeFilter === "This Week" ? "bg-primary-light border border-primary" : "bg-background"} text-text-body font-poppins px-4 py-3 w-[186px] rounded-[8px]`}
              onClick={() => setActiveFilter("This Week")}
            >
              This Week
            </button>
            <button
              className={`justify-center items-center ${activeFilter === "This Year" ? "bg-primary-light border border-primary" : "bg-background"} text-text-body font-poppins px-4 py-3 w-[186px] rounded-[8px]`}
              onClick={() => setActiveFilter("This Year")}
            >
              This Year
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Usage Statistics - Takes 2/3 of the width */}
          <div className="bg-white p-4 rounded-lg shadow-sm lg:col-span-2">
            <div className="w-full flex flex-row justify-between items-center mb-4">
              <h1 className="text-text-title text-xl font-semibold font-poppins">
                Usage Statistics
              </h1>
              <button
                className="justify-center items-center bg-primary text-text-body font-poppins px-6 py-3 rounded-[8px]"
                onClick={() => setSpendingLimitOpen(true)}
              >
                Set Spending Limit
              </button>
            </div>
            <div className="mt-6">
              <div className="font-medium text-text-title mb-4 font-poppins">
                Card Usage Overtime
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={cardUsageData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <defs>
                      <linearGradient
                        id="verticalGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#CEEF0A"
                          stopOpacity="0.32"
                        />
                        <stop
                          offset="50%"
                          stopColor="#CEEF0A"
                          stopOpacity="0.04"
                        />
                        <stop
                          offset="50%"
                          stopColor="#CEEF0A"
                          stopOpacity="0.04"
                        />
                        <stop
                          offset="100%"
                          stopColor="#CEEF0A"
                          stopOpacity="0.04"
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#eee"
                    />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value) => `${value / 1000}k`}
                      domain={[100000, 500000]}
                      ticks={[100000, 200000, 300000, 400000, 500000]}
                    />
                    <Tooltip
                      formatter={(value) => `${value.toLocaleString()}`}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      fill="url(#verticalGradient)"
                      stroke="none"
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#CEEF0A"
                      strokeWidth={2}
                      dot={{ r: 4, fill: "#CEEF0A", strokeWidth: 0 }}
                      activeDot={{ r: 6, fill: "#CEEF0A", strokeWidth: 0 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Spending Overview - Takes 1/3 of the width */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="mb-2 font-medium text-text-title font-poppins">
              Spending Overview
            </div>
            <div className="h-64 flex justify-center items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={spendingOverviewData}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                  >
                    {spendingOverviewData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <text
                    x="32%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="font-poppins font-medium"
                  >
                    100%
                  </text>
                  <Legend
                    layout="vertical"
                    verticalAlign="middle"
                    align="right"
                    iconType="circle"
                    iconSize={8}
                    formatter={(value) => (
                      <span className="text-text-body font-poppins">
                        {value}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Manage User Cards */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="w-full flex flex-row justify-between items-center mb-6">
            <h1 className="text-text-title text-xl font-semibold font-poppins">
              Manage User Cards
            </h1>
            <div className="flex gap-4">
              <button
                className="justify-center items-center bg-background border border-primary text-text-body font-poppins px-6 py-3 rounded-[8px]"
                onClick={() => setExchangeRateOpen(true)}
              >
                Set Exchange Rate
              </button>
              <button
                className="justify-center items-center bg-primary text-text-body font-poppins px-6 py-3 rounded-[8px]"
                onClick={() => setCardFeesOpen(true)}
              >
                Set Card Fees
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center my-4 px-6">
            <div className="flex flex-row gap-5">
              <button
                className="border border-primary bg-background flex gap-3 justify-center items-center px-10 py-3 rounded-[8px]"
                onClick={() => setFilterTransactionOpen(true)}
              >
                <ListFilter size={16} />
                <span className="text-text-title font-poppins text-base">
                  Filter
                </span>
              </button>

              <div className="flex flex-row justify-center items-center">
                <input
                  type="text"
                  placeholder="Search"
                  className="bg-background-alt border-border rounded-l-[8px] p-4"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="bg-primary rounded-r-[8px] p-4 px-6">
                  <Search size={24} className="text-text-body" />
                </button>
              </div>
            </div>

            <button className="bg-[#010101CC] flex gap-3 justify-center items-center px-6 py-3 rounded-[12px] text-white">
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
              <span className="font-poppins text-base">Export</span>
            </button>
          </div>

          <div className="overflow-auto relative">
            <Table className="w-full rounded-2xl bg-background p-5">
              <TableHeader className="bg-primary-fade text-muted-foreground hover:bg-primary-fade ml-5">
                <TableRow>
                  <TableHead className="p-4">
                    <input
                      type="checkbox"
                      className="w-6 h-6 mt-1 border-[#01010129] cursor-pointer"
                      checked={
                        selected.length === filteredUsers.length &&
                        selected.length > 0
                      }
                      onChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="text-base font-poppins text-text-title">
                    Username
                  </TableHead>
                  <TableHead className="text-base font-poppins text-text-title">
                    Email Address
                  </TableHead>
                  <TableHead className="text-base font-poppins text-text-title">
                    Card Type
                  </TableHead>
                  <TableHead className="text-base font-poppins text-text-title">
                    Status
                  </TableHead>
                  <TableHead className="text-base font-poppins text-text-title">
                    Issued Date
                  </TableHead>
                  <TableHead className="text-base font-poppins text-text-title">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="py-6">
                    <TableCell className="p-4">
                      <input
                        type="checkbox"
                        className="w-6 h-6 mt-1 cursor-pointer"
                        checked={selected.includes(user.id)}
                        onChange={() => handleSelect(user.id)}
                      />
                    </TableCell>
                    <TableCell className="text-text-body font-poppins text-base py-6">
                      {user.username}
                    </TableCell>
                    <TableCell className="text-text-body font-poppins text-base py-6">
                      {user.email}
                    </TableCell>
                    <TableCell className="text-text-body font-poppins text-base py-6">
                      {user.cardType}
                    </TableCell>
                    <TableCell className="text-text-body font-poppins text-base py-6">
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
                    <TableCell className="text-text-body font-poppins text-base py-6">
                      {user.issuedDate}
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
        </div>
      </div>

      {/* Set Spending Limit Modal */}
      <Dialog open={spendingLimitOpen} onOpenChange={setSpendingLimitOpen}>
        <DialogContent className="sm:max-w-md p-0 gap-0">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="text-xl font-semibold">
              Set Spending Limit
            </DialogTitle>
          </DialogHeader>
          <div className="border-t border-gray-200 my-2"></div>
          <div className="p-6">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Enter Spending Limit
              </label>
              <input
                type="text"
                placeholder="Enter"
                className="w-full p-3 border border-gray-300 rounded-md"
                value={spendingLimit}
                onChange={(e) => setSpendingLimit(e.target.value)}
              />
            </div>
            <button
              className="w-full bg-primary-light border border-primary text-text-body font-medium py-3 rounded-md mt-4"
              onClick={() => setSpendingLimitOpen(false)}
            >
              Save Changes
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Set Exchange Rate Modal */}
      <Dialog open={exchangeRateOpen} onOpenChange={setExchangeRateOpen}>
        <DialogContent className="sm:max-w-md p-0 gap-0">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="text-xl font-semibold">
              Set Exchange Rate
            </DialogTitle>
          </DialogHeader>
          <div className="border-t border-gray-200 my-2"></div>
          <div className="p-6">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Provider Exchange Rate
              </label>
              <div className="w-full p-3 bg-gray-100 rounded-md">₦2.00</div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Set Exchange Rate
              </label>
              <input
                type="text"
                placeholder="Enter Rate"
                className="w-full p-3 border border-gray-300 rounded-md"
                value={exchangeRate}
                onChange={(e) => setExchangeRate(e.target.value)}
              />
            </div>
            <button
              className="w-full bg-primary-light border border-primary text-text-body font-medium py-3 rounded-md mt-4"
              onClick={() => setExchangeRateOpen(false)}
            >
              Save Changes
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Set Card Fees Modal */}
      <Dialog open={cardFeesOpen} onOpenChange={setCardFeesOpen}>
        <DialogContent className="sm:max-w-md p-0 gap-0">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="text-xl font-semibold">
              Set Card Fees
            </DialogTitle>
          </DialogHeader>
          <div className="border-t border-gray-200 my-2"></div>
          <div className="p-6">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Enter Transaction Fee
              </label>
              <input
                type="text"
                placeholder="Enter Fee"
                className="w-full p-3 border border-gray-300 rounded-md"
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
                className="w-full p-3 border border-gray-300 rounded-md"
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
                className="w-full p-3 border border-gray-300 rounded-md"
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
                className="w-full p-3 border border-gray-300 rounded-md"
                value={foreignTransactionFee}
                onChange={(e) => setForeignTransactionFee(e.target.value)}
              />
            </div>
            <button
              className="w-full bg-primary-light border border-primary text-text-body font-medium py-3 rounded-md mt-4"
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
        <DialogContent className="sm:max-w-md p-0 gap-0">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="text-xl font-semibold">
              Filter Transaction
            </DialogTitle>
          </DialogHeader>
          <div className="border-t border-gray-200 my-2"></div>
          <div className="p-6">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Username</label>
              <input
                type="text"
                placeholder="@Adebayo100"
                className="w-full p-3 border border-gray-300 rounded-md"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Select Status
              </label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-full p-3 border border-gray-300 rounded-md bg-white">
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
                className="w-full p-3 border border-gray-300 rounded-md"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Start Date
                </label>
                <div className="relative">
                  <Select value={startDate} onValueChange={setStartDate}>
                    <SelectTrigger className="w-full p-3 border border-gray-300 rounded-md bg-white">
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
                    <SelectTrigger className="w-full p-3 border border-gray-300 rounded-md bg-white">
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
              className="w-full bg-[#CCFF00] text-text-body font-medium py-3 rounded-md mt-4"
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
