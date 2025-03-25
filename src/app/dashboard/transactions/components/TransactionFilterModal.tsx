import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: {
    username: string;
    status: string;
    transactionType: string;
    startDate: Date | undefined;
    endDate: Date | undefined;
  }) => void;
}

const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  onApply,
}) => {
  const [username, setUsername] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [transactionType, setTransactionType] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const handleApply = () => {
    onApply({ username, status, transactionType, startDate, endDate });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md -mt-20 overflow-hidden shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Filter Transaction</h2>
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
        <div className="p-6">
          <div className="space-y-5">
            {/* Username Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Username</label>
              <Input
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full h-12 rounded-md border-gray-300"
              />
            </div>

            {/* Status Field with shadcn Select */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Select Status</label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-full h-12">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Successful">Successful</SelectItem>
                  <SelectItem value="Failed">Failed</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Transaction Type Field with shadcn Select */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Transaction Type
              </label>
              <Select
                value={transactionType}
                onValueChange={setTransactionType}
              >
                <SelectTrigger className="w-full h-12">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Airtime">Airtime</SelectItem>
                  <SelectItem value="Data">Data</SelectItem>
                  <SelectItem value="Electricity">Electricity</SelectItem>
                  <SelectItem value="Cable TV">Cable TV</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Range Fields */}
            <div className="grid grid-cols-2 gap-4">
              {/* Start Date */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Start Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full h-12 rounded-md border-gray-300 justify-start text-left font-normal pl-4 bg-white hover:bg-white"
                    >
                      {startDate ? format(startDate, "PP") : "Select"}
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
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* End Date */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">End Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full h-12 rounded-md border-gray-300 justify-start text-left font-normal pl-4 bg-white hover:bg-white"
                    >
                      {endDate ? format(endDate, "PP") : "Select"}
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
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </div>

        {/* Button */}
        <div className="p-6 pt-0">
          <Button
            onClick={handleApply}
            className="w-full h-12 rounded-md bg-yellow-100 hover:bg-yellow-200 text-black font-medium"
            variant="ghost"
          >
            Filter Transaction
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
