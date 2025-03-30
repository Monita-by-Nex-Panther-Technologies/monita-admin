"use client";

import React, { useState, useEffect } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";

interface MobileSidebarProps {
  className?: string;
}

const MobileSidebar = ({ className }: MobileSidebarProps) => {
  const [open, setOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`md:hidden p-2 rounded-md hover:bg-sidebar-accent transition-colors ${
          className || ""
        }`}
        aria-label="Open sidebar"
      >
        <Menu size={24} className="text-text-body" />
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="left"
          className="p-0 w-[280px] sm:w-[320px] border-r border-border"
          hideCloseButton={true}
        >
          <Sidebar
            isMobile={true}
            onClose={() => setOpen(false)}
            onNavigate={() => setOpen(false)}
          />
        </SheetContent>
      </Sheet>
    </>
  );
};

export default MobileSidebar;
