"use client"

import { usePathname } from "next/navigation";
import { SearchInput } from "../ui/SearchInput";
import { icons } from "@/constants/icons";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const DBHeader = () => {
    const pathname = usePathname();

    // Route-to-title mapping
    const routeTitles: { [key: string]: string } = {
        "/dashboard": "Dashboard",
        "/dashboard/transactions": "Transactions",
        "/dashboard/statistics": "Statistics",
        "/dashboard/customers": "Customers",
        "/dashboard/kycs": "KYC Applications",
        "/dashboard/staffs": "Staff",
        "/dashboard/bill-payments": "Bill Payments", // Parent route
        "/dashboard/bill-payments/electricity": "Bill Pay- Electricity Bills ", // Sub-route
        "/dashboard/bill-payments/water": "Bill Pay - Water", // Sub-route
        "/dashboard/bill-payments/internet": "Bill Pay - internet ", // Sub-route
        "/dashboard/giffCard": "GiftCards",
        "/dashboard/virtualAcccount": "Virtual Accounts",
        "/dashboard/cashback": "Cashback",
        "/dashboard/oneCard": "One Card",
        "/dashboard/eSIMs": "eSIMs",
        "/dashboard/settings": "Settings",
        "/dashboard/supportTickets": "Support Tickets",
    };

    // Get the current title based on the route
    const currentTitle = routeTitles[pathname] || "Dashboard";

    return (
        <div className="h-[104px] w-full flex flex-row py-8 px-10 gap-2.5 justify-between items-center bg-background">
            {/* Dynamic Title */}
            <h1 className="text-text-title text-[32px] leading-6 font-poppins font-bold">
                {currentTitle}
            </h1>

            <div className="flex flex-row gap-[32px] justify-center items-center">
                <SearchInput />

                <button className="bg-background-alt w-10 h-10 rounded-full justify-center items-center flex">
                    <icons.settingsIcon />
                </button>
                <button className="bg-background-alt w-10 h-10 rounded-full justify-center items-center flex">
                    <icons.settingsIcon />
                </button>

                <div>
                    <div className="flex flex-row gap-4">
                        <Avatar className="w-12 h-12">
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col gap-1">
                            <h3 className="font-poppins font-medium text-base text-text-title">
                                James Matthew
                            </h3>
                            <h4 className="text-base font-poppins font-normal text-text-body">
                                Admin
                            </h4>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DBHeader;