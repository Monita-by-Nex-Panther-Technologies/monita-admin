"use client"
import type React from "react"
import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus } from "lucide-react"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

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
]

const ESimTable = () => {
    const [searchTerm, setSearchTerm] = useState<string>("")
    const [isAddProductOpen, setIsAddProductOpen] = useState(false)

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)
    }

    const handleAddProduct = (e: React.FormEvent) => {
        e.preventDefault()
        // Handle form submission
        setIsAddProductOpen(false)
    }

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-4 p-4">
                <div className="flex flex-row justify-center items-center">
                    <input
                        type="text"
                        placeholder="Search"
                        className="bg-background-alt border-border rounded-l-[8px] p-4 w-[180px]"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    <button className="bg-primary rounded-r-[8px] p-4 px-6">
                        <Search size={20} className="text-text-body" />
                    </button>
                </div>

                <div className="flex gap-4">
                    <button className="border border-primary-300 bg-background text-text-body font-poppins px-6 py-3 rounded-[12px]">
                        Manage Product
                    </button>
                    <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
                        <DialogTrigger asChild>
                            <button className="bg-primary text-text-body font-poppins px-6 py-3 rounded-[12px] font-medium flex gap-2 items-center">
                                <Plus size={16} />
                                Add Product
                            </button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px] p-0 rounded-lg">
                            <div className="p-6">
                                <div className="flex justify-between items-center">
                                    <DialogTitle className="text-xl font-semibold">Add Product</DialogTitle>

                                </div>
                                <div className="h-px bg-gray-200 my-4 -mx-6"></div>
                                <form onSubmit={handleAddProduct} className="space-y-6">
                                    <div className="bg-gray-50 p-6 rounded-lg space-y-4">
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
                                        className="w-full bg-primary hover:bg-primary/90 text-text-body font-medium py-6"
                                    >
                                        Add Product
                                    </Button>
                                </form>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="overflow-auto">
                <Table className="w-full">
                    <TableHeader className="bg-primary-fade text-muted-foreground hover:bg-primary-fade">
                        <TableRow>
                            <TableHead className="text-base font-poppins text-text-title">Name</TableHead>
                            <TableHead className="text-base font-poppins text-text-title">Service</TableHead>
                            <TableHead className="text-base font-poppins text-text-title">Min Buy Amount</TableHead>
                            <TableHead className="text-base font-poppins text-text-title">Max Buy Amount</TableHead>
                            <TableHead className="text-base font-poppins text-text-title">Vending Medium</TableHead>
                            <TableHead className="text-base font-poppins text-text-title">Notice</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {esimProducts.map((product) => (
                            <TableRow key={product.id} className="py-6">
                                <TableCell className="text-text-body font-poppins text-base py-6 flex items-center gap-2">
                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                        <span className="text-green-600 text-sm">🇳🇬</span>
                                    </div>
                                    {product.name}
                                </TableCell>
                                <TableCell className="text-text-body font-poppins text-base py-6">{product.service}</TableCell>
                                <TableCell className="text-text-body font-poppins text-base py-6">{product.minBuyAmount}</TableCell>
                                <TableCell className="text-text-body font-poppins text-base py-6">{product.maxBuyAmount}</TableCell>
                                <TableCell className="text-text-body font-poppins text-base py-6">{product.vendingMedium}</TableCell>
                                <TableCell className="text-text-body font-poppins text-base py-6">{product.notice}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default ESimTable

