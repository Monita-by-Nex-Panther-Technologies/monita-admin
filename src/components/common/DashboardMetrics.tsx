import React from "react";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { icons } from "@/constants/icons";

const DashboardMetrics = () => {
  const getChangeColor = (change: number): string => {
    return change >= 0 ? "text-green-500" : "text-red-500";
  };

  const getChangeArrow = (change: number): React.ReactNode => {
    return change >= 0 ? (
      <ArrowUpIcon className="h-2.5 w-2.5 xs:h-3 xs:w-3 sm:h-4 sm:w-4 text-green-500" />
    ) : (
      <ArrowDownIcon className="h-2.5 w-2.5 xs:h-3 xs:w-3 sm:h-4 sm:w-4 text-red-500" />
    );
  };

  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-2 xs:gap-3 sm:gap-4 w-full">
      {/* Total Users */}
      <div className="bg-white rounded-lg p-2.5 xs:p-3 sm:p-4 md:p-6 flex flex-col w-full shadow-sm">
        <div className="flex justify-between items-start mb-1.5 xs:mb-2 sm:mb-4">
          <div>
            <p className="text-2xs xs:text-xs sm:text-sm text-text-body font-normal font-poppins">
              Total Users
            </p>
            <h2 className="text-base xs:text-lg sm:text-xl md:text-2xl font-semibold font-poppins mt-0.5 xs:mt-1">
              1,000,000
            </h2>
          </div>
          <div className="bg-background-alt p-1 xs:p-1.5 sm:p-2 rounded-full">
            <icons.customersIcon className="text-text-body h-3 w-3 xs:h-4 xs:w-4 sm:h-5 sm:w-5" />
          </div>
        </div>
        <div className="flex items-center text-2xs xs:text-xs sm:text-sm">
          <div className="flex items-center mr-1.5 xs:mr-2">
            {getChangeArrow(8.2)}
            <span
              className={`ml-0.5 xs:ml-1 font-poppins font-normal text-2xs xs:text-sm sm:text-base ${getChangeColor(
                8.2
              )}`}
            >
              8.2%
            </span>
          </div>
          <span className="text-text-body text-2xs xs:text-sm sm:text-base font-poppins">
            Last Month
          </span>
        </div>
      </div>

      {/* Total Revenue */}
      <div className="bg-white rounded-lg p-2.5 xs:p-3 sm:p-4 md:p-6 flex flex-col w-full shadow-sm">
        <div className="flex justify-between items-start mb-1.5 xs:mb-2 sm:mb-4">
          <div>
            <p className="text-2xs xs:text-xs sm:text-sm text-text-body font-normal font-poppins">
              Total Revenue
            </p>
            <h2 className="text-base xs:text-lg sm:text-xl md:text-2xl font-semibold font-poppins mt-0.5 xs:mt-1">
              ₦10,000,000
            </h2>
          </div>
          <div className="bg-background-alt p-1 xs:p-1.5 sm:p-2 rounded-full">
            <icons.customersIcon className="text-text-body h-3 w-3 xs:h-4 xs:w-4 sm:h-5 sm:w-5" />
          </div>
        </div>
        <div className="flex items-center text-2xs xs:text-xs sm:text-sm">
          <div className="flex items-center mr-1.5 xs:mr-2">
            {getChangeArrow(9.5)}
            <span
              className={`ml-0.5 xs:ml-1 font-poppins font-normal text-2xs xs:text-sm sm:text-base ${getChangeColor(
                9.5
              )}`}
            >
              9.5%
            </span>
          </div>
          <span className="text-text-body text-2xs xs:text-sm sm:text-base font-poppins">
            Last Month
          </span>
        </div>
      </div>

      {/* KYC Metrics (Spans Two Rows) */}
      <div className="bg-white rounded-lg p-2.5 xs:p-3 sm:p-4 md:p-6 flex flex-col col-span-1 xs:col-span-2 lg:col-span-1 lg:row-span-2 w-full shadow-sm">
        {/* Completed KYC Applications */}
        <div className="flex justify-between items-start mb-1.5 xs:mb-2 sm:mb-4">
          <div>
            <p className="text-2xs xs:text-xs sm:text-sm text-text-body font-normal font-poppins">
              Completed KYC Applications
            </p>
            <h2 className="text-base xs:text-lg sm:text-xl md:text-2xl font-semibold font-poppins mt-0.5 xs:mt-1">
              10,000
            </h2>
          </div>
          <div className="bg-background-alt p-1 xs:p-1.5 sm:p-2 rounded-full">
            <icons.kycIcon className="text-text-body h-3 w-3 xs:h-4 xs:w-4 sm:h-5 sm:w-5" />
          </div>
        </div>
        <div className="flex items-center text-2xs xs:text-xs sm:text-sm mb-1.5 xs:mb-2 sm:mb-4">
          <div className="flex items-center mr-1.5 xs:mr-2">
            {getChangeArrow(6.2)}
            <span
              className={`ml-0.5 xs:ml-1 font-poppins font-normal text-2xs xs:text-sm sm:text-base ${getChangeColor(
                6.2
              )}`}
            >
              6.2%
            </span>
          </div>
          <span className="text-text-body text-2xs xs:text-sm sm:text-base font-poppins">
            Last Month
          </span>
        </div>

        {/* Divider */}
        <hr className="my-4 border-gray-200" />

        {/* Pending KYC Applications */}
        <div className="flex justify-between items-start mb-1.5 xs:mb-2 sm:mb-4 mt-3">
          <div>
            <p className="text-2xs xs:text-xs sm:text-sm text-text-body font-normal font-poppins">
              Pending KYC Applications
            </p>
            <h2 className="text-base xs:text-lg sm:text-xl md:text-2xl font-semibold font-poppins mt-0.5 xs:mt-1">
              5,000
            </h2>
          </div>
        </div>
        <div className="flex items-center text-2xs xs:text-xs sm:text-sm">
          <div className="flex items-center mr-1.5 xs:mr-2">
            {getChangeArrow(-5.2)}
            <span
              className={`ml-0.5 xs:ml-1 font-poppins font-normal text-2xs xs:text-sm sm:text-base ${getChangeColor(
                -5.2
              )}`}
            >
              5.2%
            </span>
          </div>
          <span className="text-text-body text-2xs xs:text-sm sm:text-base font-poppins">
            Last Month
          </span>
        </div>
      </div>

      {/* Total Transaction Count */}
      <div className="bg-white rounded-lg p-2.5 xs:p-3 sm:p-4 md:p-6 flex flex-col w-full shadow-sm">
        <div className="flex justify-between items-start mb-1.5 xs:mb-2 sm:mb-4">
          <div>
            <p className="text-2xs xs:text-xs sm:text-sm text-text-body font-normal font-poppins">
              Total Transaction Count
            </p>
            <h2 className="text-base xs:text-lg sm:text-xl md:text-2xl font-semibold font-poppins mt-0.5 xs:mt-1">
              10,000
            </h2>
          </div>
          <div className="bg-background-alt p-1 xs:p-1.5 sm:p-2 rounded-full">
            <icons.transact className="text-text-body h-3 w-3 xs:h-4 xs:w-4 sm:h-5 sm:w-5" />
          </div>
        </div>
        <div className="flex items-center text-2xs xs:text-xs sm:text-sm">
          <div className="flex items-center mr-1.5 xs:mr-2">
            {getChangeArrow(6.2)}
            <span
              className={`ml-0.5 xs:ml-1 font-poppins font-normal text-2xs xs:text-sm sm:text-base ${getChangeColor(
                6.2
              )}`}
            >
              6.2%
            </span>
          </div>
          <span className="text-text-body text-2xs xs:text-sm sm:text-base font-poppins">
            Last Month
          </span>
        </div>
      </div>

      {/* Total Transaction Value */}
      <div className="bg-white rounded-lg p-2.5 xs:p-3 sm:p-4 md:p-6 flex flex-col w-full shadow-sm">
        <div className="flex justify-between items-start mb-1.5 xs:mb-2 sm:mb-4">
          <div>
            <p className="text-2xs xs:text-xs sm:text-sm text-text-body font-normal font-poppins">
              Total Transaction Value
            </p>
            <h2 className="text-base xs:text-lg sm:text-xl md:text-2xl font-semibold font-poppins mt-0.5 xs:mt-1">
              ₦12,000,000
            </h2>
          </div>
          <div className="bg-background-alt p-1 xs:p-1.5 sm:p-2 rounded-full">
            <icons.transact className="text-text-body h-3 w-3 xs:h-4 xs:w-4 sm:h-5 sm:w-5" />
          </div>
        </div>
        <div className="flex items-center text-2xs xs:text-xs sm:text-sm">
          <div className="flex items-center mr-1.5 xs:mr-2">
            {getChangeArrow(6.5)}
            <span
              className={`ml-0.5 xs:ml-1 font-poppins font-normal text-2xs xs:text-sm sm:text-base ${getChangeColor(
                6.5
              )}`}
            >
              6.5%
            </span>
          </div>
          <span className="text-text-body text-2xs xs:text-sm sm:text-base font-poppins">
            Last Month
          </span>
        </div>
      </div>
    </div>
  );
};

export default DashboardMetrics;
