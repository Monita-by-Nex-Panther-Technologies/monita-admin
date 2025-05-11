// "use client";

// import { useState } from "react";
// import { icons } from "@/constants/icons";
// import {
//   Collapsible,
//   CollapsibleTrigger,
//   CollapsibleContent,
// } from "@/components/ui/collapsible";
// import { ChevronDown, ChevronUp } from "lucide-react";
// import React from "react";
// import Link from "next/link";
// import Image, { StaticImageData } from "next/image";
// import { usePathname } from "next/navigation";

// export const SideBarSectionHeading = ({ title }: { title: string }) => {
//   return (
//     <h1 className="text-[#FFFFFFA3] text-base font-light leading-6 py-3 px-4">
//       {title}
//     </h1>
//   );
// };

// interface SidebarNavItemProps {
//   icon: StaticImageData;
//   label: string;
//   href: string;
//   onClick?: () => void;
// }

// export const SidebarNavItem: React.FC<SidebarNavItemProps> = ({
//   icon,
//   label,
//   href,
//   onClick,
// }) => {
//   const pathname = usePathname();
//   const isActive = pathname === href;

//   return (
//     <Link
//       href={href}
//       onClick={onClick}
//       className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-colors w-full h-fit
//                 ${
//                   isActive
//                     ? "bg-[#CEEF0A1F] text-white"
//                     : "text-sidebar-foreground hover:bg-[#CEEF0A1A]"
//                 }`}
//     >
//       <div className="flex items-center justify-center w-6 h-6">
//         <Image
//           src={icon}
//           alt={`${label} icon`}
//           width={24}
//           height={24}
//           className={`w-6 h-6 ${
//             isActive ? "text-white" : "text-text-body opacity-60"
//           }`}
//         />
//       </div>

//       <span
//         className={`text-[16px] font-light font-poppins leading-none text-white ${
//           isActive ? "text-text-title" : "text-text-body"
//         }`}
//       >
//         {label}
//       </span>
//     </Link>
//   );
// };

// interface BillPaymentsProps {
//   onMobileItemClick?: () => void;
// }

// export const BillPayments: React.FC<BillPaymentsProps> = ({
//   onMobileItemClick,
// }) => {
//   const pathname = usePathname();
//   const [isBillPaymentsOpen, setIsBillPaymentsOpen] = useState(false);

//   const isActive = [
//     "/dashboard/bill-payments/products/airtime",
//     "/dashboard/bill-payments/water",
//     "/dashboard/bill-payments/internet",
//   ].includes(pathname);

//   return (
//     <Collapsible open={isBillPaymentsOpen} onOpenChange={setIsBillPaymentsOpen}>
//       <CollapsibleTrigger asChild>
//         <div
//           className={`flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer transition-colors ${
//             isActive
//               ? "bg-sidebar-primary text-text-title"
//               : "text-sidebar-foreground hover:bg-[#CEEF0A1A]"
//           }`}
//         >
//           <div className="flex items-center gap-3">
//             <span className="icon-color">
//               <Image
//                 src={icons.bilpayIcon}
//                 alt="Bill Payments"
//                 width={24}
//                 height={24}
//                 className={`${
//                   isActive ? "text-text-title" : "text-text-body opacity-60"
//                 }`}
//               />
//             </span>
//             <span className="text-sm text-[16px] font-normal font-poppins leading-none text-white">
//               Bill Payments
//             </span>
//           </div>
//           {isBillPaymentsOpen ? (
//             <ChevronUp className="w-4 h-4 text-white" />
//           ) : (
//             <ChevronDown className="w-4 h-4 text-white" />
//           )}
//         </div>
//       </CollapsibleTrigger>
//       <CollapsibleContent className="pl-8 pt-2 gap-[10px] flex flex-col">
//         <SidebarNavItem
//           icon={icons.bilpayIcon}
//           label="E-Sim"
//           href="/dashboard/bill-payments/products/esims"
//           onClick={onMobileItemClick}
//         />
//         <SidebarNavItem
//           icon={icons.bilpayIcon}
//           label="Airtime"
//           href="/dashboard/bill-payments/products/airtime"
//           onClick={onMobileItemClick}
//         />
//         <SidebarNavItem
//           icon={icons.cashbackIcon}
//           label="Data Plan"
//           href="/dashboard/bill-payments/plan/data-plan"
//           onClick={onMobileItemClick}
//         />
//         <SidebarNavItem
//           icon={icons.esimIcon}
//           label="Internet"
//           href="/dashboard/bill-payments/plan/internet"
//           onClick={onMobileItemClick}
//         />
//         <SidebarNavItem
//           icon={icons.esimIcon}
//           label="Cable TV"
//           href="/dashboard/bill-payments/plan/cable"
//           onClick={onMobileItemClick}
//         />
//       </CollapsibleContent>
//     </Collapsible>
//   );
// };

