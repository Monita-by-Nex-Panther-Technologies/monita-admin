"use client";

import { usePathname } from "next/navigation";
import { SearchInput } from "../ui/SearchInput";
import { icons } from "@/constants/icons";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Menu } from "lucide-react";
import Image from "next/image";
import { useUserStore } from "@/store/userStore";

interface DBHeaderProps {
  toggleSidebar: () => void;
}

const DBHeader = ({ toggleSidebar }: DBHeaderProps) => {
  const pathname = usePathname();
   const {
      user,
      isLoading: userLoading,
    } = useUserStore()
  

  const routeTitles: { [key: string]: string } = {
    "/dashboard": "Dashboard",
    "/dashboard/transactions": "Transactions",
    "/dashboard/statistics": "Statistics",
    "/dashboard/customers": "Customers",
    "/dashboard/kycs": "KYC Applications",
    "/dashboard/staffs": "Staff",
    "/dashboard/bill-payments": "Bill Payments",
    "/dashboard/bill-payments/electricity": "Bill Pay - Electricity Bills",
    "/dashboard/bill-payments/water": "Bill Pay - Water",
    "/dashboard/bill-payments/internet": "Bill Pay - Internet",
    "/dashboard/giffCard": "GiftCards",
    "/dashboard/virtualAcccount": "Virtual Accounts",
    "/dashboard/cashback": "Cashback",
    "/dashboard/oneCard": "One Card",
    "/dashboard/eSIMs": "eSIMs",
    "/dashboard/settings": "Settings",
    "/dashboard/supportTickets": "Support Tickets",
  };

  const currentTitle = routeTitles[pathname] || "Dashboard";
  const initials = `${user?.lastName[0] ?? ''}${user?.firstName[0] ?? ''}`.toUpperCase();

  return (
    <div className="min-h-[80px] md:min-h-[104px] w-full flex flex-row py-4 md:py-8 px-6 md:px-10 gap-4 justify-between items-center bg-background">
      <div className="flex items-center">
        <button
          className="mr-4 lg:hidden"
          onClick={toggleSidebar}
          aria-label="Toggle menu"
        >
          <Menu size={24} />
        </button>

        <h1 className="text-text-title text-xl md:text-[24px] leading-6 font-poppins font-bold">
          {currentTitle}
        </h1>
      </div>

      <div className="flex items-center gap-4 md:gap-[32px]">
        {/* <div className="hidden md:block">
          <SearchInput />
        </div> */}

        <div className="flex items-center gap-2 md:gap-[32px]">
          {/* Settings Icon (Desktop) */}
          {/* <button className="hidden md:flex bg-background-alt w-10 h-10 rounded-full justify-center items-center">
            <Image
              src={icons.settingsIcon}
              alt="Settings"
              width={20}
              height={20}
            />
          </button> */}

          {/* Settings Icon (Mobile) */}
          {/* <button className="bg-background-alt w-10 h-10 rounded-full justify-center items-center flex">
            <Image
              src={icons.settingsIcon}
              alt="Settings"
              width={20}
              height={20}
            />
          </button> */}

          <div className="flex items-center gap-2 md:gap-4">
             <Avatar className="w-10 h-10 md:w-12 md:h-12 bg-muted text-muted-foreground">
      <AvatarFallback className="font-medium">
        {initials}
      </AvatarFallback>
    </Avatar>
            <div className="flex flex-col gap-1 text-left">
              <h3 className="font-poppins font-medium text-sm md:text-base text-text-title truncate max-w-[80px] md:max-w-none">
                {user?.lastName} {user?.firstName}
              </h3>
              <h4 className="text-xs md:text-base font-poppins font-normal text-text-body">
                {user?.role?.name}
              </h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DBHeader;
