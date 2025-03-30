import StatCard from "@/components/common/StartCard";
import { icons } from "@/constants/icons";
import React from "react";

const TransactionStat = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total Users"
        value="1,000,000"
        Icon={icons.customersIcon} // Pass the icon component directly
      />
      <StatCard
        title="Total Users"
        value="1,000,000"
        Icon={icons.customersIcon} // Pass the icon component directly
      />
      <StatCard
        title="Total Users"
        value="1,000,000"
        Icon={icons.customersIcon} // Pass the icon component directly
      />
      <StatCard
        title="Total Users"
        value="1,000,000"
        Icon={icons.customersIcon} // Pass the icon component directly
      />
    </div>
  );
};

export default TransactionStat;
