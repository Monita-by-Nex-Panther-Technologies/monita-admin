"use client";
import type React from "react";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Sample data for eSim products
const esimProducts = [
  {
    id: "1",
    name: "Nigeria",
    flag: "NG",
    service: "eSim",
    minBuyAmount: "₦50",
    maxBuyAmount: "₦1,000",
    vendingMedium: "-",
    notice: "N/A",
  },
];

const ESimTable = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    setIsAddProductOpen(false);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 p-4 gap-4">
        <div className="flex flex-row justify-center items-center w-full md:w-auto">
          <input
            type="text"
            placeholder="Search"
            className="bg-background-alt border-border rounded-l-[8px] p-4 w-full md:w-[180px]"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button className="bg-primary rounded-r-[8px] p-4 px-6">
            <Search size={20} className="text-text-body" />
          </button>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <button className="border border-primary-300 bg-background text-text-body font-poppins px-4 md:px-6 py-3 rounded-[12px] text-sm md:text-base flex-1 md:flex-none">
            Manage Product
          </button>
          <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
            <DialogTrigger asChild>
              <button className="bg-primary text-text-body font-poppins px-4 md:px-6 py-3 rounded-[12px] font-medium flex gap-2 items-center text-sm md:text-base flex-1 md:flex-none">
                <Plus size={16} />
                Add Product
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] p-0 rounded-lg max-w-[90vw]">
              <div className="p-4 md:p-6">
                <div className="flex justify-between items-center">
                  <DialogTitle className="text-lg md:text-xl font-semibold">
                    Add Product
                  </DialogTitle>
                </div>
                <div className="h-px bg-gray-200 my-4 -mx-4 md:-mx-6"></div>
                <form onSubmit={handleAddProduct} className="space-y-6">
                  <div className="bg-gray-50 p-4 md:p-6 rounded-lg space-y-4">
                    <div className="space-y-2">
                      <label className="font-medium">Country</label>
                      <Select>
                        <SelectTrigger className="w-full bg-white">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="nigeria">Nigeria</SelectItem>
                          <SelectItem value="ghana">Ghana</SelectItem>
                          <SelectItem value="kenya">Kenya</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="font-medium">Provider</label>
                      <Select>
                        <SelectTrigger className="w-full bg-white">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="provider1">Provider 1</SelectItem>
                          <SelectItem value="provider2">Provider 2</SelectItem>
                          <SelectItem value="provider3">Provider 3</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="font-medium">Provider Id</label>
                      <Input placeholder="Enter id" className="bg-white" />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-text-body font-medium py-4 md:py-6"
                  >
                    Add Product
                  </Button>
                </form>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="overflow-x-auto w-full">
        <div className="min-w-full inline-block align-middle">
          <Table className="min-w-full">
            <TableHeader className="bg-primary-fade text-muted-foreground hover:bg-primary-fade">
              <TableRow>
                <TableHead className="text-sm md:text-base font-poppins text-text-title whitespace-nowrap">
                  Name
                </TableHead>
                <TableHead className="text-sm md:text-base font-poppins text-text-title whitespace-nowrap">
                  Service
                </TableHead>
                <TableHead className="text-sm md:text-base font-poppins text-text-title whitespace-nowrap">
                  Min Buy Amount
                </TableHead>
                <TableHead className="text-sm md:text-base font-poppins text-text-title whitespace-nowrap">
                  Max Buy Amount
                </TableHead>
                <TableHead className="text-sm md:text-base font-poppins text-text-title whitespace-nowrap">
                  Vending Medium
                </TableHead>
                <TableHead className="text-sm md:text-base font-poppins text-text-title whitespace-nowrap">
                  Notice
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {esimProducts.map((product) => (
                <TableRow key={product.id} className="py-4 md:py-6">
                  <TableCell className="text-text-body font-poppins text-sm md:text-base py-4 md:py-6 flex items-center gap-2 whitespace-nowrap">
                    <div className="w-6 h-6 md:w-8 md:h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-xs md:text-sm">
                        🇳🇬
                      </span>
                    </div>
                    {product.name}
                  </TableCell>
                  <TableCell className="text-text-body font-poppins text-sm md:text-base py-4 md:py-6 whitespace-nowrap">
                    {product.service}
                  </TableCell>
                  <TableCell className="text-text-body font-poppins text-sm md:text-base py-4 md:py-6 whitespace-nowrap">
                    {product.minBuyAmount}
                  </TableCell>
                  <TableCell className="text-text-body font-poppins text-sm md:text-base py-4 md:py-6 whitespace-nowrap">
                    {product.maxBuyAmount}
                  </TableCell>
                  <TableCell className="text-text-body font-poppins text-sm md:text-base py-4 md:py-6 whitespace-nowrap">
                    {product.vendingMedium}
                  </TableCell>
                  <TableCell className="text-text-body font-poppins text-sm md:text-base py-4 md:py-6 whitespace-nowrap">
                    {product.notice}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default ESimTable;
