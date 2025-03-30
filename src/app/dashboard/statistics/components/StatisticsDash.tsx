"use client";

import { useState } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  ComposedChart,
  Area,
  Line,
} from "recharts";

const transactionVolumeData = [
  { name: "Jan", value: 300000 },
  { name: "Feb", value: 270000 },
  { name: "Mar", value: 350000 },
  { name: "Apr", value: 300000 },
  { name: "May", value: 380000 },
  { name: "Jun", value: 350000 },
  { name: "Jul", value: 300000 },
  { name: "Aug", value: 380000 },
  { name: "Sep", value: 350000 },
  { name: "Oct", value: 380000 },
  { name: "Nov", value: 400000 },
  { name: "Dec", value: 420000 },
];

const userGrowthData = [
  { name: "Jan", active: 350000, inactive: 300000 },
  { name: "Feb", active: 300000, inactive: 250000 },
  { name: "Mar", active: 250000, inactive: 220000 },
  { name: "Apr", active: 380000, inactive: 350000 },
  { name: "May", active: 350000, inactive: 300000 },
  { name: "Jun", active: 300000, inactive: 280000 },
  { name: "Jul", active: 380000, inactive: 300000 },
  { name: "Aug", active: 300000, inactive: 280000 },
  { name: "Sep", active: 350000, inactive: 300000 },
  { name: "Oct", active: 300000, inactive: 280000 },
  { name: "Nov", active: 350000, inactive: 300000 },
  { name: "Dec", active: 400000, inactive: 350000 },
];

const transactionTypesData = [
  { name: "Airtime", value: 20, color: "#FF5733" },
  { name: "Data", value: 15, color: "#0088FE" },
  { name: "Cable TV", value: 15, color: "#FF4560" },
  { name: "Electricity", value: 10, color: "#00C49F" },
  { name: "GiftCards", value: 10, color: "#FFBB28" },
  { name: "eSIMS", value: 10, color: "#AF19FF" },
  { name: "Education", value: 10, color: "#4ECDC4" },
  { name: "Internet", value: 10, color: "#7B68EE" },
];

const userDemographicsData = [
  { name: "Lagos: 40%", value: 40, color: "#2D3748" },
  { name: "Abuja: 20%", value: 20, color: "#0088FE" },
  { name: "Ibadan: 20%", value: 20, color: "#FF4560" },
  { name: "Benin: 10%", value: 10, color: "#00C49F" },
  { name: "Ekiti: 10%", value: 10, color: "#FFBB28" },
];

