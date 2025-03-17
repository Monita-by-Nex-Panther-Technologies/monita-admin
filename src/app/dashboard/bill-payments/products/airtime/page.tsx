"use client"
import type React from "react"
import { useState, type ChangeEvent } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Search, Plus } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

// Define types for the product data
interface Product {
    id: number
    name: string
    service: string
    minBuyAmount: string
    maxBuyAmount: string
    vendingMedium: string
    notice: string
    logo: string
}

// Define types for the Manage Product Modal props
interface ManageProductModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    discountRate: string
    setDiscountRate: (value: string) => void
    status: string
    setStatus: (value: string) => void
    cashbackEnabled: boolean
    setCashbackEnabled: (value: boolean) => void
    onSave: () => void
}

// Define types for the Add Product Modal props
interface AddProductModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    serviceName: string
    setServiceName: (value: string) => void
    productName: string
    setProductName: (value: string) => void
    productNote: string
    setProductNote: (value: string) => void
    provider: string
    setProvider: (value: string) => void
    providerId: string
    setProviderId: (value: string) => void
    onAdd: () => void
}

// Manage Product Modal Component
const ManageProductModal: React.FC<ManageProductModalProps> = ({
    open,
    onOpenChange,
    discountRate,
    setDiscountRate,
    status,
    setStatus,
    cashbackEnabled,
    setCashbackEnabled,
    onSave,
}) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
                <div className="p-6 pb-0">
                    <div className="flex justify-between items-center">
                        <DialogTitle className="text-2xl font-bold">Manage Product</DialogTitle>
                    </div>
                </div>

                <div className="h-[1px] bg-gray-200 w-full my-6"></div>

                <div className="p-6 pt-0">
                    <div className="bg-white p-6 rounded-lg">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <h3 className="text-lg font-semibold">Set Discount rate</h3>
                                <Input
                                    value={discountRate}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setDiscountRate(e.target.value)}
                                    className="h-16 text-lg rounded-lg border-gray-300"
                                />
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-lg font-semibold">Select Status</h3>
                                <div className="relative">
                                    <Select value={status} onValueChange={setStatus} >
                                        <SelectTrigger className="h-16 w-full text-lg rounded-lg border-gray-300 flex justify-between items-center">
                                            <SelectValue placeholder="Select" className="w-full" />
                                            {/* <ChevronDown className="h-5 w-5 opacity-50" /> */}
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="inactive">Inactive</SelectItem>
                                            <SelectItem value="pending">Pending</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="bg-gray-100 p-4 rounded-lg flex items-center justify-between">
                                <span className="text-lg font-medium">Enable or Disable Cashback</span>
                                <Switch
                                    checked={cashbackEnabled}
                                    onCheckedChange={setCashbackEnabled}
                                    className="data-[state=checked]:bg-primary"
                                />
                            </div>
                        </div>
                    </div>

                    <Button
                        onClick={onSave}
                        className="w-full mt-6 h-16 text-lg font-semibold bg-[#d0f154] hover:bg-[#c5e64a] text-black rounded-full"
                    >
                        Save Changes
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

