"use client";

import { Database, Globe, Tv } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface ProductNavItemProps {
  icon: React.ReactNode;
  label: string;
  route: string;
  isActive: boolean;
}

const ProductNavItem: React.FC<ProductNavItemProps> = ({
  icon,
  label,
  route,
  isActive,
}) => {
  return (
    <Link href={route} className="block">
      <div
        className={`
      p-4 rounded-lg cursor-pointer w-[1/3] transition-all duration-200 flex flex-row items-center justify-start gap-2
      ${isActive ? "bg-white border-2 border-primary" : "bg-white border border-gray-100 hover:border-gray-200 hover:shadow-sm"}
    `}
      >
        <div
          className={`w-10 h-10 rounded-full flex justify-center items-center ${isActive ? "bg-white" : "bg-background-alt"}`}
        >
          <div className="text-gray-700">{icon}</div>
        </div>
        <span className="text-[16px] font-poppins font-normal text-gray-700">
          {label}
        </span>
      </div>
    </Link>
  );
};

const PlanHeadder = () => {
  const pathname = usePathname();
  const basePath = "/dashboard/bill-payments/plan";

  const categories = [
    {
      id: "data",
      label: "Data Plan",
      icon: <Database size={20} />,
      route: `${basePath}/data-plan`,
    },
    {
      id: "internet",
      label: "Internet",
      icon: <Globe size={20} />,
      route: `${basePath}/internet`,
    },
    {
      id: "cable",
      label: "Cable TV",
      icon: <Tv size={20} />,
      route: `${basePath}/cable`,
    },
  ];

  return (
    <div className="w-full flex flex-row justify-between items-center bg-background p-4 rounded-[8px] mt-4">
      <h1 className="text-text-title text-xl font-semibold font-poppins">
        Plan
      </h1>
      <div className="grid grid-cols-3 bg-background-alt w-[70%] gap-x-1.5 px-3 py-2 justify-center items-center rounded-[8px]">
        {categories.map((category) => (
          <ProductNavItem
            key={category.id}
            icon={category.icon}
            label={category.label}
            route={category.route}
            isActive={
              pathname === category.route ||
              pathname.startsWith(`${category.route}/`)
            }
          />
        ))}
      </div>
    </div>
  );
};

export default PlanHeadder;
