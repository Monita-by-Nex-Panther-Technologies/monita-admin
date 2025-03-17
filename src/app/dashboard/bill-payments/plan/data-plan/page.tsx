"use client"

import React, { useState } from 'react';

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

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Pencil, Trash2, Plus } from "lucide-react";

const DataPlanManagement = () => {
    const [selectedNetwork, setSelectedNetwork] = useState("MTN");

    // Different plans for different networks
    const networkPlans = {
        "MTN": [
            { id: 1, size: 500, unit: "MB", disabled: false, hotDeal: false, costPrice: "₦500", sellingPrice: "₦550", gold: "₦540", simServer: "", validity: "30 days" },
            { id: 2, size: 500, unit: "MB", disabled: false, hotDeal: false, costPrice: "₦500", sellingPrice: "₦550", gold: "₦540", simServer: "", validity: "30 days" },
            { id: 3, size: 500, unit: "MB", disabled: false, hotDeal: false, costPrice: "₦500", sellingPrice: "₦550", gold: "₦540", simServer: "", validity: "30 days" },
            { id: 4, size: 500, unit: "MB", disabled: false, hotDeal: false, costPrice: "₦500", sellingPrice: "₦550", gold: "₦540", simServer: "", validity: "30 days" },
            { id: 5, size: 500, unit: "MB", disabled: false, hotDeal: false, costPrice: "₦500", sellingPrice: "₦550", gold: "₦540", simServer: "", validity: "30 days" },
            { id: 6, size: 500, unit: "MB", disabled: false, hotDeal: false, costPrice: "₦500", sellingPrice: "₦550", gold: "₦540", simServer: "", validity: "30 days" },
        ],
        "GLO": [
            { id: 1, size: 1000, unit: "MB", disabled: false, hotDeal: true, costPrice: "₦600", sellingPrice: "₦650", gold: "₦630", simServer: "", validity: "30 days" },
            { id: 2, size: 2000, unit: "MB", disabled: false, hotDeal: false, costPrice: "₦900", sellingPrice: "₦950", gold: "₦930", simServer: "", validity: "30 days" },
        ],
        "9moboile": [
            { id: 1, size: 1500, unit: "MB", disabled: true, hotDeal: false, costPrice: "₦700", sellingPrice: "₦750", gold: "₦730", simServer: "", validity: "30 days" },
        ],
        "Airtel": [
            { id: 1, size: 2500, unit: "MB", disabled: false, hotDeal: true, costPrice: "₦800", sellingPrice: "₦850", gold: "₦830", simServer: "", validity: "30 days" },
            { id: 2, size: 5000, unit: "MB", disabled: false, hotDeal: false, costPrice: "₦1500", sellingPrice: "₦1600", gold: "₦1550", simServer: "", validity: "30 days" },
        ]
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
        const planIndex = updatedPlans[networkName].findIndex(plan => plan.id === planId);

        if (planIndex !== -1) {
            updatedPlans[networkName][planIndex] = {
                ...updatedPlans[networkName][planIndex],
                [field]: value
            };
            setDataPlans(updatedPlans);
        }
    };

    const networks = [
        { name: "MTN", logo: "https://upload.wikimedia.org/wikipedia/commons/9/93/New_MTN_logo.svg", color: "#FFCC00" },
        { name: "GLO", logo: "https://upload.wikimedia.org/wikipedia/en/8/86/Globacom_limited_logo.svg", color: "#008751" },
        { name: "9moboile", logo: "", color: "#009900" },
        { name: "Airtel", logo: "https://upload.wikimedia.org/wikipedia/commons/7/72/Airtel_logo.svg", color: "#FF0000" }
    ];

    return (
        <>
            {/* Network Selection */}
            <div className="grid grid-cols-4 w-full items-center gap-4 mb-8">
                {networks.map((network) => (
                    <div
                        key={network.name}
                        className={`flex items-center px-3 py-4 mt-5 rounded-lg cursor-pointer ${selectedNetwork === network.name ? 'bg-primary-alpha-8 border border-primary' : 'bg-background border border-gray-200'}`}
                        onClick={() => setSelectedNetwork(network.name)}
                    >
                        <div
                            className="w-8 h-8 flex items-center justify-center rounded-full mr-2"
                            style={{ backgroundColor: network.color }}
                        >
                            {network.name === "MTN" && <span className="text-xs font-bold text-black">MTN</span>}
                            {network.name === "GLO" && <span className="text-xs font-bold text-white">glo</span>}
                            {network.name === "9moboile" && <span className="text-xs text-white">9</span>}
                            {network.name === "Airtel" && <span className="text-xs text-white">A</span>}
                        </div>
                        <span className="font-medium text-gray-700">{network.name}</span>
                    </div>
                ))}
            </div>

            <div className="w-full mx-auto bg-white rounded-lg">
                {/* Data Plan Header */}
                <div className="flex justify-between items-center mb-6 p-6">
                    <h1 className="text-2xl font-bold text-gray-800">Data Plan - {selectedNetwork}</h1>
                    <div className="flex flex-row space-x-4">
                        <Button variant="outline" className="border border-gray-200 text-text-title w-[182px] h-[48px] hover:bg-gray-50 rounded-md px-6 py-5">
                            Save Changes
                        </Button>
                        <Button className="bg-primary text-text-title text-[16px] flex flex-row w-[182px] h-[48px] gap-1 font-normal font-poppins rounded-md px-4 py-3">
                            <Plus className="h-5 w-5 mr-2" />
                            Add Plan
                        </Button>
                    </div>
                </div>

                {/* Data Plan Table */}
                <Table className="w-full">
                    <TableHeader>
                        <TableRow className="bg-primary-alpha-8 hover:bg-primary-alpha-8 border-b border-gray-200">
                            <TableHead className="font-medium text-[16px] text-gray-700 py-3 pl-4">Data Plan</TableHead>
                            <TableHead className="font-medium text-[16px] text-gray-700 py-3">Disable</TableHead>
                            <TableHead className="font-medium text-[16px] text-gray-700 py-3">Hot Deal</TableHead>
                            <TableHead className="font-medium text-[16px] text-gray-700 py-3">Cost Price</TableHead>
                            <TableHead className="font-medium text-[16px] text-gray-700 py-3">Selling Price</TableHead>
                            <TableHead className="font-medium text-[16px] text-gray-700 py-3">Gold</TableHead>
                            <TableHead className="font-medium text-[16px] text-gray-700 py-3">Sim server</TableHead>
                            <TableHead className="font-medium text-[16px] text-gray-700 py-3">Validity</TableHead>
                            <TableHead className="font-medium text-[16px] text-gray-700 py-3">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {dataPlans[selectedNetwork].map((plan) => (
                            <TableRow key={plan.id} className="border-b border-gray-200">
                                <TableCell className="py-5">
                                    <div className="flex items-center bg-background-alt w-fit rounded-sm p-1 gap-1">
                                        <Input
                                            type="number"
                                            value={plan.size}
                                            onChange={(e) => handlePlanUpdate(selectedNetwork, plan.id, 'size', parseInt(e.target.value))}
                                            className="text-gray-700 rounded bg-background w-18 text-center"
                                        />
                                        <div className="relative">
                                            <Select
                                                value={plan.unit}
                                                onValueChange={(value) => handlePlanUpdate(selectedNetwork, plan.id, 'unit', value)}
                                            >
                                                <SelectTrigger className="w-18 text-text-body border-0 bg-background-alt">
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
                                        onCheckedChange={(checked) => handlePlanUpdate(selectedNetwork, plan.id, 'disabled', checked)}
                                        className="scale-125 data-[state=checked]:bg-primary"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Switch
                                        checked={plan.hotDeal}
                                        onCheckedChange={(checked) => handlePlanUpdate(selectedNetwork, plan.id, 'hotDeal', checked)}
                                        className="scale-125 data-[state=checked]:bg-primary"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Input
                                        value={plan.costPrice}
                                        onChange={(e) => handlePlanUpdate(selectedNetwork, plan.id, 'costPrice', e.target.value)}
                                        className="border border-gray-200 text-text-body rounded-sm py-5 w-24"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Input
                                        value={plan.sellingPrice}
                                        onChange={(e) => handlePlanUpdate(selectedNetwork, plan.id, 'sellingPrice', e.target.value)}
                                        className="border border-gray-200 text-text-body rounded-sm py-5 w-24"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Input
                                        value={plan.gold}
                                        onChange={(e) => handlePlanUpdate(selectedNetwork, plan.id, 'gold', e.target.value)}
                                        className="border border-gray-200 text-text-body rounded-sm py-5 w-24"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Input
                                        value={plan.simServer}
                                        onChange={(e) => handlePlanUpdate(selectedNetwork, plan.id, 'simServer', e.target.value)}
                                        className="border border-gray-200 text-text-body rounded-sm py-5 w-32"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Input
                                        value={plan.validity}
                                        onChange={(e) => handlePlanUpdate(selectedNetwork, plan.id, 'validity', e.target.value)}
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

export default DataPlanManagement;