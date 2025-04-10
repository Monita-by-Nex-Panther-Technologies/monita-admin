"use client";

import { useState } from "react";
import DBHeader from "@/components/common/DBHeader";
import Sidebar from "@/components/ui/Sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-background-alt">
      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`w-[275px] bg-background border-r border-sidebar-border fixed top-0 left-0 h-screen z-30 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } overflow-hidden`}
      >
        <Sidebar onCloseMobile={() => setIsSidebarOpen(false)} />
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-[275px] flex flex-col h-screen">
        {/* Header */}
        <div className="sticky top-0 z-10">
          <DBHeader toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="w-full p-4 sm:p-6 md:p-8">{children}</div>
        </div>
      </main>
    </div>
  );
}
