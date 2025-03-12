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
// import Image from "next/image";


export const SideBarSectionHeading = ({ title }: { title: string }) => {
    return (
        <h1 className="text-sidebar-heading text-base font-light leading-6 py-3 px-4">
            {title}
        </h1>
    )
}

interface SidebarNavItemProps {
    icon: React.FC<React.SVGProps<SVGSVGElement>>; // SVG Component
    label: string;
    href: string;
}

export const SidebarNavItem: React.FC<SidebarNavItemProps> = ({ icon: Icon, label, href }) => {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link
            href={href}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-colors w-full h-fit
                ${isActive ? "bg-sidebar-primary text-text-title" : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"}`}
        >
            {/* Icon: Ensure proper alignment */}
            <div className="flex items-center justify-center w-6 h-6">
                <Icon className={`w-6 h-6 ${isActive ? "text-text-title" : "text-text-body opacity-60"}`} />
            </div>

            {/* Label: Ensure it's aligned with the icon */}
            <span className={`text-[16px] font-normal font-poppins leading-none ${isActive ? "text-text-title" : "text-text-body"}`}>
                {label}
            </span>
        </Link>
    );
};






export const BillPayments = () => {
    const pathname = usePathname();
    const [isBillPaymentsOpen, setIsBillPaymentsOpen] = useState(false);

    // Check if any nested item is active
    const isActive = [
        "/dashboard/bill-payments/electricity",
        "/dashboard/bill-payments/water",
        "/dashboard/bill-payments/internet",
    ].includes(pathname);

    return (
        <Collapsible
            open={isBillPaymentsOpen}
            onOpenChange={setIsBillPaymentsOpen}
        >
            <CollapsibleTrigger asChild>
                <div
                    className={`flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer transition-colors ${isActive
                        ? "bg-sidebar-primary text-text-title"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        }`}
                >
                    <div className="flex items-center gap-3">
                        <span className="icon-color">
                            <icons.bilpayIcon
                                alt="Bill Payments"
                                width={24}
                                height={24}
                                className={isActive ? "text-text-title" : "text-text-body opacity-60"}
                            />
                        </span>
                        <span
                            className={`text-sm text-[16px] font-normal font-poppins leading-none ${isActive ? "text-text-title" : "text-text-body"
                                }`}
                        >
                            Bill Payments
                        </span>
                    </div>
                    {isBillPaymentsOpen ? (
                        <ChevronUp className="w-4 h-4" />
                    ) : (
                        <ChevronDown className="w-4 h-4" />
                    )}
                </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="pl-8 pt-2 gap-[10px] flex flex-col">
                <SidebarNavItem
                    icon={icons.bilpayIcon}
                    label="Electricity"
                    href="/dashboard/bill-payments/electricity"
                />
                <SidebarNavItem
                    icon={icons.cashbackIcon}
                    label="Water"
                    href="/dashboard/bill-payments/water"
                />
                <SidebarNavItem
                    icon={icons.esimIcon}
                    label="Internet"
                    href="/dashboard/bill-payments/internet"
                />
            </CollapsibleContent>
        </Collapsible>
    );
};


interface ButtonProps {
    icon: React.FC<React.SVGProps<SVGSVGElement>>; // SVG Component
    label: string;
    onClick?: () => void; // Optional click handler
}

export const Button: React.FC<ButtonProps> = ({ icon: Icon, label, onClick }) => {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-colors w-full h-fit text-sidebar-foreground "
        >
            {/* Icon: Ensure proper alignment */}
            <div className="flex items-center justify-center w-6 h-6">
                <Icon className="w-6 h-6 text-text-body" />
            </div>

            {/* Label: Ensure it's aligned with the icon */}
            <span className="text-[16px] font-normal font-poppins leading-none text-destructive">
                {label}
            </span>
        </button>
    );
};