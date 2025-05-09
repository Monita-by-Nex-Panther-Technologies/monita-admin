"use client"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useServiceStore } from "@/store/BillpaymentStore"
import debounce from 'lodash/debounce'
import { ChevronLeft, ChevronRight, Pencil, Plus, Search, Trash2, X } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import React, { ChangeEvent, useCallback, useEffect, useState } from "react"
import { toast } from "sonner"

// Brand Modal props
interface AddBrandModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    serviceId: string
    name: string
    setName: (value: string) => void
    label: string
    setLabel: (value: string) => void
    providerInternalId: string
    setProviderInternalId: (value: string) => void
    providerBrandId: string
    setProviderBrandId: (value: string) => void
    isEnabled: boolean
    setIsEnabled: (value: boolean) => void
    onAdd: () => void
}

// Edit Brand Modal props
interface EditBrandModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    brandId: string
    name: string
    setName: (value: string) => void
    label: string
    setLabel: (value: string) => void
    providerInternalId: string
    setProviderInternalId: (value: string) => void
    providerBrandId: string
    setProviderBrandId: (value: string) => void
    isEnabled: boolean
    setIsEnabled: (value: boolean) => void
    onUpdate: () => void
}

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

// Add Brand Modal Component
const AddBrandModal: React.FC<AddBrandModalProps> = ({
    open,
    onOpenChange,
    serviceId,
    name,
    setName,
    label,
    setLabel,
    providerInternalId,
    setProviderInternalId,
    providerBrandId,
    setProviderBrandId,
    isEnabled,
    setIsEnabled,
    onAdd,
}) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] p-0 overflow-auto max-h-[90vh] w-[95vw] sm:w-full rounded-lg dialog-no-default-close-button">
                <div className="p-4 pb-0">
                    <div className="flex flex-col justify-center items-start w-[90%]">
                        <DialogTitle className="text-xl sm:text-2xl font-bold">Add Brand</DialogTitle>
                        <div className="h-[1px] bg-gray-200 w-full flex mt-3 mx-auto"></div>
                    </div>
                </div>

                <div className="p-4 pt-4 bg-background-alt">
                    <div className="bg-white rounded-lg px-4 py-6">
                        <div className="space-y-3">
                            <div className="space-y-1">
                                <Label htmlFor="name" className="text-sm font-medium">
                                    Brand Name
                                </Label>
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                                    placeholder="Enter Brand Name"
                                    className="h-10 text-sm rounded-lg border-gray-300"
                                />
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="label" className="text-sm font-medium">
                                    Brand Label
                                </Label>
                                <Input
                                    id="label"
                                    value={label}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setLabel(e.target.value)}
                                    placeholder="Enter Brand Label"
                                    className="h-10 text-sm rounded-lg border-gray-300"
                                />
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="providerInternalId" className="text-sm font-medium">
                                    Provider Internal ID
                                </Label>
                                <Input
                                    id="providerInternalId"
                                    value={providerInternalId}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setProviderInternalId(e.target.value)}
                                    placeholder="e.g. VTPASS"
                                    className="h-10 text-sm rounded-lg border-gray-300"
                                />
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="providerBrandId" className="text-sm font-medium">
                                    Provider Brand ID
                                </Label>
                                <Input
                                    id="providerBrandId"
                                    value={providerBrandId}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setProviderBrandId(e.target.value)}
                                    placeholder="e.g. mtn"
                                    className="h-10 text-sm rounded-lg border-gray-300"
                                />
                            </div>

                            <div className="flex items-center justify-between pt-2">
                                <span className="text-sm font-medium">Enable Brand</span>
                                <Switch
                                    checked={isEnabled}
                                    onCheckedChange={setIsEnabled}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-background w-full pt-1 my-auto justify-center items-center">
                    <Button
                        onClick={onAdd}
                        disabled={!name || !label || !providerInternalId || !providerBrandId}
                        className="w-[80%] mx-auto flex my-auto mt-4 mb-4 h-12 text-base font-semibold bg-[#f0ffc2] hover:bg-[#e5f5b7] disabled:bg-gray-200 disabled:text-gray-500 text-black rounded-full"
                    >
                        Add Brand
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

