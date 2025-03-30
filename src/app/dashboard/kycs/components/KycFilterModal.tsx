import React, { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";

interface FilterCriteria {
  username: string;
  status: string;
  kycLevel: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
}

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterCriteria) => void;
}

// Define valid status and KYC level types for better type safety
type Status = "all" | "Approved" | "Pending" | "Rejected";
type KycLevel = "all" | "Tier 1" | "Tier 2" | "Tier 3";

const KycFilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  onApply,
}) => {
  const [filters, setFilters] = useState<FilterCriteria>({
    username: "",
    status: "all",
    kycLevel: "all",
    startDate: undefined,
    endDate: undefined,
  });

  // Type-safe handle change function with overloads
  const handleChange = <K extends keyof FilterCriteria>(
    field: K,
    value: FilterCriteria[K]
  ): void => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleApply = (): void => {
    // Convert "all" values to empty strings before passing to parent component
    const adjustedFilters = {
      ...filters,
      status: filters.status === "all" ? "" : filters.status,
      kycLevel: filters.kycLevel === "all" ? "" : filters.kycLevel,
    };
    onApply(adjustedFilters);
    onClose();
  };

  const handleResetFilters = (): void => {
    setFilters({
      username: "",
      status: "all",
      kycLevel: "all",
      startDate: undefined,
      endDate: undefined,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-background p-4 sm:p-6 rounded-lg shadow-lg w-[95%] max-w-md mx-auto overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Filter KYC Applications</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-3 sm:space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <Input
              value={filters.username}
              onChange={(e) => handleChange("username", e.target.value)}
              placeholder="Enter username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">KYC Status</label>
            <Select
              value={filters.status}
              onValueChange={(value: Status) => handleChange("status", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">KYC Level</label>
            <Select
              value={filters.kycLevel}
              onValueChange={(value: KycLevel) =>
                handleChange("kycLevel", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select KYC level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="Tier 1">Tier 1</SelectItem>
                <SelectItem value="Tier 2">Tier 2</SelectItem>
                <SelectItem value="Tier 3">Tier 3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  {filters.startDate
                    ? format(filters.startDate, "PPP")
                    : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={filters.startDate}
                  onSelect={(date: Date | undefined) =>
                    handleChange("startDate", date)
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">End Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  {filters.endDate
                    ? format(filters.endDate, "PPP")
                    : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={filters.endDate}
                  onSelect={(date: Date | undefined) =>
                    handleChange("endDate", date)
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={handleResetFilters}
              className="flex-1"
            >
              Reset
            </Button>
            <Button onClick={handleApply} className="flex-1">
              Apply Filters
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KycFilterModal;
