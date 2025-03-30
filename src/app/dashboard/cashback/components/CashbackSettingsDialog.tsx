import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Calendar } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
// import { useToast } from "@/hooks/use-toast";

interface CashbackSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CashbackSettingsDialog: React.FC<CashbackSettingsDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const [transactionType, setTransactionType] = useState<string>("");
  const [cashbackPercentage, setCashbackPercentage] = useState<string>("");
  const [minTransactionAmount, setMinTransactionAmount] = useState<string>("");
  const [maxCashbackCap, setMaxCashbackCap] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  // const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Here you would typically send this data to your backend
    toast.success(
      "Cashback settings updated. Your cashback settings have been successfully updated."
    );
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-w-[95vw] p-0 overflow-hidden bg-white rounded-xl mx-2 sm:mx-auto">
        <div className="p-4 sm:p-6 pb-0">
          <div className="flex items-center justify-between mb-1">
            <DialogTitle className="text-lg sm:text-xl font-semibold">
              Cashback Settings
            </DialogTitle>
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-2 border-0"
              onClick={() => onOpenChange(false)}
            >
              <span className="mr-2 text-sm font-normal text-gray-500 hidden sm:inline">
                Close
              </span>
              <X className="h-4 w-4 text-gray-500" />
            </Button>
          </div>
          <div className="h-px w-[calc(100%+32px)] sm:w-[calc(100%+48px)] bg-gray-200 -mx-4 sm:-mx-6 mt-4"></div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-4 sm:p-6 space-y-4 sm:space-y-5"
        >
          <div className="space-y-2">
            <label className="text-sm font-medium">Transaction Type</label>
            <Select value={transactionType} onValueChange={setTransactionType}>
              <SelectTrigger className="w-full h-10 border-gray-200">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Transactions</SelectItem>
                <SelectItem value="retail">Retail</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="dining">Dining</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Cashback Percentage</label>
            <Input
              placeholder="Enter value"
              value={cashbackPercentage}
              onChange={(e) => setCashbackPercentage(e.target.value)}
              className="h-10 border-gray-200"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Min Transaction Amount
            </label>
            <Input
              placeholder="Enter value"
              value={minTransactionAmount}
              onChange={(e) => setMinTransactionAmount(e.target.value)}
              className="h-10 border-gray-200"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Max Cashback Cap</label>
            <Input
              placeholder="Enter value"
              value={maxCashbackCap}
              onChange={(e) => setMaxCashbackCap(e.target.value)}
              className="h-10 border-gray-200"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Start Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-between font-normal h-10 border-gray-200 hover:bg-transparent",
                      !startDate && "text-gray-500"
                    )}
                  >
                    {startDate ? format(startDate, "PPP") : "Select"}
                    <Calendar className="h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">End Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-between font-normal h-10 border-gray-200 hover:bg-transparent",
                      !endDate && "text-gray-500"
                    )}
                  >
                    {endDate ? format(endDate, "PPP") : "Select"}
                    <Calendar className="h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-10 sm:h-12 rounded-full font-medium mt-6 bg-[#F7FCC5] hover:bg-[#F0F5B0] text-black"
          >
            Set Cashback
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CashbackSettingsDialog;
