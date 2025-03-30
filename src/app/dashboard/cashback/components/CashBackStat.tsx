import StatCard from "@/components/common/StartCard";
import { icons } from "@/constants/icons";
import React from "react";

const CashBackStat = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 lg:grid-cols-3 gap-4 mb-4">
      <StatCard
        title="Total Users"
        value="1,000,000"
        Icon={icons.customersIcon} // Pass the icon component directly
      />
      <StatCard
        title="Active Accounts "
        value="800,000"
        Icon={icons.customersIcon} // Pass the icon component directly
      />
      <StatCard
        title="Inactive Accounts"
        value="8,000,000"
        Icon={icons.customersIcon} // Pass the icon component directly
      />
    </div>
  );
};

export default CashBackStat;
