"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { Menu as MenuIcon, Settings } from "lucide-react";
import { usePathname } from "next/navigation";
import { SearchInput } from "../ui/SearchInput";

interface DBHeaderProps {
  onMenuClick: () => void;
}

const DBHeader = ({ onMenuClick }: DBHeaderProps) => {
  const pathname = usePathname();
  const currentTitle =
    (pathname?.split("/")?.pop()?.charAt(0)?.toUpperCase() ?? "") +
      (pathname?.split("/")?.pop()?.slice(1) ?? "") || "Dashboard";

  return (
    <div className="h-[104px] w-full flex flex-row py-8 px-4 md:px-10 gap-2.5 justify-between items-center bg-background">
      {/* Mobile Menu Button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <MenuIcon className="h-6 w-6" />
      </button>

      {/* Dynamic Title */}
      <h1 className="text-text-title text-xl md:text-[32px] leading-6 font-poppins font-bold">
        {currentTitle}
      </h1>

      <div className="flex flex-row gap-2 md:gap-[32px] justify-center items-center">
        <SearchInput className="hidden md:flex" />

        <button className="bg-background-alt w-10 h-10 rounded-full justify-center items-center hidden md:flex">
          <Settings />
        </button>

        <div>
          <div className="flex flex-row gap-2 md:gap-4">
            <Avatar className="w-8 h-8 md:w-12 md:h-12">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="hidden md:flex flex-col gap-1">
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
