"use client";

import React, { useState } from "react";

type PlanType = {
  id: number;
  size: number;
  unit: string;
  disabled: boolean;
  hotDeal: boolean;
  costPrice: string;
  sellingPrice: string;
  gold: string;
  simServer: string;
  validity: string;
};

type NetworkPlansType = {
  [key: string]: PlanType[];
};

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Pencil, Trash2, Plus } from "lucide-react";

const DataPlanManagement = () => {
  const [selectedNetwork, setSelectedNetwork] = useState("MTN");

  // Different plans for different networks
  const networkPlans = {
    MTN: [
      {
        id: 1,
        size: 500,
        unit: "MB",
        disabled: false,
        hotDeal: false,
        costPrice: "₦500",
        sellingPrice: "₦550",
        gold: "₦540",
        simServer: "",
        validity: "30 days",
      },
      {
        id: 2,
        size: 500,
        unit: "MB",
        disabled: false,
        hotDeal: false,
        costPrice: "₦500",
        sellingPrice: "₦550",
        gold: "₦540",
        simServer: "",
        validity: "30 days",
      },
      {
        id: 3,
        size: 500,
        unit: "MB",
        disabled: false,
        hotDeal: false,
        costPrice: "₦500",
        sellingPrice: "₦550",
        gold: "₦540",
        simServer: "",
        validity: "30 days",
      },
      {
        id: 4,
        size: 500,
        unit: "MB",
        disabled: false,
        hotDeal: false,
        costPrice: "₦500",
        sellingPrice: "₦550",
        gold: "₦540",
        simServer: "",
        validity: "30 days",
      },
      {
        id: 5,
        size: 500,
        unit: "MB",
        disabled: false,
        hotDeal: false,
        costPrice: "₦500",
        sellingPrice: "₦550",
        gold: "₦540",
        simServer: "",
        validity: "30 days",
      },
      {
        id: 6,
        size: 500,
        unit: "MB",
        disabled: false,
        hotDeal: false,
        costPrice: "₦500",
        sellingPrice: "₦550",
        gold: "₦540",
        simServer: "",
        validity: "30 days",
      },
    ],
    GLO: [
      {
        id: 1,
        size: 1000,
        unit: "MB",
        disabled: false,
        hotDeal: true,
        costPrice: "₦600",
        sellingPrice: "₦650",
        gold: "₦630",
        simServer: "",
        validity: "30 days",
      },
      {
        id: 2,
        size: 2000,
        unit: "MB",
        disabled: false,
        hotDeal: false,
        costPrice: "₦900",
        sellingPrice: "₦950",
        gold: "₦930",
        simServer: "",
        validity: "30 days",
      },
    ],
    "9moboile": [
      {
        id: 1,
        size: 1500,
        unit: "MB",
        disabled: true,
        hotDeal: false,
        costPrice: "₦700",
        sellingPrice: "₦750",
        gold: "₦730",
        simServer: "",
        validity: "30 days",
      },
    ],
    Airtel: [
      {
        id: 1,
        size: 2500,
        unit: "MB",
        disabled: false,
        hotDeal: true,
        costPrice: "₦800",
        sellingPrice: "₦850",
        gold: "₦830",
        simServer: "",
        validity: "30 days",
      },
      {
        id: 2,
        size: 5000,
        unit: "MB",
        disabled: false,
        hotDeal: false,
        costPrice: "₦1500",
        sellingPrice: "₦1600",
        gold: "₦1550",
        simServer: "",
        validity: "30 days",
      },
    ],
  };

  const [dataPlans, setDataPlans] = useState<NetworkPlansType>(networkPlans);

  // Handle plan updates
  const handlePlanUpdate = (
    networkName: string,
    planId: number,
    field: keyof PlanType,
    value: string | number | boolean // Union type for possible values
  ) => {
    const updatedPlans = { ...dataPlans };
    const planIndex = updatedPlans[networkName].findIndex(
      (plan) => plan.id === planId
    );

    if (planIndex !== -1) {
      updatedPlans[networkName][planIndex] = {
        ...updatedPlans[networkName][planIndex],
        [field]: value,
      };
      setDataPlans(updatedPlans);
    }
  };

  const networks = [
    {
      name: "MTN",
      logo: "https://upload.wikimedia.org/wikipedia/commons/9/93/New_MTN_logo.svg",
      color: "#FFCC00",
    },
    {
      name: "GLO",
      logo: "https://upload.wikimedia.org/wikipedia/en/8/86/Globacom_limited_logo.svg",
      color: "#008751",
    },
    { name: "9moboile", logo: "", color: "#009900" },
    {
      name: "Airtel",
      logo: "https://upload.wikimedia.org/wikipedia/commons/7/72/Airtel_logo.svg",
      color: "#FF0000",
    },
  ];

  return (
    <>
      {/* Network Selection - Responsive Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 w-full items-center gap-2 sm:gap-4 mb-4 sm:mb-8">
        {networks.map((network) => (
          <div
            key={network.name}
            className={`flex items-center px-2 sm:px-3 py-3 sm:py-4 mt-3 sm:mt-5 rounded-lg cursor-pointer ${
              selectedNetwork === network.name
                ? "bg-primary-alpha-8 border border-primary"
                : "bg-background border border-gray-200"
            }`}
            onClick={() => setSelectedNetwork(network.name)}
          >
            <div
              className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-full mr-1 sm:mr-2"
              style={{ backgroundColor: network.color }}
            >
              {network.name === "MTN" && (
                <span className="text-xs font-bold text-black">MTN</span>
              )}
              {network.name === "GLO" && (
                <span className="text-xs font-bold text-white">glo</span>
              )}
              {network.name === "9moboile" && (
                <span className="text-xs text-white">9</span>
              )}
              {network.name === "Airtel" && (
                <span className="text-xs text-white">A</span>
              )}
            </div>
            <span className="font-medium text-sm sm:text-base text-gray-700">
              {network.name}
            </span>
          </div>
        ))}
      </div>

      <div className="w-full mx-auto bg-white rounded-lg">
        {/* Data Plan Header - Responsive Layout */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 p-3 sm:p-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-0">
            Data Plan - {selectedNetwork}
          </h1>
          <div className="flex flex-col sm:flex-row w-full sm:w-auto space-y-2 sm:space-y-0 sm:space-x-4">
            <Button
              variant="outline"
              className="border border-gray-200 text-text-title w-full sm:w-[182px] h-[40px] sm:h-[48px] hover:bg-gray-50 rounded-md px-3 sm:px-6 py-2 sm:py-5"
            >
              Save Changes
            </Button>
            <Button className="bg-primary text-text-title text-[14px] sm:text-[16px] flex items-center justify-center w-full sm:w-[182px] h-[40px] sm:h-[48px] gap-1 font-normal font-poppins rounded-md px-3 sm:px-4 py-2 sm:py-3">
              <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
              Add Plan
            </Button>
          </div>
        </div>

        {/* Responsive Table with Horizontal Scroll */}
        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="bg-primary-alpha-8 hover:bg-primary-alpha-8 border-b border-gray-200">
                <TableHead className="font-medium text-[14px] sm:text-[16px] text-gray-700 py-2 sm:py-3 pl-2 sm:pl-4 whitespace-nowrap">
                  Data Plan
                </TableHead>
                <TableHead className="font-medium text-[14px] sm:text-[16px] text-gray-700 py-2 sm:py-3 whitespace-nowrap">
                  Disable
                </TableHead>
                <TableHead className="font-medium text-[14px] sm:text-[16px] text-gray-700 py-2 sm:py-3 whitespace-nowrap">
                  Hot Deal
                </TableHead>
                <TableHead className="font-medium text-[14px] sm:text-[16px] text-gray-700 py-2 sm:py-3 whitespace-nowrap">
                  Cost Price
                </TableHead>
                <TableHead className="font-medium text-[14px] sm:text-[16px] text-gray-700 py-2 sm:py-3 whitespace-nowrap">
                  Selling Price
                </TableHead>
                <TableHead className="font-medium text-[14px] sm:text-[16px] text-gray-700 py-2 sm:py-3 whitespace-nowrap">
                  Gold
                </TableHead>
                <TableHead className="font-medium text-[14px] sm:text-[16px] text-gray-700 py-2 sm:py-3 whitespace-nowrap">
                  Sim server
                </TableHead>
                <TableHead className="font-medium text-[14px] sm:text-[16px] text-gray-700 py-2 sm:py-3 whitespace-nowrap">
                  Validity
                </TableHead>
                <TableHead className="font-medium text-[14px] sm:text-[16px] text-gray-700 py-2 sm:py-3 whitespace-nowrap">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dataPlans[selectedNetwork].map((plan) => (
                <TableRow key={plan.id} className="border-b border-gray-200">
                  <TableCell className="py-3 sm:py-5">
                    <div className="flex items-center bg-background-alt w-fit rounded-sm p-1 gap-1">
                      <Input
                        type="number"
                        value={plan.size}
                        onChange={(e) =>
                          handlePlanUpdate(
                            selectedNetwork,
                            plan.id,
                            "size",
                            parseInt(e.target.value)
                          )
                        }
                        className="text-gray-700 rounded bg-background w-14 sm:w-18 text-center text-sm sm:text-base"
                      />
                      <div className="relative">
                        <Select
                          value={plan.unit}
                          onValueChange={(value) =>
                            handlePlanUpdate(
                              selectedNetwork,
                              plan.id,
                              "unit",
                              value
                            )
                          }
                        >
                          <SelectTrigger className="w-14 sm:w-18 text-sm sm:text-base text-text-body border-0 bg-background-alt">
                            <SelectValue placeholder="Unit" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="MB">MB</SelectItem>
                            <SelectItem value="GB">GB</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={plan.disabled}
                      onCheckedChange={(checked) =>
                        handlePlanUpdate(
                          selectedNetwork,
                          plan.id,
                          "disabled",
                          checked
                        )
                      }
                      className="scale-100 sm:scale-125 data-[state=checked]:bg-primary"
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={plan.hotDeal}
                      onCheckedChange={(checked) =>
                        handlePlanUpdate(
                          selectedNetwork,
                          plan.id,
                          "hotDeal",
                          checked
                        )
                      }
                      className="scale-100 sm:scale-125 data-[state=checked]:bg-primary"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={plan.costPrice}
                      onChange={(e) =>
                        handlePlanUpdate(
                          selectedNetwork,
                          plan.id,
                          "costPrice",
                          e.target.value
                        )
                      }
                      className="border border-gray-200 text-text-body rounded-sm py-3 sm:py-5 w-20 sm:w-24 text-sm sm:text-base"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={plan.sellingPrice}
                      onChange={(e) =>
                        handlePlanUpdate(
                          selectedNetwork,
                          plan.id,
                          "sellingPrice",
                          e.target.value
                        )
                      }
                      className="border border-gray-200 text-text-body rounded-sm py-3 sm:py-5 w-20 sm:w-24 text-sm sm:text-base"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={plan.gold}
                      onChange={(e) =>
                        handlePlanUpdate(
                          selectedNetwork,
                          plan.id,
                          "gold",
                          e.target.value
                        )
                      }
                      className="border border-gray-200 text-text-body rounded-sm py-3 sm:py-5 w-20 sm:w-24 text-sm sm:text-base"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={plan.simServer}
                      onChange={(e) =>
                        handlePlanUpdate(
                          selectedNetwork,
                          plan.id,
                          "simServer",
                          e.target.value
                        )
                      }
                      className="border border-gray-200 text-text-body rounded-sm py-3 sm:py-5 w-20 sm:w-32 text-sm sm:text-base"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={plan.validity}
                      onChange={(e) =>
                        handlePlanUpdate(
                          selectedNetwork,
                          plan.id,
                          "validity",
                          e.target.value
                        )
                      }
                      className="border border-gray-200 text-text-body rounded-sm py-3 sm:py-5 w-20 sm:w-24 text-sm sm:text-base"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1 sm:space-x-2">
                      <Button
                        variant="ghost"
                        className="h-6 w-6 sm:h-8 sm:w-8 p-0"
                      >
                        <Pencil className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        className="h-6 w-6 sm:h-8 sm:w-8 p-0"
                      >
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default DataPlanManagement;
