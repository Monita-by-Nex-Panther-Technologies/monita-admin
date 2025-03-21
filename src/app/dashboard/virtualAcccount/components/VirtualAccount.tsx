import StatCard from "@/components/common/StartCard";
import { icons } from "@/constants/icons";
import React from "react";

const VirtualAccount = () => {
  return (
    <div className=" grid xl:grid-col-4 lg:grid-cols-4 md:grid-cols-2 gap-4">
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
      <StatCard
        title="Blocked Accounts "
        value="500"
        Icon={icons.customersIcon} // Pass the icon component directly
      />
    </div>
  );
};

export default VirtualAccount;
