"use client";

import { useState, useEffect } from "react";
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
    <h1 className="text-sm font-medium leading-6 py-2 px-4 text-text-title/80">
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
  // Exact match for active state
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all w-full h-fit
        ${
          isActive
            ? "bg-sidebar-primary text-text-title"
            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-center w-6 h-6">
        <Icon
          className={`w-5 h-5 ${
            isActive ? "text-text-title" : "text-[#CEEF0A]"
          }`}
        />
      </div>
      <span
        className={`text-[15px] font-normal font-poppins leading-none ${
          isActive ? "text-text-title" : "text-text-body"
        }`}
      >
        {label}
      </span>
    </Link>
  );
};

interface BillPaymentsProps {
  onItemClick?: () => void;
}

export const BillPayments = ({ onItemClick }: BillPaymentsProps) => {
  const pathname = usePathname();
  const [isBillPaymentsOpen, setIsBillPaymentsOpen] = useState(false);

  // Check if any bill payment route is active - but don't mark parent as active
  const containsBillPayments = pathname.includes("/dashboard/bill-payments");

  // Auto-expand when on a bill payments page
  useEffect(() => {
    if (containsBillPayments) {
      setIsBillPaymentsOpen(true);
    }
  }, [containsBillPayments]);

  return (
    <Collapsible open={isBillPaymentsOpen} onOpenChange={setIsBillPaymentsOpen}>
      <CollapsibleTrigger asChild>
        <div
          className={`flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all 
            text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground`}
        >
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-6 h-6">
              <icons.bilpayIcon className="w-5 h-5 text-[#CEEF0A]" />
            </span>
            <span className="text-[15px] font-normal font-poppins leading-none text-text-body">
              Bill Payments
            </span>
          </div>
          {isBillPaymentsOpen ? (
            <ChevronUp className="w-4 h-4 text-text-body" />
          ) : (
            <ChevronDown className="w-4 h-4 text-text-body" />
          )}
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="pl-8 pt-2 gap-2 flex flex-col">
        <SidebarNavItem
          icon={icons.esimIcon}
          label="E-Sim"
          href="/dashboard/bill-payments/products/esims"
          onClick={onItemClick}
        />
        <SidebarNavItem
          icon={icons.bilpayIcon}
          label="Airtime"
          href="/dashboard/bill-payments/products/airtime"
          onClick={onItemClick}
        />
        <SidebarNavItem
          icon={icons.bilpayIcon}
          label="Data Plan"
          href="/dashboard/bill-payments/plan/data-plan"
          onClick={onItemClick}
        />
        <SidebarNavItem
          icon={icons.esimIcon}
          label="Internet"
          href="/dashboard/bill-payments/plan/internet"
          onClick={onItemClick}
        />
        <SidebarNavItem
          icon={icons.esimIcon}
          label="Cable TV"
          href="/dashboard/bill-payments/plan/cable"
          onClick={onItemClick}
        />
      </CollapsibleContent>
    </Collapsible>
  );
};

interface CustomButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  label: string;
}

export const Button: React.FC<CustomButtonProps> = ({
  icon: Icon,
  label,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-colors w-full h-fit text-sidebar-foreground hover:bg-destructive/10"
    >
      <div className="flex items-center justify-center w-6 h-6">
        <Icon className="w-5 h-5 text-destructive" />
      </div>
      <span className="text-[15px] font-normal font-poppins leading-none text-destructive">
        {label}
      </span>
    </button>
  );
};
