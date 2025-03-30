"use client";

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
} from "recharts";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

export default function UsageStatistics() {
  const [spendingLimitOpen, setSpendingLimitOpen] = useState(false);
  const [spendingLimit, setSpendingLimit] = useState("");

  return (
    <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm lg:col-span-2">
      <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3 sm:gap-0">
        <h1 className="text-text-title text-lg sm:text-xl font-semibold font-poppins">
          Usage Statistics
        </h1>
        <button
          className="justify-center items-center bg-primary text-text-body font-poppins px-4 sm:px-6 py-2 sm:py-3 rounded-[8px] text-sm sm:text-base w-full sm:w-auto"
          onClick={() => setSpendingLimitOpen(true)}
        >
          Set Spending Limit
        </button>
      </div>
      <div className="mt-4 sm:mt-6">
        <div className="font-medium text-text-title mb-2 sm:mb-4 font-poppins text-sm sm:text-base">
          Card Usage Overtime
        </div>
        <div className="h-48 sm:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={cardUsageData}
              margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
            >
              <defs>
                <linearGradient
                  id="verticalGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#CEEF0A" stopOpacity="0.32" />
                  <stop offset="50%" stopColor="#CEEF0A" stopOpacity="0.04" />
                  <stop offset="50%" stopColor="#CEEF0A" stopOpacity="0.04" />
                  <stop offset="100%" stopColor="#CEEF0A" stopOpacity="0.04" />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#eee"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: window.innerWidth < 640 ? 10 : 12 }}
                interval={"preserveStartEnd"}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `${value / 1000}k`}
                domain={[100000, 500000]}
                ticks={[100000, 200000, 300000, 400000, 500000]}
                tick={{ fontSize: window.innerWidth < 640 ? 10 : 12 }}
                width={30}
              />
              <Tooltip formatter={(value) => `${value.toLocaleString()}`} />
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
                dot={{
                  r: window.innerWidth < 640 ? 2 : 4,
                  fill: "#CEEF0A",
                  strokeWidth: 0,
                }}
                activeDot={{
                  r: window.innerWidth < 640 ? 4 : 6,
                  fill: "#CEEF0A",
                  strokeWidth: 0,
                }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Set Spending Limit Modal */}
      <Dialog open={spendingLimitOpen} onOpenChange={setSpendingLimitOpen}>
        <DialogContent className="sm:max-w-md p-0 gap-0 w-[95%] max-w-md mx-auto">
          <DialogHeader className="p-4 sm:p-6 pb-2">
            <DialogTitle className="text-lg sm:text-xl font-semibold">
              Set Spending Limit
            </DialogTitle>
          </DialogHeader>
          <div className="border-t border-gray-200 my-2"></div>
          <div className="p-4 sm:p-6">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Enter Spending Limit
              </label>
              <input
                type="text"
                placeholder="Enter"
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-md text-sm sm:text-base"
                value={spendingLimit}
                onChange={(e) => setSpendingLimit(e.target.value)}
              />
            </div>
            <button
              className="w-full bg-primary-light border border-primary text-text-body font-medium py-2 sm:py-3 rounded-md mt-4 text-sm sm:text-base"
              onClick={() => setSpendingLimitOpen(false)}
            >
              Save Changes
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
