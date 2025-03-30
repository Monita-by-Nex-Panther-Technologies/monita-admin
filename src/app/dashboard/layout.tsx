"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/ui/Sidebar";
import DBHeader from "@/components/common/DBHeader";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-background-alt overflow-hidden">
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          w-[275px] bg-background border-r border-sidebar-border 
          fixed top-0 left-0 h-screen overflow-y-auto z-30
          transition-transform duration-300 ease-in-out
          lg:translate-x-0 
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <Sidebar onNavigate={() => setIsSidebarOpen(false)} />
      </aside>

      {/* Main content */}
      <main
        className={`
          flex-1 transition-all duration-300 ease-in-out
          w-full lg:pl-[275px]
        `}
      >
        <div className="flex flex-col h-full">
          <DBHeader onMenuClick={toggleSidebar} />
          <div className="w-full p-4 md:p-8 flex-grow">{children}</div>
        </div>
      </main>
    </div>
  );
}
