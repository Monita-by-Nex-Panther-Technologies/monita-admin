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

interface NetworkItemProps {
    network: {
        id: string;
        name: string;
        label: string;
        isEnabled: boolean;
    };
    isSelected: boolean;
    onSelect: () => void;
}

const NetworkItem: React.FC<NetworkItemProps> = ({ network, isSelected, onSelect }) => {
    const getBrandLogo = (label: string) => {
        const normalizedLabel = label.toLowerCase();
        if (normalizedLabel.includes('mtn')) {
            return (
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-yellow-400 flex items-center justify-center">
                    <span className="text-xs font-bold">MTN</span>
                </div>
            );
        } else if (normalizedLabel.includes('glo')) {
            return (
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-green-600 flex items-center justify-center">
                    <span className="text-xs font-bold text-white">glo</span>
                </div>
            );
        } else if (normalizedLabel.includes('airtel')) {
            return (
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-red-600 flex items-center justify-center">
                    <span className="text-xs font-bold text-white">A</span>
                </div>
            );
        } else if (normalizedLabel.includes('9mobile')) {
            return (
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-green-400 flex items-center justify-center">
                    <span className="text-xs font-bold text-white">9</span>
                </div>
            );
        } else {
            return (
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-400 flex items-center justify-center">
                    <span className="text-xs font-bold text-white">{label.charAt(0)}</span>
                </div>
            );
        }
    };

    return (
        <div
            className={`flex items-center px-2 sm:px-3 py-3 sm:py-4 rounded-lg cursor-pointer transition-all duration-200 ${isSelected ? 'bg-primary-alpha-8 border border-primary' : 'bg-background border border-gray-200'
                }`}
            onClick={onSelect}
        >
            <div className="flex items-center justify-start gap-2 min-w-0">
                {getBrandLogo(network.label)}
                <span className="text-sm sm:text-base font-medium text-gray-700 truncate">{network.name}</span>
            </div>
            {!network.isEnabled && (
                <span className="ml-auto text-xs bg-red-100 text-red-600 px-2 py-1 rounded flex-shrink-0">Disabled</span>
            )}
        </div>
    );
};

const NetworkSelectionSkeleton = () => (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 w-full mb-6">
        {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-gray-200 animate-pulse rounded-lg"></div>
        ))}
    </div>
);

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
            <div className="h-8 w-8 bg-gray-200 animate-pulse rounded-full"></div>
        </TableCell>
        <TableCell>
            <div className="flex space-x-2">
                <div className="h-8 w-8 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-8 w-8 bg-gray-200 animate-pulse rounded"></div>
            </div>
        </TableCell>
    </TableRow>
);

const DataPlanTableSkeleton = () => (
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

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    const getPageNumbers = () => {
        const pages = [];
        pages.push(1);

        for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
            pages.push(i);
        }

        if (totalPages > 1) {
            pages.push(totalPages);
        }

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

interface AddProductModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    serviceId: string;
    brandId: string;
    onAdd: (productData: any) => void;
    categoryOptions: { id: string; name: string; displayName: string }[];
}

const AddProductModal: React.FC<AddProductModalProps> = ({
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
    const [validity, setValidity] = useState("30 Days");
    const [providerProductId, setProviderProductId] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [isHot, setIsHot] = useState(false);


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

        setName("");
        setDescription("");
        setCost(0);
        setPrice(0);
        setCashback(0);
        setValidity("30 Days");
        setProviderProductId("");
        setCategoryId(categoryOptions[0]?.id || "");
        setIsHot(false);

        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] p-0 overflow-auto max-h-[90vh] w-[95vw] sm:w-full rounded-lg">
                <DialogHeader className="p-4 border-b">
                    <div className="flex justify-between items-center w-full">
                        <DialogTitle className="text-xl font-bold">Add Data Plan</DialogTitle>
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
                            placeholder="e.g. 1.0GB"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="add-description">Description</Label>
                        <Input
                            id="add-description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="e.g. 1.0GB 30 days"
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
                    <div className="space-y-2">
                        <Label htmlFor="add-provider">Provider Product ID</Label>
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
                        disabled={!name || !description || cost <= 0 || price <= 0 || !categoryId}
                    >
                        Add Product
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

interface EditProductModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    product: any;
    onEdit: (productId: string, updates: any) => void;
    categoryOptions: { id: string; name: string; displayName: string }[];
}

