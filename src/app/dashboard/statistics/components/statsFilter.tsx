import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";
import React from "react";
import { Controller, useForm } from "react-hook-form";

interface StatFilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onApply: (filters: { startDate?: Date; endDate?: Date }) => void;
}

export interface StatFilterCriteria {
    startDate?: Date;
    endDate?: Date;
}

const StatFilterModal: React.FC<StatFilterModalProps> = ({ isOpen, onClose, onApply }) => {
    const { control, handleSubmit, reset } = useForm<StatFilterCriteria>(
        {
            defaultValues: {
                startDate: undefined,
                endDate: undefined,
            },
        }
    );

    const handleApply = (data: StatFilterCriteria) => {
        let filteredData = Object.fromEntries(
            Object.entries(data).filter(([_, value]) => value !== "" && value !== undefined)
        );

        reset();
        onApply(filteredData as StatFilterCriteria); // Pass the form data to the parent component
        onClose(); // Close the modal
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg w-full max-w-md -mt-20 overflow-hidden shadow-xl">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-xl font-semibold">Custom Date Range</h2>
                    <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full h-8 w-8 p-0 flex items-center justify-center bg-gray-100 border-none"
                        onClick={onClose}
                    >
                        <X size={16} className="text-gray-500" />
                    </Button>
                </div>

                {/* Filter Form */}
                <form onSubmit={handleSubmit(handleApply)} className="p-6 space-y-5">
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
                                                className="w-full h-12 rounded-md border-gray-300 justify-start text-left font-normal pl-4 bg-white hover:bg-white"
                                            >
                                                {field.value ? format(field.value, "PP") : "Select"}
                                                <CalendarIcon className="ml-auto h-4 w-4 text-gray-400" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent
                                            className="w-auto p-0"
                                            align="start"
                                            side="bottom"
                                            sideOffset={5}
                                            avoidCollisions={false}
                                        >
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
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
                                                className="w-full h-12 rounded-md border-gray-300 justify-start text-left font-normal pl-4 bg-white hover:bg-white"
                                            >
                                                {field.value ? format(field.value, "PP") : "Select"}
                                                <CalendarIcon className="ml-auto h-4 w-4 text-gray-400" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent
                                            className="w-auto p-0"
                                            align="start"
                                            side="bottom"
                                            sideOffset={5}
                                            avoidCollisions={false}
                                        >
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                )}
                            />
                        </div>
                    </div>

                    {/* Apply Button */}
                    <Button
                        type="submit"
                        className="w-full h-12 rounded-md bg-yellow-100 hover:bg-yellow-200 text-black font-medium"
                        variant="ghost"
                    >
                        Apply Filter
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default StatFilterModal;