// Edit Brand Modal Component
const EditBrandModal: React.FC<EditBrandModalProps> = ({
    open,
    onOpenChange,
    brandId,
    name,
    setName,
    label,
    setLabel,
    providerInternalId,
    setProviderInternalId,
    providerBrandId,
    setProviderBrandId,
    isEnabled,
    setIsEnabled,
    onUpdate,
}) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] p-0 overflow-auto max-h-[90vh] w-[95vw] sm:w-full rounded-lg dialog-no-default-close-button">
                <div className="p-4 pb-0">
                    <div className="flex flex-col justify-center items-start w-[90%]">
                        <DialogTitle className="text-xl sm:text-2xl font-bold">Edit Brand</DialogTitle>
                        <div className="h-[1px] bg-gray-200 w-full flex mt-3 mx-auto"></div>
                    </div>
                </div>

                <div className="p-4 pt-4 bg-background-alt">
                    <div className="bg-white rounded-lg px-4 py-6">
                        <div className="space-y-3">
                            <div className="space-y-1">
                                <Label htmlFor="edit-name" className="text-sm font-medium">
                                    Brand Name
                                </Label>
                                <Input
                                    id="edit-name"
                                    value={name}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                                    placeholder="Enter Brand Name"
                                    className="h-10 text-sm rounded-lg border-gray-300"
                                />
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="edit-label" className="text-sm font-medium">
                                    Brand Label
                                </Label>
                                <Input
                                    id="edit-label"
                                    value={label}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setLabel(e.target.value)}
                                    placeholder="Enter Brand Label"
                                    className="h-10 text-sm rounded-lg border-gray-300"
                                />
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="edit-providerInternalId" className="text-sm font-medium">
                                    Provider Internal ID
                                </Label>
                                <Input
                                    id="edit-providerInternalId"
                                    value={providerInternalId}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setProviderInternalId(e.target.value)}
                                    placeholder="e.g. VTPASS"
                                    className="h-10 text-sm rounded-lg border-gray-300"
                                />
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="edit-providerBrandId" className="text-sm font-medium">
                                    Provider Brand ID
                                </Label>
                                <Input
                                    id="edit-providerBrandId"
                                    value={providerBrandId}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setProviderBrandId(e.target.value)}
                                    placeholder="e.g. mtn"
                                    className="h-10 text-sm rounded-lg border-gray-300"
                                />
                            </div>

                            <div className="flex items-center justify-between pt-2">
                                <span className="text-sm font-medium">Enable Brand</span>
                                <Switch
                                    checked={isEnabled}
                                    onCheckedChange={setIsEnabled}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-background w-full pt-1 my-auto justify-center items-center">
                    <Button
                        onClick={onUpdate}
                        disabled={!name || !label || !providerInternalId || !providerBrandId}
                        className="w-[80%] mx-auto flex my-auto mt-4 mb-4 h-12 text-base font-semibold bg-[#f0ffc2] hover:bg-[#e5f5b7] disabled:bg-gray-200 disabled:text-gray-500 text-black rounded-full"
                    >
                        Update Brand
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

// Brand table skeleton loader
const BrandTableSkeleton = () => {
    return (
        <div className="w-full bg-background py-6 rounded-sm">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 w-full px-4 sm:px-8 gap-4">
                <div className="h-12 w-full sm:w-64 bg-gray-200 animate-pulse rounded-lg"></div>
                <div className="flex gap-4">
                    <div className="h-12 w-full sm:w-40 bg-gray-200 animate-pulse rounded-lg"></div>
                </div>
            </div>

            <div className="px-4 sm:px-8">
                <div className="h-12 w-full bg-gray-200 animate-pulse rounded-lg mb-4"></div>
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-16 w-full bg-gray-200 animate-pulse rounded-lg mb-2"></div>
                ))}
            </div>
        </div>
    );
};

// Table row skeleton for search results loading
const TableRowSkeleton = () => (
    <TableRow>
        <TableCell className="py-4 pl-6">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-200 animate-pulse rounded-full"></div>
                <div className="h-5 w-24 bg-gray-200 animate-pulse rounded"></div>
            </div>
        </TableCell>
        <TableCell>
            <div className="h-5 w-16 bg-gray-200 animate-pulse rounded"></div>
        </TableCell>
        <TableCell>
            <div className="h-5 w-16 bg-gray-200 animate-pulse rounded"></div>
        </TableCell>
        <TableCell>
            <div className="h-5 w-16 bg-gray-200 animate-pulse rounded"></div>
        </TableCell>
        <TableCell>
            <div className="h-5 w-10 bg-gray-200 animate-pulse rounded"></div>
        </TableCell>
        <TableCell>
            <div className="flex space-x-2">
                <div className="h-8 w-8 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-8 w-8 bg-gray-200 animate-pulse rounded"></div>
            </div>
        </TableCell>
    </TableRow>
);

