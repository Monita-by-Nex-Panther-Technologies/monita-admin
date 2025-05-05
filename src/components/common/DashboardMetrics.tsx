import React from "react";
import { ArrowUpIcon, ArrowDownIcon, Users, BanknoteArrowDown, IdCard, ShieldEllipsis, ArrowLeftRight, CreditCard } from "lucide-react";
import { icons } from "@/constants/icons";
import Image from "next/image";

const DashboardMetrics = () => {
  const getChangeColor = (change: number): string => {
    return change >= 0 ? "text-green-500" : "text-red-500";
  };

  const getChangeArrow = (change: number): React.ReactNode => {
    return change >= 0 ? (
      <ArrowUpIcon className="h-4 w-4 text-green-500" />
    ) : (
      <ArrowDownIcon className="h-4 w-4 text-red-500" />
    );
  };

  const IconWrapper = ({ icon }: { icon:any }) => (
    <div className="bg-primary p-2 rounded-full">
     {icon}
    </div>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {/* Total Users */}
      <div className="bg-white rounded-lg p-6 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-xs text-text-body font-normal font-poppins">
             Customers
            </p>
            <h2 className="text-lg font-semibold font-poppins mt-1">1,000,000</h2>
          </div>
          <IconWrapper icon={<Users className="w-4 h-4 md:w-6 md:h-6" />} />
        </div>
        <div className="flex items-center text-xs">
          <div className="flex items-center mr-2">
            {getChangeArrow(8.2)}
            <span className={`ml-1 font-poppins font-normal text-md ${getChangeColor(8.2)}`}>
              8.2%
            </span>
          </div>
          <span className="text-text-body text-md font-poppins">Last Month</span>
        </div>
      </div>

      {/* Total Revenue */}
      <div className="bg-white rounded-lg p-6 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-xs text-text-body font-normal font-poppins">
               Revenue
            </p>
            <h2 className="text-lg font-semibold font-poppins mt-1">₦10,000,000</h2>
          </div>


          <IconWrapper icon={<BanknoteArrowDown className="w-4 h-4 md:w-6 md:h-6" />} />
        </div>
        <div className="flex items-center text-xs">
          <div className="flex items-center mr-2">
            {getChangeArrow(9.5)}
            <span className={`ml-1 font-poppins font-normal text-md ${getChangeColor(9.5)}`}>
              9.5%
            </span>
          </div>
          <span className="text-text-body text-md font-poppins">Last Month</span>
        </div>
      </div>



      {/* KYC Metrics */}
      <div className="bg-white rounded-lg p-6 flex flex-col sm:col-span-2 lg:col-span-1 lg:row-span-2">
        {/* Completed KYC Applications */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-xs text-text-body font-normal font-poppins">
              Completed KYC 
            </p>
            <h2 className="text-lg font-semibold font-poppins mt-1">10,000</h2>
          </div>

          <IconWrapper icon={<ShieldEllipsis className="w-4 h-4 md:w-6 md:h-6" />} />
        </div>
        <div className="flex items-center text-xs mb-4">
          <div className="flex items-center mr-2">
            {getChangeArrow(6.2)}
            <span className={`ml-1 font-poppins font-normal text-md ${getChangeColor(6.2)}`}>
              6.2%
            </span>
          </div>
          <span className="text-text-body text-md font-poppins">Last Month</span>
        </div>

        <hr className="my-4 border-gray-200" />


        {/* Pending KYC Applications */}
        <div className="flex justify-between items-start mb-4 mt-3">
          <div>
            <p className="text-xs text-text-body font-normal font-poppins">
              Pending KYC 
            </p>
            <h2 className="text-xl font-semibold font-poppins mt-1">5,000</h2>
          </div>
      
          <IconWrapper icon={<IdCard className="w-4 h-4 md:w-6 md:h-6" />} />
        </div>
        <div className="flex items-center text-xs">
          <div className="flex items-center mr-2">
            {getChangeArrow(-5.2)}
            <span className={`ml-1 font-poppins font-normal text-md ${getChangeColor(-5.2)}`}>
              5.2%
            </span>
          </div>
          <span className="text-text-body text-md font-poppins">Last Month</span>
        </div>
      </div>

      {/* Total Transaction Count */}
      <div className="bg-white rounded-lg p-6 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-xs text-text-body font-normal font-poppins">
               Deposit
            </p>
            <h2 className="text-xl font-semibold font-poppins mt-1">10,000</h2>
          </div>


          <IconWrapper icon={<CreditCard className="w-4 h-4 md:w-6 md:h-6" />} />
        </div>
        <div className="flex items-center text-xs">
          <div className="flex items-center mr-2">
            {getChangeArrow(6.2)}
            <span className={`ml-1 font-poppins font-normal text-md ${getChangeColor(6.2)}`}>
              6.2%
            </span>
          </div>
          <span className="text-text-body text-md font-poppins">Last Month</span>
        </div>
      </div>

      {/* Total Transaction Value */}
      <div className="bg-white rounded-lg p-6 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-xs text-text-body font-normal font-poppins">
              Net Transaction
            </p>
            <h2 className="text-xl font-semibold font-poppins mt-1">₦12,000,000</h2>
          </div>
          <IconWrapper icon={<ArrowLeftRight className="w-4 h-4 md:w-6 md:h-6" />} />
        </div>
        <div className="flex items-center text-xs">
          <div className="flex items-center mr-2">
            {getChangeArrow(6.5)}
            <span className={`ml-1 font-poppins font-normal text-md ${getChangeColor(6.5)}`}>
              6.5%
            </span>
          </div>
          <span className="text-text-body text-md font-poppins">Last Month</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardMetrics;
