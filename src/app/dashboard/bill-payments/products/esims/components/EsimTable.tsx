'use client'

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EsimPackage, formatPrice, useEsimPackageStore } from '@/store/EsimPackageStore';
import { useEsimLocationStore } from '@/store/EsimStore';
import { ChevronLeft, ChevronRight, Edit, Plus, Search, Trash2 } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { toast } from "sonner";

// Pagination Component
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

// Loading skeleton components
const TableRowSkeleton = () => (
    <TableRow className="py-6">
        <TableCell>
            <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-gray-200 animate-pulse rounded-full"></div>
                <div className="h-6 w-24 bg-gray-200 animate-pulse rounded"></div>
            </div>
        </TableCell>
        <TableCell><div className="h-6 w-16 bg-gray-200 animate-pulse rounded"></div></TableCell>
        <TableCell><div className="h-6 w-16 bg-gray-200 animate-pulse rounded"></div></TableCell>
        <TableCell><div className="h-6 w-16 bg-gray-200 animate-pulse rounded"></div></TableCell>
        <TableCell><div className="h-6 w-16 bg-gray-200 animate-pulse rounded"></div></TableCell>
        <TableCell><div className="h-6 w-16 bg-gray-200 animate-pulse rounded"></div></TableCell>
    </TableRow>
);

