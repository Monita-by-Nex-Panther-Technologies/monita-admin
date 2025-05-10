
'use client'

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ServiceType, useServiceStore } from "@/store/BillpaymentStore";
import { useProductCategoryStore } from "@/store/ProductCategoryStore";
import { useProductStore } from "@/store/ProductStore";
import { ChevronLeft, ChevronRight, Edit, Plus, Trash2 } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from "sonner";

interface ServiceItemProps {
    service: {
        id: string;
        name: string;
        label: string;
        isEnabled: boolean;
        color?: string;
    };
    isSelected: boolean;
    onSelect: () => void;
}

const ServiceItem: React.FC<ServiceItemProps> = ({ service, isSelected, onSelect }) => {
    const getServiceLogo = (label: string, color?: string) => {
        const normalizedLabel = label.toLowerCase();
        const bgColor = color || (
            normalizedLabel.includes('showmax') ? "#FF0000" :
                normalizedLabel.includes('dstv') ? "#192F59" :
                    normalizedLabel.includes('gotv') ? "#009900" :
                        normalizedLabel.includes('startimes') ? "#FFA500" : "#6E6E6E"
        );

        return (
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: bgColor }}>
                <span className="text-xs font-bold text-white">{label.charAt(0)}</span>
            </div>
        );
    };

    return (
        <div
            className={`flex items-center px-2 sm:px-3 py-3 sm:py-4 rounded-lg cursor-pointer transition-all duration-200 ${isSelected ? 'bg-primary-alpha-8 border border-primary' : 'bg-background border border-gray-200'
                }`}
            onClick={onSelect}
        >
            <div className="flex items-center justify-start gap-2 min-w-0">
                {getServiceLogo(service.label, service.color)}
                <span className="text-sm sm:text-base font-medium text-gray-700 truncate">{service.name}</span>
            </div>
            {!service.isEnabled && (
                <span className="ml-auto text-xs bg-red-100 text-red-600 px-2 py-1 rounded flex-shrink-0">Disabled</span>
            )}
        </div>
    );
};

// Service selection skeleton
const ServiceSelectionSkeleton = () => (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 w-full mb-6">
        {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-gray-200 animate-pulse rounded-lg"></div>
        ))}
    </div>
);

// Product table row skeleton
const ProductRowSkeleton = () => (
    <TableRow>
        <TableCell>
            <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
        </TableCell>
        <TableCell>
            <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
        </TableCell>
        <TableCell>
            <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
        </TableCell>
        <TableCell>
            <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
        </TableCell>
        <TableCell>
            <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
        </TableCell>
        <TableCell>
            <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
        </TableCell>
        <TableCell>
            <div className="flex space-x-2">
                <div className="h-8 w-8 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-8 w-8 bg-gray-200 animate-pulse rounded"></div>
            </div>
        </TableCell>
    </TableRow>
);

// Table skeleton loader
const CablePlanTableSkeleton = () => (
    <div className="w-full mx-auto bg-white rounded-lg p-4 sm:p-6">
        <div className="flex justify-between items-center mb-6">
            <div className="h-8 w-48 bg-gray-200 animate-pulse rounded"></div>
            <div className="flex flex-row space-x-4">
                <div className="h-12 w-32 sm:w-40 bg-gray-200 animate-pulse rounded"></div>
            </div>
        </div>

        <div className="overflow-x-auto">
            <Table className="w-full">
                <TableHeader>
                    <TableRow>
                        <TableHead>
                            <div className="h-10 w-full bg-gray-200 animate-pulse rounded"></div>
                        </TableHead>
                        <TableHead>
                            <div className="h-10 w-full bg-gray-200 animate-pulse rounded"></div>
                        </TableHead>
                        <TableHead>
                            <div className="h-10 w-full bg-gray-200 animate-pulse rounded"></div>
                        </TableHead>
                        <TableHead>
                            <div className="h-10 w-full bg-gray-200 animate-pulse rounded"></div>
                        </TableHead>
                        <TableHead>
                            <div className="h-10 w-full bg-gray-200 animate-pulse rounded"></div>
                        </TableHead>
                        <TableHead>
                            <div className="h-10 w-full bg-gray-200 animate-pulse rounded"></div>
                        </TableHead>
                        <TableHead>
                            <div className="h-10 w-full bg-gray-200 animate-pulse rounded"></div>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {[1, 2, 3, 4].map((i) => (
                        <ProductRowSkeleton key={i} />
                    ))}
                </TableBody>
            </Table>
        </div>
    </div>
);

