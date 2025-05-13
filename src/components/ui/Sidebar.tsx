"use client";

import { useState, useEffect } from "react";
import { images } from "@/constants/images";
import Image from "next/image";
import React from "react";
import {
  BillPayments,
  Button,
  SidebarNavItem,
  SideBarSectionHeading,
} from "./SidebarComponents";
import { icons } from "@/constants/icons";
import { X } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from 'next/navigation'

interface SidebarProps {
  onCloseMobile?: () => void;
}

const Sidebar = ({ onCloseMobile }: SidebarProps) => {
  const [isClient, setIsClient] = useState(false); // Client-side flag
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);



  const handleLogout = () => {
    logout(); // Call logout from store
    router.push("/signin"); // Redirect to the login page
  };

  return (
    <div className="w-full bg-[#262C05] flex flex-col px-6 py-8 gap-6 md:gap-10 h-full">
      <div className="flex w-full items-center justify-between">
        <Image
          src={images.image.monitaLogo}
          alt="monitaLogo"
          width={164}
          height={39.96}
        />

        <button
          onClick={onCloseMobile}
          className="lg:hidden text-white p-1"
          aria-label="Close sidebar"
        >
          <X size={24} />
        </button>
      </div>

      <nav className="w-full flex-grow overflow-y-auto scrollbar-hide">
        <div className="w-full flex flex-col gap-[10px] pb-6">
          <SideBarSectionHeading title="Overview" />
          <SidebarNavItem
            icon={icons.home}
            label="Dashboard"
            href="/dashboard"
            onClick={onCloseMobile}
          />
          <SidebarNavItem
            icon={icons.transact}
            label="Transactions"
            href="/dashboard/transactions"
            onClick={onCloseMobile}
          />
          <SidebarNavItem
            icon={icons.statisticsIcon}
            label="Statistics"
            href="/dashboard/statistics"
            onClick={onCloseMobile}
          />
        </div>

        <div className="w-full flex flex-col gap-[10px]">
          <SideBarSectionHeading title="Users" />
          <SidebarNavItem
            icon={icons.customersIcon}
            label="Customers"
            href="/dashboard/customers"
            onClick={onCloseMobile}
          />
          <SidebarNavItem
            icon={icons.kycIcon}
            label="KYC Applications"
            href="/dashboard/kycs"
            onClick={onCloseMobile}
          />
          <SidebarNavItem
            icon={icons.staffIcon}
            label="Staff"
            href="/dashboard/staffs"
            onClick={onCloseMobile}
          />
        </div>

        <div className="w-full flex flex-col gap-[10px]">
          <SideBarSectionHeading title="Financial Services" />
          <BillPayments onMobileItemClick={onCloseMobile} />
          {/* <SidebarNavItem
            icon={icons.giftcardIcon}
            label="GiftCards"
            href="/dashboard/giffCard"
            onClick={onCloseMobile}
          /> */}
          <SidebarNavItem
            icon={icons.virtAccIcon}
            label="Virtual Accounts"
            href="/dashboard/virtualAcccount"
            onClick={onCloseMobile}
          />
          <SidebarNavItem
            icon={icons.cashbackIcon}
            label="Cashback"
            href="/dashboard/cashback"
            onClick={onCloseMobile}
          />

<SidebarNavItem
            icon={icons.cardIcon}
            label="One Card"
            href="/dashboard/oneCard"
            onClick={onCloseMobile}
          />
        </div>

        <div className="w-full flex flex-col gap-[10px]">
          <SideBarSectionHeading title="Others" />
         
          {/* <SidebarNavItem
            icon={icons.esimIcon}
            label="eSIMs"
            href="/dashboard/bill-payments/products/esims"
            onClick={onCloseMobile}
          /> */}
          <SidebarNavItem
            icon={icons.settingsIcon}
            label="Settings"
            href="/dashboard/settings"
            onClick={onCloseMobile}
          />
          {/* <SidebarNavItem
            icon={icons.supportIcon}
            label="Support Tickets"
            href="/dashboard/supportTickets"
            onClick={onCloseMobile}
          /> */}
        </div>
      </nav>

      <div className="mt-auto">
        <Button icon={icons.logoutIcon} label="Logout" onClick={handleLogout} />
      </div>
    </div>
  );
};

export default Sidebar;
