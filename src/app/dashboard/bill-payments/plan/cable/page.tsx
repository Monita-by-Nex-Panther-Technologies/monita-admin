"use client"

import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

type PlanType = {
    id: number;
    name: string;
    disabled: boolean;
    costPrice: string;
    sellingPrice: string;
    commission: string; // Added Commission field
    validity: string;
    package: string; // Added Package field
};

type ServiceProviderType = {
    [key: string]: PlanType[];
};

type ServiceType = {
    name: string;
    color: string;
};

const CablePlanManagement = () => {
    const [selectedService, setSelectedService] = useState<string>("Showmax"); // Default to Showmax
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newPlan, setNewPlan] = useState({
        name: '',
        package: '', // Added Package field
        costPrice: '',
        sellingPrice: '',
        commission: '', // Added Commission field
        validity: ''
    });

    const serviceProviders: ServiceProviderType = {
        "Showmax": [
            { id: 1, name: "Mobile", disabled: false, costPrice: "₦1200", sellingPrice: "₦1300", commission: "₦50", validity: "30 days", package: "Basic" },
            { id: 2, name: "Mobile Pro", disabled: false, costPrice: "₦2500", sellingPrice: "₦2600", commission: "₦100", validity: "30 days", package: "Premium" },
        ],
        "DSTV": [
            { id: 1, name: "Compact", disabled: false, costPrice: "₦5000", sellingPrice: "₦5200", commission: "₦200", validity: "30 days", package: "Basic" },
            { id: 2, name: "Compact Plus", disabled: false, costPrice: "₦7000", sellingPrice: "₦7200", commission: "₦300", validity: "30 days", package: "Premium" },
        ],
        "GOTV": [
            { id: 1, name: "Jolli", disabled: false, costPrice: "₦1500", sellingPrice: "₦1600", commission: "₦50", validity: "30 days", package: "Basic" },
            { id: 2, name: "Jinja", disabled: false, costPrice: "₦2500", sellingPrice: "₦2600", commission: "₦100", validity: "30 days", package: "Premium" },
        ],
        "Startimes": [
            { id: 1, name: "Nova", disabled: false, costPrice: "₦1200", sellingPrice: "₦1300", commission: "₦50", validity: "30 days", package: "Basic" },
            { id: 2, name: "Basic", disabled: false, costPrice: "₦1800", sellingPrice: "₦1900", commission: "₦100", validity: "30 days", package: "Premium" },
        ],
    };

    const services: ServiceType[] = [
        { name: "Showmax", color: "#FF0000" },
        { name: "DSTV", color: "#192F59" },
        { name: "GOTV", color: "#009900" },
        { name: "Startimes", color: "#FFA500" },
    ];

    const [servicePlans, setServicePlans] = useState<ServiceProviderType>(serviceProviders);

    const handlePlanUpdate = (
        serviceName: string,
        planId: number,
        field: keyof PlanType,
        value: string | boolean // Union type for possible values
    ) => {
        const updatedPlans = { ...servicePlans };
        const planIndex = updatedPlans[serviceName].findIndex(plan => plan.id === planId);

        if (planIndex !== -1) {
            updatedPlans[serviceName][planIndex] = {
                ...updatedPlans[serviceName][planIndex],
                [field]: value
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
            commission: newPlan.commission, // Added Commission field
            validity: newPlan.validity,
            package: newPlan.package // Added Package field
        });
        setServicePlans(updatedPlans);
        setIsDialogOpen(false);
        setNewPlan({
            name: '',
            package: '', // Reset Package field
            costPrice: '',
            sellingPrice: '',
            commission: '', // Reset Commission field
            validity: ''
        });
    };

    const isAddButtonDisabled = !newPlan.name || !newPlan.package || !newPlan.costPrice || !newPlan.sellingPrice || !newPlan.commission || !newPlan.validity;

    return (
        <>
            <div className="grid grid-cols-4 w-full items-center gap-4 mb-8">
                {services.map((service) => (
                    <div
                        key={service.name}
                        className={`flex items-center px-3 py-4 mt-5 rounded-lg cursor-pointer ${selectedService === service.name ? 'bg-primary-alpha-8 border border-primary' : 'bg-background border border-gray-200'}`}
                        onClick={() => setSelectedService(service.name)}
                    >
                        <div
                            className="w-8 h-8 flex items-center justify-center rounded-full mr-2"
                            style={{ backgroundColor: service.color }}
                        >
                            <span className="text-xs font-bold text-white">{service.name[0]}</span>
                        </div>
                        <span className="font-medium text-gray-700">{service.name}</span>
                    </div>
                ))}
            </div>

            <div className="w-full mx-auto bg-white rounded-lg">
                <div className="flex justify-between items-center mb-6 p-6">
                    <h1 className="text-2xl font-bold text-gray-800">Cable - {selectedService}</h1>
                    <div className="flex flex-row space-x-4">
                        <Button variant="outline" className="border border-gray-200 text-text-title w-[182px] h-[48px] hover:bg-gray-50 rounded-md px-6 py-5">
                            Save Changes
                        </Button>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-primary text-text-title text-[16px] flex flex-row w-[182px] h-[48px] gap-1 font-normal font-poppins rounded-md px-4 py-3">
                                    <Plus className="h-5 w-5 mr-2" />
                                    Add Plan
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add Cable Plan</DialogTitle>
                                    <hr className="my-4 border-gray-200" />
                                </DialogHeader>
                                <div className="space-y-4">
                                    {/* Product (Full Width) */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-text-title">Product</label>
                                        <Input
                                            placeholder="Enter Product"
                                            value={newPlan.name}
                                            onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                                            className="p-3 w-full"
                                        />
                                    </div>

                                    {/* Two Columns for Package, Selling Price, Cost Price, Commission */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-text-title">Package</label>
                                            <Input
                                                placeholder="Enter Package"
                                                value={newPlan.package}
                                                onChange={(e) => setNewPlan({ ...newPlan, package: e.target.value })}
                                                className="p-3"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-text-title">Selling Price</label>
                                            <Input
                                                placeholder="Enter Selling Price"
                                                value={newPlan.sellingPrice}
                                                onChange={(e) => setNewPlan({ ...newPlan, sellingPrice: e.target.value })}
                                                className="p-3"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-text-title">Cost Price</label>
                                            <Input
                                                placeholder="Enter Cost Price"
                                                value={newPlan.costPrice}
                                                onChange={(e) => setNewPlan({ ...newPlan, costPrice: e.target.value })}
                                                className="p-3"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-text-title">Commission</label>
                                            <Input
                                                placeholder="Enter Commission"
                                                value={newPlan.commission}
                                                onChange={(e) => setNewPlan({ ...newPlan, commission: e.target.value })}
                                                className="p-3"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    onClick={handleAddPlan}
                                    disabled={isAddButtonDisabled}
                                    className="w-full mt-4 text-text-title"
                                >
                                    Save Changes
                                </Button>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                <Table className="w-full">
                    <TableHeader>
                        <TableRow className="bg-primary-alpha-8 hover:bg-primary-alpha-8 border-b border-gray-200">
                            <TableHead className="font-medium text-[16px] text-gray-700 py-3 pl-4">Product</TableHead>
                            <TableHead className="font-medium text-[16px] text-gray-700 py-3">Package</TableHead>
                            <TableHead className="font-medium text-[16px] text-gray-700 py-3">Selling Price</TableHead>
                            <TableHead className="font-medium text-[16px] text-gray-700 py-3">Cost Price</TableHead>
                            <TableHead className="font-medium text-[16px] text-gray-700 py-3">Commission</TableHead>
                            <TableHead className="font-medium text-[16px] text-gray-700 py-3">Validity</TableHead>
                            <TableHead className="font-medium text-[16px] text-gray-700 py-3">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {servicePlans[selectedService].map((plan) => (
                            <TableRow key={plan.id} className="border-b border-gray-200">
                                <TableCell className="py-5">
                                    <Input
                                        value={plan.name}
                                        onChange={(e) => handlePlanUpdate(selectedService, plan.id, 'name', e.target.value)}
                                        className="border border-gray-200 text-text-body rounded-sm py-5 w-32"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Input
                                        value={plan.package}
                                        onChange={(e) => handlePlanUpdate(selectedService, plan.id, 'package', e.target.value)}
                                        className="border border-gray-200 text-text-body rounded-sm py-5 w-32"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Input
                                        value={plan.sellingPrice}
                                        onChange={(e) => handlePlanUpdate(selectedService, plan.id, 'sellingPrice', e.target.value)}
                                        className="border border-gray-200 text-text-body rounded-sm py-5 w-24"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Input
                                        value={plan.costPrice}
                                        onChange={(e) => handlePlanUpdate(selectedService, plan.id, 'costPrice', e.target.value)}
                                        className="border border-gray-200 text-text-body rounded-sm py-5 w-24"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Input
                                        value={plan.commission}
                                        onChange={(e) => handlePlanUpdate(selectedService, plan.id, 'commission', e.target.value)}
                                        className="border border-gray-200 text-text-body rounded-sm py-5 w-24"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Input
                                        value={plan.validity}
                                        onChange={(e) => handlePlanUpdate(selectedService, plan.id, 'validity', e.target.value)}
                                        className="border border-gray-200 text-text-body rounded-sm py-5 w-24"
                                    />
                                </TableCell>
                                <TableCell>
                                    <div className="flex space-x-2">
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <Pencil className="h-4 w-4 text-gray-500" />
                                        </Button>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </>
    );
};

export default CablePlanManagement;