// Header skeleton loader
const HeaderSkeleton = () => (
    <div className="w-full mx-auto bg-white rounded-lg p-4 sm:p-6 mb-4">
        <div className="flex justify-between items-center">
            <div className="h-8 w-48 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-12 w-32 sm:w-40 bg-gray-200 animate-pulse rounded"></div>
        </div>
    </div>
);

// Pagination component
interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    // Create an array of page numbers to display
    const getPageNumbers = () => {
        const pages = [];
        // Always show first page
        pages.push(1);

        // Current page and surroundings
        for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
            pages.push(i);
        }

        // Always show last page if more than 1 page
        if (totalPages > 1) {
            pages.push(totalPages);
        }

        // Make the array unique and sorted
        return [...new Set(pages)].sort((a, b) => a - b);
    };

    const pageNumbers = getPageNumbers();

    return (
        <div className="flex items-center justify-center space-x-2 mt-6">
            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="h-8 w-8 p-0"
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>

            {pageNumbers.map((page, index) => {
                // If there's a gap between page numbers, show ellipsis
                if (index > 0 && page > pageNumbers[index - 1] + 1) {
                    return (
                        <React.Fragment key={`ellipsis-${index}`}>
                            <span className="text-gray-400">...</span>
                            <Button
                                variant={page === currentPage ? "default" : "outline"}
                                size="sm"
                                onClick={() => onPageChange(page)}
                                className={`h-8 w-8 p-0 ${page === currentPage ? 'bg-primary text-black' : ''}`}
                            >
                                {page}
                            </Button>
                        </React.Fragment>
                    );
                }

                return (
                    <Button
                        key={page}
                        variant={page === currentPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => onPageChange(page)}
                        className={`h-8 w-8 p-0 ${page === currentPage ? 'bg-primary text-black' : ''}`}
                    >
                        {page}
                    </Button>
                );
            })}

            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="h-8 w-8 p-0"
            >
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    );
};

// Add Cable Plan Modal Component
interface AddCablePlanModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    serviceId: string;
    brandId: string;
    onAdd: (productData: any) => void;
    categoryOptions: { id: string; name: string; displayName: string }[];
}

