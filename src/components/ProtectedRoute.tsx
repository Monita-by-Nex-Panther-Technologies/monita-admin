"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Loader2 } from "lucide-react";
import { AdminRole, hasAccessToRoute } from "@/constants/permissions";
import { ProtectedRouteProps } from "@/interfaces/protectedRoute";

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user, isLoading } = useAuthStore();
  const [checking, setChecking] = useState(true);

  const getUserRole = (): AdminRole | undefined => {
    if (!user) return undefined;

    if (user.role) {
      switch (user.role.toLowerCase()) {
        case "super_admin":
          return "super_admin";
        case "general_admin":
          return "general_admin";
        case "finance_admin":
          return "finance_admin";
        case "customer_support":
          return "customer_support";
        case "kyc_admin":
          return "kyc_admin";
        case "staff_admin":
          return "staff_admin";
        default:
          return "general_admin";
      }
    }

    return "super_admin";
  };

  useEffect(() => {
    const checkAuth = async () => {
      if (
        pathname === "/signin" ||
        pathname === "/forget-password" ||
        pathname === "/reset-password" ||
        pathname === "/unauthorized"
      ) {
        setChecking(false);
        return;
      }

      if (!isAuthenticated && !isLoading) {
        router.replace("/signin");
      } else if (isAuthenticated) {
        const userRole = getUserRole();

        if (!hasAccessToRoute(pathname, userRole)) {
          router.replace("/unauthorized");
        }
      }

      setChecking(false);
    };

    checkAuth();
  }, [isAuthenticated, isLoading, pathname, router]);

  if (checking || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2">Authenticating...</span>
      </div>
    );
  }

  if (
    pathname === "/signin" ||
    pathname === "/forget-password" ||
    pathname === "/reset-password" ||
    pathname === "/unauthorized"
  ) {
    return <>{children}</>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
