"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Pencil, Trash2, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type PlanType = {
  id: number;
  name: string;
  disabled: boolean;
  costPrice: string;
  sellingPrice: string;
  gold: string;
  vtpass: string;
  validity: string;
};

type ServiceProviderType = {
  [key: string]: PlanType[];
};

type ServiceType = {
  name: string;
  color: string;
};

const ServicePlanManagement = () => {
  const [selectedService, setSelectedService] = useState<string>("Spectranet");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newPlan, setNewPlan] = useState({
    name: "",
    costPrice: "",
    sellingPrice: "",
    gold: "",
    vtpass: "",
    validity: "",
  });

  const serviceProviders: ServiceProviderType = {
    Spectranet: [
      {
        id: 1,
        name: "BITT",
        disabled: false,
        costPrice: "₦500",
        sellingPrice: "₦520",
        gold: "₦505",
        vtpass: "",
        validity: "30 days",
      },
      {
        id: 2,
        name: "BITT",
        disabled: false,
        costPrice: "₦500",
        sellingPrice: "₦520",
        gold: "₦505",
        vtpass: "",
        validity: "30 days",
      },
      {
        id: 3,
        name: "BITT",
        disabled: false,
        costPrice: "₦500",
        sellingPrice: "₦520",
        gold: "₦505",
        vtpass: "",
        validity: "30 days",
      },
      {
        id: 4,
        name: "BITT",
        disabled: false,
        costPrice: "₦500",
        sellingPrice: "₦520",
        gold: "₦505",
        vtpass: "",
        validity: "30 days",
      },
      {
        id: 5,
        name: "BITT",
        disabled: false,
        costPrice: "₦500",
        sellingPrice: "₦520",
        gold: "₦505",
        vtpass: "",
        validity: "30 days",
      },
      {
        id: 6,
        name: "BITT",
        disabled: false,
        costPrice: "₦500",
        sellingPrice: "₦520",
        gold: "₦505",
        vtpass: "",
        validity: "30 days",
      },
    ],
    "SMILE Recharge": [
      {
        id: 1,
        name: "FlexiDaily",
        disabled: false,
        costPrice: "₦600",
        sellingPrice: "₦650",
        gold: "₦630",
        vtpass: "",
        validity: "1 day",
      },
      {
        id: 2,
        name: "FlexiWeekly",
        disabled: false,
        costPrice: "₦1500",
        sellingPrice: "₦1600",
        gold: "₦1550",
        vtpass: "",
        validity: "7 days",
      },
    ],
    "SMILE Bundle": [
      {
        id: 1,
        name: "ValuePlus",
        disabled: false,
        costPrice: "₦2000",
        sellingPrice: "₦2100",
        gold: "₦2050",
        vtpass: "",
        validity: "30 days",
      },
      {
        id: 2,
        name: "SmileLite",
        disabled: false,
        costPrice: "₦3000",
        sellingPrice: "₦3100",
        gold: "₦3050",
        vtpass: "",
        validity: "30 days",
      },
    ],
  };

  const services: ServiceType[] = [
    { name: "Spectranet", color: "#192F59" },
    { name: "SMILE Recharge", color: "#009900" },
    { name: "SMILE Bundle", color: "#009900" },
  ];

  const [servicePlans, setServicePlans] =
    useState<ServiceProviderType>(serviceProviders);

  const handlePlanUpdate = (
    serviceName: string,
    planId: number,
    field: keyof PlanType,
    value: string | boolean
  ) => {
    const updatedPlans = { ...servicePlans };
    const planIndex = updatedPlans[serviceName].findIndex(
      (plan) => plan.id === planId
    );

    if (planIndex !== -1) {
      updatedPlans[serviceName][planIndex] = {
        ...updatedPlans[serviceName][planIndex],
        [field]: value,
      };
      setServicePlans(updatedPlans);
    }
  };

  const handleAddPlan = () => {
    const updatedPlans = { ...servicePlans };
    const newId = updatedPlans[selectedService].length + 1;
    updatedPlans[selectedService].push({
      id: newId,
      name: newPlan.name,
      disabled: false,
      costPrice: newPlan.costPrice,
      sellingPrice: newPlan.sellingPrice,
      gold: newPlan.gold,
      vtpass: newPlan.vtpass,
      validity: newPlan.validity,
    });
    setServicePlans(updatedPlans);
    setIsDialogOpen(false);
    setNewPlan({
      name: "",
      costPrice: "",
      sellingPrice: "",
      gold: "",
      vtpass: "",
      validity: "",
    });
  };

  const isAddButtonDisabled =
    !newPlan.name ||
    !newPlan.costPrice ||
    !newPlan.sellingPrice ||
    !newPlan.validity;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 w-full items-center gap-3 md:gap-4 mb-4 md:mb-8">
        {services.map((service) => (
          <div
            key={service.name}
            className={`flex items-center px-2 md:px-3 py-3 md:py-4 mt-2 md:mt-5 rounded-lg cursor-pointer ${
              selectedService === service.name
                ? "bg-primary-alpha-8 border border-primary"
                : "bg-background border border-gray-200"
            }`}
            onClick={() => setSelectedService(service.name)}
          >
            <div
              className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center rounded-full mr-2"
              style={{ backgroundColor: service.color }}
            >
              <span className="text-xs font-bold text-white">S</span>
            </div>
            <span className="font-medium text-xs md:text-sm text-gray-700">
              {service.name}
            </span>
          </div>
        ))}
      </div>

      <div className="w-full mx-auto bg-white rounded-lg">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 md:mb-6 p-3 md:p-6">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 md:mb-0">
            Internet - {selectedService}
          </h1>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <Button
              variant="outline"
              className="border border-gray-200 text-text-title h-10 md:h-[48px] w-full md:w-[182px] hover:bg-gray-50 rounded-md px-4 py-2 md:px-6 md:py-5 text-sm md:text-base"
            >
              Save Changes
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary text-text-title text-sm md:text-[16px] flex flex-row h-10 md:h-[48px] w-full md:w-[182px] gap-1 font-normal font-poppins rounded-md px-3 py-2 md:px-4 md:py-3">
                  <Plus className="h-4 w-4 md:h-5 md:w-5 mr-1 md:mr-2" />
                  Add Plan
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-background-alt p-1 rounded-sm max-w-[95vw] md:max-w-2xl">
                <DialogHeader className="bg-white w-full pt-4 md:pt-6 px-3 md:px-4">
                  <DialogTitle>Add Internet Plan</DialogTitle>
                  <hr className="my-3 md:my-4 border-gray-300" />
                </DialogHeader>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-5 w-full p-3 md:p-6 rounded-sm m-auto bg-background">
                  <div className="space-y-1 md:space-y-2">
                    <label className="block text-sm md:text-[16px] font-medium text-text-title">
                      Name
                    </label>
                    <Input
                      placeholder="Name"
                      value={newPlan.name}
                      onChange={(e) =>
                        setNewPlan({ ...newPlan, name: e.target.value })
                      }
                      className="p-3 md:p-5 border border-[#01010129]"
                    />
                  </div>
                  <div className="space-y-1 md:space-y-2">
                    <label className="block text-sm md:text-[16px] font-medium text-text-title">
                      Cost Price
                    </label>
                    <Input
                      placeholder="Cost Price"
                      value={newPlan.costPrice}
                      onChange={(e) =>
                        setNewPlan({ ...newPlan, costPrice: e.target.value })
                      }
                      className="p-3 md:p-5 border border-[#01010129]"
                    />
                  </div>
                  <div className="space-y-1 md:space-y-2">
                    <label className="block text-sm md:text-[16px] font-medium text-text-title">
                      Selling Price
                    </label>
                    <Input
                      placeholder="Selling Price"
                      value={newPlan.sellingPrice}
                      onChange={(e) =>
                        setNewPlan({ ...newPlan, sellingPrice: e.target.value })
                      }
                      className="p-3 md:p-5 border border-[#01010129]"
                    />
                  </div>
                  <div className="space-y-1 md:space-y-2">
                    <label className="block text-sm md:text-[16px] font-medium text-text-title">
                      Gold
                    </label>
                    <Input
                      placeholder="Gold"
                      value={newPlan.gold}
                      onChange={(e) =>
                        setNewPlan({ ...newPlan, gold: e.target.value })
                      }
                      className="p-3 md:p-5 border border-[#01010129]"
                    />
                  </div>
                  <div className="space-y-1 md:space-y-2">
                    <label className="block text-sm md:text-[16px] font-medium text-text-title">
                      Vtpass
                    </label>
                    <Input
                      placeholder="Vtpass"
                      value={newPlan.vtpass}
                      onChange={(e) =>
                        setNewPlan({ ...newPlan, vtpass: e.target.value })
                      }
                      className="p-3 md:p-5 border border-[#01010129]"
                    />
                  </div>
                  <div className="space-y-1 md:space-y-2">
                    <label className="block text-sm md:text-[16px] font-medium text-text-title">
                      Validity
                    </label>
                    <Input
                      placeholder="Validity"
                      value={newPlan.validity}
                      onChange={(e) =>
                        setNewPlan({ ...newPlan, validity: e.target.value })
                      }
                      className="p-3 md:p-5 border border-[#01010129]"
                    />
                  </div>
                </div>
                <div className="bg-background py-3 md:py-4 px-3 md:px-6">
                  <Button
                    onClick={handleAddPlan}
                    disabled={isAddButtonDisabled}
                    className="w-full mt-2 md:mt-4"
                  >
                    Add Plan
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <Table className="w-full min-w-[800px]">
            <TableHeader>
              <TableRow className="bg-primary-alpha-8 hover:bg-primary-alpha-8 border-b border-gray-200">
                <TableHead className="font-medium text-sm md:text-[16px] text-gray-700 py-2 md:py-3 pl-3 md:pl-4">
                  Name
                </TableHead>
                <TableHead className="font-medium text-sm md:text-[16px] text-gray-700 py-2 md:py-3">
                  Disable
                </TableHead>
                <TableHead className="font-medium text-sm md:text-[16px] text-gray-700 py-2 md:py-3">
                  Cost Price
                </TableHead>
                <TableHead className="font-medium text-sm md:text-[16px] text-gray-700 py-2 md:py-3">
                  Selling Price
                </TableHead>
                <TableHead className="font-medium text-sm md:text-[16px] text-gray-700 py-2 md:py-3">
                  Gold
                </TableHead>
                <TableHead className="font-medium text-sm md:text-[16px] text-gray-700 py-2 md:py-3">
                  Vtpass
                </TableHead>
                <TableHead className="font-medium text-sm md:text-[16px] text-gray-700 py-2 md:py-3">
                  Validity
                </TableHead>
                <TableHead className="font-medium text-sm md:text-[16px] text-gray-700 py-2 md:py-3">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {servicePlans[selectedService].map((plan) => (
                <TableRow key={plan.id} className="border-b border-gray-200">
                  <TableCell className="py-3 md:py-5">
                    <Input
                      value={plan.name}
                      onChange={(e) =>
                        handlePlanUpdate(
                          selectedService,
                          plan.id,
                          "name",
                          e.target.value
                        )
                      }
                      className="border border-gray-200 text-text-body rounded-sm py-2 md:py-5 w-20 md:w-32"
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={plan.disabled}
                      onCheckedChange={(checked) =>
                        handlePlanUpdate(
                          selectedService,
                          plan.id,
                          "disabled",
                          checked
                        )
                      }
                      className="scale-100 md:scale-125 data-[state=checked]:bg-primary"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={plan.costPrice}
                      onChange={(e) =>
                        handlePlanUpdate(
                          selectedService,
                          plan.id,
                          "costPrice",
                          e.target.value
                        )
                      }
                      className="border border-gray-200 text-text-body rounded-sm py-2 md:py-5 w-20 md:w-24"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={plan.sellingPrice}
                      onChange={(e) =>
                        handlePlanUpdate(
                          selectedService,
                          plan.id,
                          "sellingPrice",
                          e.target.value
                        )
                      }
                      className="border border-gray-200 text-text-body rounded-sm py-2 md:py-5 w-20 md:w-24"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={plan.gold}
                      onChange={(e) =>
                        handlePlanUpdate(
                          selectedService,
                          plan.id,
                          "gold",
                          e.target.value
                        )
                      }
                      className="border border-gray-200 text-text-body rounded-sm py-2 md:py-5 w-20 md:w-24"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={plan.vtpass}
                      onChange={(e) =>
                        handlePlanUpdate(
                          selectedService,
                          plan.id,
                          "vtpass",
                          e.target.value
                        )
                      }
                      className="border border-gray-200 text-text-body rounded-sm py-2 md:py-5 w-20 md:w-24"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={plan.validity}
                      onChange={(e) =>
                        handlePlanUpdate(
                          selectedService,
                          plan.id,
                          "validity",
                          e.target.value
                        )
                      }
                      className="border border-gray-200 text-text-body rounded-sm py-2 md:py-5 w-20 md:w-24"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1 md:space-x-2">
                      <Button
                        variant="ghost"
                        className="h-6 w-6 md:h-8 md:w-8 p-0"
                      >
                        <Pencil className="h-3 w-3 md:h-4 md:w-4 text-gray-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        className="h-6 w-6 md:h-8 md:w-8 p-0"
                      >
                        <Trash2 className="h-3 w-3 md:h-4 md:w-4 text-red-500" />
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

export default ServicePlanManagement;
