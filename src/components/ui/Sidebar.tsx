"use client";

import { images } from "@/constants/images";
import Image from "next/image";
import React, { useState, useEffect } from "react";
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
import { X } from "lucide-react";

interface SidebarProps {
  onNavigate?: () => void;
  isMobile?: boolean;
  onClose?: () => void;
}

const Sidebar = ({ onNavigate, isMobile = false, onClose }: SidebarProps) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/auth");
  };

  if (!mounted) return null;

  return (
    <div className="w-full h-full bg-background flex flex-col px-6 py-8 overflow-y-auto">
      <div className="flex items-center justify-between mb-10">
        <Image
          src={images.image.monitaLogo}
          alt="monitaLogo"
          width={164}
          height={40}
          className="object-contain"
        />
        {isMobile && (
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-sidebar-accent transition-colors"
            aria-label="Close sidebar"
          >
            <X size={24} className="text-text-body" />
          </button>
        )}
      </div>

      <nav className="flex-1 w-full">
        <div className="w-full flex flex-col gap-2 mb-6">
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

        <div className="w-full flex flex-col gap-2 mb-6">
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

        <div className="w-full flex flex-col gap-2 mb-6">
          <SideBarSectionHeading title="Financial Services" />
          <BillPayments onItemClick={onNavigate} />
          <SidebarNavItem
            icon={icons.giftcardIcon}
            label="GiftCards"
            href="/dashboard/giftCard"
            onClick={onNavigate}
          />
          <SidebarNavItem
            icon={icons.virtAccIcon}
            label="Virtual Accounts"
            href="/dashboard/virtualAccount"
            onClick={onNavigate}
          />
          <SidebarNavItem
            icon={icons.cashbackIcon}
            label="Cashback"
            href="/dashboard/cashback"
            onClick={onNavigate}
          />
        </div>

        <div className="w-full flex flex-col gap-2 mb-6">
          <SideBarSectionHeading title="Products & Support" />
          <SidebarNavItem
            icon={icons.cardIcon}
            label="One Card"
            href="/dashboard/oneCard"
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

      <div className="mt-auto pt-4">
        <Button icon={icons.logoutIcon} label="Logout" onClick={handleLogout} />
      </div>
    </div>
  );
};

export default Sidebar;