// Main Component
const EsimPackageManagement = () => {
    // Get store hooks
    const {
        packages,
        page,
        totalPages,
        limit,
        total,
        isLoading: packagesLoading,
        getPackages,
        createPackage,
        updatePackage,
        deletePackage
    } = useEsimPackageStore();

    const {
        locations,
        isLoading: locationsLoading,
        getLocations
    } = useEsimLocationStore();

    // Local state
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
    const [isAddProductOpen, setIsAddProductOpen] = useState(false);
    const [isEditProductOpen, setIsEditProductOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState<EsimPackage | null>(null);

    // Form state for adding and editing products
    const [formData, setFormData] = useState({
        serviceId: "d33d57ee-7619-408e-8d40-fe98d31eedf7", // Default service ID
        packageNo: "",
        packageName: "",
        costPrice: 0,
        price: 0,
        esimLocationID: ""
    });

    // Load locations on component mount
    useEffect(() => {
        loadAllData();
    }, []);

    // When location is selected, load packages for that location
    useEffect(() => {
        if (selectedLocationId) {
            loadPackagesForLocation(1);
        } else {
            // When no location is selected, load all packages
            loadAllPackages(1);
        }
    }, [selectedLocationId]);

    // Load all initial data
    const loadAllData = async () => {
        try {
            await getLocations({ page: 1, limit: 100, search: '' }); // Get all locations
            await loadAllPackages(1); // Load initial packages (all locations)
        } catch (error) {
            toast.error("Failed to load initial data");
        }
    };

    // Load all packages (no location filter)
    const loadAllPackages = (page: number) => {
        getPackages({
            page,
            limit: 10,
            search: searchTerm || undefined
        });
    };

    // Load packages for a specific location
    const loadPackagesForLocation = (page: number) => {
        if (!selectedLocationId) return;

        getPackages({
            page,
            limit: 10,
            esimLocationID: selectedLocationId,
            search: searchTerm || undefined
        });
    };

    // Handle search
    const handleSearch = () => {
        if (selectedLocationId) {
            loadPackagesForLocation(1);
        } else {
            loadAllPackages(1);
        }
    };

    // Handle search input change
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    // Handle location change
    const handleLocationChange = (value: string) => {
        // If "all" is selected, set to null to indicate no filter
        setSelectedLocationId(value === "all" ? null : value);
        // Reset search term when changing location
        setSearchTerm("");
    };

    // Handle form field changes
    const handleFormChange = (field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Handle add product submission
    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await createPackage({
                serviceId: formData.serviceId,
                packageNo: formData.packageNo,
                packageName: formData.packageName,
                costPrice: formData.costPrice,
                price: formData.price,
                esimLocationID: formData.esimLocationID || (selectedLocationId || "")
            });

            toast.success("eSIM package added successfully");
            setIsAddProductOpen(false);

            // Reset form data
            setFormData({
                serviceId: "d33d57ee-7619-408e-8d40-fe98d31eedf7",
                packageNo: "",
                packageName: "",
                costPrice: 0,
                price: 0,
                esimLocationID: selectedLocationId || ""
            });

            // Refresh packages
            if (selectedLocationId) {
                loadPackagesForLocation(1);
            } else {
                loadAllPackages(1);
            }
        } catch (error: any) {
            toast.error("Failed to add eSIM package", {
                description: error.message || "An error occurred"
            });
        }
    };

    // Handle edit product submission
    const handleEditProduct = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!currentProduct) return;

        try {
            await updatePackage(currentProduct.id, {
                serviceId: formData.serviceId,
                packageNo: formData.packageNo,
                packageName: formData.packageName,
                costPrice: formData.costPrice,
                price: formData.price,
                esimLocationID: formData.esimLocationID
            });

            toast.success("eSIM package updated successfully");
            setIsEditProductOpen(false);

            // Refresh packages
            if (selectedLocationId) {
                loadPackagesForLocation(page);
            } else {
                loadAllPackages(page);
            }
        } catch (error: any) {
            toast.error("Failed to update eSIM package", {
                description: error.message || "An error occurred"
            });
        }
    };

    // Handle delete product
    const handleDeleteProduct = async (id: string, name: string) => {
        if (confirm(`Are you sure you want to delete "${name}"?`)) {
            try {
                await deletePackage(id);
                toast.success(`"${name}" deleted successfully`);

                // Refresh packages - go to previous page if deleting last item on page
                if (packages.length === 1 && page > 1) {
                    if (selectedLocationId) {
                        loadPackagesForLocation(page - 1);
                    } else {
                        loadAllPackages(page - 1);
                    }
                } else {
                    if (selectedLocationId) {
                        loadPackagesForLocation(page);
                    } else {
                        loadAllPackages(page);
                    }
                }
            } catch (error: any) {
                toast.error("Failed to delete eSIM package", {
                    description: error.message || "An error occurred"
                });
            }
        }
    };

    // Open edit modal for a product
    const openEditModal = (product: EsimPackage) => {
        setCurrentProduct(product);

        // Format price data for the form
        setFormData({
            serviceId: product.serviceId,
            packageNo: product.packageNo,
            packageName: product.packageName,
            costPrice: formatPrice(product.costPrice),
            price: formatPrice(product.price),
            esimLocationID: product.esimLocationID
        });

        setIsEditProductOpen(true);
    };

    // Helper function to format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 2
        }).format(amount);
    };

    // Helper function to get country flag emoji
    const getCountryFlag = (code: string) => {
        if (!code) return '';

        try {
            // Convert country code to flag emoji
            const codePoints = [...code.toUpperCase()]
                .map(char => 127397 + char.charCodeAt(0));
            return String.fromCodePoint(...codePoints);
        } catch (error) {
            console.error("Error creating flag emoji:", error);
            return '';
        }
    };

    // Handle page change
    const handlePageChange = (newPage: number) => {
        if (selectedLocationId) {
            loadPackagesForLocation(newPage);
        } else {
            loadAllPackages(newPage);
        }
    };

    // Check if we are in a loading state
    const isLoading = (locationsLoading && locations.length === 0) ||
        (packagesLoading && packages.length === 0);

    return (
        <div className="w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 p-4">
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    {/* Location selector - Fixed: using "all" instead of empty string */}
                    <div className="w-full sm:w-auto">
                        <Select
                            value={selectedLocationId || "all"}
                            onValueChange={handleLocationChange}
                        >
                            <SelectTrigger className="w-full sm:w-[200px] bg-background-alt border-border rounded-[8px] p-2">
                                <SelectValue placeholder="All Locations" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Locations</SelectItem>
                                {locations.map((location) => (
                                    <SelectItem key={location.id} value={location.id}>
                                        {location.locationName} ({location.locationCode.toUpperCase()})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Search input */}
                    <div className="flex flex-row justify-center items-center">
                        <input
                            type="text"
                            placeholder="Search"
                            className="bg-background-alt border-border rounded-l-[8px] p-4 w-full sm:w-[180px]"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        <button
                            className="bg-primary rounded-r-[8px] p-4 px-6"
                            onClick={handleSearch}
                        >
                            <Search size={20} className="text-text-body" />
                        </button>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
                    <Link
                        href="/dashboard/bill-payments/products/esims/locations"
                        className="border border-primary-300 bg-background text-text-body font-poppins px-6 py-3 rounded-[12px] text-center whitespace-nowrap"
                    >
                        Manage Esim Location
                    </Link>

                    <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
                        <DialogTrigger asChild>
                            <button className="bg-primary text-text-body font-poppins px-6 py-3 rounded-[12px] font-medium flex gap-2 items-center justify-center">
                                <Plus size={16} />
                                Add Package
                            </button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px] p-0 rounded-lg">
                            <div className="p-6">
                                <div className="flex justify-between items-center">
                                    <DialogTitle className="text-xl font-semibold">Add eSIM Package</DialogTitle>
                                </div>
                                <div className="h-px bg-gray-200 my-4 -mx-6"></div>
                                <form onSubmit={handleAddProduct} className="space-y-6">
                                    <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                                        <div className="space-y-2">
                                            <label className="font-medium">Package Name</label>
                                            <Input
                                                placeholder="e.g. Nigeria 2GB 30Days"
                                                className="bg-white"
                                                value={formData.packageName}
                                                onChange={(e) => handleFormChange('packageName', e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="font-medium">Package No</label>
                                            <Input
                                                placeholder="e.g. PKG001"
                                                className="bg-white"
                                                value={formData.packageNo}
                                                onChange={(e) => handleFormChange('packageNo', e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="font-medium">Cost Price</label>
                                                <Input
                                                    type="number"
                                                    placeholder="0.00"
                                                    className="bg-white"
                                                    value={formData.costPrice}
                                                    onChange={(e) => handleFormChange('costPrice', Number(e.target.value))}
                                                    min="0"
                                                    step="0.01"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="font-medium">Selling Price</label>
                                                <Input
                                                    type="number"
                                                    placeholder="0.00"
                                                    className="bg-white"
                                                    value={formData.price}
                                                    onChange={(e) => handleFormChange('price', Number(e.target.value))}
                                                    min="0"
                                                    step="0.01"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="font-medium">Location</label>
                                            <Select
                                                value={formData.esimLocationID || (selectedLocationId || "")}
                                                onValueChange={(value) => handleFormChange('esimLocationID', value)}
                                                required
                                            >
                                                <SelectTrigger className="w-full bg-white">
                                                    <SelectValue placeholder="Select location" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {locations.map((location) => (
                                                        <SelectItem key={location.id} value={location.id}>
                                                            {getCountryFlag(location.locationCode)} {location.locationName}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full bg-primary hover:bg-primary/90 text-text-body font-medium py-6"
                                        disabled={!formData.packageName || !formData.packageNo || formData.costPrice <= 0 || formData.price <= 0 || !(formData.esimLocationID || selectedLocationId)}
                                    >
                                        Add Package
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
                            <TableHead className="text-base font-poppins text-text-title">Package Name</TableHead>
                            <TableHead className="text-base font-poppins text-text-title">Package No</TableHead>
                            <TableHead className="text-base font-poppins text-text-title">Cost Price</TableHead>
                            <TableHead className="text-base font-poppins text-text-title">Selling Price</TableHead>
                            <TableHead className="text-base font-poppins text-text-title">Location</TableHead>
                            <TableHead className="text-base font-poppins text-text-title">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            // Show skeleton loading
                            Array(5).fill(0).map((_, index) => (
                                <TableRowSkeleton key={index} />
                            ))
                        ) : packages.length === 0 ? (
                            // Show empty state
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                    {selectedLocationId
                                        ? searchTerm
                                            ? "No packages found matching your search"
                                            : "No packages found for this location"
                                        : searchTerm
                                            ? "No packages found matching your search"
                                            : "No packages available"
                                    }
                                </TableCell>
                            </TableRow>
                        ) : (
                            // Show packages
                            packages.map((pkg) => (
                                <TableRow key={pkg.id} className="py-6">
                                    <TableCell className="text-text-body font-poppins text-base py-6 flex items-center gap-2">
                                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                            <span className="text-green-600 text-sm">
                                                {pkg.esimLocation ? getCountryFlag(pkg.esimLocation.locationCode) : ''}
                                            </span>
                                        </div>
                                        <div>
                                            <div>{pkg.packageName}</div>
                                            {/* <div className="text-xs text-gray-500 truncate max-w-[200px]">ID: {pkg.id.slice(0, 8)}...</div> */}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-text-body font-poppins text-base py-6">{pkg.packageNo}</TableCell>
                                    <TableCell className="text-text-body font-poppins text-base py-6">{formatCurrency(formatPrice(pkg.costPrice))}</TableCell>
                                    <TableCell className="text-text-body font-poppins text-base py-6">{formatCurrency(formatPrice(pkg.price))}</TableCell>
                                    <TableCell className="text-text-body font-poppins text-base py-6">
                                        {pkg.esimLocation?.locationName || '-'}
                                    </TableCell>
                                    <TableCell className="text-text-body font-poppins text-base py-6">
                                        <div className="flex space-x-2">
                                            <Button
                                                variant="ghost"
                                                className="h-8 w-8 p-0"
                                                onClick={() => openEditModal(pkg)}
                                            >
                                                <Edit className="h-4 w-4 text-blue-500" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                className="h-8 w-8 p-0"
                                                onClick={() => handleDeleteProduct(pkg.id, pkg.packageName)}
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

            {/* Pagination - only show if we have packages and not loading */}
            {!isLoading && packages.length > 0 && (
                <>
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                    <div className="text-center text-xs sm:text-sm text-gray-500 py-3">
                        Showing {packages.length} of {total} records
                    </div>
                </>
            )}

            {/* Edit Product Modal */}
            {currentProduct && (
                <Dialog open={isEditProductOpen} onOpenChange={setIsEditProductOpen}>
                    <DialogContent className="sm:max-w-[500px] p-0 rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center">
                                <DialogTitle className="text-xl font-semibold">Edit eSIM Package</DialogTitle>
                            </div>
                            <div className="h-px bg-gray-200 my-4 -mx-6"></div>
                            <form onSubmit={handleEditProduct} className="space-y-6">
                                <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                                    <div className="space-y-2">
                                        <label className="font-medium">Package Name</label>
                                        <Input
                                            placeholder="e.g. Nigeria 2GB 30Days"
                                            className="bg-white"
                                            value={formData.packageName}
                                            onChange={(e) => handleFormChange('packageName', e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="font-medium">Package No</label>
                                        <Input
                                            placeholder="e.g. PKG001"
                                            className="bg-white"
                                            value={formData.packageNo}
                                            onChange={(e) => handleFormChange('packageNo', e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="font-medium">Cost Price</label>
                                            <Input
                                                type="number"
                                                placeholder="0.00"
                                                className="bg-white"
                                                value={formData.costPrice}
                                                onChange={(e) => handleFormChange('costPrice', Number(e.target.value))}
                                                min="0"
                                                step="0.01"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="font-medium">Selling Price</label>
                                            <Input
                                                type="number"
                                                placeholder="0.00"
                                                className="bg-white"
                                                value={formData.price}
                                                onChange={(e) => handleFormChange('price', Number(e.target.value))}
                                                min="0"
                                                step="0.01"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="font-medium">Location</label>
                                        <Select
                                            value={formData.esimLocationID}
                                            onValueChange={(value) => handleFormChange('esimLocationID', value)}
                                            required
                                        >
                                            <SelectTrigger className="w-full bg-white">
                                                <SelectValue placeholder="Select location" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {locations.map((location) => (
                                                    <SelectItem key={location.id} value={location.id}>
                                                        {getCountryFlag(location.locationCode)} {location.locationName}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-primary hover:bg-primary/90 text-text-body font-medium py-6"
                                    disabled={!formData.packageName || !formData.packageNo || formData.costPrice <= 0 || formData.price <= 0 || !formData.esimLocationID}
                                >
                                    Update Package
                                </Button>
                            </form>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
};

export default EsimPackageManagement;
// 'use client'

// import { Button } from "@/components/ui/button";
// import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { EsimPackage, formatPrice, useEsimPackageStore } from '@/store/EsimPackageStore';
// import { useEsimLocationStore } from '@/store/EsimStore';
// import { ChevronLeft, ChevronRight, Edit, Plus, Search, Trash2 } from 'lucide-react';
// import Link from 'next/link';
// import React, { useEffect, useState } from 'react';
// import { toast } from "sonner";

// // Pagination Component
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

// // Loading skeleton components
// const TableRowSkeleton = () => (
//     <TableRow className="py-6">
//         <TableCell>
//             <div className="flex items-center gap-2">
//                 <div className="h-8 w-8 bg-gray-200 animate-pulse rounded-full"></div>
//                 <div className="h-6 w-24 bg-gray-200 animate-pulse rounded"></div>
//             </div>
//         </TableCell>
//         <TableCell><div className="h-6 w-16 bg-gray-200 animate-pulse rounded"></div></TableCell>
//         <TableCell><div className="h-6 w-16 bg-gray-200 animate-pulse rounded"></div></TableCell>
//         <TableCell><div className="h-6 w-16 bg-gray-200 animate-pulse rounded"></div></TableCell>
//         <TableCell><div className="h-6 w-16 bg-gray-200 animate-pulse rounded"></div></TableCell>
//         <TableCell><div className="h-6 w-16 bg-gray-200 animate-pulse rounded"></div></TableCell>
//     </TableRow>
// );

// // Main Component
// const EsimPackageManagement = () => {
//     // Get store hooks
//     const {
//         packages,
//         page,
//         totalPages,
//         limit,
//         total,
//         isLoading: packagesLoading,
//         getPackages,
//         createPackage,
//         updatePackage,
//         deletePackage
//     } = useEsimPackageStore();

//     const {
//         locations,
//         isLoading: locationsLoading,
//         getLocations
//     } = useEsimLocationStore();

//     // Local state
//     const [searchTerm, setSearchTerm] = useState<string>("");
//     const [selectedLocationId, setSelectedLocationId] = useState<string>("");
//     const [isAddProductOpen, setIsAddProductOpen] = useState(false);
//     const [isEditProductOpen, setIsEditProductOpen] = useState(false);
//     const [currentProduct, setCurrentProduct] = useState<EsimPackage | null>(null);

//     // Form state for adding and editing products
//     const [formData, setFormData] = useState({
//         serviceId: "d33d57ee-7619-408e-8d40-fe98d31eedf7", // Default service ID
//         packageNo: "",
//         packageName: "",
//         costPrice: 0,
//         price: 0,
//         esimLocationID: ""
//     });

//     // Load locations on component mount
//     useEffect(() => {
//         loadAllData();
//     }, []);

//     // When location is selected, load packages for that location
//     useEffect(() => {
//         if (selectedLocationId) {
//             loadPackagesForLocation(1);
//         } else {
//             // When no location is selected, load all packages
//             loadAllPackages(1);
//         }
//     }, [selectedLocationId]);

//     // Load all initial data
//     const loadAllData = async () => {
//         try {
//             await getLocations({ page: 1, limit: 100, search: '' }); // Get all locations
//             await loadAllPackages(1); // Load initial packages (all locations)
//         } catch (error) {
//             toast.error("Failed to load initial data");
//         }
//     };

//     // Load all packages (no location filter)
//     const loadAllPackages = (page: number) => {
//         getPackages({
//             page,
//             limit: 10,
//             search: searchTerm || undefined
//         });
//     };

//     // Load packages for a specific location
//     const loadPackagesForLocation = (page: number) => {
//         if (!selectedLocationId) return;

//         getPackages({
//             page,
//             limit: 10,
//             esimLocationID: selectedLocationId,
//             search: searchTerm || undefined
//         });
//     };

//     // Handle search
//     const handleSearch = () => {
//         if (selectedLocationId) {
//             loadPackagesForLocation(1);
//         } else {
//             loadAllPackages(1);
//         }
//     };

//     // Handle search input change
//     const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setSearchTerm(e.target.value);
//     };

//     // Handle location change
//     const handleLocationChange = (value: string) => {
//         setSelectedLocationId(value);
//         // Reset search term when changing location
//         setSearchTerm("");
//     };

//     // Handle form field changes
//     const handleFormChange = (field: string, value: any) => {
//         setFormData(prev => ({
//             ...prev,
//             [field]: value
//         }));
//     };

//     // Handle add product submission
//     const handleAddProduct = async (e: React.FormEvent) => {
//         e.preventDefault();

//         try {
//             await createPackage({
//                 serviceId: formData.serviceId,
//                 packageNo: formData.packageNo,
//                 packageName: formData.packageName,
//                 costPrice: formData.costPrice,
//                 price: formData.price,
//                 esimLocationID: formData.esimLocationID || selectedLocationId
//             });

//             toast.success("eSIM package added successfully");
//             setIsAddProductOpen(false);

//             // Reset form data
//             setFormData({
//                 serviceId: "d33d57ee-7619-408e-8d40-fe98d31eedf7",
//                 packageNo: "",
//                 packageName: "",
//                 costPrice: 0,
//                 price: 0,
//                 esimLocationID: selectedLocationId
//             });

//             // Refresh packages
//             if (selectedLocationId) {
//                 loadPackagesForLocation(1);
//             } else {
//                 loadAllPackages(1);
//             }
//         } catch (error: any) {
//             toast.error("Failed to add eSIM package", {
//                 description: error.message || "An error occurred"
//             });
//         }
//     };

//     // Handle edit product submission
//     const handleEditProduct = async (e: React.FormEvent) => {
//         e.preventDefault();

//         if (!currentProduct) return;

//         try {
//             await updatePackage(currentProduct.id, {
//                 serviceId: formData.serviceId,
//                 packageNo: formData.packageNo,
//                 packageName: formData.packageName,
//                 costPrice: formData.costPrice,
//                 price: formData.price,
//                 esimLocationID: formData.esimLocationID
//             });

//             toast.success("eSIM package updated successfully");
//             setIsEditProductOpen(false);

//             // Refresh packages
//             if (selectedLocationId) {
//                 loadPackagesForLocation(page);
//             } else {
//                 loadAllPackages(page);
//             }
//         } catch (error: any) {
//             toast.error("Failed to update eSIM package", {
//                 description: error.message || "An error occurred"
//             });
//         }
//     };

//     // Handle delete product
//     const handleDeleteProduct = async (id: string, name: string) => {
//         if (confirm(`Are you sure you want to delete "${name}"?`)) {
//             try {
//                 await deletePackage(id);
//                 toast.success(`"${name}" deleted successfully`);

//                 // Refresh packages - go to previous page if deleting last item on page
//                 if (packages.length === 1 && page > 1) {
//                     if (selectedLocationId) {
//                         loadPackagesForLocation(page - 1);
//                     } else {
//                         loadAllPackages(page - 1);
//                     }
//                 } else {
//                     if (selectedLocationId) {
//                         loadPackagesForLocation(page);
//                     } else {
//                         loadAllPackages(page);
//                     }
//                 }
//             } catch (error: any) {
//                 toast.error("Failed to delete eSIM package", {
//                     description: error.message || "An error occurred"
//                 });
//             }
//         }
//     };

//     // Open edit modal for a product
//     const openEditModal = (product: EsimPackage) => {
//         setCurrentProduct(product);

//         // Format price data for the form
//         setFormData({
//             serviceId: product.serviceId,
//             packageNo: product.packageNo,
//             packageName: product.packageName,
//             costPrice: formatPrice(product.costPrice),
//             price: formatPrice(product.price),
//             esimLocationID: product.esimLocationID
//         });

//         setIsEditProductOpen(true);
//     };

//     // Helper function to format currency
//     const formatCurrency = (amount: number) => {
//         return new Intl.NumberFormat('en-NG', {
//             style: 'currency',
//             currency: 'NGN',
//             minimumFractionDigits: 2
//         }).format(amount);
//     };

//     // Helper function to get country flag emoji
//     const getCountryFlag = (code: string) => {
//         if (!code) return '';

//         try {
//             // Convert country code to flag emoji
//             const codePoints = [...code.toUpperCase()]
//                 .map(char => 127397 + char.charCodeAt(0));
//             return String.fromCodePoint(...codePoints);
//         } catch (error) {
//             console.error("Error creating flag emoji:", error);
//             return '';
//         }
//     };

//     // Handle page change
//     const handlePageChange = (newPage: number) => {
//         if (selectedLocationId) {
//             loadPackagesForLocation(newPage);
//         } else {
//             loadAllPackages(newPage);
//         }
//     };

//     // Check if we are in a loading state
//     const isLoading = (locationsLoading && locations.length === 0) ||
//         (packagesLoading && packages.length === 0);

//     return (
//         <div className="w-full">
//             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 p-4">
//                 <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
//                     {/* Location selector */}
//                     <Select value={selectedLocationId} onValueChange={handleLocationChange}>
//                         <SelectTrigger className="w-full sm:w-[200px] bg-background-alt border-border rounded-[8px] p-2">
//                             <SelectValue placeholder="All Locations" />
//                         </SelectTrigger>
//                         <SelectContent>
//                             <SelectItem value="">All Locations</SelectItem>
//                             {locations.map((location) => (
//                                 <SelectItem key={location.id} value={location.id}>
//                                     {location.locationName} ({location.locationCode.toUpperCase()})
//                                 </SelectItem>
//                             ))}
//                         </SelectContent>
//                     </Select>

//                     {/* Search input */}
//                     <div className="flex flex-row justify-center items-center">
//                         <input
//                             type="text"
//                             placeholder="Search"
//                             className="bg-background-alt border-border rounded-l-[8px] p-4 w-full sm:w-[180px]"
//                             value={searchTerm}
//                             onChange={handleSearchChange}
//                             onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
//                         />
//                         <button
//                             className="bg-primary rounded-r-[8px] p-4 px-6"
//                             onClick={handleSearch}
//                         >
//                             <Search size={20} className="text-text-body" />
//                         </button>
//                     </div>
//                 </div>

//                 <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
//                     <Link
//                         href="/dashboard/bill-payments/products/esims/locations"
//                         className="border border-primary-300 bg-background text-text-body font-poppins px-6 py-3 rounded-[12px] text-center whitespace-nowrap"
//                     >
//                         Manage Esim Location
//                     </Link>

//                     <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
//                         <DialogTrigger asChild>
//                             <button className="bg-primary text-text-body font-poppins px-6 py-3 rounded-[12px] font-medium flex gap-2 items-center justify-center">
//                                 <Plus size={16} />
//                                 Add Package
//                             </button>
//                         </DialogTrigger>
//                         <DialogContent className="sm:max-w-[500px] p-0 rounded-lg">
//                             <div className="p-6">
//                                 <div className="flex justify-between items-center">
//                                     <DialogTitle className="text-xl font-semibold">Add eSIM Package</DialogTitle>
//                                 </div>
//                                 <div className="h-px bg-gray-200 my-4 -mx-6"></div>
//                                 <form onSubmit={handleAddProduct} className="space-y-6">
//                                     <div className="bg-gray-50 p-6 rounded-lg space-y-4">
//                                         <div className="space-y-2">
//                                             <label className="font-medium">Package Name</label>
//                                             <Input
//                                                 placeholder="e.g. Nigeria 2GB 30Days"
//                                                 className="bg-white"
//                                                 value={formData.packageName}
//                                                 onChange={(e) => handleFormChange('packageName', e.target.value)}
//                                                 required
//                                             />
//                                         </div>

//                                         <div className="space-y-2">
//                                             <label className="font-medium">Package No</label>
//                                             <Input
//                                                 placeholder="e.g. PKG001"
//                                                 className="bg-white"
//                                                 value={formData.packageNo}
//                                                 onChange={(e) => handleFormChange('packageNo', e.target.value)}
//                                                 required
//                                             />
//                                         </div>

//                                         <div className="grid grid-cols-2 gap-4">
//                                             <div className="space-y-2">
//                                                 <label className="font-medium">Cost Price</label>
//                                                 <Input
//                                                     type="number"
//                                                     placeholder="0.00"
//                                                     className="bg-white"
//                                                     value={formData.costPrice}
//                                                     onChange={(e) => handleFormChange('costPrice', Number(e.target.value))}
//                                                     min="0"
//                                                     step="0.01"
//                                                     required
//                                                 />
//                                             </div>
//                                             <div className="space-y-2">
//                                                 <label className="font-medium">Selling Price</label>
//                                                 <Input
//                                                     type="number"
//                                                     placeholder="0.00"
//                                                     className="bg-white"
//                                                     value={formData.price}
//                                                     onChange={(e) => handleFormChange('price', Number(e.target.value))}
//                                                     min="0"
//                                                     step="0.01"
//                                                     required
//                                                 />
//                                             </div>
//                                         </div>

//                                         <div className="space-y-2">
//                                             <label className="font-medium">Location</label>
//                                             <Select
//                                                 value={formData.esimLocationID || selectedLocationId}
//                                                 onValueChange={(value) => handleFormChange('esimLocationID', value)}
//                                                 required
//                                             >
//                                                 <SelectTrigger className="w-full bg-white">
//                                                     <SelectValue placeholder="Select location" />
//                                                 </SelectTrigger>
//                                                 <SelectContent>
//                                                     {locations.map((location) => (
//                                                         <SelectItem key={location.id} value={location.id}>
//                                                             {getCountryFlag(location.locationCode)} {location.locationName}
//                                                         </SelectItem>
//                                                     ))}
//                                                 </SelectContent>
//                                             </Select>
//                                         </div>
//                                     </div>

//                                     <Button
//                                         type="submit"
//                                         className="w-full bg-primary hover:bg-primary/90 text-text-body font-medium py-6"
//                                         disabled={!formData.packageName || !formData.packageNo || formData.costPrice <= 0 || formData.price <= 0 || !(formData.esimLocationID || selectedLocationId)}
//                                     >
//                                         Add Package
//                                     </Button>
//                                 </form>
//                             </div>
//                         </DialogContent>
//                     </Dialog>
//                 </div>
//             </div>

//             <div className="overflow-auto">
//                 <Table className="w-full">
//                     <TableHeader className="bg-primary-fade text-muted-foreground hover:bg-primary-fade">
//                         <TableRow>
//                             <TableHead className="text-base font-poppins text-text-title">Package Name</TableHead>
//                             <TableHead className="text-base font-poppins text-text-title">Package No</TableHead>
//                             <TableHead className="text-base font-poppins text-text-title">Cost Price</TableHead>
//                             <TableHead className="text-base font-poppins text-text-title">Selling Price</TableHead>
//                             <TableHead className="text-base font-poppins text-text-title">Location</TableHead>
//                             <TableHead className="text-base font-poppins text-text-title">Actions</TableHead>
//                         </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                         {isLoading ? (
//                             // Show skeleton loading
//                             Array(5).fill(0).map((_, index) => (
//                                 <TableRowSkeleton key={index} />
//                             ))
//                         ) : packages.length === 0 ? (
//                             // Show empty state
//                             <TableRow>
//                                 <TableCell colSpan={6} className="text-center py-8 text-gray-500">
//                                     {selectedLocationId
//                                         ? searchTerm
//                                             ? "No packages found matching your search"
//                                             : "No packages found for this location"
//                                         : searchTerm
//                                             ? "No packages found matching your search"
//                                             : "No packages available"
//                                     }
//                                 </TableCell>
//                             </TableRow>
//                         ) : (
//                             // Show packages
//                             packages.map((pkg) => (
//                                 <TableRow key={pkg.id} className="py-6">
//                                     <TableCell className="text-text-body font-poppins text-base py-6 flex items-center gap-2">
//                                         <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
//                                             <span className="text-green-600 text-sm">
//                                                 {pkg.esimLocation ? getCountryFlag(pkg.esimLocation.locationCode) : ''}
//                                             </span>
//                                         </div>
//                                         <div>
//                                             <div>{pkg.packageName}</div>
//                                             <div className="text-xs text-gray-500 truncate max-w-[200px]">ID: {pkg.id.slice(0, 8)}...</div>
//                                         </div>
//                                     </TableCell>
//                                     <TableCell className="text-text-body font-poppins text-base py-6">{pkg.packageNo}</TableCell>
//                                     <TableCell className="text-text-body font-poppins text-base py-6">{formatCurrency(formatPrice(pkg.costPrice))}</TableCell>
//                                     <TableCell className="text-text-body font-poppins text-base py-6">{formatCurrency(formatPrice(pkg.price))}</TableCell>
//                                     <TableCell className="text-text-body font-poppins text-base py-6">
//                                         {pkg.esimLocation?.locationName || '-'}
//                                     </TableCell>
//                                     <TableCell className="text-text-body font-poppins text-base py-6">
//                                         <div className="flex space-x-2">
//                                             <Button
//                                                 variant="ghost"
//                                                 className="h-8 w-8 p-0"
//                                                 onClick={() => openEditModal(pkg)}
//                                             >
//                                                 <Edit className="h-4 w-4 text-blue-500" />
//                                             </Button>
//                                             <Button
//                                                 variant="ghost"
//                                                 className="h-8 w-8 p-0"
//                                                 onClick={() => handleDeleteProduct(pkg.id, pkg.packageName)}
//                                             >
//                                                 <Trash2 className="h-4 w-4 text-red-500" />
//                                             </Button>
//                                         </div>
//                                     </TableCell>
//                                 </TableRow>
//                             ))
//                         )}
//                     </TableBody>
//                 </Table>
//             </div>

//             {/* Pagination - only show if we have packages and not loading */}
//             {!isLoading && packages.length > 0 && (
//                 <>
//                     <Pagination
//                         currentPage={page}
//                         totalPages={totalPages}
//                         onPageChange={handlePageChange}
//                     />
//                     <div className="text-center text-xs sm:text-sm text-gray-500 py-3">
//                         Showing {packages.length} of {total} records
//                     </div>
//                 </>
//             )}

//             {/* Edit Product Modal */}
//             {currentProduct && (
//                 <Dialog open={isEditProductOpen} onOpenChange={setIsEditProductOpen}>
//                     <DialogContent className="sm:max-w-[500px] p-0 rounded-lg">
//                         <div className="p-6">
//                             <div className="flex justify-between items-center">
//                                 <DialogTitle className="text-xl font-semibold">Edit eSIM Package</DialogTitle>
//                             </div>
//                             <div className="h-px bg-gray-200 my-4 -mx-6"></div>
//                             <form onSubmit={handleEditProduct} className="space-y-6">
//                                 <div className="bg-gray-50 p-6 rounded-lg space-y-4">
//                                     <div className="space-y-2">
//                                         <label className="font-medium">Package Name</label>
//                                         <Input
//                                             placeholder="e.g. Nigeria 2GB 30Days"
//                                             className="bg-white"
//                                             value={formData.packageName}
//                                             onChange={(e) => handleFormChange('packageName', e.target.value)}
//                                             required
//                                         />
//                                     </div>

//                                     <div className="space-y-2">
//                                         <label className="font-medium">Package No</label>
//                                         <Input
//                                             placeholder="e.g. PKG001"
//                                             className="bg-white"
//                                             value={formData.packageNo}
//                                             onChange={(e) => handleFormChange('packageNo', e.target.value)}
//                                             required
//                                         />
//                                     </div>

//                                     <div className="grid grid-cols-2 gap-4">
//                                         <div className="space-y-2">
//                                             <label className="font-medium">Cost Price</label>
//                                             <Input
//                                                 type="number"
//                                                 placeholder="0.00"
//                                                 className="bg-white"
//                                                 value={formData.costPrice}
//                                                 onChange={(e) => handleFormChange('costPrice', Number(e.target.value))}
//                                                 min="0"
//                                                 step="0.01"
//                                                 required
//                                             />
//                                         </div>
//                                         <div className="space-y-2">
//                                             <label className="font-medium">Selling Price</label>
//                                             <Input
//                                                 type="number"
//                                                 placeholder="0.00"
//                                                 className="bg-white"
//                                                 value={formData.price}
//                                                 onChange={(e) => handleFormChange('price', Number(e.target.value))}
//                                                 min="0"
//                                                 step="0.01"
//                                                 required
//                                             />
//                                         </div>
//                                     </div>

//                                     <div className="space-y-2">
//                                         <label className="font-medium">Location</label>
//                                         <Select
//                                             value={formData.esimLocationID}
//                                             onValueChange={(value) => handleFormChange('esimLocationID', value)}
//                                             required
//                                         >
//                                             <SelectTrigger className="w-full bg-white">
//                                                 <SelectValue placeholder="Select location" />
//                                             </SelectTrigger>
//                                             <SelectContent>
//                                                 {locations.map((location) => (
//                                                     <SelectItem key={location.id} value={location.id}>
//                                                         {getCountryFlag(location.locationCode)} {location.locationName}
//                                                     </SelectItem>
//                                                 ))}
//                                             </SelectContent>
//                                         </Select>
//                                     </div>
//                                 </div>

//                                 <Button
//                                     type="submit"
//                                     className="w-full bg-primary hover:bg-primary/90 text-text-body font-medium py-6"
//                                     disabled={!formData.packageName || !formData.packageNo || formData.costPrice <= 0 || formData.price <= 0 || !formData.esimLocationID}
//                                 >
//                                     Update Package
//                                 </Button>
//                             </form>
//                         </div>
//                     </DialogContent>
//                 </Dialog>
//             )}
//         </div>
//     );
// };

// export default EsimPackageManagement;
// // "use client"
// // import { Button } from "@/components/ui/button"
// // import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
// // import { Input } from "@/components/ui/input"
// // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// // import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// // import { Plus, Search } from "lucide-react"
// // import Link from "next/link"
// // import type React from "react"
// // import { useState } from "react"

// // // Sample data for eSim products
// // const esimProducts = [
// //     {
// //         id: "1",
// //         name: "Nigeria",
// //         flag: "NG",
// //         service: "eSim",
// //         minBuyAmount: "₦50",
// //         maxBuyAmount: "₦1,000",
// //         vendingMedium: "-",
// //         notice: "N/A",
// //     },
// // ]

// // const ESimTable = () => {
// //     const [searchTerm, setSearchTerm] = useState<string>("")
// //     const [isAddProductOpen, setIsAddProductOpen] = useState(false)

// //     const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// //         setSearchTerm(e.target.value)
// //     }

// //     const handleAddProduct = (e: React.FormEvent) => {
// //         e.preventDefault()
// //         // Handle form submission
// //         setIsAddProductOpen(false)
// //     }

// //     return (
// //         <div className="w-full">
// //             <div className="flex justify-between items-center mb-4 p-4">
// //                 <div className="flex flex-row justify-center items-center">
// //                     <input
// //                         type="text"
// //                         placeholder="Search"
// //                         className="bg-background-alt border-border rounded-l-[8px] p-4 w-[180px]"
// //                         value={searchTerm}
// //                         onChange={handleSearchChange}
// //                     />
// //                     <button className="bg-primary rounded-r-[8px] p-4 px-6">
// //                         <Search size={20} className="text-text-body" />
// //                     </button>
// //                 </div>

// //                 <div className="flex gap-4">
// //                     <Link
// //                         href="/dashboard/bill-payments/products/esims/manage-esimlocation"
// //                         className="border border-primary-300 bg-background text-text-body font-poppins px-6 py-3 rounded-[12px]"
// //                     >
// //                         Manage Esim Location
// //                     </Link>
// //                     <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
// //                         <DialogTrigger asChild>
// //                             <button className="bg-primary text-text-body font-poppins px-6 py-3 rounded-[12px] font-medium flex gap-2 items-center">
// //                                 <Plus size={16} />
// //                                 Add Product
// //                             </button>
// //                         </DialogTrigger>
// //                         <DialogContent className="sm:max-w-[500px] p-0 rounded-lg">
// //                             <div className="p-6">
// //                                 <div className="flex justify-between items-center">
// //                                     <DialogTitle className="text-xl font-semibold">Add Product</DialogTitle>

// //                                 </div>
// //                                 <div className="h-px bg-gray-200 my-4 -mx-6"></div>
// //                                 <form onSubmit={handleAddProduct} className="space-y-6">
// //                                     <div className="bg-gray-50 p-6 rounded-lg space-y-4">
// //                                         <div className="space-y-2">
// //                                             <label className="font-medium">Country</label>
// //                                             <Select>
// //                                                 <SelectTrigger className="w-full bg-white">
// //                                                     <SelectValue placeholder="Select" />
// //                                                 </SelectTrigger>
// //                                                 <SelectContent>
// //                                                     <SelectItem value="nigeria">Nigeria</SelectItem>
// //                                                     <SelectItem value="ghana">Ghana</SelectItem>
// //                                                     <SelectItem value="kenya">Kenya</SelectItem>
// //                                                 </SelectContent>
// //                                             </Select>
// //                                         </div>

// //                                         <div className="space-y-2">
// //                                             <label className="font-medium">Provider</label>
// //                                             <Select>
// //                                                 <SelectTrigger className="w-full bg-white">
// //                                                     <SelectValue placeholder="Select" />
// //                                                 </SelectTrigger>
// //                                                 <SelectContent>
// //                                                     <SelectItem value="provider1">Provider 1</SelectItem>
// //                                                     <SelectItem value="provider2">Provider 2</SelectItem>
// //                                                     <SelectItem value="provider3">Provider 3</SelectItem>
// //                                                 </SelectContent>
// //                                             </Select>
// //                                         </div>

// //                                         <div className="space-y-2">
// //                                             <label className="font-medium">Provider Id</label>
// //                                             <Input placeholder="Enter id" className="bg-white" />
// //                                         </div>
// //                                     </div>

// //                                     <Button
// //                                         type="submit"
// //                                         className="w-full bg-primary hover:bg-primary/90 text-text-body font-medium py-6"
// //                                     >
// //                                         Add Product
// //                                     </Button>
// //                                 </form>
// //                             </div>
// //                         </DialogContent>
// //                     </Dialog>
// //                 </div>
// //             </div>

// //             <div className="overflow-auto">
// //                 <Table className="w-full">
// //                     <TableHeader className="bg-primary-fade text-muted-foreground hover:bg-primary-fade">
// //                         <TableRow>
// //                             <TableHead className="text-base font-poppins text-text-title">Name</TableHead>
// //                             <TableHead className="text-base font-poppins text-text-title">Service</TableHead>
// //                             <TableHead className="text-base font-poppins text-text-title">Min Buy Amount</TableHead>
// //                             <TableHead className="text-base font-poppins text-text-title">Max Buy Amount</TableHead>
// //                             <TableHead className="text-base font-poppins text-text-title">Vending Medium</TableHead>
// //                             <TableHead className="text-base font-poppins text-text-title">Notice</TableHead>
// //                         </TableRow>
// //                     </TableHeader>
// //                     <TableBody>
// //                         {esimProducts.map((product) => (
// //                             <TableRow key={product.id} className="py-6">
// //                                 <TableCell className="text-text-body font-poppins text-base py-6 flex items-center gap-2">
// //                                     <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
// //                                         <span className="text-green-600 text-sm">🇳🇬</span>
// //                                     </div>
// //                                     {product.name}
// //                                 </TableCell>
// //                                 <TableCell className="text-text-body font-poppins text-base py-6">{product.service}</TableCell>
// //                                 <TableCell className="text-text-body font-poppins text-base py-6">{product.minBuyAmount}</TableCell>
// //                                 <TableCell className="text-text-body font-poppins text-base py-6">{product.maxBuyAmount}</TableCell>
// //                                 <TableCell className="text-text-body font-poppins text-base py-6">{product.vendingMedium}</TableCell>
// //                                 <TableCell className="text-text-body font-poppins text-base py-6">{product.notice}</TableCell>
// //                             </TableRow>
// //                         ))}
// //                     </TableBody>
// //                 </Table>
// //             </div>
// //         </div>
// //     )
// // }

// // export default ESimTable


