"use client";

import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useRolesStore } from "@/store/rolesStore";

interface FilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onApply: (filters: Partial<FilterCriteria>) => void;
}

export interface FilterCriteria {
    status: string;
    roleId: string;
    startDate: Date | undefined;
    endDate: Date | undefined;
}

const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onClose, onApply }) => {
    const { roles, isLoading: rolesLoading, getRoles } = useRolesStore();
    
    const { control, handleSubmit, reset } = useForm<FilterCriteria>({
        defaultValues: {
            status: "",
            roleId: "",
            startDate: undefined,
            endDate: undefined,
        },
    });

    // Fetch roles when the modal opens
    useEffect(() => {
        if (isOpen && roles.length === 0) {
            getRoles().catch(error => {
                console.error("Failed to load roles:", error);
            });
        }
    }, [isOpen, roles.length, getRoles]);

    const handleApply = (data: FilterCriteria) => {
        const filteredData = Object.fromEntries(
            Object.entries(data).filter(([_, value]) => value !== "" && value !== undefined)
        );
        reset();
        onApply(filteredData);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Filter Staff</DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleSubmit(handleApply)} className="space-y-5 py-4">
                    {/* Status Field */}
                    {/* <div className="space-y-2">
                        <label className="block text-sm font-medium">Status</label>
                        <Controller
                            name="status"
                            control={control}
                            render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="w-full h-12">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ACTIVE">Active</SelectItem>
                                        <SelectItem value="INACTIVE">Inactive</SelectItem>
                                        <SelectItem value="SUSPENDED">Suspended</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div> */}

                    <div className="space-y-2">
                        <label className="block text-sm font-medium">Role</label>
                        <Controller
                            name="roleId"
                            control={control}
                            render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange} disabled={rolesLoading}>
                                    <SelectTrigger className="w-full h-12">
                                        <SelectValue placeholder={rolesLoading ? "Loading roles..." : "Select role"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {roles.map((role) => (
                                            <SelectItem key={role.id} value={role.id}>
                                                {role.name}
                                            </SelectItem>
                                        ))}
                                        {roles.length === 0 && !rolesLoading && (
                                            <SelectItem value="" disabled>
                                                No roles available
                                            </SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>

                    {/* Date Range Fields */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Start Date */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium">Start Date</label>
                            <Controller
                                name="startDate"
                                control={control}
                                render={({ field }) => (
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className="w-full h-12 justify-start text-left font-normal"
                                            >
                                                {field.value ? format(field.value, "PP") : "Select"}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent
                                            className="w-auto p-0"
                                            align="start"
                                        >
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                )}
                            />
                        </div>

                        {/* End Date */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium">End Date</label>
                            <Controller
                                name="endDate"
                                control={control}
                                render={({ field }) => (
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className="w-full h-12 justify-start text-left font-normal"
                                            >
                                                {field.value ? format(field.value, "PP") : "Select"}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent
                                            className="w-auto p-0"
                                            align="start"
                                        >
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                )}
                            />
                        </div>
                    </div>
                </form>

                <DialogFooter>
                    {/* <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button> */}
                    <Button 
                        onClick={handleSubmit(handleApply)}
                        className="w-full h-12 rounded-md bg-yellow-100 hover:bg-yellow-200 text-black font-medium"
                        variant="ghost"
                    >
                        Filter Staff
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default FilterModal;