// Add Product Modal Component
const AddProductModal: React.FC<AddProductModalProps> = ({
    open,
    onOpenChange,
    serviceName,
    setServiceName,
    productName,
    setProductName,
    productNote,
    setProductNote,
    provider,
    setProvider,
    providerId,
    setProviderId,
    onAdd,
}) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange} >
            <DialogContent className="sm:max-w-[500px] p-0 overflow-auto max-h-[90vh]  dialog-no-default-close-button">
                <div className="p-4 pb-0">
                    <div className="flex  flex-col justify-center items-start w-[90%]">
                        <DialogTitle className="text-2xl font-bold">Add Product</DialogTitle>
                        <div className="h-[1px] bg-gray-200 w-full flex mt-3 mx-auto"></div>
                    </div>
                </div>


                <div className="p-4 pt-4 bg-background-alt">
                    <div className="bg-white rounded-lg px-4 py-6">
                        <div className="space-y-3">
                            <div className="space-y-1">
                                <Label htmlFor="serviceName" className="text-sm font-medium">
                                    Service Name
                                </Label>
                                <Select value={serviceName} onValueChange={setServiceName}>
                                    <SelectTrigger id="serviceName" className="h-10 w-full text-sm rounded-lg border-gray-300">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="airtime">Airtime</SelectItem>
                                        <SelectItem value="data">Data</SelectItem>
                                        <SelectItem value="electricity">Electricity</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="productName" className="text-sm font-medium">
                                    Product Name
                                </Label>
                                <Input
                                    id="productName"
                                    value={productName}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setProductName(e.target.value)}
                                    placeholder="Enter Name"
                                    className="h-10 text-sm rounded-lg border-gray-300"
                                />
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="productNote" className="text-sm font-medium">
                                    Product Note
                                </Label>
                                <Textarea
                                    id="productNote"
                                    value={productNote}
                                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setProductNote(e.target.value)}
                                    placeholder="Enter Note"
                                    className="min-h-[60px] text-sm rounded-lg border-gray-300 resize-none"
                                />
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="provider" className="text-sm font-medium">
                                    Provider
                                </Label>
                                <Select value={provider} onValueChange={setProvider}>
                                    <SelectTrigger id="provider" className="h-10 w-full text-sm rounded-lg border-gray-300">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="vtpass">Vtpass</SelectItem>
                                        <SelectItem value="flutterwave">Flutterwave</SelectItem>
                                        <SelectItem value="paystack">Paystack</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="providerId" className="text-sm font-medium">
                                    Provider Id
                                </Label>
                                <Input
                                    id="providerId"
                                    value={providerId}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setProviderId(e.target.value)}
                                    placeholder="Enter Id"
                                    className="h-10 text-sm rounded-lg border-gray-300"
                                />
                            </div>
                        </div>
                    </div>


                </div>
                <div className=" bg-background w-full pt-1 my-auto justify-center items-center">

                    <Button
                        onClick={onAdd}
                        className="w-[80%] mx-auto flex my-auto mt-4 mb-4 h-12 text-base font-semibold bg-[#f0ffc2] hover:bg-[#e5f5b7] text-black rounded-full"
                    >
                        Add Product
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

