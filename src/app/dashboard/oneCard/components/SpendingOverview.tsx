"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";

const spendingOverviewData = [
  { name: "Subscriptions: 40%", value: 40, color: "#2D3748" },
  { name: "Entertainment: 10%", value: 10, color: "#FFBB28" },
  { name: "Shopping: 20%", value: 20, color: "#0088FE" },
  { name: "Travel: 20%", value: 20, color: "#FF4560" },
  { name: "Food: 10%", value: 10, color: "#00C49F" },
];

export default function SpendingOverview() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm">
      <div className="mb-2 font-medium text-text-title font-poppins text-sm sm:text-base">
        Spending Overview
      </div>
      <div className="h-56 sm:h-64 flex justify-center items-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={spendingOverviewData}
              cx="50%"
              cy="50%"
              innerRadius={isMobile ? 20 : 30}
              outerRadius={isMobile ? 65 : 80}
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
              x={isMobile ? "30%" : "32%"}
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="font-poppins font-medium"
              style={{ fontSize: isMobile ? 12 : 14 }}
            >
              100%
            </text>
            <Legend
              layout="vertical"
              verticalAlign="middle"
              align="right"
              iconType="circle"
              iconSize={isMobile ? 6 : 8}
              formatter={(value) => (
                <span
                  className="text-text-body font-poppins"
                  style={{ fontSize: isMobile ? 10 : 12 }}
                >
                  {value}
                </span>
              )}
              wrapperStyle={isMobile ? { paddingLeft: 10 } : undefined}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