// interface ButtonProps {
//   icon: StaticImageData;
//   label: string;
//   onClick?: () => void;
// }

// export const Button: React.FC<ButtonProps> = ({ icon, label, onClick }) => {
//   return (
//     <button
//       onClick={onClick}
//       className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-colors w-full h-fit text-sidebar-foreground"
//     >
//       <div className="flex items-center justify-center w-6 h-6">
//         <Image src={icon} alt={`${label} icon`} width={24} height={24} className="w-6 h-6" />
//       </div>
//       <span className="text-[16px] font-normal font-poppins leading-none text-destructive">
//         {label}
//       </span>
//     </button>
//   );
// };


"use client";

import { useState, useEffect } from "react";
import { icons } from "@/constants/icons";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import React from "react";
import Link from "next/link";
import Image, { StaticImageData } from "next/image";
import { usePathname } from "next/navigation";
import { ServiceType, useServiceStore } from '@/store/BillpaymentStore';
import { toast } from 'sonner';

export const SideBarSectionHeading = ({ title }: { title: string }) => {
  return (
    <h1 className="text-[#FFFFFFA3] text-base font-light leading-6 py-3 px-4">
      {title}
    </h1>
  );
};

interface SidebarNavItemProps {
  icon: StaticImageData;
  label: string;
  href: string;
  serviceId?: string;
  serviceType?: ServiceType;
  onClick?: () => void;
}

