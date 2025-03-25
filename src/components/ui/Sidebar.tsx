"use client";

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
import { useDispatch } from "react-redux";
import { logout } from "@/store/reducers/authSlice";
import { useRouter } from "next/navigation";

interface SidebarProps {
  onNavigate?: () => void;
}

const Sidebar = ({ onNavigate }: SidebarProps) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    router.push("/auth");
  };

  return (
    <div className="w-full bg-background justify-start items-start flex flex-col px-6 py-10 gap-14 pb-20 ">
      <Image
        src={images.image.monitaLogo}
        alt="monitaLogo"
        width={164}
        height={39.96}
      />

      <nav className="w-full">
        <div className="w-full flex flex-col gap-[10px]">
          <SideBarSectionHeading title="Overview" />
          <SidebarNavItem
            icon={icons.home}
            label="Dashboard"
            href="/dashboard"
            onClick={onNavigate}
          />
          <SidebarNavItem
            icon={icons.transact}
            label="Transactions"
            href="/dashboard/transactions"
            onClick={onNavigate}
          />
          <SidebarNavItem
            icon={icons.statisticsIcon}
            label="Statistics"
            href="/dashboard/statistics"
            onClick={onNavigate}
          />
        </div>

        <div className="w-full flex flex-col gap-[10px]">
          <SideBarSectionHeading title="Users" />
          <SidebarNavItem
            icon={icons.customersIcon}
            label="Customers"
            href="/dashboard/customers"
            onClick={onNavigate}
          />
          <SidebarNavItem
            icon={icons.kycIcon}
            label="KYC Applications"
            href="/dashboard/kycs"
            onClick={onNavigate}
          />
          <SidebarNavItem
            icon={icons.staffIcon}
            label="Staff"
            href="/dashboard/staffs"
            onClick={onNavigate}
          />
        </div>

        <div className="w-full flex flex-col gap-[10px]">
          <SideBarSectionHeading title="Financial Services" />

          {/* Use the BillPayments component */}
          <BillPayments />

          <SidebarNavItem
            icon={icons.giftcardIcon}
            label="GiftCards"
            href="/dashboard/giffCard"
            onClick={onNavigate}
          />
          <SidebarNavItem
            icon={icons.virtAccIcon}
            label="Virtual Accounts"
            href="/dashboard/virtualAcccount"
            onClick={onNavigate}
          />
          <SidebarNavItem
            icon={icons.cashbackIcon}
            label="Cashback"
            href="/dashboard/cashback"
            onClick={onNavigate}
          />
        </div>

        <div className="w-full flex flex-col gap-[10px]">
          <SideBarSectionHeading title="Products & Support" />
          <SidebarNavItem
            icon={icons.cardIcon}
            label="One Card"
            href="/dashboard/oneCard"
            onClick={onNavigate}
          />
          <SidebarNavItem
            icon={icons.esimIcon}
            label="eSIMs"
            href="/dashboard/bill-payments/products/esims"
            onClick={onNavigate}
          />
          <SidebarNavItem
            icon={icons.settingsIcon}
            label="Settings"
            href="/dashboard/settings"
            onClick={onNavigate}
          />
          <SidebarNavItem
            icon={icons.supportIcon}
            label="Support Tickets"
            href="/dashboard/supportTickets"
            onClick={onNavigate}
          />
        </div>
      </nav>

      <div className="">
        <Button icon={icons.logoutIcon} label="Logout" onClick={handleLogout} />
      </div>
    </div>
  );
};

export default Sidebar;
