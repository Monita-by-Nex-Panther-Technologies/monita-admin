"use client";
import { useTransactionStore } from "@/store/transactionStore";
import { combineArrayToObject } from "@/utilities/utils";
import { set } from "lodash";
import React, { useEffect, useState } from "react";
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  ComposedChart,
} from "recharts";

const DBAnalyticsSection = () => {

  const {
        isLoading,
        graphData,
        getTransactionGraph,
        } = useTransactionStore()

        const [transactionData, setTransactionData] = useState<{ name: string; value: number }[]>([]);

        const [type, setType] = useState("credit");

        useEffect(() => {
            getTransactionGraph({ queryType: "yearly" }); 
          }, []);

          useEffect(() => {

            if(graphData){

              setTransactionData(combineArrayToObject(graphData?.period , type === "credit" ? graphData?.creditValues : graphData?.debitValues))

            }
          }, [graphData,type]);

  return (
    <div className="w-full  px-4">
 

      {/* Analytics & Trends Section */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 py-6">
        {/* Transaction Trends Chart */}
        <div className="flex flex-col w-full lg:col-span-2 gap-4">
          <div className="w-full bg-background rounded-[8px] p-4">
            <div className="w-full flex flex-col sm:flex-row justify-between gap-2 items-start md:items-center">
              <h1 className="text-text-title text-sm font-semibold font-poppins mb-3 sm:mb-0">
                Analytics 
              </h1>
              <div className="flex flex-row w-full sm:w-auto overflow-x-auto bg-background-alt gap-x-1.5 px-3 py-2 rounded-[8px]">
                <button 
                
                className={`justify-center cursor-pointer items-center text-sm  md:text-md bg-background text-text-body font-poppins px-4 py-3 w-full sm:w-[200px] min-w-[120px] rounded-[8px] active:bg-primary-foreground ${type === "credit" && "bg-primary text-black"}` }
onClick={()=>setType("credit")}
                >
                   Credit
                </button>
                <button className={`justify-center cursor-pointer items-center text-sm  md:text-md bg-background text-text-body font-poppins px-4 py-3 w-full sm:w-[200px] min-w-[120px] rounded-[8px] ${type === "debit" && "bg-primary text-black"}` }
                
                onClick={()=>setType("debit")}
                
                >
                  Debit 
                </button>
              </div>
            </div>
          </div>
          <div className="w-full bg-background rounded-[8px] p-4">
      <div className="h-[300px] w-full">
        {isLoading ? (
          <div className="w-full h-full rounded-md bg-gray-200 animate-pulse" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={transactionData}>
              <defs>
                <linearGradient id="verticalGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#CEEF0A" stopOpacity={0.32} />
                  <stop offset="100%" stopColor="#FFFFFF" stopOpacity={0.04} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="name" />
              <YAxis
                tickFormatter={(value) => `${value / 1000}k`}
                domain={[0, 500000]}
                ticks={[0, 100000, 200000, 300000, 400000, 500000]}
              />
              <Tooltip />
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
                strokeWidth={3}
                dot={{ fill: "#CEEF0A", r: 5 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
        </div>

        {/* Users Growth Section */}
        <div className="w-full lg:row-span-2 bg-background rounded-[8px] px-4  h-auto sm:h-[445px] py-5 flex flex-col">
          <h1 className="text-text-title text-sm font-semibold font-poppins mb-4">
            Users Growth
          </h1>
          <div className="flex flex-col gap-4 justify-center  items-center  relative w-full ">
            {/* Circular Progress Bar */}
            <svg width="132" height="132" viewBox="0 0 200 200">
              {/* Background Circle */}
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="#e0e0e0" // Light gray background
                strokeWidth="20"
              />

              {/* Inactive Users (Dark Gray) */}
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="#010101CC" // Inactive users color
                strokeWidth="20"
                strokeDasharray="565.48" // Circumference of the circle (2 * π * r)
                strokeDashoffset="0" // No offset
                transform="rotate(-90 100 100)"
              />

              {/* Returning Users (Dark Green) */}
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="#728406" // Returning users color
                strokeWidth="20"
                strokeDasharray="565.48"
                strokeDashoffset="113.1" // 20% of the circle (500 / 2500 * 565.48)
                transform="rotate(-90 100 100)"
              />

              {/* Active Users (Green) */}
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="#CEEF0A" // Active users color
                strokeWidth="20"
                strokeDasharray="565.48"
                strokeDashoffset="339.29" // 60% of the circle (2000 / 2500 * 565.48)
                transform="rotate(-90 100 100)"
              />

              {/* Total Users Text */}
              <text
                x="50%"
                y="45%"
                textAnchor="middle"
                className="text-[18px] font-bold"
              >
                100,000
              </text>
              <text
                x="50%"
                y="55%"
                textAnchor="middle"
                className="text-[18px] text-text-body"
              >
                Total Users
              </text>
            </svg>

            <span className="border border-[#01010129] w-full"></span>

            {/* User Breakdown */}
            <div className="flex flex-col gap-4 w-full bg-background-alt py-4 rounded-[8px] justify-between px-2 ">
              <div className="text-center">
                <span className=" font-poppins text-text-body text-xs">
                  New Users
                </span>
                <div className="flex items-center justify-center">
                  <span className="w-3 h-3 bg-[#CEEF0A] rounded-full mr-2"></span>
                  <span className="font-bold font-poppins text-sm text-text-title">
                    7,000
                  </span>
                </div>
              </div>
              <div className="text-center">
                <span className="text-xs font-poppins text-text-body">
                  Returning
                </span>
                <div className="flex items-center justify-center">
                  <span className="w-3 h-3 bg-[#728406] rounded-full mr-2"></span>
                  <span className="font-bold font-poppins text-text-title text-sm">
                    2,000
                  </span>
                </div>
              </div>
              <div className="text-center">
                <span className="text-xs font-poppins text-text-body">
                  Inactive
                </span>
                <div className="flex items-center justify-center">
                  <span className="w-3 h-3 bg-[#010101CC] rounded-full mr-2"></span>
                  <span className="font-bold font-poppins text-text-title text-sm">
                    500
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DBAnalyticsSection;