const ProductsTable: React.FC = () => {
    // Sample product data from the image
    const products: Product[] = [
        {
            id: 1,
            name: "MTN",
            service: "Airtime",
            minBuyAmount: "₦50",
            maxBuyAmount: "₦1,000",
            vendingMedium: "Vtpass",
            notice: "N/A",
            logo: "/mtn-logo.png",
        },
        {
            id: 2,
            name: "Glo",
            service: "Airtime",
            minBuyAmount: "₦50",
            maxBuyAmount: "₦1,000",
            vendingMedium: "Vtpass",
            notice: "N/A",
            logo: "/glo-logo.png",
        },
        {
            id: 3,
            name: "Airtel",
            service: "Airtime",
            minBuyAmount: "₦50",
            maxBuyAmount: "₦1,000",
            vendingMedium: "Vtpass",
            notice: "N/A",
            logo: "/airtel-logo.png",
        },
        {
            id: 4,
            name: "9mobile",
            service: "Airtime",
            minBuyAmount: "₦50",
            maxBuyAmount: "₦1,000",
            vendingMedium: "Vtpass",
            notice: "N/A",
            logo: "/9mobile-logo.png",
        },
    ]

    const [searchTerm, setSearchTerm] = useState<string>("")
    const [manageProductOpen, setManageProductOpen] = useState<boolean>(false)
    const [addProductOpen, setAddProductOpen] = useState<boolean>(false)

    // Manage Product state
    const [discountRate, setDiscountRate] = useState<string>("10%")
    const [status, setStatus] = useState<string>("")
    const [cashbackEnabled, setCashbackEnabled] = useState<boolean>(false)

    // Add Product state
    const [serviceName, setServiceName] = useState<string>("")
    const [productName, setProductName] = useState<string>("")
    const [productNote, setProductNote] = useState<string>("")
    const [provider, setProvider] = useState<string>("")
    const [providerId, setProviderId] = useState<string>("")

    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)
    }

    const handleSaveChanges = () => {
        // Handle saving changes
        console.log({ discountRate, status, cashbackEnabled })
        setManageProductOpen(false)
    }

    const handleAddProduct = () => {
        // Handle adding product
        console.log({ serviceName, productName, productNote, provider, providerId })
        setAddProductOpen(false)
    }

    return (
        <div className="w-full bg-background py-6 rounded-sm">
            {/* Header with search and buttons */}
            <div className="flex justify-between items-center mb-6 w-full px-8">
                <div className="flex flex-row justify-center items-center">
                    <input
                        type="text"
                        placeholder="Search"
                        className="bg-background-alt border-border rounded-l-[8px] p-4"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    <button className="bg-primary rounded-r-[8px] p-4 px-6">
                        <Search size={24} className="text-text-body" />
                    </button>
                </div>
                <div className="flex gap-4 items-center">
                    <Button
                        className="bg-white text-text-title border border-primary rounded-lg px-6 py-6 font-medium hover:bg-primary-fade"
                        onClick={() => setManageProductOpen(true)}
                    >
                        Manage Product
                    </Button>
                    <Button
                        className="bg-primary text-text-body rounded-lg px-6 py-6 font-medium hover:bg-primary/90 flex items-center gap-2"
                        onClick={() => setAddProductOpen(true)}
                    >
                        <Plus size={20} />
                        Add Product
                    </Button>
                </div>
            </div>

            {/* Products Table */}
            <div className="overflow-auto">
                <Table className="w-full">
                    <TableHeader className="bg-primary-fade text-muted-foreground hover:bg-primary-fade ml-5 py-4">

                        <TableRow className="py-4">
                            <TableHead className="text-base font-poppins text-text-title pl-8">Name</TableHead>
                            <TableHead className="text-base font-poppins text-text-title">Service</TableHead>
                            <TableHead className="text-base font-poppins text-text-title">Min Buy Amount</TableHead>
                            <TableHead className="text-base font-poppins text-text-title">Max Buy Amount</TableHead>
                            <TableHead className="text-base font-poppins text-text-title">Vending Medium</TableHead>
                            <TableHead className="text-base font-poppins text-text-title">Notice</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="py-6">
                        {products.map((product) => (
                            <TableRow key={product.id} className="border-t-2">
                                <TableCell className="py-4 pl-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-primary-fade rounded-full flex items-center justify-center overflow-hidden">
                                            {product.name === "MTN" && (
                                                <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center">
                                                    <span className="text-xs font-bold">MTN</span>
                                                </div>
                                            )}
                                            {product.name === "Glo" && (
                                                <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center">
                                                    <span className="text-xs font-bold text-white">glo</span>
                                                </div>
                                            )}
                                            {product.name === "Airtel" && (
                                                <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center">
                                                    <span className="text-xs font-bold text-white">A</span>
                                                </div>
                                            )}
                                            {product.name === "9mobile" && (
                                                <div className="w-6 h-6 rounded-full bg-green-400 flex items-center justify-center">
                                                    <span className="text-xs font-bold text-white">9</span>
                                                </div>
                                            )}
                                        </div>
                                        <span className="text-base font-medium text-text-body">{product.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-text-body font-poppins text-base py-6 ">{product.service}</TableCell>
                                <TableCell className="text-text-body font-poppins text-base py-6">{product.minBuyAmount}</TableCell>
                                <TableCell className="text-text-body font-poppins text-base py-6">{product.maxBuyAmount}</TableCell>
                                <TableCell className="text-text-body font-poppins text-base py-6">{product.vendingMedium}</TableCell>
                                <TableCell className="text-text-body font-poppins text-base py-6">{product.notice}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Manage Product Modal */}
            <ManageProductModal
                open={manageProductOpen}
                onOpenChange={setManageProductOpen}
                discountRate={discountRate}
                setDiscountRate={setDiscountRate}
                status={status}
                setStatus={setStatus}
                cashbackEnabled={cashbackEnabled}
                setCashbackEnabled={setCashbackEnabled}
                onSave={handleSaveChanges}
            />

            {/* Add Product Modal */}
            <AddProductModal
                open={addProductOpen}
                onOpenChange={setAddProductOpen}
                serviceName={serviceName}
                setServiceName={setServiceName}
                productName={productName}
                setProductName={setProductName}
                productNote={productNote}
                setProductNote={setProductNote}
                provider={provider}
                setProvider={setProvider}
                providerId={providerId}
                setProviderId={setProviderId}
                onAdd={handleAddProduct}
            />
        </div>
    )
}

export default ProductsTable

