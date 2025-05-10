
"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ServiceType, useServiceStore } from "@/store/BillpaymentStore";
import debounce from 'lodash/debounce';
import { ChevronLeft, ChevronRight, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

// [Keep all the modal components and skeleton components the same as before]
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
    providerProductId: string
    setProviderProductId: (value: string) => void
    isEnabled: boolean
    setIsEnabled: (value: boolean) => void
    onAdd: () => void
    isLoading?: boolean
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
    providerProductId: string
    setProviderProductId: (value: string) => void
    isEnabled: boolean
    setIsEnabled: (value: boolean) => void
    onUpdate: () => void
    isLoading?: boolean
}

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
    providerProductId,
    setProviderProductId,
    isEnabled,
    setIsEnabled,
    onAdd,
    isLoading = false,
}) => {
    const providerOptions = [
        { value: "VTPASS", label: "VTPASS" },
        { value: "ARTX", label: "ARTX" },
        { value: "SIMACCESS", label: "SIMACCESS" },
        { value: "RELOADLY", label: "RELOADLY" },
    ];

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
                                {isLoading ? (
                                    <div className="h-10 bg-gray-200 animate-pulse rounded-lg"></div>
                                ) : (
                                    <Input
                                        id="name"
                                        value={name}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                                        placeholder="Enter Brand Name"
                                        className="h-10 text-sm rounded-lg border-gray-300"
                                    />
                                )}
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="label" className="text-sm font-medium">
                                    Brand Label
                                </Label>
                                {isLoading ? (
                                    <div className="h-10 bg-gray-200 animate-pulse rounded-lg"></div>
                                ) : (
                                    <Input
                                        id="label"
                                        value={label}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setLabel(e.target.value)}
                                        placeholder="Enter Brand Label"
                                        className="h-10 text-sm rounded-lg border-gray-300"
                                    />
                                )}
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="providerInternalId" className="text-sm font-medium">
                                    Provider Internal ID
                                </Label>
                                {isLoading ? (
                                    <div className="h-10 bg-gray-200 animate-pulse rounded-lg"></div>
                                ) : (
                                    <select
                                        id="providerInternalId"
                                        value={providerInternalId}
                                        onChange={(e) => setProviderInternalId(e.target.value)}
                                        className="h-10 w-full text-sm rounded-lg border border-gray-300 px-3"
                                    >
                                        {providerOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="providerBrandId" className="text-sm font-medium">
                                    Provider Brand ID
                                </Label>
                                {isLoading ? (
                                    <div className="h-10 bg-gray-200 animate-pulse rounded-lg"></div>
                                ) : (
                                    <Input
                                        id="providerBrandId"
                                        value={providerBrandId}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setProviderBrandId(e.target.value)}
                                        placeholder="e.g. mtn"
                                        className="h-10 text-sm rounded-lg border-gray-300"
                                    />
                                )}
                            </div>

                            <div className="flex items-center justify-between pt-2">
                                <span className="text-sm font-medium">Enable Brand</span>
                                {isLoading ? (
                                    <div className="h-6 w-11 bg-gray-200 animate-pulse rounded-full"></div>
                                ) : (
                                    <Switch
                                        checked={isEnabled}
                                        onCheckedChange={setIsEnabled}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-background w-full pt-1 my-auto justify-center items-center">
                    <Button
                        onClick={onAdd}
                        disabled={!name || !label || !providerInternalId || !providerBrandId || isLoading}
                        className="w-[80%] mx-auto flex my-auto mt-4 mb-4 h-12 text-base font-semibold bg-[#f0ffc2] hover:bg-[#e5f5b7] disabled:bg-gray-200 disabled:text-gray-500 text-black rounded-full"
                    >
                        {isLoading ? (
                            <span className="animate-pulse">Loading...</span>
                        ) : (
                            "Add Brand"
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

// Edit Brand Modal Component (same as before)
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
    providerProductId,
    setProviderProductId,
    isEnabled,
    setIsEnabled,
    onUpdate,
    isLoading = false,
}) => {
    const providerOptions = [
        { value: "VTPASS", label: "VTPASS" },
        { value: "ARTX", label: "ARTX" },
        { value: "SIMACCESS", label: "SIMACCESS" },
        { value: "RELOADLY", label: "RELOADLY" },
    ];

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
                                {isLoading ? (
                                    <div className="h-10 bg-gray-200 animate-pulse rounded-lg"></div>
                                ) : (
                                    <Input
                                        id="edit-name"
                                        value={name}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                                        placeholder="Enter Brand Name"
                                        className="h-10 text-sm rounded-lg border-gray-300"
                                    />
                                )}
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="edit-label" className="text-sm font-medium">
                                    Brand Label
                                </Label>
                                {isLoading ? (
                                    <div className="h-10 bg-gray-200 animate-pulse rounded-lg"></div>
                                ) : (
                                    <Input
                                        id="edit-label"
                                        value={label}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setLabel(e.target.value)}
                                        placeholder="Enter Brand Label"
                                        className="h-10 text-sm rounded-lg border-gray-300"
                                    />
                                )}
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="edit-providerInternalId" className="text-sm font-medium">
                                    Provider Internal ID
                                </Label>
                                {isLoading ? (
                                    <div className="h-10 bg-gray-200 animate-pulse rounded-lg"></div>
                                ) : (
                                    <select
                                        id="edit-providerInternalId"
                                        value={providerInternalId}
                                        onChange={(e) => setProviderInternalId(e.target.value)}
                                        className="h-10 w-full text-sm rounded-lg border border-gray-300 px-3"
                                    >
                                        {providerOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="edit-providerBrandId" className="text-sm font-medium">
                                    Provider Brand ID
                                </Label>
                                {isLoading ? (
                                    <div className="h-10 bg-gray-200 animate-pulse rounded-lg"></div>
                                ) : (
                                    <Input
                                        id="edit-providerBrandId"
                                        value={providerBrandId}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setProviderBrandId(e.target.value)}
                                        placeholder="e.g. mtn"
                                        className="h-10 text-sm rounded-lg border-gray-300"
                                    />
                                )}
                            </div>

                            <div className="flex items-center justify-between pt-2">
                                <span className="text-sm font-medium">Enable Brand</span>
                                {isLoading ? (
                                    <div className="h-6 w-11 bg-gray-200 animate-pulse rounded-full"></div>
                                ) : (
                                    <Switch
                                        checked={isEnabled}
                                        onCheckedChange={setIsEnabled}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-background w-full pt-1 my-auto justify-center items-center">
                    <Button
                        onClick={onUpdate}
                        disabled={!name || !label || !providerInternalId || !providerBrandId || isLoading}
                        className="w-[80%] mx-auto flex my-auto mt-4 mb-4 h-12 text-base font-semibold bg-[#f0ffc2] hover:bg-[#e5f5b7] disabled:bg-gray-200 disabled:text-gray-500 text-black rounded-full"
                    >
                        {isLoading ? (
                            <span className="animate-pulse">Loading...</span>
                        ) : (
                            "Update Brand"
                        )}
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

const BrandTable: React.FC = () => {
    const pathname = usePathname();

    // Get current service type from pathname
    const getCurrentServiceType = (): ServiceType => {
        if (pathname.includes('/airtime')) return 'airtime';
        if (pathname.includes('/data-plan')) return 'data';
        if (pathname.includes('/cable')) return 'cable';
        if (pathname.includes('/education')) return 'education';
        if (pathname.includes('/internet')) return 'internet';
        if (pathname.includes('/electricity')) return 'electricity';
        if (pathname.includes('/esims')) return 'esim';
        if (pathname.includes('/giftcards')) return 'giftcard';
        return 'cable'; // default
    };

    const currentServiceType = getCurrentServiceType();

    const {
        brands,
        isLoading,
        getBrands,
        addBrand,
        updateBrand,
        deleteBrand,
        toggleBrandStatus,
        selectedServiceId,
        selectedService,
        updateSearchState,
        getSearchState,
        brandsTotal,
        brandsPage,
        brandsLimit,
        services
    } = useServiceStore();

    // Pagination state with proper type annotations
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(10);

    const [addBrandOpen, setAddBrandOpen] = useState<boolean>(false);
    const [editBrandOpen, setEditBrandOpen] = useState<boolean>(false);
    const [currentBrandId, setCurrentBrandId] = useState<string>("");
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const [isFormLoading, setIsFormLoading] = useState<boolean>(false);

    // Get search state for current service type
    const searchState = getSearchState(currentServiceType);
    const [searchTerm, setSearchTerm] = useState<string>(searchState.term);

    // Add Brand state
    const [name, setName] = useState<string>("");
    const [label, setLabel] = useState<string>("");
    const [providerInternalId, setProviderInternalId] = useState<string>("VTPASS");
    const [providerBrandId, setProviderBrandId] = useState<string>("");
    const [providerProductId, setProviderProductId] = useState<string>("");
    const [enabled, setEnabled] = useState<boolean>(true);

    // Edit Brand state
    const [editName, setEditName] = useState<string>("");
    const [editLabel, setEditLabel] = useState<string>("");
    const [editProviderInternalId, setEditProviderInternalId] = useState<string>("");
    const [editProviderBrandId, setEditProviderBrandId] = useState<string>("");
    const [editProviderProductId, setEditProviderProductId] = useState<string>("");
    const [editEnabled, setEditEnabled] = useState<boolean>(true);

    // Function to get service ID for current service type
    const getServiceIdForCurrentType = useCallback(() => {
        if (services.length === 0) return null;

        const service = services.find(s => s.label.toLowerCase() === currentServiceType);
        return service?.id || null;
    }, [services, currentServiceType]);

    // Effect to load brands when service changes or page changes
    useEffect(() => {
        const loadBrands = async () => {
            // First get the service ID for the current service type
            const serviceId = getServiceIdForCurrentType();

            if (!serviceId) {

                if (services.length === 0) {

                    return;
                }

                return;
            }

            try {
                const searchState = getSearchState(currentServiceType);
                getBrands(serviceId, currentPage, itemsPerPage, searchState.term);
            } catch (error: any) {
                toast.error("Failed to load brands", {
                    description: error.message || "An error occurred"
                });
            }
        };

        loadBrands();
    }, [currentServiceType, currentPage, itemsPerPage, services, getBrands, getSearchState, getServiceIdForCurrentType]);


    useEffect(() => {
        const currentState = getSearchState(currentServiceType);
        setSearchTerm(currentState.term);
        setCurrentPage(1);
    }, [currentServiceType, getSearchState]);

    const debouncedSearch = useCallback(
        debounce(async (term: string) => {
            const serviceId = getServiceIdForCurrentType();
            if (!serviceId) return;

            try {
                setIsSearching(true);
                setCurrentPage(1); // Reset to first page on search

                updateSearchState(currentServiceType, term);
                getBrands(serviceId, 1, itemsPerPage, term);
            } catch (error: any) {
                toast.error("Search failed", {
                    description: error.message || "An error occurred"
                });
            } finally {
                setIsSearching(false);
            }
        }, 500),
        [getBrands, currentServiceType, updateSearchState, itemsPerPage, getServiceIdForCurrentType]
    );

    // Trigger search when searchTerm changes
    useEffect(() => {
        if (searchTerm) {
            debouncedSearch(searchTerm);
        }
        // else {
        //     // If search term is cleared, fetch all brands
        //     const serviceId = getServiceIdForCurrentType();
        //     if (serviceId) {
        //         setCurrentPage(1);
        //         getBrands(serviceId, 1, itemsPerPage, '');
        //         updateSearchState(currentServiceType, '');
        //     }
        // }
    }, [searchTerm, debouncedSearch, currentServiceType, updateSearchState, itemsPerPage, getServiceIdForCurrentType]);

    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleClearSearch = () => {
        setSearchTerm("");
        const serviceId = getServiceIdForCurrentType();
        if (serviceId) {
            setCurrentPage(1);
            getBrands(serviceId, 1, itemsPerPage, '');
            updateSearchState(currentServiceType, '');
        }
    };

    // Pagination handlers
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const newItemsPerPage = parseInt(e.target.value);
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1); // Reset to first page when changing items per page
    };

    // Calculate pagination values
    const totalPages = Math.ceil(brandsTotal / itemsPerPage);
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, brandsTotal);

    const handleAddBrand = async () => {
        const serviceId = getServiceIdForCurrentType();
        if (!serviceId) {
            toast.error("No service ID found");
            return;
        }

        try {
            setIsFormLoading(true);
            const brandData = {
                name,
                label,
                serviceId: serviceId,
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
            await getBrands(serviceId, currentPage, itemsPerPage, searchTerm);
        } catch (error: any) {
            toast.error("Failed to add brand", {
                description: error.message || "An error occurred"
            });
        } finally {
            setIsFormLoading(false);
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
            setIsFormLoading(true);
            const updatedData = {
                name: editName,
                label: editLabel,
                providerInternalId: editProviderInternalId,
                providerBrandId: editProviderBrandId,
                isEnabled: editEnabled
            };

            updateBrand(currentBrandId, updatedData);
            toast.success("Brand updated successfully");
            setEditBrandOpen(false);

            // Refresh brands list
            // const serviceId = getServiceIdForCurrentType();
            // if (serviceId) {
            //     await getBrands(serviceId, currentPage, itemsPerPage, searchTerm);
            // }
        } catch (error: any) {
            toast.error("Failed to update brand", {
                description: error.message || "An error occurred"
            });
        } finally {
            setIsFormLoading(false);
        }
    };

    const handleToggleStatus = async (brandId: string, isEnabled: boolean) => {
        try {
            toggleBrandStatus(brandId, isEnabled);
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

                // If current page becomes empty after deletion, go to previous page
                if (brands.length === 1 && currentPage > 1) {
                    setCurrentPage(currentPage - 1);
                } else {
                    // Refresh the current page
                    const serviceId = getServiceIdForCurrentType();
                    if (serviceId) {
                        await getBrands(serviceId, currentPage, itemsPerPage, searchTerm);
                    }
                }
            } catch (error: any) {
                toast.error("Failed to delete brand", {
                    description: error.message || "An error occurred"
                });
            }
        }
    };

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



    if (isLoading && brands.length === 0) {
        return <BrandTableSkeleton />;
    }

    return (
        <div className="w-full bg-background py-6 rounded-sm">
            {/* Service Type Indicator */}

            {/* Header with search and buttons */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 w-full px-4 sm:px-8 gap-4">
                <div className="flex flex-row justify-center items-center w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-auto">
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
                <div className="flex gap-4 items-center w-full sm:w-auto">
                    <Button
                        className="bg-primary w-full sm:w-auto text-text-body rounded-lg px-6 py-6 font-medium hover:bg-primary/90 flex items-center justify-center gap-2"
                        onClick={() => setAddBrandOpen(true)}
                    >
                        <Plus size={20} />
                        Add Brand
                    </Button>
                </div>
            </div>

            {/* Pagination Info and Items per page selector */}
            <div className="flex flex-col sm:flex-row justify-between items-center px-4 sm:px-8 mb-4 gap-4">
                <div className="text-sm text-gray-600">
                    Showing {startItem} to {endItem} of {brandsTotal} brands
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Items per page:</span>
                    <select
                        value={itemsPerPage}
                        onChange={handleItemsPerPageChange}
                        className="h-8 text-sm rounded border border-gray-300 px-2"
                    >
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                </div>
            </div>

            {/* Products Table */}
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
                            Array(itemsPerPage).fill(0).map((_, index) => (
                                <TableRowSkeleton key={`skeleton-${index}`} />
                            ))
                        ) : brands.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                                    {getServiceIdForCurrentType() ?
                                        `No brands found for ${currentServiceType}` :
                                        'Please select a service from the navigation'
                                    }
                                </TableCell>
                            </TableRow>
                        ) :

                            isLoading ? Array(itemsPerPage).fill(0).map((_, index) => (
                                <TableRowSkeleton key={`loading-${index}`} />
                            )) : (
                                brands.map((brand) => (
                                    <TableRow key={brand.id} className="border-t-2">
                                        <TableCell className="py-4 pl-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-primary-fade rounded-full flex items-center justify-center overflow-hidden">
                                                    {getServiceLogo(brand.label)}
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

            {/* Pagination Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-center px-4 sm:px-8 mt-6 gap-4">
                <div className="text-sm text-gray-600">
                    Showing {startItem} to {endItem} of {brandsTotal} entries
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                    </Button>

                    {/* Page numbers */}
                    <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(7, totalPages) }, (_, index) => {
                            let pageNum;
                            if (totalPages <= 7) {
                                pageNum = index + 1;
                            } else if (currentPage <= 4) {
                                pageNum = index + 1;
                            } else if (currentPage >= totalPages - 3) {
                                pageNum = totalPages - 6 + index;
                            } else {
                                pageNum = currentPage - 3 + index;
                            }

                            return (
                                <Button
                                    key={pageNum}
                                    variant={currentPage === pageNum ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => handlePageChange(pageNum)}
                                    className="px-3 py-1 min-w-[32px]"
                                >
                                    {pageNum}
                                </Button>
                            );
                        })}
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1"
                    >
                        Next
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Add Brand Modal */}
            <AddBrandModal
                open={addBrandOpen}
                onOpenChange={setAddBrandOpen}
                serviceId={getServiceIdForCurrentType() || ''}
                name={name}
                setName={setName}
                label={label}
                setLabel={setLabel}
                providerInternalId={providerInternalId}
                setProviderInternalId={setProviderInternalId}
                providerBrandId={providerBrandId}
                setProviderBrandId={setProviderBrandId}
                providerProductId={providerProductId}
                setProviderProductId={setProviderProductId}
                isEnabled={enabled}
                setIsEnabled={setEnabled}
                onAdd={handleAddBrand}
                isLoading={isFormLoading}
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
                providerProductId={editProviderProductId}
                setProviderProductId={setEditProviderProductId}
                isEnabled={editEnabled}
                setIsEnabled={setEditEnabled}
                onUpdate={handleUpdateBrand}
                isLoading={isFormLoading}
            />
        </div>
    );
};

export default BrandTable;