export const SidebarNavItem: React.FC<SidebarNavItemProps> = ({
  icon,
  label,
  href,
  serviceId,
  serviceType,
  onClick,
}) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  const { setSelectedService } = useServiceStore();

  const handleClick = (e: React.MouseEvent) => {
    // If serviceId and serviceType are provided, set them in the store
    if (serviceId && serviceType) {
      setSelectedService(serviceType, serviceId);
    }
    
    // Call the original onClick if provided (for mobile menu closing)
    if (onClick) onClick();
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-colors w-full h-fit
                ${
                  isActive
                    ? "bg-[#CEEF0A1F] text-white"
                    : "text-sidebar-foreground hover:bg-[#CEEF0A1A]"
                }`}
    >
      <div className="flex items-center justify-center w-6 h-6">
        <Image
          src={icon}
          alt={`${label} icon`}
          width={24}
          height={24}
          className={`w-6 h-6 ${
            isActive ? "text-white" : "text-text-body opacity-60"
          }`}
        />
      </div>

      <span
        className={`text-[16px] font-light font-poppins leading-none text-white ${
          isActive ? "text-text-title" : "text-text-body"
        }`}
      >
        {label}
      </span>
    </Link>
  );
};

interface BillPaymentsProps {
  onMobileItemClick?: () => void;
}

export const BillPayments: React.FC<BillPaymentsProps> = ({
  onMobileItemClick,
}) => {
  const pathname = usePathname();
  const [isBillPaymentsOpen, setIsBillPaymentsOpen] = useState(false);
  const { services, getServices, isLoading } = useServiceStore();
  const [serviceMap, setServiceMap] = useState<Record<string, string>>({});

  // Expand bill payments if current page is in bill payments section
  useEffect(() => {
    const billPaymentsPaths = [
      "/dashboard/bill-payments/products/airtime",
      "/dashboard/bill-payments/products/esims",
      "/dashboard/bill-payments/plan/data-plan",
      "/dashboard/bill-payments/plan/internet",
      "/dashboard/bill-payments/plan/cable",
    ];
    
    if (billPaymentsPaths.some(path => pathname === path || pathname.startsWith(`${path}/`))) {
      setIsBillPaymentsOpen(true);
    }
  }, [pathname]);

  // Fetch services on mount
  // useEffect(() => {
  //   const fetchServices = async () => {
  //     try {
  //       await getServices();
  //     } catch (error: any) {
  //       toast.error("Failed to load services", {
  //         description: error.message || "An error occurred"
  //       });
  //     }
  //   };

  //   fetchServices();
  // }, [getServices]);

  // Create a map of service labels to service IDs for easy lookup
  useEffect(() => {
    const map: Record<string, string> = {};
    services.forEach(service => {
      map[service.label.toLowerCase()] = service.id;
    });
    setServiceMap(map);
  }, [services]);

  const isActive = [
    "/dashboard/bill-payments/products/airtime",
    "/dashboard/bill-payments/products/esims",
    "/dashboard/bill-payments/plan/data-plan",
    "/dashboard/bill-payments/plan/internet",
    "/dashboard/bill-payments/plan/cable",
  ].some(path => pathname === path || pathname.startsWith(`${path}/`));

  return (
    <Collapsible open={isBillPaymentsOpen} onOpenChange={setIsBillPaymentsOpen}>
      <CollapsibleTrigger asChild>
        <div
          className={`flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer transition-colors ${
            isActive
              ? "bg-sidebar-primary text-text-title"
              : "text-sidebar-foreground hover:bg-[#CEEF0A1A]"
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="icon-color">
              <Image
                src={icons.bilpayIcon}
                alt="Bill Payments"
                width={24}
                height={24}
                className={`${
                  isActive ? "text-text-title" : "text-text-body opacity-60"
                }`}
              />
            </span>
            <span className="text-sm text-[16px] font-normal font-poppins leading-none text-white">
              Bill Payments
            </span>
          </div>
          {isBillPaymentsOpen ? (
            <ChevronUp className="w-4 h-4 text-white" />
          ) : (
            <ChevronDown className="w-4 h-4 text-white" />
          )}
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="pl-8 pt-2 gap-[10px] flex flex-col">
        <SidebarNavItem
          icon={icons.esimIcon}
          label="E-Sim"
          href="/dashboard/bill-payments/products/esims"
          serviceId={serviceMap['esim'] || ''}
          serviceType="esim"
          onClick={onMobileItemClick}
        />
        <SidebarNavItem
          icon={icons.bilpayIcon}
          label="Airtime"
          href="/dashboard/bill-payments/products/airtime"
          serviceId={serviceMap['airtime'] || ''}
          serviceType="airtime"
          onClick={onMobileItemClick}
        />
        <SidebarNavItem
          icon={icons.cashbackIcon}
          label="Data Plan"
          href="/dashboard/bill-payments/plan/data-plan"
          serviceId={serviceMap['data'] || ''}
          serviceType="data"
          onClick={onMobileItemClick}
        />
        <SidebarNavItem
          icon={icons.esimIcon}
          label="Internet"
          href="/dashboard/bill-payments/plan/internet"
          serviceId={serviceMap['internet'] || ''}
          serviceType="internet"
          onClick={onMobileItemClick}
        />
        <SidebarNavItem
          icon={icons.esimIcon}
          label="Cable TV"
          href="/dashboard/bill-payments/plan/cable"
          serviceId={serviceMap['cable'] || ''}
          serviceType="cable"
          onClick={onMobileItemClick}
        />
      </CollapsibleContent>
    </Collapsible>
  );
};

interface ButtonProps {
  icon: StaticImageData;
  label: string;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({ icon, label, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-colors w-full h-fit text-sidebar-foreground"
    >
      <div className="flex items-center justify-center w-6 h-6">
        <Image src={icon} alt={`${label} icon`} width={24} height={24} className="w-6 h-6" />
      </div>
      <span className="text-[16px] font-normal font-poppins leading-none text-destructive">
        {label}
      </span>
    </button>
  );
};