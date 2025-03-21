import React from "react";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { icons } from "@/constants/icons";

const DashboardMetrics = () => {
  // Helper function to determine text color based on change value
  const getChangeColor = (change: number): string => {
    return change >= 0 ? "text-green-500" : "text-red-500";
  };

  // Helper function to determine which arrow to display
  const getChangeArrow = (change: number): React.ReactNode => {
    return change >= 0 ? (
      <ArrowUpIcon className="h-4 w-4 text-green-500" />
    ) : (
      <ArrowDownIcon className="h-4 w-4 text-red-500" />
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      {/* Total Users */}
      <div className="bg-white rounded-lg p-6 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm text-text-body font-normal font-poppins">
              Total Users
            </p>
            <h2 className="text-2xl font-semibold font-poppins mt-1">
              1,000,000
            </h2>
          </div>
          <div className="bg-background-alt p-2 rounded-full">
            <icons.customersIcon className=" text-text-body" />
          </div>
        </div>
        <div className="flex items-center text-sm">
          <div className="flex items-center mr-2">
            {getChangeArrow(8.2)}
            <span
              className={`ml-1 font-poppins font-normal text-base ${getChangeColor(8.2)}`}
            >
              8.2%
            </span>
          </div>
          <span className="text-text-body text-base font-poppins">
            Last Month
          </span>
        </div>
      </div>

      {/* Total Revenue */}
      <div className="bg-white rounded-lg p-6 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm text-text-body font-normal font-poppins">
              Total Revenue
            </p>
            <h2 className="text-2xl font-semibold font-poppins mt-1">
              ₦10,000,000
            </h2>
          </div>
          <div className="bg-background-alt p-2 rounded-full">
            <icons.customersIcon className=" text-text-body" />
          </div>
        </div>
        <div className="flex items-center text-sm">
          <div className="flex items-center mr-2">
            {getChangeArrow(9.5)}
            <span
              className={`ml-1 font-poppins font-normal text-base ${getChangeColor(9.5)}`}
            >
              9.5%
            </span>
          </div>
          <span className="text-text-body text-base font-poppins">
            Last Month
          </span>
        </div>
      </div>

      {/* KYC Metrics (Spans Two Rows) */}
      <div className="bg-white rounded-lg p-6 flex flex-col row-span-2">
        {/* Completed KYC Applications */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm text-text-body font-normal font-poppins">
              Completed KYC Applications
            </p>
            <h2 className="text-2xl font-semibold font-poppins mt-1">10,000</h2>
          </div>
          <div className="bg-background-alt p-2 rounded-full">
            <icons.kycIcon className=" text-text-body" />
          </div>
        </div>
        <div className="flex items-center text-sm mb-4">
          <div className="flex items-center mr-2">
            {getChangeArrow(6.2)}
            <span
              className={`ml-1 font-poppins font-normal text-base ${getChangeColor(6.2)}`}
            >
              6.2%
            </span>
          </div>
          <span className="text-text-body text-base font-poppins">
            Last Month
          </span>
        </div>

        {/* Divider */}
        <hr className="my-4 border-gray-200" />

        {/* Pending KYC Applications */}
        <div className="flex justify-between items-start mb-4 mt-3">
          <div>
            <p className="text-sm text-text-body font-normal font-poppins">
              Pending KYC Applications
            </p>
            <h2 className="text-2xl font-semibold font-poppins mt-1">5,000</h2>
          </div>
        </div>
        <div className="flex items-center text-sm">
          <div className="flex items-center mr-2">
            {getChangeArrow(-5.2)}
            <span
              className={`ml-1 font-poppins font-normal text-base ${getChangeColor(-5.2)}`}
            >
              5.2%
            </span>
          </div>
          <span className="text-text-body text-base font-poppins">
            Last Month
          </span>
        </div>
      </div>

      {/* Total Transaction Count */}
      <div className="bg-white rounded-lg p-6 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm text-text-body font-normal font-poppins">
              Total Transaction Count
            </p>
            <h2 className="text-2xl font-semibold font-poppins mt-1">10,000</h2>
          </div>
          <div className="bg-background-alt p-2 rounded-full">
            <icons.transact className=" text-text-body" />
          </div>
        </div>
        <div className="flex items-center text-sm">
          <div className="flex items-center mr-2">
            {getChangeArrow(6.2)}
            <span
              className={`ml-1 font-poppins font-normal text-base ${getChangeColor(6.2)}`}
            >
              6.2%
            </span>
          </div>
          <span className="text-text-body text-base font-poppins">
            Last Month
          </span>
        </div>
      </div>

      {/* Total Transaction Value */}
      <div className="bg-white rounded-lg p-6 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm text-text-body font-normal font-poppins">
              Total Transaction Value
            </p>
            <h2 className="text-2xl font-semibold font-poppins mt-1">
              ₦12,000,000
            </h2>
          </div>
          <div className="bg-background-alt p-2 rounded-full">
            <icons.transact className=" text-text-body" />
          </div>
        </div>
        <div className="flex items-center text-sm">
          <div className="flex items-center mr-2">
            {getChangeArrow(6.5)}
            <span
              className={`ml-1 font-poppins font-normal text-base ${getChangeColor(6.5)}`}
            >
              6.5%
            </span>
          </div>
          <span className="text-text-body text-base font-poppins">
            Last Month
          </span>
        </div>
      </div>
    </div>
  );
};

export default DashboardMetrics;
