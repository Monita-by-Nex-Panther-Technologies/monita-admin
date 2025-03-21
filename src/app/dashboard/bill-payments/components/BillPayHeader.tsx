"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const BillPayHeader = () => {
  const pathname = usePathname();

  // Check if path starts with the specified base path
  const isPathActive = (basePath: string) => {
    return pathname.startsWith(basePath);
  };

  return (
    <div className="w-full flex flex-row justify-between items-center bg-background p-4 rounded-[8px]">
      <h1 className="text-text-title text-xl font-semibold font-poppins">
        Service Management
      </h1>
      <div className="flex flex-row bg-background-alt gap-x-1.5 px-3 py-2 rounded-[8px]">
        <Link
          href="/dashboard/bill-payments/service-type"
          className={`cursor-pointer justify-center items-center bg-background text-text-body font-poppins px-4 py-3 w-[186px] rounded-[8px] ${
            isPathActive("/dashboard/bill-payments/service-type")
              ? "bg-primary-alpha-8 border-2 border-primary text-text-title"
              : ""
          }`}
        >
          Service Type
        </Link>
        <Link
          href="/dashboard/bill-payments/products/airtime"
          className={`cursor-pointer justify-center items-center bg-background text-text-body font-poppins px-4 py-3 w-[186px] rounded-[8px] ${
            isPathActive("/dashboard/bill-payments/products")
              ? "bg-primary-alpha-8 border-2 border-primary text-text-title"
              : ""
          }`}
        >
          Product
        </Link>
        <Link
          href="/dashboard/bill-payments/plan/data-plan"
          className={`cursor-pointer justify-center items-center bg-background text-text-body font-poppins px-4 py-3 w-[186px] rounded-[8px] ${
            isPathActive("/dashboard/bill-payments/plan")
              ? "bg-primary-alpha-8 border-2 border-primary text-text-title"
              : ""
          }`}
        >
          Plan
        </Link>
      </div>
    </div>
  );
};

export default BillPayHeader;
