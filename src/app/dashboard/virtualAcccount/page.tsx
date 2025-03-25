import React from "react";
import VirtualAccount from "./components/VirtualAccount";
import VirtualAccountsList from "./components/VirtualAcountList";

const page = () => {
  return (
    <div>
      <VirtualAccount />
      <VirtualAccountsList />
    </div>
  );
};

export default page;
