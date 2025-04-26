export type AdminRole =
  | "super_admin"
  | "general_admin"
  | "finance_admin"
  | "customer_support"
  | "kyc_admin"
  | "staff_admin";

export const routePermissions: Record<string, AdminRole[]> = {
  "/dashboard": [
    "super_admin",
    "general_admin",
    "finance_admin",
    "customer_support",
    "kyc_admin",
    "staff_admin",
  ],
  "/dashboard/transactions": ["super_admin", "general_admin", "finance_admin"],
  "/dashboard/statistics": ["super_admin", "general_admin", "finance_admin"],
  "/dashboard/customers": ["super_admin", "general_admin", "customer_support"],
  "/dashboard/kycs": ["super_admin", "general_admin", "kyc_admin"],
  "/dashboard/staffs": ["super_admin", "staff_admin"],
  "/dashboard/bill-payments": ["super_admin", "general_admin", "finance_admin"],
  "/dashboard/giffCard": ["super_admin", "general_admin", "finance_admin"],
  "/dashboard/virtualAcccount": [
    "super_admin",
    "general_admin",
    "finance_admin",
  ],
  "/dashboard/cashback": ["super_admin", "general_admin", "finance_admin"],
  "/dashboard/oneCard": ["super_admin", "general_admin", "finance_admin"],
  "/dashboard/settings": ["super_admin"],
  "/dashboard/supportTickets": [
    "super_admin",
    "general_admin",
    "customer_support",
  ],
};

export const hasAccessToRoute = (
  pathname: string,
  userRole?: AdminRole
): boolean => {
  if (!userRole) return false;

  if (routePermissions[pathname]?.includes(userRole)) {
    return true;
  }

  for (const route in routePermissions) {
    if (
      pathname.startsWith(route) &&
      routePermissions[route].includes(userRole)
    ) {
      return true;
    }
  }

  return false;
};