const AddCablePlanModal: React.FC<AddCablePlanModalProps> = ({
    open,
    onOpenChange,
    serviceId,
    brandId,
    onAdd,
    categoryOptions
}) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [cost, setCost] = useState(0);
    const [price, setPrice] = useState(0);
    const [cashback, setCashback] = useState(0);
    const [commission, setCommission] = useState(0);
    const [validity, setValidity] = useState("30 Days");
    const [providerProductId, setProviderProductId] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [packageType, setPackageType] = useState("");
    const [isHot, setIsHot] = useState(false);

    // Set default category when options change
    useEffect(() => {
        if (categoryOptions.length > 0 && !categoryId) {
            setCategoryId(categoryOptions[0].id);
        }
    }, [categoryOptions, categoryId]);

    const handleAdd = () => {
        const productData = {
            name,
            description,
            serviceId,
            brandId,
            cost: Number(cost),
            price: Number(price),
            cashback: Number(cashback),
            validity,
            providerProductId,
            serviceProductCategoryId: categoryId,
            isHot,
        };

        onAdd(productData);

        // Reset form
        setName("");
        setDescription("");
        setCost(0);
        setPrice(0);
        setCashback(0);
        setValidity("30 Days");
        setProviderProductId("");
        setCategoryId(categoryOptions[0]?.id || "");
        setPackageType("");
        setIsHot(false);

        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] p-0 overflow-auto max-h-[90vh] w-[95vw] sm:w-full rounded-lg">
                <DialogHeader className="p-4 border-b">
                    <div className="flex justify-between items-center w-full">
                        <DialogTitle className="text-xl font-bold">Add Cable Plan</DialogTitle>
                        <button
                            onClick={() => onOpenChange(false)}
                            className="text-sm text-gray-500 flex items-center"
                        >
                            Close <span className="ml-1">×</span>
                        </button>
                    </div>
                </DialogHeader>

                <div className="p-4 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="add-name">Name</Label>
                        <Input
                            id="add-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Compact"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="add-description">Description</Label>
                        <Input
                            id="add-description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="e.g. Basic, Premium"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="add-cost">Cost Price</Label>
                            <Input
                                id="add-cost"
                                type="number"
                                value={cost}
                                onChange={(e) => setCost(Number(e.target.value))}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="add-price">Selling Price</Label>
                            <Input
                                id="add-price"
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(Number(e.target.value))}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="add-cashback">Cashback</Label>
                            <Input
                                id="add-cashback"
                                type="number"
                                value={cashback}
                                onChange={(e) => setCashback(Number(e.target.value))}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="add-validity">Validity</Label>
                            <Input
                                id="add-validity"
                                value={validity}
                                onChange={(e) => setValidity(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="add-provider">Provider</Label>
                            <Select value={providerProductId} onValueChange={setProviderProductId}>
                                <SelectTrigger id="add-provider">
                                    <SelectValue placeholder="Select provider" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ARTX">ARTX</SelectItem>
                                    <SelectItem value="VTPASS">VTPASS</SelectItem>
                                    <SelectItem value="SIMACCESS">SIMACCESS</SelectItem>
                                    <SelectItem value="RELOADLY">RELOADLY</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="add-category">Category</Label>
                            <Select value={categoryId} onValueChange={setCategoryId}>
                                <SelectTrigger id="add-category">
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categoryOptions.map((category) => (
                                        <SelectItem key={category.id} value={category.id}>
                                            {category.displayName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Label htmlFor="add-isHot" className="flex-grow">Hot Deal</Label>
                        <Switch
                            id="add-isHot"
                            checked={isHot}
                            onCheckedChange={setIsHot}
                        />
                    </div>
                </div>

                <div className="p-4 pt-0">
                    <Button
                        onClick={handleAdd}
                        className="w-full py-2 bg-primary text-black rounded-md"
                        disabled={!name || !description || cost <= 0 || price <= 0 || !providerProductId || !categoryId}
                    >
                        Add Cable Plan
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

// Edit Cable Plan Modal Component
interface EditCablePlanModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    product: any;
    onEdit: (productId: string, updates: any) => void;
    categoryOptions: { id: string; name: string; displayName: string }[];
}

const EditCablePlanModal: React.FC<EditCablePlanModalProps> = ({
    open,
    onOpenChange,
    product,
    onEdit,
    categoryOptions
}) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [cost, setCost] = useState(0);
    const [price, setPrice] = useState(0);
    const [cashback, setCashback] = useState(0);
    const [validity, setValidity] = useState("");
    const [providerProductId, setProviderProductId] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [isHot, setIsHot] = useState(false);

    // Set form values when product changes
    useEffect(() => {
        if (product) {
            setName(product.name || "");
            setDescription(product.description || "");
            setCost(product.cost || 0);
            setPrice(product.price || 0);
            setCashback(product.cashback || 0);
            setValidity(product.validity || "");
            setProviderProductId(product.providerProductId || "");
            setCategoryId(product.serviceProductCategoryId || "");
            setIsHot(product.isHot || false);
        }
    }, [product]);

    const handleEdit = () => {
        const updates = {
            name,
            description,
            cost: Number(cost),
            price: Number(price),
            cashback: Number(cashback),
            validity,
            providerProductId,
            serviceProductCategoryId: categoryId,
            isHot,
        };

        onEdit(product.id, updates);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] p-0 overflow-auto max-h-[90vh] w-[95vw] sm:w-full rounded-lg">
                <DialogHeader className="p-4 border-b">
                    <div className="flex justify-between items-center w-full">
                        <DialogTitle className="text-xl font-bold">Edit Cable Plan</DialogTitle>
                        <button
                            onClick={() => onOpenChange(false)}
                            className="text-sm text-gray-500 flex items-center"
                        >
                            Close <span className="ml-1">×</span>
                        </button>
                    </div>
                </DialogHeader>

                <div className="p-4 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="edit-name">Name</Label>
                        <Input
                            id="edit-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Compact"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-description">Description</Label>
                        <Input
                            id="edit-description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="e.g. Basic, Premium"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-cost">Cost Price</Label>
                            <Input
                                id="edit-cost"
                                type="number"
                                value={cost}
                                onChange={(e) => setCost(Number(e.target.value))}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-price">Selling Price</Label>
                            <Input
                                id="edit-price"
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(Number(e.target.value))}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-cashback">Cashback</Label>
                            <Input
                                id="edit-cashback"
                                type="number"
                                value={cashback}
                                onChange={(e) => setCashback(Number(e.target.value))}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-validity">Validity</Label>
                            <Input
                                id="edit-validity"
                                value={validity}
                                onChange={(e) => setValidity(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-provider">Provider</Label>
                            <Select value={providerProductId} onValueChange={setProviderProductId}>
                                <SelectTrigger id="edit-provider">
                                    <SelectValue placeholder="Select provider" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ARTX">ARTX</SelectItem>
                                    <SelectItem value="VTPASS">VTPASS</SelectItem>
                                    <SelectItem value="SIMACCESS">SIMACCESS</SelectItem>
                                    <SelectItem value="RELOADLY">RELOADLY</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-category">Category</Label>
                            <Select value={categoryId} onValueChange={setCategoryId}>
                                <SelectTrigger id="edit-category">
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categoryOptions.map((category) => (
                                        <SelectItem key={category.id} value={category.id}>
                                            {category.displayName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Label htmlFor="edit-isHot" className="flex-grow">Hot Deal</Label>
                        <Switch
                            id="edit-isHot"
                            checked={isHot}
                            onCheckedChange={setIsHot}
                        />
                    </div>
                </div>

                <div className="p-4 pt-0">
                    <Button
                        onClick={handleEdit}
                        className="w-full py-2 bg-primary text-black rounded-md"
                        disabled={!name || !description || cost <= 0 || price <= 0 || !providerProductId || !categoryId}
                    >
                        Update Cable Plan
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

// Cable Plan Row Component with Edit Modal
interface CablePlanRowProps {
    product: any;
    onSave: (productId: string, updates: any) => void;
    onToggleHot: (productId: string, isHot: boolean) => void;
    onDelete: (productId: string, name: string) => void;
    categoryOptions: { id: string; name: string; displayName: string }[];
}

const CablePlanRow: React.FC<CablePlanRowProps> = ({
    product,
    onSave,
    onToggleHot,
    onDelete,
    categoryOptions
}) => {
    const [editModalOpen, setEditModalOpen] = useState(false);
    const categoryLabel = product.serviceProductCategory?.displayName || "-";

    return (
        <>
            <TableRow className="border-b border-gray-200">
                <TableCell className="py-3 sm:py-5 pl-4">
                    <div className="flex flex-col">
                        <span className="font-medium">{product.name}</span>
                        <span className="text-xs text-primary-600 mt-1">
                            {categoryLabel}
                        </span>
                    </div>
                </TableCell>
                <TableCell className="py-3 sm:py-5">
                    <>{product.description || "-"}</>
                </TableCell>
                <TableCell className="text-text-body font-poppins text-base py-3">
                    ₦{product.cost.toLocaleString()}
                </TableCell>
                <TableCell className="text-text-body font-poppins text-base py-3">
                    ₦{product.price.toLocaleString()}
                </TableCell>
                <TableCell className="text-text-body font-poppins text-base py-3">
                    {product.cashback ? `₦${product.cashback.toLocaleString()}` : '-'}
                </TableCell>
                <TableCell className="text-text-body font-poppins text-base py-3">
                    {product.validity || '-'}
                </TableCell>
                <TableCell>
                    <div className="flex space-x-2">
                        <Button
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            onClick={() => setEditModalOpen(true)}
                        >
                            <Edit className="h-4 w-4 text-blue-500" />
                        </Button>
                        <Button
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            onClick={() => onDelete(product.id, product.name)}
                        >
                            <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                    </div>
                </TableCell>
            </TableRow>

            <EditCablePlanModal
                open={editModalOpen}
                onOpenChange={setEditModalOpen}
                product={product}
                onEdit={onSave}
                categoryOptions={categoryOptions}
            />
        </>
    );
};

const CablePlanManagement = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Enhanced state management integration
    const {
        services,
        brands,
        selectedServiceId,
        selectedService,
        setSelectedService,
        getServices,
        getBrands,
        // clearBrands,
        isLoading: brandsLoading
    } = useServiceStore();

    const { productCategories, getProductCategories } = useProductCategoryStore();

    const {
        products,
        productsTotal,
        productsPage,
        productsLimit,
        isLoading: productsLoading,
        getProducts,
        updateProduct,
        toggleProductHot,
        deleteProduct,
        addProduct,
        clearProducts
    } = useProductStore();

    // Get serviceId from URL or store
    const urlServiceId = searchParams.get('serviceId');
    const serviceId = urlServiceId || selectedServiceId || '';

    // Get pagination from URL
    const pageParam = searchParams.get('page');
    const limitParam = searchParams.get('limit');

    const currentPage = pageParam ? parseInt(pageParam) : productsPage || 1;
    const pageSize = limitParam ? parseInt(limitParam) : productsLimit || 10;

    // Local state
    const [selectedProviderBrandId, setSelectedProviderBrandId] = useState<string>("");
    const [selectedServiceName, setSelectedServiceName] = useState<string>("");
    const [addProductOpen, setAddProductOpen] = useState<boolean>(false);
    const [categoryOptions, setCategoryOptions] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [prevServiceId, setPrevServiceId] = useState<string>("");
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);

    // Services with colors
    const serviceColors = {
        "Showmax": "#FF0000",
        "DSTV": "#192F59",
        "GOTV": "#009900",
        "Startimes": "#FFA500"
    };

    // Calculate total pages
    const totalPages = Math.ceil(productsTotal / pageSize);

    // Create a function to update URL with new page
    const updatePageInUrl = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', page.toString());
        router.push(`${pathname}?${params.toString()}`);
    };

    // Clear data when service changes
    useEffect(() => {
        if (serviceId && serviceId !== prevServiceId) {
            // Clear brands and products when switching services
            if (prevServiceId) {
                // clearBrands();
                clearProducts();
            }

            // Reset selected brand and service name
            setSelectedProviderBrandId("");
            setSelectedServiceName("");

            // Update prevServiceId
            setPrevServiceId(serviceId);
        }
    }, [serviceId, prevServiceId, clearProducts]);

    // Load services when component mounts
    useEffect(() => {
        const loadServices = async () => {
            if (services.length === 0) {
                try {
                    await getServices();
                } catch (error) {
                    console.error('Failed to load services:', error);
                }
            }
        };

        loadServices();
    }, [getServices, services.length]);

    // Handle service detection and selection
    useEffect(() => {
        if (services.length > 0) {
            // If no serviceId is provided, try to find the cable service
            if (!serviceId) {
                const cableService = services.find(s => s.label.toLowerCase() === 'cable');
                if (cableService) {
                    // Found cable service, set it as selected
                    setSelectedService('cable' as ServiceType, cableService.id);

                    // Update URL with the detected service ID
                    const params = new URLSearchParams(searchParams.toString());
                    params.set('serviceId', cableService.id);
                    router.push(`${pathname}?${params.toString()}`);
                }
            } else {
                // Service ID is provided, ensure it's set in the store
                const currentService = services.find(s => s.id === serviceId);
                if (currentService && selectedServiceId !== serviceId) {
                    setSelectedService(currentService.label.toLowerCase() as ServiceType, currentService.id);
                }
            }
        }
    }, [services, serviceId, selectedServiceId, setSelectedService, pathname, searchParams, router]);

    // Load brands and categories when service is available
    useEffect(() => {
        const fetchInitialData = async () => {
            if (!serviceId) return;

            try {
                // Start loading indicators
                setIsLoadingCategories(true);

                // Fetch product categories
                await getProductCategories();

                // Fetch brands for the cable service with force refresh
                await getBrands(serviceId, 1, 100, '',);

                // Stop loading indicators
                setIsLoadingCategories(false);
            } catch (error: any) {
                setIsLoadingCategories(false);
                toast.error("Failed to load initial data", {
                    description: error.message || "An error occurred"
                });
            }
        };

        fetchInitialData();
    }, [serviceId, getProductCategories, getBrands]);

    // Update category options whenever productCategories changes
    useEffect(() => {
        setCategoryOptions(productCategories);
    }, [productCategories]);

    // Auto-select first brand and fetch products when brands are loaded
    useEffect(() => {
        if (brands.length > 0 && serviceId) {
            // Only auto-select first brand if we don't have a selected brand
            // or if the current selected brand is not in the new list
            const isBrandInList = selectedProviderBrandId &&
                brands.some(brand => brand.id === selectedProviderBrandId);

            if (!selectedProviderBrandId || !isBrandInList) {
                const firstBrand = brands[0];
                setSelectedProviderBrandId(firstBrand.id);
                setSelectedServiceName(firstBrand.name);
            }

            // Fetch products for the selected brand
            if (selectedProviderBrandId) {
                getProducts({
                    serviceId,
                    brandId: selectedProviderBrandId,
                    page: currentPage,
                    limit: pageSize,
                    search: searchTerm
                });
            }
        }
    }, [brands, serviceId, selectedProviderBrandId, currentPage, pageSize, searchTerm]);

    // Handle service provider selection
    const handleServiceSelect = (brandId: string, brandName: string) => {
        setSelectedProviderBrandId(brandId);
        setSelectedServiceName(brandName);

        // Reset to page 1 when changing provider
        updatePageInUrl(1);

        // Fetch products for the selected provider
        getProducts({
            serviceId,
            brandId,
            page: 1,
            limit: pageSize,
            search: searchTerm
        });
    };

    // Handle page change
    const handlePageChange = (page: number) => {
        updatePageInUrl(page);

        // Fetch products for the new page
        getProducts({
            serviceId,
            brandId: selectedProviderBrandId,
            page,
            limit: pageSize,
            search: searchTerm
        });
    };

    // Handle search
    const handleSearch = () => {
        // Reset to page 1 when searching
        updatePageInUrl(1);

        getProducts({
            serviceId,
            brandId: selectedProviderBrandId,
            page: 1,
            limit: pageSize,
            search: searchTerm
        });
    };

    // Handle product update
    const handleUpdateProduct = async (productId: string, updates: any) => {
        try {
            await updateProduct(productId, updates);
            toast.success("Cable plan updated successfully");

            // Refresh products
            getProducts({
                serviceId,
                brandId: selectedProviderBrandId,
                page: currentPage,
                limit: pageSize,
                search: searchTerm
            });
        } catch (error: any) {
            toast.error("Failed to update cable plan", {
                description: error.message || "An error occurred"
            });
        }
    };

    // Handle product deletion
    const handleDeleteProduct = async (productId: string, productName: string) => {
        if (confirm(`Are you sure you want to delete "${productName}"?`)) {
            try {
                await deleteProduct(productId);
                toast.success(`"${productName}" deleted successfully`);

                // Refresh products after deletion
                // If we're on the last page and it's now empty, go to previous page
                if (products.length === 1 && currentPage > 1) {
                    handlePageChange(currentPage - 1);
                } else {
                    getProducts({
                        serviceId,
                        brandId: selectedProviderBrandId,
                        page: currentPage,
                        limit: pageSize,
                        search: searchTerm
                    });
                }
            } catch (error: any) {
                toast.error("Failed to delete cable plan", {
                    description: error.message || "An error occurred"
                });
            }
        }
    };

    // Handle hot deal toggle
    const handleToggleHot = async (productId: string, isHot: boolean) => {
        try {
            await toggleProductHot(productId, isHot);
            toast.success(`Hot deal ${isHot ? 'enabled' : 'disabled'}`);

            // The store will automatically update the products list
        } catch (error: any) {
            toast.error("Failed to update cable plan", {
                description: error.message || "An error occurred"
            });
        }
    };

    // Handle add product
    const handleAddProduct = async (productData: any) => {
        try {
            await addProduct(productData);
            toast.success("Cable plan added successfully");

            // Refresh products - go to first page after adding
            handlePageChange(1);
        } catch (error: any) {
            toast.error("Failed to add cable plan", {
                description: error.message || "An error occurred"
            });
        }
    };

    // Show loading state if we don't have service ID yet
    if (!serviceId) {
        return (
            <div className="mt-6 flex justify-center items-center h-64">
                <div className="animate-pulse">Loading cable service...</div>
            </div>
        );
    }

    return (
        <>
            {/* Service Provider Selection - with skeleton loading */}
            {brandsLoading ? (
                <ServiceSelectionSkeleton />
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 w-full mb-6 mt-6">
                    {brands.map((brand) => (
                        <ServiceItem
                            key={brand.id}
                            service={{
                                ...brand,
                                color: (serviceColors as any)[brand.name] || undefined
                            }}
                            isSelected={selectedProviderBrandId === brand.id}
                            onSelect={() => handleServiceSelect(brand.id, brand.name)}
                        />
                    ))}
                </div>
            )}

            {/* Content Area - Header + Table */}
            {productsLoading || !selectedProviderBrandId ? (
                <>
                    <HeaderSkeleton />
                    <CablePlanTableSkeleton />
                </>
            ) : (
                <div className="w-full mx-auto bg-white rounded-lg overflow-hidden">
                    {/* Cable Plan Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 sm:p-6 gap-4">
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                            {selectedServiceName ? `Cable - ${selectedServiceName}` : "Cable"}
                        </h1>
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                            <Button
                                className="bg-primary text-text-title text-[16px] flex flex-row w-full sm:w-[182px] h-[48px] gap-1 font-normal font-poppins rounded-md px-4 py-3"
                                onClick={() => setAddProductOpen(true)}
                            >
                                <Plus className="h-5 w-5 mr-2" />
                                Add Plan
                            </Button>
                        </div>
                    </div>

                    {/* Cable Plan Table */}
                    <div className="overflow-x-auto">
                        <Table className="w-full">
                            <TableHeader>
                                <TableRow className="bg-primary-alpha-8 hover:bg-primary-alpha-8 border-b border-gray-200">
                                    <TableHead className="font-medium text-sm sm:text-[16px] text-gray-700 py-3 pl-4">Product</TableHead>
                                    <TableHead className="font-medium text-sm sm:text-[16px] text-gray-700 py-3">Package</TableHead>
                                    <TableHead className="font-medium text-sm sm:text-[16px] text-gray-700 py-3">Cost Price</TableHead>
                                    <TableHead className="font-medium text-sm sm:text-[16px] text-gray-700 py-3">Selling Price</TableHead>
                                    <TableHead className="font-medium text-sm sm:text-[16px] text-gray-700 py-3">Cashback</TableHead>
                                    <TableHead className="font-medium text-sm sm:text-[16px] text-gray-700 py-3">Validity</TableHead>
                                    <TableHead className="font-medium text-sm sm:text-[16px] text-gray-700 py-3">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {products.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                                            No plans found for this service provider
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    products.map((product) => (
                                        <CablePlanRow
                                            key={product.id}
                                            product={product}
                                            onSave={handleUpdateProduct}
                                            onToggleHot={handleToggleHot}
                                            onDelete={handleDeleteProduct}
                                            categoryOptions={categoryOptions}
                                        />
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    {productsTotal > 0 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    )}

                    {/* Records count */}
                    <div className="text-center text-sm text-gray-500 py-3">
                        Showing {products.length} of {productsTotal} records
                    </div>
                </div>
            )}

            {/* Add Cable Plan Modal */}
            {selectedProviderBrandId && !isLoadingCategories && (
                <AddCablePlanModal
                    open={addProductOpen}
                    onOpenChange={setAddProductOpen}
                    serviceId={serviceId}
                    brandId={selectedProviderBrandId}
                    onAdd={handleAddProduct}
                    categoryOptions={categoryOptions}
                />
            )}
        </>
    );
};

export default CablePlanManagement;