const BrandManagement: React.FC = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Get URL parameters
    const pageParam = searchParams.get('page');
    const limitParam = searchParams.get('limit');
    const serviceIdParam = searchParams.get('serviceId');
    const searchParam = searchParams.get('search');

    const currentPage = pageParam ? parseInt(pageParam) : 1;
    const pageSize = limitParam ? parseInt(limitParam) : 10;

    // Store hooks
    const {
        brands,
        brandsTotal,
        isLoading,
        services,
        getBrands,
        getServices,
        addBrand,
        updateBrand,
        deleteBrand,
        toggleBrandStatus
    } = useServiceStore();

    // Local state
    const [searchTerm, setSearchTerm] = useState<string>(searchParam || "");
    const [selectedServiceId, setSelectedServiceId] = useState<string>(serviceIdParam || "");
    const [addBrandOpen, setAddBrandOpen] = useState<boolean>(false);
    const [editBrandOpen, setEditBrandOpen] = useState<boolean>(false);
    const [currentBrandId, setCurrentBrandId] = useState<string>("");
    const [isSearching, setIsSearching] = useState<boolean>(false);

    // Add Brand state
    const [name, setName] = useState<string>("");
    const [label, setLabel] = useState<string>("");
    const [providerInternalId, setProviderInternalId] = useState<string>("VTPASS");
    const [providerBrandId, setProviderBrandId] = useState<string>("");
    const [enabled, setEnabled] = useState<boolean>(true);

    // Edit Brand state
    const [editName, setEditName] = useState<string>("");
    const [editLabel, setEditLabel] = useState<string>("");
    const [editProviderInternalId, setEditProviderInternalId] = useState<string>("");
    const [editProviderBrandId, setEditProviderBrandId] = useState<string>("");
    const [editEnabled, setEditEnabled] = useState<boolean>(true);

    // Calculate total pages
    const totalPages = Math.ceil(brandsTotal / pageSize);

    // Function to update URL with new parameters
    const updateUrlParams = (newParams: Record<string, string | number>) => {
        const params = new URLSearchParams(searchParams.toString());

        Object.entries(newParams).forEach(([key, value]) => {
            if (value) {
                params.set(key, value.toString());
            } else {
                params.delete(key);
            }
        });

        router.push(`${window.location.pathname}?${params.toString()}`);
    };

    // Debounced search function
    const debouncedSearch = useCallback(
        debounce(async (term: string) => {
            try {
                setIsSearching(true);
                await getBrands(selectedServiceId, currentPage, pageSize, term);
            } catch (error: any) {
                toast.error("Search failed", {
                    description: error.message || "An error occurred"
                });
            } finally {
                setIsSearching(false);
            }
        }, 500),
        [selectedServiceId, currentPage, pageSize, getBrands]
    );

    // Fetch services on mount
    useEffect(() => {
        const fetchServices = async () => {
            try {
                await getServices();
            } catch (error: any) {
                toast.error("Failed to load services", {
                    description: error.message || "An error occurred"
                });
            }
        };

        fetchServices();
    }, [getServices]);

    // Fetch brands when service, page, or search changes
    useEffect(() => {
        const fetchBrands = async () => {
            try {
                await getBrands(selectedServiceId, currentPage, pageSize, searchTerm);
            } catch (error: any) {
                toast.error("Failed to load brands", {
                    description: error.message || "An error occurred"
                });
            }
        };

        fetchBrands();
    }, [selectedServiceId, currentPage, pageSize, getBrands]);

    // Handle search term changes
    useEffect(() => {
        updateUrlParams({ search: searchTerm, page: 1 });

        if (searchTerm) {
            debouncedSearch(searchTerm);
        } else {
            getBrands(selectedServiceId, currentPage, pageSize);
        }
    }, [searchTerm, selectedServiceId, debouncedSearch, getBrands]);

    // Handlers
    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleClearSearch = () => {
        setSearchTerm("");
    };

    const handleServiceChange = (value: string) => {
        setSelectedServiceId(value);
        updateUrlParams({ serviceId: value, page: 1 });
    };

    const handlePageChange = (page: number) => {
        updateUrlParams({ page });
    };

    const handleAddBrand = async () => {
        if (!selectedServiceId) {
            toast.error("Please select a service first");
            return;
        }

        try {
            const brandData = {
                name,
                label,
                serviceId: selectedServiceId,
                providerInternalId,
                providerBrandId,
                isEnabled: enabled
            };

            await addBrand(brandData);
            toast.success("Brand added successfully");

            // Reset form
            setName("");
            setLabel("");
            setProviderInternalId("VTPASS");
            setProviderBrandId("");
            setEnabled(true);

            setAddBrandOpen(false);

            // Refresh brands list
            await getBrands(selectedServiceId, currentPage, pageSize, searchTerm);
        } catch (error: any) {
            toast.error("Failed to add brand", {
                description: error.message || "An error occurred"
            });
        }
    };

    const handleEditClick = (brand: any) => {
        setCurrentBrandId(brand.id);
        setEditName(brand.name);
        setEditLabel(brand.label);
        setEditProviderInternalId(brand.providerInternalId);
        setEditProviderBrandId(brand.providerBrandId);
        setEditEnabled(brand.isEnabled);
        setEditBrandOpen(true);
    };

    const handleUpdateBrand = async () => {
        try {
            const updatedData = {
                name: editName,
                label: editLabel,
                providerInternalId: editProviderInternalId,
                providerBrandId: editProviderBrandId,
                isEnabled: editEnabled
            };

            await updateBrand(currentBrandId, updatedData);
            toast.success("Brand updated successfully");
            setEditBrandOpen(false);

            // Refresh brands list
            await getBrands(selectedServiceId, currentPage, pageSize, searchTerm);
        } catch (error: any) {
            toast.error("Failed to update brand", {
                description: error.message || "An error occurred"
            });
        }
    };

    const handleToggleStatus = async (brandId: string, isEnabled: boolean) => {
        try {
            await toggleBrandStatus(brandId, isEnabled);
            toast.success(`Brand ${isEnabled ? 'enabled' : 'disabled'} successfully`);
        } catch (error: any) {
            toast.error("Failed to update brand status", {
                description: error.message || "An error occurred"
            });
        }
    };

    const handleDeleteBrand = async (brandId: string, brandName: string) => {
        if (confirm(`Are you sure you want to delete "${brandName}"?`)) {
            try {
                await deleteBrand(brandId);
                toast.success(`"${brandName}" deleted successfully`);

                // Refresh brands list and adjust page if necessary
                const newTotal = brandsTotal - 1;
                const newTotalPages = Math.ceil(newTotal / pageSize);
                const adjustedPage = currentPage > newTotalPages ? newTotalPages : currentPage;

                updateUrlParams({ page: adjustedPage || 1 });
                await getBrands(selectedServiceId, adjustedPage || 1, pageSize, searchTerm);
            } catch (error: any) {
                toast.error("Failed to delete brand", {
                    description: error.message || "An error occurred"
                });
            }
        }
    };

    // Brand logo helper function
    const getBrandLogo = (label: string) => {
        const normalizedLabel = label.toLowerCase();
        if (normalizedLabel.includes('mtn')) {
            return (
                <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center">
                    <span className="text-xs font-bold">MTN</span>
                </div>
            );
        } else if (normalizedLabel.includes('glo')) {
            return (
                <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center">
                    <span className="text-xs font-bold text-white">glo</span>
                </div>
            );
        } else if (normalizedLabel.includes('airtel')) {
            return (
                <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center">
                    <span className="text-xs font-bold text-white">A</span>
                </div>
            );
        } else if (normalizedLabel.includes('9mobile')) {
            return (
                <div className="w-6 h-6 rounded-full bg-green-400 flex items-center justify-center">
                    <span className="text-xs font-bold text-white">9</span>
                </div>
            );
        } else {
            return (
                <div className="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center">
                    <span className="text-xs font-bold text-white">{label.charAt(0)}</span>
                </div>
            );
        }
    };

    if (isLoading && brands.length === 0) {
        return <BrandTableSkeleton />;
    }

    return (
        <div className="w-full bg-background py-6 rounded-sm">
            {/* Header with filters and search */}
            <div className="flex flex-col gap-4 mb-6 w-full px-4 sm:px-8">
                {/* Service filter and Add button */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="w-full sm:w-64">
                        <Select value={selectedServiceId || undefined} onValueChange={handleServiceChange}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a service" />
                            </SelectTrigger>
                            <SelectContent>
                                {services.map((service) => (
                                    <SelectItem key={service.id} value={service.id}>
                                        {service.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Button
                        className="bg-primary w-full sm:w-auto text-text-body rounded-lg px-6 py-6 font-medium hover:bg-primary/90 flex items-center justify-center gap-2"
                        onClick={() => setAddBrandOpen(true)}
                    >
                        <Plus size={20} />
                        Add Brand
                    </Button>
                </div>

                {/* Search bar */}
                <div className="flex flex-row justify-center items-center w-full">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Search brands"
                            className="bg-background-alt w-full border-border rounded-l-[8px] p-4 pr-10"
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                        {searchTerm && (
                            <button
                                className="absolute right-0 top-0 h-full px-3 flex items-center justify-center text-gray-500 hover:text-gray-700"
                                onClick={handleClearSearch}
                            >
                                <X size={18} />
                            </button>
                        )}
                    </div>
                    <button
                        className="bg-primary rounded-r-[8px] p-4 px-6 flex-shrink-0"
                    >
                        <Search size={24} className="text-text-body" />
                    </button>
                </div>
            </div>

            {/* Brands Table */}
            <div className="overflow-auto">
                <Table className="w-full">
                    <TableHeader className="bg-primary-fade text-muted-foreground hover:bg-primary-fade ml-5 py-4">
                        <TableRow className="py-4">
                            <TableHead className="text-base font-poppins text-text-title pl-8">Name</TableHead>
                            <TableHead className="text-base font-poppins text-text-title">Label</TableHead>
                            <TableHead className="text-base font-poppins text-text-title">Provider</TableHead>
                            <TableHead className="text-base font-poppins text-text-title">Provider ID</TableHead>
                            <TableHead className="text-base font-poppins text-text-title">Status</TableHead>
                            <TableHead className="text-base font-poppins text-text-title">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="py-6">
                        {isSearching ? (
                            // Show skeleton rows when searching
                            Array(pageSize).fill(0).map((_, index) => (
                                <TableRowSkeleton key={`skeleton-${index}`} />
                            ))
                        ) : brands.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                    {selectedServiceId ?
                                        `No brands found for this service${searchTerm ? ` matching "${searchTerm}"` : ''}` :
                                        'Select a service to view brands'
                                    }
                                </TableCell>
                            </TableRow>
                        ) : (
                            brands.map((brand) => (
                                <TableRow key={brand.id} className="border-t-2">
                                    <TableCell className="py-4 pl-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-primary-fade rounded-full flex items-center justify-center overflow-hidden">
                                                {getBrandLogo(brand.label)}
                                            </div>
                                            <span className="text-base font-medium text-text-body">{brand.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-text-body font-poppins text-base py-6">{brand.label}</TableCell>
                                    <TableCell className="text-text-body font-poppins text-base py-6">{brand.providerInternalId}</TableCell>
                                    <TableCell className="text-text-body font-poppins text-base py-6">{brand.providerBrandId}</TableCell>
                                    <TableCell className="text-text-body font-poppins text-base py-6">
                                        <Switch
                                            checked={brand.isEnabled}
                                            onCheckedChange={(checked) => handleToggleStatus(brand.id, checked)}
                                            className="ml-4"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex space-x-2">
                                            <Button
                                                variant="ghost"
                                                className="h-8 w-8 p-0"
                                                onClick={() => handleEditClick(brand)}
                                            >
                                                <Pencil className="h-4 w-4 text-gray-500" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                className="h-8 w-8 p-0"
                                                onClick={() => handleDeleteBrand(brand.id, brand.name)}
                                            >
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {brandsTotal > 0 && totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            )}

            {/* Records count */}
            {brandsTotal > 0 && (
                <div className="text-center text-sm text-gray-500 py-3">
                    Showing {Math.min((currentPage - 1) * pageSize + 1, brandsTotal)} to{' '}
                    {Math.min(currentPage * pageSize, brandsTotal)} of {brandsTotal} brands
                </div>
            )}

            {/* Add Brand Modal */}
            <AddBrandModal
                open={addBrandOpen}
                onOpenChange={setAddBrandOpen}
                serviceId={selectedServiceId}
                name={name}
                setName={setName}
                label={label}
                setLabel={setLabel}
                providerInternalId={providerInternalId}
                setProviderInternalId={setProviderInternalId}
                providerBrandId={providerBrandId}
                setProviderBrandId={setProviderBrandId}
                isEnabled={enabled}
                setIsEnabled={setEnabled}
                onAdd={handleAddBrand}
            />

            {/* Edit Brand Modal */}
            <EditBrandModal
                open={editBrandOpen}
                onOpenChange={setEditBrandOpen}
                brandId={currentBrandId}
                name={editName}
                setName={setEditName}
                label={editLabel}
                setLabel={setEditLabel}
                providerInternalId={editProviderInternalId}
                setProviderInternalId={setEditProviderInternalId}
                providerBrandId={editProviderBrandId}
                setProviderBrandId={setEditProviderBrandId}
                isEnabled={editEnabled}
                setIsEnabled={setEditEnabled}
                onUpdate={handleUpdateBrand}
            />
        </div>
    );
};

export default BrandManagement;