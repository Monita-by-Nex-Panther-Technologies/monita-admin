"use client";

import { useState } from "react";
import { icons } from "@/constants/icons";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const SideBarSectionHeading = ({ title }: { title: string }) => {
  return (
    <h1 className="text-[#FFFFFFA3] text-base font-light leading-6 py-3 px-4">
      {title}
    </h1>
  );
};

interface SidebarNavItemProps {
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  label: string;
  href: string;
  onClick?: () => void;
}

export const SidebarNavItem: React.FC<SidebarNavItemProps> = ({
  icon: Icon,
  label,
  href,
  onClick,
}) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-colors w-full h-fit
                ${
                  isActive
                    ? "bg-[#CEEF0A1F] text-white"
                    : "text-sidebar-foreground hover:bg-[#CEEF0A1A]"
                }`}
    >
      <div className="flex items-center justify-center w-6 h-6">
        <Icon
          className={`w-6 h-6 text-white ${
            isActive ? "text-white" : "text-text-body opacity-60"
          }`}
        />
      </div>

      <span
        className={`text-[16px] font-light font-poppins leading-none text-white ${
          isActive ? "text-text-title" : "text-text-body"
        }`}
      >
        {label}
      </span>
    </Link>
  );
};

interface BillPaymentsProps {
  onMobileItemClick?: () => void;
}

export const BillPayments: React.FC<BillPaymentsProps> = ({
  onMobileItemClick,
}) => {
  const pathname = usePathname();
  const [isBillPaymentsOpen, setIsBillPaymentsOpen] = useState(false);

  const isActive = [
    "/dashboard/bill-payments/products/airtime",
    "/dashboard/bill-payments/water",
    "/dashboard/bill-payments/internet",
  ].includes(pathname);

  return (
    <Collapsible open={isBillPaymentsOpen} onOpenChange={setIsBillPaymentsOpen}>
      <CollapsibleTrigger asChild>
        <div
          className={`flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer transition-colors ${
            isActive
              ? "bg-sidebar-primary text-text-title"
              : "text-sidebar-foreground hover:bg-[#CEEF0A1A]"
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="icon-color">
              <icons.bilpayIcon
                alt="Bill Payments"
                width={24}
                height={24}
                className={
                  isActive ? "text-text-title" : "text-text-body opacity-60"
                }
              />
            </span>
            <span
              className={`text-sm text-[16px] font-normal font-poppins leading-none ${
                isActive ? "text-white" : "text-white"
              }`}
            >
              Bill Payments
            </span>
          </div>
          {isBillPaymentsOpen ? (
            <ChevronUp className="w-4 h-4 text-white" />
          ) : (
            <ChevronDown className="w-4 h-4 text-white" />
          )}
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="pl-8 pt-2 gap-[10px] flex flex-col">
        <SidebarNavItem
          icon={icons.bilpayIcon}
          label="E-Sim"
          href="/dashboard/bill-payments/products/esims"
          onClick={onMobileItemClick}
        />
        <SidebarNavItem
          icon={icons.bilpayIcon}
          label="Airtime"
          href="/dashboard/bill-payments/products/airtime"
          onClick={onMobileItemClick}
        />
        <SidebarNavItem
          icon={icons.cashbackIcon}
          label="Data Plan"
          href="/dashboard/bill-payments/plan/data-plan"
          onClick={onMobileItemClick}
        />
        <SidebarNavItem
          icon={icons.esimIcon}
          label="Internet"
          href="/dashboard/bill-payments/plan/internet"
          onClick={onMobileItemClick}
        />
        <SidebarNavItem
          icon={icons.esimIcon}
          label="Cable TV"
          href="/dashboard/bill-payments/plan/cable"
          onClick={onMobileItemClick}
        />
      </CollapsibleContent>
    </Collapsible>
  );
};

interface ButtonProps {
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  label: string;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  icon: Icon,
  label,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-colors w-full h-fit text-sidebar-foreground"
    >
      <div className="flex items-center justify-center w-6 h-6">
        <Icon className="w-6 h-6 text-text-body" />
      </div>

      <span className="text-[16px] font-normal font-poppins leading-none text-destructive">
        {label}
      </span>
    </button>
  );
};