const EditProductModal: React.FC<EditProductModalProps> = ({
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
                        <DialogTitle className="text-xl font-bold">Edit Data Plan</DialogTitle>
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
                            placeholder="e.g. 1.0GB"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-description">Description</Label>
                        <Input
                            id="edit-description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="e.g. 1.0GB 30 days"
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
                    <div className="space-y-2">
                        <Label htmlFor="edit-provider">Provider Product ID</Label>
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
                        disabled={!name || !description || cost <= 0 || price <= 0 || !categoryId}
                    >
                        Update Product
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

interface ProductRowProps {
    product: any;
    onSave: (productId: string, updates: any) => void;
    onToggleHot: (productId: string, isHot: boolean) => void;
    onDelete: (productId: string, name: string) => void;
    onEdit: (productId: string, updates: any) => void;
    categoryOptions: { id: string; name: string; displayName: string }[];
}

const ProductRow: React.FC<ProductRowProps> = ({
    product,
    onToggleHot,
    onDelete,
    onEdit,
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
                        <span className="text-xs text-gray-500">{product.description}</span>
                        <span className="text-xs text-primary-600 mt-1">
                            {categoryLabel}
                        </span>
                    </div>
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
                <TableCell className="text-center py-3">
                    <Switch
                        checked={product.isHot}
                        onCheckedChange={(checked) => onToggleHot(product.id, checked)}
                        className="scale-100 sm:scale-125 data-[state=checked]:bg-primary"
                    />
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

            <EditProductModal
                open={editModalOpen}
                onOpenChange={setEditModalOpen}
                product={product}
                onEdit={onEdit}
                categoryOptions={categoryOptions}
            />
        </>
    );
};

const DataPlanManagement = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

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

    const urlServiceId = searchParams.get('serviceId');
    const serviceId = urlServiceId || selectedServiceId || '';

    const pageParam = searchParams.get('page');
    const limitParam = searchParams.get('limit');

    const currentPage = pageParam ? parseInt(pageParam) : productsPage || 1;
    const pageSize = limitParam ? parseInt(limitParam) : productsLimit || 10;

    const [selectedNetworkId, setSelectedNetworkId] = useState<string>("");
    const [selectedNetwork, setSelectedNetwork] = useState<string>("");
    const [addProductOpen, setAddProductOpen] = useState<boolean>(false);
    const [categoryOptions, setCategoryOptions] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [prevServiceId, setPrevServiceId] = useState<string>("");
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);
    const [brandsInitialized, setBrandsInitialized] = useState(false);
    const [initialLoadComplete, setInitialLoadComplete] = useState(false);

    const totalPages = Math.ceil(productsTotal / pageSize);

    // Clear data when service changes
    useEffect(() => {
        if (serviceId && serviceId !== prevServiceId) {
            // Clear brands and products when switching services
            if (prevServiceId) {
                // clearBrands();
                clearProducts();
                setSelectedNetworkId("");
                setSelectedNetwork("");
                setBrandsInitialized(false);
                setInitialLoadComplete(false);
            }

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
            // If no serviceId is provided, try to find the data service
            if (!serviceId) {
                const dataService = services.find(s => s.label.toLowerCase() === 'data');
                if (dataService) {
                    setSelectedService('data' as ServiceType, dataService.id);

                    // Update URL with the detected service ID
                    const params = new URLSearchParams(searchParams.toString());
                    params.set('serviceId', dataService.id);
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

    // Load categories and brands when service is available
    useEffect(() => {
        const fetchInitialData = async () => {
            if (!serviceId) return;

            try {
                // Start loading indicators
                setIsLoadingCategories(true);

                // Fetch product categories first
                await getProductCategories();

                // Then fetch brands with force refresh
                await getBrands(serviceId, 1, 100, '');

                // Set flag that brands have been initialized
                setBrandsInitialized(true);

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
        if (brands.length > 0 && serviceId && brandsInitialized) {
            // Only auto-select first brand if none is selected
            if (!selectedNetworkId) {
                const firstBrand = brands[0];
                setSelectedNetworkId(firstBrand.id);
                setSelectedNetwork(firstBrand.name);

                // Immediately fetch products for the first brand
                getProducts({
                    serviceId,
                    brandId: firstBrand.id,
                    page: currentPage,
                    limit: pageSize,
                    search: searchTerm
                });

                // Initial load is complete
                setInitialLoadComplete(true);
            } else if (!initialLoadComplete) {
                // If network is already selected but initial load isn't complete
                getProducts({
                    serviceId,
                    brandId: selectedNetworkId,
                    page: currentPage,
                    limit: pageSize,
                    search: searchTerm
                });
                setInitialLoadComplete(true);
            }
        }
    }, [brands, serviceId, brandsInitialized, selectedNetworkId, currentPage, pageSize, searchTerm, initialLoadComplete, getProducts]);

    // Handle network selection
    const handleNetworkSelect = (networkId: string, networkName: string) => {
        setSelectedNetworkId(networkId);
        setSelectedNetwork(networkName);

        // Reset to page 1 and fetch products for the selected network
        getProducts({
            serviceId,
            brandId: networkId,
            page: 1,
            limit: pageSize,
            search: searchTerm
        });
    };

    // Handle page change
    const handlePageChange = (page: number) => {
        // Fetch products for the new page
        getProducts({
            serviceId,
            brandId: selectedNetworkId,
            page,
            limit: pageSize,
            search: searchTerm
        });
    };

    // Handle search
    const handleSearch = () => {
        // Fetch products with the search term
        getProducts({
            serviceId,
            brandId: selectedNetworkId,
            page: 1, // Reset to page 1 for search
            limit: pageSize,
            search: searchTerm
        });
    };

    // Handle product update
    const handleUpdateProduct = async (productId: string, updates: any) => {
        try {
            await updateProduct(productId, updates);
            toast.success("Product updated successfully");

            // Refresh products
            getProducts({
                serviceId,
                brandId: selectedNetworkId,
                page: currentPage,
                limit: pageSize,
                search: searchTerm
            });
        } catch (error: any) {
            toast.error("Failed to update product", {
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
                if (products.length === 1 && currentPage > 1) {
                    handlePageChange(currentPage - 1);
                } else {
                    getProducts({
                        serviceId,
                        brandId: selectedNetworkId,
                        page: currentPage,
                        limit: pageSize,
                        search: searchTerm
                    });
                }
            } catch (error: any) {
                toast.error("Failed to delete product", {
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
        } catch (error: any) {
            toast.error("Failed to update product", {
                description: error.message || "An error occurred"
            });
        }
    };

    // Handle add product
    const handleAddProduct = async (productData: any) => {
        try {
            await addProduct(productData);
            toast.success("Product added successfully");

            // Refresh products - go to first page after adding
            handlePageChange(1);
        } catch (error: any) {
            toast.error("Failed to add product", {
                description: error.message || "An error occurred"
            });
        }
    };

    // Show loading state if we don't have service ID yet
    if (!serviceId) {
        return (
            <div className="mt-6 flex justify-center items-center h-64">
                <div className="animate-pulse">Loading data plan service...</div>
            </div>
        );
    }

    return (
        <>
            {/* Network Selection - with skeleton loading */}
            {brandsLoading || !brandsInitialized ? (
                <NetworkSelectionSkeleton />
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 w-full mb-6 mt-6">
                    {brands.map((brand) => (
                        <NetworkItem
                            key={brand.id}
                            network={brand}
                            isSelected={selectedNetworkId === brand.id}
                            onSelect={() => handleNetworkSelect(brand.id, brand.name)}
                        />
                    ))}
                </div>
            )}

            {/* Content Area - with skeleton loading */}
            {productsLoading || !initialLoadComplete ? (
                <>
                    <HeaderSkeleton />
                    <DataPlanTableSkeleton />
                </>
            ) : selectedNetworkId ? (
                <div className="w-full mx-auto bg-white rounded-lg overflow-hidden">
                    {/* Data Plan Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 sm:p-6 gap-4">
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                            {selectedNetwork ? `Data Plan - ${selectedNetwork}` : "Data Plan"}
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

                    {/* Data Plan Table */}
                    <div className="overflow-x-auto">
                        <Table className="w-full">
                            <TableHeader>
                                <TableRow className="bg-primary-alpha-8 hover:bg-primary-alpha-8 border-b border-gray-200">
                                    <TableHead className="font-medium text-sm sm:text-[16px] text-gray-700 py-3 pl-4">Data Plan</TableHead>
                                    <TableHead className="font-medium text-sm sm:text-[16px] text-gray-700 py-3">Cost Price</TableHead>
                                    <TableHead className="font-medium text-sm sm:text-[16px] text-gray-700 py-3">Selling Price</TableHead>
                                    <TableHead className="font-medium text-sm sm:text-[16px] text-gray-700 py-3">Cashback</TableHead>
                                    <TableHead className="font-medium text-sm sm:text-[16px] text-gray-700 py-3">Validity</TableHead>
                                    <TableHead className="font-medium text-sm sm:text-[16px] text-gray-700 py-3">Hot Deal</TableHead>
                                    <TableHead className="font-medium text-sm sm:text-[16px] text-gray-700 py-3">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {products.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                                            No data plans found for this network
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    products.map((product) => (
                                        <ProductRow
                                            key={product.id}
                                            product={product}
                                            onSave={handleUpdateProduct}
                                            onToggleHot={handleToggleHot}
                                            onDelete={handleDeleteProduct}
                                            onEdit={handleUpdateProduct}
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
            ) : (
                <div className="w-full mx-auto bg-white rounded-lg p-6 text-center">
                    <p className="text-gray-500">Loading data plans...</p>
                </div>
            )}

            {/* Add Product Modal - only show when categories and network are loaded */}
            {selectedNetworkId && !isLoadingCategories && (
                <AddProductModal
                    open={addProductOpen}
                    onOpenChange={setAddProductOpen}
                    serviceId={serviceId}
                    brandId={selectedNetworkId}
                    onAdd={handleAddProduct}
                    categoryOptions={categoryOptions}
                />
            )}
        </>
    );
};

export default DataPlanManagement;

// 'use client'

// import { Button } from "@/components/ui/button";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Switch } from "@/components/ui/switch";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { ServiceType, useServiceStore } from "@/store/BillpaymentStore";
// import { useProductCategoryStore } from "@/store/ProductCategoryStore";
// import { useProductStore } from "@/store/ProductStore";
// import { ChevronLeft, ChevronRight, Edit, Plus, Trash2 } from 'lucide-react';
// import { usePathname, useRouter, useSearchParams } from 'next/navigation';
// import React, { useEffect, useState } from 'react';
// import { toast } from "sonner";

// interface NetworkItemProps {
//     network: {
//         id: string;
//         name: string;
//         label: string;
//         isEnabled: boolean;
//     };
//     isSelected: boolean;
//     onSelect: () => void;
// }

// const NetworkItem: React.FC<NetworkItemProps> = ({ network, isSelected, onSelect }) => {
//     const getBrandLogo = (label: string) => {
//         const normalizedLabel = label.toLowerCase();
//         if (normalizedLabel.includes('mtn')) {
//             return (
//                 <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-yellow-400 flex items-center justify-center">
//                     <span className="text-xs font-bold">MTN</span>
//                 </div>
//             );
//         } else if (normalizedLabel.includes('glo')) {
//             return (
//                 <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-green-600 flex items-center justify-center">
//                     <span className="text-xs font-bold text-white">glo</span>
//                 </div>
//             );
//         } else if (normalizedLabel.includes('airtel')) {
//             return (
//                 <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-red-600 flex items-center justify-center">
//                     <span className="text-xs font-bold text-white">A</span>
//                 </div>
//             );
//         } else if (normalizedLabel.includes('9mobile')) {
//             return (
//                 <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-green-400 flex items-center justify-center">
//                     <span className="text-xs font-bold text-white">9</span>
//                 </div>
//             );
//         } else {
//             return (
//                 <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-400 flex items-center justify-center">
//                     <span className="text-xs font-bold text-white">{label.charAt(0)}</span>
//                 </div>
//             );
//         }
//     };

//     return (
//         <div
//             className={`flex items-center px-2 sm:px-3 py-3 sm:py-4 rounded-lg cursor-pointer transition-all duration-200 ${isSelected ? 'bg-primary-alpha-8 border border-primary' : 'bg-background border border-gray-200'
//                 }`}
//             onClick={onSelect}
//         >
//             <div className="flex items-center justify-start gap-2 min-w-0">
//                 {getBrandLogo(network.label)}
//                 <span className="text-sm sm:text-base font-medium text-gray-700 truncate">{network.name}</span>
//             </div>
//             {!network.isEnabled && (
//                 <span className="ml-auto text-xs bg-red-100 text-red-600 px-2 py-1 rounded flex-shrink-0">Disabled</span>
//             )}
//         </div>
//     );
// };

// const NetworkSelectionSkeleton = () => (
//     <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 w-full mb-6">
//         {[1, 2, 3, 4].map((i) => (
//             <div key={i} className="h-16 bg-gray-200 animate-pulse rounded-lg"></div>
//         ))}
//     </div>
// );

// const ProductRowSkeleton = () => (
//     <TableRow>
//         <TableCell>
//             <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
//         </TableCell>
//         <TableCell>
//             <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
//         </TableCell>
//         <TableCell>
//             <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
//         </TableCell>
//         <TableCell>
//             <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
//         </TableCell>
//         <TableCell>
//             <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
//         </TableCell>
//         <TableCell>
//             <div className="h-8 w-8 bg-gray-200 animate-pulse rounded-full"></div>
//         </TableCell>
//         <TableCell>
//             <div className="flex space-x-2">
//                 <div className="h-8 w-8 bg-gray-200 animate-pulse rounded"></div>
//                 <div className="h-8 w-8 bg-gray-200 animate-pulse rounded"></div>
//             </div>
//         </TableCell>
//     </TableRow>
// );

// const DataPlanTableSkeleton = () => (
//     <div className="w-full mx-auto bg-white rounded-lg p-4 sm:p-6">
//         <div className="flex justify-between items-center mb-6">
//             <div className="h-8 w-48 bg-gray-200 animate-pulse rounded"></div>
//             <div className="flex flex-row space-x-4">
//                 <div className="h-12 w-32 sm:w-40 bg-gray-200 animate-pulse rounded"></div>
//             </div>
//         </div>

//         <div className="overflow-x-auto">
//             <Table className="w-full">
//                 <TableHeader>
//                     <TableRow>
//                         <TableHead>
//                             <div className="h-10 w-full bg-gray-200 animate-pulse rounded"></div>
//                         </TableHead>
//                         <TableHead>
//                             <div className="h-10 w-full bg-gray-200 animate-pulse rounded"></div>
//                         </TableHead>
//                         <TableHead>
//                             <div className="h-10 w-full bg-gray-200 animate-pulse rounded"></div>
//                         </TableHead>
//                         <TableHead>
//                             <div className="h-10 w-full bg-gray-200 animate-pulse rounded"></div>
//                         </TableHead>
//                         <TableHead>
//                             <div className="h-10 w-full bg-gray-200 animate-pulse rounded"></div>
//                         </TableHead>
//                         <TableHead>
//                             <div className="h-10 w-full bg-gray-200 animate-pulse rounded"></div>
//                         </TableHead>
//                         <TableHead>
//                             <div className="h-10 w-full bg-gray-200 animate-pulse rounded"></div>
//                         </TableHead>
//                     </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                     {[1, 2, 3, 4].map((i) => (
//                         <ProductRowSkeleton key={i} />
//                     ))}
//                 </TableBody>
//             </Table>
//         </div>
//     </div>
// );

// interface PaginationProps {
//     currentPage: number;
//     totalPages: number;
//     onPageChange: (page: number) => void;
// }

// const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
//     const getPageNumbers = () => {
//         const pages = [];
//         pages.push(1);

//         for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
//             pages.push(i);
//         }

//         if (totalPages > 1) {
//             pages.push(totalPages);
//         }

//         return [...new Set(pages)].sort((a, b) => a - b);
//     };

//     const pageNumbers = getPageNumbers();

//     return (
//         <div className="flex items-center justify-center space-x-2 mt-6">
//             <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => onPageChange(Math.max(1, currentPage - 1))}
//                 disabled={currentPage === 1}
//                 className="h-8 w-8 p-0"
//             >
//                 <ChevronLeft className="h-4 w-4" />
//             </Button>

//             {pageNumbers.map((page, index) => {
//                 if (index > 0 && page > pageNumbers[index - 1] + 1) {
//                     return (
//                         <React.Fragment key={`ellipsis-${index}`}>
//                             <span className="text-gray-400">...</span>
//                             <Button
//                                 variant={page === currentPage ? "default" : "outline"}
//                                 size="sm"
//                                 onClick={() => onPageChange(page)}
//                                 className={`h-8 w-8 p-0 ${page === currentPage ? 'bg-primary text-black' : ''}`}
//                             >
//                                 {page}
//                             </Button>
//                         </React.Fragment>
//                     );
//                 }

//                 return (
//                     <Button
//                         key={page}
//                         variant={page === currentPage ? "default" : "outline"}
//                         size="sm"
//                         onClick={() => onPageChange(page)}
//                         className={`h-8 w-8 p-0 ${page === currentPage ? 'bg-primary text-black' : ''}`}
//                     >
//                         {page}
//                     </Button>
//                 );
//             })}

//             <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
//                 disabled={currentPage === totalPages || totalPages === 0}
//                 className="h-8 w-8 p-0"
//             >
//                 <ChevronRight className="h-4 w-4" />
//             </Button>
//         </div>
//     );
// };

// interface AddProductModalProps {
//     open: boolean;
//     onOpenChange: (open: boolean) => void;
//     serviceId: string;
//     brandId: string;
//     onAdd: (productData: any) => void;
//     categoryOptions: { id: string; name: string; displayName: string }[];
// }

// const AddProductModal: React.FC<AddProductModalProps> = ({
//     open,
//     onOpenChange,
//     serviceId,
//     brandId,
//     onAdd,
//     categoryOptions
// }) => {
//     const [name, setName] = useState("");
//     const [description, setDescription] = useState("");
//     const [cost, setCost] = useState(0);
//     const [price, setPrice] = useState(0);
//     const [cashback, setCashback] = useState(0);
//     const [validity, setValidity] = useState("30 Days");
//     const [providerProductId, setProviderProductId] = useState("");
//     const [categoryId, setCategoryId] = useState("");
//     const [isHot, setIsHot] = useState(false);


//     useEffect(() => {
//         if (categoryOptions.length > 0 && !categoryId) {
//             setCategoryId(categoryOptions[0].id);
//         }
//     }, [categoryOptions, categoryId]);

//     const handleAdd = () => {
//         const productData = {
//             name,
//             description,
//             serviceId,
//             brandId,
//             cost: Number(cost),
//             price: Number(price),
//             cashback: Number(cashback),
//             validity,
//             providerProductId,
//             serviceProductCategoryId: categoryId,
//             isHot,
//         };

//         onAdd(productData);

//         setName("");
//         setDescription("");
//         setCost(0);
//         setPrice(0);
//         setCashback(0);
//         setValidity("30 Days");
//         setProviderProductId("");
//         setCategoryId(categoryOptions[0]?.id || "");
//         setIsHot(false);

//         onOpenChange(false);
//     };

//     return (
//         <Dialog open={open} onOpenChange={onOpenChange}>
//             <DialogContent className="sm:max-w-[500px] p-0 overflow-auto max-h-[90vh] w-[95vw] sm:w-full rounded-lg">
//                 <DialogHeader className="p-4 border-b">
//                     <div className="flex justify-between items-center w-full">
//                         <DialogTitle className="text-xl font-bold">Add Data Plan</DialogTitle>
//                         <button
//                             onClick={() => onOpenChange(false)}
//                             className="text-sm text-gray-500 flex items-center"
//                         >
//                             Close <span className="ml-1">×</span>
//                         </button>
//                     </div>
//                 </DialogHeader>

//                 <div className="p-4 space-y-4">
//                     <div className="space-y-2">
//                         <Label htmlFor="add-name">Name</Label>
//                         <Input
//                             id="add-name"
//                             value={name}
//                             onChange={(e) => setName(e.target.value)}
//                             placeholder="e.g. 1.0GB"
//                         />
//                     </div>

//                     <div className="space-y-2">
//                         <Label htmlFor="add-description">Description</Label>
//                         <Input
//                             id="add-description"
//                             value={description}
//                             onChange={(e) => setDescription(e.target.value)}
//                             placeholder="e.g. 1.0GB 30 days"
//                         />
//                     </div>

//                     <div className="grid grid-cols-2 gap-4">
//                         <div className="space-y-2">
//                             <Label htmlFor="add-cost">Cost Price</Label>
//                             <Input
//                                 id="add-cost"
//                                 type="number"
//                                 value={cost}
//                                 onChange={(e) => setCost(Number(e.target.value))}
//                             />
//                         </div>

//                         <div className="space-y-2">
//                             <Label htmlFor="add-price">Selling Price</Label>
//                             <Input
//                                 id="add-price"
//                                 type="number"
//                                 value={price}
//                                 onChange={(e) => setPrice(Number(e.target.value))}
//                             />
//                         </div>
//                     </div>

//                     <div className="grid grid-cols-2 gap-4">
//                         <div className="space-y-2">
//                             <Label htmlFor="add-cashback">Cashback</Label>
//                             <Input
//                                 id="add-cashback"
//                                 type="number"
//                                 value={cashback}
//                                 onChange={(e) => setCashback(Number(e.target.value))}
//                             />
//                         </div>

//                         <div className="space-y-2">
//                             <Label htmlFor="add-validity">Validity</Label>
//                             <Input
//                                 id="add-validity"
//                                 value={validity}
//                                 onChange={(e) => setValidity(e.target.value)}
//                             />
//                         </div>
//                     </div>
//                     <div className="space-y-2">
//                         <Label htmlFor="add-provider">Provider Product ID</Label>
//                         <Select value={providerProductId} onValueChange={setProviderProductId}>
//                             <SelectTrigger id="add-provider">
//                                 <SelectValue placeholder="Select provider" />
//                             </SelectTrigger>
//                             <SelectContent>
//                                 <SelectItem value="ARTX">ARTX</SelectItem>
//                                 <SelectItem value="VTPASS">VTPASS</SelectItem>
//                                 <SelectItem value="SIMACCESS">SIMACCESS</SelectItem>
//                                 <SelectItem value="RELOADLY">RELOADLY</SelectItem>
//                             </SelectContent>
//                         </Select>
//                     </div>

//                     <div className="space-y-2">
//                         <Label htmlFor="add-category">Category</Label>
//                         <Select value={categoryId} onValueChange={setCategoryId}>
//                             <SelectTrigger id="add-category">
//                                 <SelectValue placeholder="Select category" />
//                             </SelectTrigger>
//                             <SelectContent>
//                                 {categoryOptions.map((category) => (
//                                     <SelectItem key={category.id} value={category.id}>
//                                         {category.displayName}
//                                     </SelectItem>
//                                 ))}
//                             </SelectContent>
//                         </Select>
//                     </div>

//                     <div className="flex items-center space-x-2">
//                         <Label htmlFor="add-isHot" className="flex-grow">Hot Deal</Label>
//                         <Switch
//                             id="add-isHot"
//                             checked={isHot}
//                             onCheckedChange={setIsHot}
//                         />
//                     </div>
//                 </div>

//                 <div className="p-4 pt-0">
//                     <Button
//                         onClick={handleAdd}
//                         className="w-full py-2 bg-primary text-black rounded-md"
//                         disabled={!name || !description || cost <= 0 || price <= 0 || !categoryId}
//                     >
//                         Add Product
//                     </Button>
//                 </div>
//             </DialogContent>
//         </Dialog>
//     );
// };

// interface EditProductModalProps {
//     open: boolean;
//     onOpenChange: (open: boolean) => void;
//     product: any;
//     onEdit: (productId: string, updates: any) => void;
//     categoryOptions: { id: string; name: string; displayName: string }[];
// }

// const EditProductModal: React.FC<EditProductModalProps> = ({
//     open,
//     onOpenChange,
//     product,
//     onEdit,
//     categoryOptions
// }) => {
//     const [name, setName] = useState("");
//     const [description, setDescription] = useState("");
//     const [cost, setCost] = useState(0);
//     const [price, setPrice] = useState(0);
//     const [cashback, setCashback] = useState(0);
//     const [validity, setValidity] = useState("");
//     const [providerProductId, setProviderProductId] = useState("");
//     const [categoryId, setCategoryId] = useState("");
//     const [isHot, setIsHot] = useState(false);

//     useEffect(() => {
//         if (product) {
//             setName(product.name || "");
//             setDescription(product.description || "");
//             setCost(product.cost || 0);
//             setPrice(product.price || 0);
//             setCashback(product.cashback || 0);
//             setValidity(product.validity || "");
//             setProviderProductId(product.providerProductId || "");
//             setCategoryId(product.serviceProductCategoryId || "");
//             setIsHot(product.isHot || false);
//         }
//     }, [product]);

//     const handleEdit = () => {
//         const updates = {
//             name,
//             description,
//             cost: Number(cost),
//             price: Number(price),
//             cashback: Number(cashback),
//             validity,
//             providerProductId,
//             serviceProductCategoryId: categoryId,
//             isHot,
//         };

//         onEdit(product.id, updates);
//         onOpenChange(false);
//     };

//     return (
//         <Dialog open={open} onOpenChange={onOpenChange}>
//             <DialogContent className="sm:max-w-[500px] p-0 overflow-auto max-h-[90vh] w-[95vw] sm:w-full rounded-lg">
//                 <DialogHeader className="p-4 border-b">
//                     <div className="flex justify-between items-center w-full">
//                         <DialogTitle className="text-xl font-bold">Edit Data Plan</DialogTitle>
//                         <button
//                             onClick={() => onOpenChange(false)}
//                             className="text-sm text-gray-500 flex items-center"
//                         >
//                             Close <span className="ml-1">×</span>
//                         </button>
//                     </div>
//                 </DialogHeader>

//                 <div className="p-4 space-y-4">
//                     <div className="space-y-2">
//                         <Label htmlFor="edit-name">Name</Label>
//                         <Input
//                             id="edit-name"
//                             value={name}
//                             onChange={(e) => setName(e.target.value)}
//                             placeholder="e.g. 1.0GB"
//                         />
//                     </div>

//                     <div className="space-y-2">
//                         <Label htmlFor="edit-description">Description</Label>
//                         <Input
//                             id="edit-description"
//                             value={description}
//                             onChange={(e) => setDescription(e.target.value)}
//                             placeholder="e.g. 1.0GB 30 days"
//                         />
//                     </div>

//                     <div className="grid grid-cols-2 gap-4">
//                         <div className="space-y-2">
//                             <Label htmlFor="edit-cost">Cost Price</Label>
//                             <Input
//                                 id="edit-cost"
//                                 type="number"
//                                 value={cost}
//                                 onChange={(e) => setCost(Number(e.target.value))}
//                             />
//                         </div>

//                         <div className="space-y-2">
//                             <Label htmlFor="edit-price">Selling Price</Label>
//                             <Input
//                                 id="edit-price"
//                                 type="number"
//                                 value={price}
//                                 onChange={(e) => setPrice(Number(e.target.value))}
//                             />
//                         </div>
//                     </div>

//                     <div className="grid grid-cols-2 gap-4">
//                         <div className="space-y-2">
//                             <Label htmlFor="edit-cashback">Cashback</Label>
//                             <Input
//                                 id="edit-cashback"
//                                 type="number"
//                                 value={cashback}
//                                 onChange={(e) => setCashback(Number(e.target.value))}
//                             />
//                         </div>

//                         <div className="space-y-2">
//                             <Label htmlFor="edit-validity">Validity</Label>
//                             <Input
//                                 id="edit-validity"
//                                 value={validity}
//                                 onChange={(e) => setValidity(e.target.value)}
//                             />
//                         </div>
//                     </div>
//                     <div className="space-y-2">
//                         <Label htmlFor="edit-provider">Provider Product ID</Label>
//                         <Select value={providerProductId} onValueChange={setProviderProductId}>
//                             <SelectTrigger id="edit-provider">
//                                 <SelectValue placeholder="Select provider" />
//                             </SelectTrigger>
//                             <SelectContent>
//                                 <SelectItem value="ARTX">ARTX</SelectItem>
//                                 <SelectItem value="VTPASS">VTPASS</SelectItem>
//                                 <SelectItem value="SIMACCESS">SIMACCESS</SelectItem>
//                                 <SelectItem value="RELOADLY">RELOADLY</SelectItem>
//                             </SelectContent>
//                         </Select>
//                     </div>

//                     <div className="space-y-2">
//                         <Label htmlFor="edit-category">Category</Label>
//                         <Select value={categoryId} onValueChange={setCategoryId}>
//                             <SelectTrigger id="edit-category">
//                                 <SelectValue placeholder="Select category" />
//                             </SelectTrigger>
//                             <SelectContent>
//                                 {categoryOptions.map((category) => (
//                                     <SelectItem key={category.id} value={category.id}>
//                                         {category.displayName}
//                                     </SelectItem>
//                                 ))}
//                             </SelectContent>
//                         </Select>
//                     </div>

//                     <div className="flex items-center space-x-2">
//                         <Label htmlFor="edit-isHot" className="flex-grow">Hot Deal</Label>
//                         <Switch
//                             id="edit-isHot"
//                             checked={isHot}
//                             onCheckedChange={setIsHot}
//                         />
//                     </div>
//                 </div>

//                 <div className="p-4 pt-0">
//                     <Button
//                         onClick={handleEdit}
//                         className="w-full py-2 bg-primary text-black rounded-md"
//                         disabled={!name || !description || cost <= 0 || price <= 0 || !categoryId}
//                     >
//                         Update Product
//                     </Button>
//                 </div>
//             </DialogContent>
//         </Dialog>
//     );
// };

// interface ProductRowProps {
//     product: any;
//     onSave: (productId: string, updates: any) => void;
//     onToggleHot: (productId: string, isHot: boolean) => void;
//     onDelete: (productId: string, name: string) => void;
//     onEdit: (productId: string, updates: any) => void;
//     categoryOptions: { id: string; name: string; displayName: string }[];
// }

// const ProductRow: React.FC<ProductRowProps> = ({
//     product,
//     onToggleHot,
//     onDelete,
//     onEdit,
//     categoryOptions
// }) => {
//     const [editModalOpen, setEditModalOpen] = useState(false);

//     const categoryLabel = product.serviceProductCategory?.displayName || "-";

//     return (
//         <>
//             <TableRow className="border-b border-gray-200">
//                 <TableCell className="py-3 sm:py-5 pl-4">
//                     <div className="flex flex-col">
//                         <span className="font-medium">{product.name}</span>
//                         <span className="text-xs text-gray-500">{product.description}</span>
//                         <span className="text-xs text-primary-600 mt-1">
//                             {categoryLabel}
//                         </span>
//                     </div>
//                 </TableCell>
//                 <TableCell className="text-text-body font-poppins text-base py-3">
//                     ₦{product.cost.toLocaleString()}
//                 </TableCell>
//                 <TableCell className="text-text-body font-poppins text-base py-3">
//                     ₦{product.price.toLocaleString()}
//                 </TableCell>
//                 <TableCell className="text-text-body font-poppins text-base py-3">
//                     {product.cashback ? `₦${product.cashback.toLocaleString()}` : '-'}
//                 </TableCell>
//                 <TableCell className="text-text-body font-poppins text-base py-3">
//                     {product.validity || '-'}
//                 </TableCell>
//                 <TableCell className="text-center py-3">
//                     <Switch
//                         checked={product.isHot}
//                         onCheckedChange={(checked) => onToggleHot(product.id, checked)}
//                         className="scale-100 sm:scale-125 data-[state=checked]:bg-primary"
//                     />
//                 </TableCell>
//                 <TableCell>
//                     <div className="flex space-x-2">
//                         <Button
//                             variant="ghost"
//                             className="h-8 w-8 p-0"
//                             onClick={() => setEditModalOpen(true)}
//                         >
//                             <Edit className="h-4 w-4 text-blue-500" />
//                         </Button>
//                         <Button
//                             variant="ghost"
//                             className="h-8 w-8 p-0"
//                             onClick={() => onDelete(product.id, product.name)}
//                         >
//                             <Trash2 className="h-4 w-4 text-red-500" />
//                         </Button>
//                     </div>
//                 </TableCell>
//             </TableRow>

//             <EditProductModal
//                 open={editModalOpen}
//                 onOpenChange={setEditModalOpen}
//                 product={product}
//                 onEdit={onEdit}
//                 categoryOptions={categoryOptions}
//             />
//         </>
//     );
// };

// const DataPlanManagement = () => {
//     const router = useRouter();
//     const pathname = usePathname();
//     const searchParams = useSearchParams();

//     const {
//         services,
//         brands,
//         selectedServiceId,
//         selectedService,
//         setSelectedService,
//         getServices,
//         getBrands,
//         isLoading: brandsLoading
//     } = useServiceStore();

//     const { productCategories, getProductCategories } = useProductCategoryStore();

//     const {
//         products,
//         productsTotal,
//         productsPage,
//         productsLimit,
//         isLoading: productsLoading,
//         getProducts,
//         updateProduct,
//         toggleProductHot,
//         deleteProduct,
//         addProduct,
//     } = useProductStore();

//     const urlServiceId = searchParams.get('serviceId');
//     const serviceId = urlServiceId || selectedServiceId || '';

//     const pageParam = searchParams.get('page');
//     const limitParam = searchParams.get('limit');

//     const currentPage = pageParam ? parseInt(pageParam) : productsPage || 1;
//     const pageSize = limitParam ? parseInt(limitParam) : productsLimit || 10;

//     const [selectedNetworkId, setSelectedNetworkId] = useState<string>("");
//     const [selectedNetwork, setSelectedNetwork] = useState<string>("");
//     const [addProductOpen, setAddProductOpen] = useState<boolean>(false);
//     const [categoryOptions, setCategoryOptions] = useState<any[]>([]);
//     const [searchTerm, setSearchTerm] = useState<string>("");

//     const totalPages = Math.ceil(productsTotal / pageSize);

//     useEffect(() => {
//         const loadServices = async () => {
//             if (services.length === 0) {
//                 try {
//                     await getServices();
//                 } catch (error) {
//                     console.error('Failed to load services:', error);
//                 }
//             }
//         };

//         loadServices();
//     }, [getServices, services.length]);

//     useEffect(() => {
//         if (services.length > 0) {
//             if (!serviceId) {
//                 const dataService = services.find(s => s.label.toLowerCase() === 'data');
//                 if (dataService) {
//                     setSelectedService('data' as ServiceType, dataService.id);

//                     const params = new URLSearchParams(searchParams.toString());
//                     params.set('serviceId', dataService.id);
//                     router.push(`${pathname}?${params.toString()}`);
//                 }
//             } else {
//                 const currentService = services.find(s => s.id === serviceId);
//                 if (currentService && selectedServiceId !== serviceId) {
//                     setSelectedService(currentService.label.toLowerCase() as ServiceType, currentService.id);
//                 }
//             }
//         }
//     }, [services, serviceId, selectedServiceId, setSelectedService, pathname, searchParams, router]);

//     useEffect(() => {
//         const fetchInitialData = async () => {
//             if (!serviceId) return;

//             try {
//                 await getProductCategories();
//                 await getBrands(serviceId, 1, 100, '');
//             } catch (error: any) {
//                 toast.error("Failed to load initial data", {
//                     description: error.message || "An error occurred"
//                 });
//             }
//         };

//         fetchInitialData();
//     }, [serviceId, getProductCategories, getBrands]);

//     useEffect(() => {
//         setCategoryOptions(productCategories);
//     }, [productCategories]);

//     useEffect(() => {
//         if (brands.length > 0 && serviceId) {
//             if (!selectedNetworkId) {
//                 const firstNetwork = brands[0];
//                 setSelectedNetworkId(firstNetwork.id);
//                 setSelectedNetwork(firstNetwork.name);
//             }

//             if (selectedNetworkId) {
//                 getProducts({
//                     serviceId,
//                     brandId: selectedNetworkId,
//                     page: currentPage,
//                     limit: pageSize,
//                     search: searchTerm
//                 });
//             }
//         }
//     }, [brands, serviceId, selectedNetworkId, currentPage, pageSize, searchTerm]);

//     const handleNetworkSelect = (networkId: string, networkName: string) => {
//         setSelectedNetworkId(networkId);
//         setSelectedNetwork(networkName);

//         getProducts({
//             serviceId,
//             brandId: networkId,
//             page: 1,
//             limit: pageSize,
//             search: searchTerm
//         });
//     };

//     const handlePageChange = (page: number) => {
//         getProducts({
//             serviceId,
//             brandId: selectedNetworkId,
//             page,
//             limit: pageSize,
//             search: searchTerm
//         });
//     };

//     const handleSearch = () => {
//         getProducts({
//             serviceId,
//             brandId: selectedNetworkId,
//             page: 1,
//             limit: pageSize,
//             search: searchTerm
//         });
//     };

//     const handleUpdateProduct = async (productId: string, updates: any) => {
//         try {
//             await updateProduct(productId, updates);
//             toast.success("Product updated successfully");

//             getProducts({
//                 serviceId,
//                 brandId: selectedNetworkId,
//                 page: currentPage,
//                 limit: pageSize,
//                 search: searchTerm
//             });
//         } catch (error: any) {
//             toast.error("Failed to update product", {
//                 description: error.message || "An error occurred"
//             });
//         }
//     };

//     const handleDeleteProduct = async (productId: string, productName: string) => {
//         if (confirm(`Are you sure you want to delete "${productName}"?`)) {
//             try {
//                 await deleteProduct(productId);
//                 toast.success(`"${productName}" deleted successfully`);

//                 if (products.length === 1 && currentPage > 1) {
//                     handlePageChange(currentPage - 1);
//                 } else {
//                     getProducts({
//                         serviceId,
//                         brandId: selectedNetworkId,
//                         page: currentPage,
//                         limit: pageSize,
//                         search: searchTerm
//                     });
//                 }
//             } catch (error: any) {
//                 toast.error("Failed to delete product", {
//                     description: error.message || "An error occurred"
//                 });
//             }
//         }
//     };

//     const handleToggleHot = async (productId: string, isHot: boolean) => {
//         try {
//             await toggleProductHot(productId, isHot);
//             toast.success(`Hot deal ${isHot ? 'enabled' : 'disabled'}`);
//         } catch (error: any) {
//             toast.error("Failed to update product", {
//                 description: error.message || "An error occurred"
//             });
//         }
//     };

//     const handleAddProduct = async (productData: any) => {
//         try {
//             await addProduct(productData);
//             toast.success("Product added successfully");
//             handlePageChange(1);
//         } catch (error: any) {
//             toast.error("Failed to add product", {
//                 description: error.message || "An error occurred"
//             });
//         }
//     };

//     if (!serviceId) {
//         return (
//             <div className="mt-6 flex justify-center items-center h-64">
//                 <div className="animate-pulse">Loading data plan service...</div>
//             </div>
//         );
//     }

//     if (brandsLoading || !brands.length) {
//         return (
//             <>
//                 <div className="mt-6">
//                     <NetworkSelectionSkeleton />
//                     <DataPlanTableSkeleton />
//                 </div>
//             </>
//         );
//     }

//     return (
//         <>
//             <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 w-full mb-6 mt-6">
//                 {brands.map((brand) => (
//                     <NetworkItem
//                         key={brand.id}
//                         network={brand}
//                         isSelected={selectedNetworkId === brand.id}
//                         onSelect={() => handleNetworkSelect(brand.id, brand.name)}
//                     />
//                 ))}
//             </div>

//             {productsLoading ? (
//                 <DataPlanTableSkeleton />
//             ) : selectedNetworkId ? (
//                 <div className="w-full mx-auto bg-white rounded-lg overflow-hidden">
//                     <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 sm:p-6 gap-4">
//                         <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Data Plan - {selectedNetwork}</h1>
//                         <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
//                             <Button
//                                 className="bg-primary text-text-title text-[16px] flex flex-row w-full sm:w-[182px] h-[48px] gap-1 font-normal font-poppins rounded-md px-4 py-3"
//                                 onClick={() => setAddProductOpen(true)}
//                             >
//                                 <Plus className="h-5 w-5 mr-2" />
//                                 Add Plan
//                             </Button>
//                         </div>
//                     </div>

//                     <div className="overflow-x-auto">
//                         <Table className="w-full">
//                             <TableHeader>
//                                 <TableRow className="bg-primary-alpha-8 hover:bg-primary-alpha-8 border-b border-gray-200">
//                                     <TableHead className="font-medium text-sm sm:text-[16px] text-gray-700 py-3 pl-4">Data Plan</TableHead>
//                                     <TableHead className="font-medium text-sm sm:text-[16px] text-gray-700 py-3">Cost Price</TableHead>
//                                     <TableHead className="font-medium text-sm sm:text-[16px] text-gray-700 py-3">Selling Price</TableHead>
//                                     <TableHead className="font-medium text-sm sm:text-[16px] text-gray-700 py-3">Cashback</TableHead>
//                                     <TableHead className="font-medium text-sm sm:text-[16px] text-gray-700 py-3">Validity</TableHead>
//                                     <TableHead className="font-medium text-sm sm:text-[16px] text-gray-700 py-3">Hot Deal</TableHead>
//                                     <TableHead className="font-medium text-sm sm:text-[16px] text-gray-700 py-3">Actions</TableHead>
//                                 </TableRow>
//                             </TableHeader>
//                             <TableBody>
//                                 {products.length === 0 ? (
//                                     <TableRow>
//                                         <TableCell colSpan={7} className="text-center py-8 text-gray-500">
//                                             You have not selected any Brand yet
//                                         </TableCell>
//                                     </TableRow>
//                                 ) : (
//                                     products.map((product) => (
//                                         <ProductRow
//                                             key={product.id}
//                                             product={product}
//                                             onSave={handleUpdateProduct}
//                                             onToggleHot={handleToggleHot}
//                                             onDelete={handleDeleteProduct}
//                                             onEdit={handleUpdateProduct}
//                                             categoryOptions={categoryOptions}
//                                         />
//                                     ))
//                                 )}
//                             </TableBody>
//                         </Table>
//                     </div>

//                     {productsTotal > 0 && (
//                         <Pagination
//                             currentPage={currentPage}
//                             totalPages={totalPages}
//                             onPageChange={handlePageChange}
//                         />
//                     )}

//                     <div className="text-center text-sm text-gray-500 py-3">
//                         Showing {products.length} of {productsTotal} records
//                     </div>
//                 </div>
//             ) : (
//                 <div className="w-full mx-auto bg-white rounded-lg p-6 text-center">
//                     <p className="text-gray-500">Loading data plans...</p>
//                 </div>
//             )}

//             {selectedNetworkId && (
//                 <AddProductModal
//                     open={addProductOpen}
//                     onOpenChange={setAddProductOpen}
//                     serviceId={serviceId}
//                     brandId={selectedNetworkId}
//                     onAdd={handleAddProduct}
//                     categoryOptions={categoryOptions}
//                 />
//             )}
//         </>
//     );
// };

// export default DataPlanManagement;