export default function StatisticsDash() {
  const [activeTab, setActiveTab] = useState("Transaction Volume");

  return (
    <div className="p-3 sm:p-6 bg-gray-50 min-h-screen">
      <div className="grid gap-4 sm:gap-6">
        {/* Filter by Date */}
        <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center bg-background p-3 sm:p-4 rounded-[8px]">
          <h1 className="text-text-title text-lg sm:text-xl font-semibold font-poppins mb-3 sm:mb-0">
            Filter by Date
          </h1>
          <div className="flex flex-col sm:flex-row w-full sm:w-auto bg-background-alt gap-2 sm:gap-x-1.5 px-2 sm:px-3 py-2 rounded-[8px]">
            <button className="justify-center items-center bg-primary-light border border-primary text-text-body font-poppins px-3 sm:px-4 py-2 sm:py-3 w-full sm:w-[186px] rounded-[8px] active:bg-primary-foreground">
              Today
            </button>
            <button className="justify-center items-center bg-background text-text-body font-poppins px-3 sm:px-4 py-2 sm:py-3 w-full sm:w-[186px] rounded-[8px]">
              This Week
            </button>
            <button className="justify-center items-center bg-background text-text-body font-poppins px-3 sm:px-4 py-2 sm:py-3 w-full sm:w-[186px] rounded-[8px]">
              This Year
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Volume & Trends - Takes 2/3 of the width */}
          <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm lg:col-span-2">
            <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 sm:mb-4">
              <h1 className="text-text-title text-lg sm:text-xl font-semibold font-poppins mb-3 sm:mb-0">
                Volume & Trends
              </h1>
              <div className="flex flex-col sm:flex-row w-full sm:w-auto bg-background-alt gap-2 sm:gap-x-1.5 px-2 sm:px-3 py-2 rounded-[8px]">
                <button
                  className={`justify-center items-center ${
                    activeTab === "Transaction Volume"
                      ? "bg-primary-light border border-primary"
                      : "bg-background"
                  } text-text-body font-poppins px-3 sm:px-4 py-2 rounded-[8px] text-sm sm:text-base`}
                  onClick={() => setActiveTab("Transaction Volume")}
                >
                  Transaction Volume
                </button>
                <button
                  className={`justify-center items-center ${
                    activeTab === "Transaction Trends"
                      ? "bg-primary-light border border-primary"
                      : "bg-background"
                  } text-text-body font-poppins px-3 sm:px-4 py-2 rounded-[8px] text-sm sm:text-base`}
                  onClick={() => setActiveTab("Transaction Trends")}
                >
                  Transaction Trends
                </button>
              </div>
            </div>
            <div className="mt-4 sm:mt-6">
              <div className="font-medium text-text-title mb-2 sm:mb-4 font-poppins">
                Transaction Volume
              </div>
              <div className="h-48 sm:h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={transactionVolumeData}
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
                        <stop
                          offset="0%"
                          stopColor="#FFDE00"
                          stopOpacity="0.32"
                        />
                        <stop
                          offset="50%"
                          stopColor="#FFFFFF"
                          stopOpacity="0.04"
                        />
                        <stop
                          offset="100%"
                          stopColor="#FFFFFF"
                          stopOpacity="0"
                        />
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
                      tick={{ fontSize: 10 }}
                      interval={"preserveStartEnd"}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value) => `${value / 1000}k`}
                      domain={[100000, 500000]}
                      ticks={[100000, 200000, 300000, 400000, 500000]}
                      tick={{ fontSize: 10 }}
                    />
                    <Tooltip
                      formatter={(value) => `${value.toLocaleString()}`}
                      contentStyle={{ fontSize: "12px" }}
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
                      stroke="#FFDE00"
                      strokeWidth={2}
                      dot={{ r: 3, fill: "#FFDE00", strokeWidth: 0 }}
                      activeDot={{ r: 5, fill: "#FFDE00", strokeWidth: 0 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Transaction Types - Takes 1/3 of the width */}
          <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm">
            <div className="mb-2 font-medium text-text-title font-poppins">
              Transaction Types
            </div>
            <div className="h-48 sm:h-64 flex justify-center items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <Pie
                    data={transactionTypesData}
                    cx="50%"
                    cy="50%"
                    innerRadius={25}
                    outerRadius={60}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {transactionTypesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend
                    layout="vertical"
                    verticalAlign="middle"
                    align="right"
                    iconType="circle"
                    iconSize={8}
                    formatter={(value) => (
                      <span className="text-text-body font-poppins text-xs sm:text-sm">
                        {value}
                      </span>
                    )}
                    wrapperStyle={{ fontSize: "10px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* User Growth - Takes 2/3 of the width */}
          <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm lg:col-span-2">
            <div className="mb-2 font-medium text-text-title font-poppins">
              User Growth
            </div>
            <div className="h-48 sm:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={userGrowthData}
                  margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                  barGap={0}
                  barCategoryGap={8}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f0f0f0"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10 }}
                    interval={"preserveStartEnd"}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => `${value / 1000}k`}
                    domain={[0, 500000]}
                    ticks={[0, 100000, 200000, 300000, 400000, 500000]}
                    tick={{ fontSize: 10 }}
                  />
                  <Tooltip
                    formatter={(value) => `${value.toLocaleString()}`}
                    contentStyle={{ fontSize: "12px" }}
                  />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    formatter={(value) => (
                      <span className="text-text-body font-poppins capitalize text-xs sm:text-sm">
                        {value}
                      </span>
                    )}
                    wrapperStyle={{ fontSize: "10px" }}
                  />
                  <Bar dataKey="active" fill="#5F8D4E" radius={[4, 4, 0, 0]} />
                  <Bar
                    dataKey="inactive"
                    fill="#A4BE7B"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* User Demographics - Takes 1/3 of the width */}
          <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm">
            <div className="mb-2 font-medium text-text-title font-poppins">
              User Demographics
            </div>
            <div className="h-48 sm:h-64 flex justify-center items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <Pie
                    data={userDemographicsData}
                    cx="50%"
                    cy="50%"
                    innerRadius={25}
                    outerRadius={60}
                    paddingAngle={2}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                  >
                    {userDemographicsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="font-poppins font-medium text-xs sm:text-base"
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
                      <span className="text-text-body font-poppins text-xs sm:text-sm">
                        {value}
                      </span>
                    )}
                    wrapperStyle={{ fontSize: "10px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
