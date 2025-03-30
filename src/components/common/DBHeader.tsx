"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { Menu as MenuIcon, Settings, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { SearchInput } from "../ui/SearchInput";

interface DBHeaderProps {
  onMenuClick: () => void;
}

const DBHeader = ({ onMenuClick }: DBHeaderProps) => {
  const pathname = usePathname();
  const [showProfileInfo, setShowProfileInfo] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const currentTitle =
    (pathname?.split("/")?.pop()?.charAt(0)?.toUpperCase() ?? "") +
      (pathname?.split("/")?.pop()?.slice(1) ?? "") || "Dashboard";

  return (
    <header className="sticky top-0 z-50 bg-background border-b">
      <div className="h-16 md:h-[104px] w-full flex items-center px-4 md:px-10">
        {/* Left Section - Menu Button & Title */}
        <div className="flex items-center flex-1 min-w-0">
          <button
            onClick={onMenuClick}
            className="mr-4 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 md:hidden"
          >
            <MenuIcon className="h-6 w-6" />
          </button>
          <h1 className="text-text-title text-xl md:text-[32px] font-poppins font-bold truncate">
            {currentTitle}
          </h1>
        </div>

        {/* Right Section - Controls */}
        <div className="flex items-center space-x-4 md:space-x-6">
          {/* Search - Desktop */}
          <div className="hidden md:block w-[180px] lg:w-[240px] xl:w-[300px]">
            <SearchInput />
          </div>

          {/* Search - Mobile Toggle */}
          <button
            onClick={() => setShowMobileSearch(!showMobileSearch)}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 md:hidden"
          >
            <Search className="h-5 w-5" />
          </button>

          {/* Settings - Mobile */}
          <button className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 md:hidden">
            <Settings className="h-5 w-5" />
          </button>

          {/* Settings - Desktop */}
          <button className="hidden md:inline-flex items-center justify-center w-10 h-10 rounded-full bg-background-alt hover:bg-gray-100 dark:hover:bg-gray-800 md:ml-8">
            <Settings className="h-5 w-5" />
          </button>

          {/* Avatar */}
          <div className="relative">
            <button
              onClick={() => setShowProfileInfo(!showProfileInfo)}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <Avatar className="w-8 h-8 md:w-10 md:h-10">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <span className="hidden md:inline-flex flex-col text-left">
                <span className="text-sm font-medium text-text-title">
                  James Matthew
                </span>
                <span className="text-xs text-text-body">Admin</span>
              </span>
            </button>

            {/* Mobile Profile Dropdown */}
            {showProfileInfo && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 md:hidden">
                <div className="p-3">
                  <p className="text-sm font-medium text-text-title">
                    James Matthew
                  </p>
                  <p className="text-sm text-text-body truncate">
                    james@example.com
                  </p>
                  <p className="text-xs text-text-body mt-1">Admin</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search - Full width when active */}
      {showMobileSearch && (
        <div className="px-4 pb-3 md:hidden">
          <SearchInput className="w-full" />
        </div>
      )}
    </header>
  );
};

export default DBHeader;
