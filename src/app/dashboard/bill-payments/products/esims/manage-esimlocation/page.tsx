

'use client'

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEsimLocationStore } from '@/store/EsimStore';
import { ChevronLeft, ChevronRight, Edit, Plus, Trash2, X } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
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

// Location Modal Component
interface LocationModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode: 'add' | 'edit';
    initialData?: {
        id?: string;
        locationName: string;
        locationId: string;
        locationCode: string;
    };
    onSubmit: (data: any) => void;
}

const LocationModal: React.FC<LocationModalProps> = ({
    open,
    onOpenChange,
    mode,
    initialData = { locationName: '', locationId: '', locationCode: '' },
    onSubmit
}) => {
    const [locationName, setLocationName] = useState(initialData.locationName);
    const [locationId, setLocationId] = useState(initialData.locationId);
    const [locationCode, setLocationCode] = useState(initialData.locationCode);

    // Update form when initialData changes (for edit mode)
    useEffect(() => {
        if (open && mode === 'edit') {
            setLocationName(initialData.locationName || '');
            setLocationId(initialData.locationId || '');
            setLocationCode(initialData.locationCode || '');
        }
    }, [open, mode, initialData]);

    // Reset form when modal closes
    useEffect(() => {
        if (!open && mode === 'add') {
            setLocationName('');
            setLocationId('');
            setLocationCode('');
        }
    }, [open, mode]);

    const handleSubmit = () => {
        const data: { id?: string; locationName: string; locationId: string; locationCode: string } = {
            locationName,
            locationId,
            locationCode,
        };

        if (mode === 'edit' && initialData.id) {
            data.id = initialData.id;
        }

        onSubmit(data);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] p-0 overflow-auto max-h-[90vh] w-[95vw] sm:w-full rounded-lg">
                <DialogHeader className="p-4 border-b">
                    <div className="flex justify-between items-center w-full">
                        <DialogTitle className="text-xl font-bold">
                            {mode === 'add' ? 'Add eSIM Location' : 'Edit eSIM Location'}
                        </DialogTitle>
                        <button
                            onClick={() => onOpenChange(false)}
                            className="text-sm text-gray-500 flex items-center"
                        >
                            Close <span className="ml-1">×</span>
                        </button>
                    </div>
                </DialogHeader>

                <div className="p-6 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="locationName">Location Name</Label>
                        <Input
                            id="locationName"
                            value={locationName}
                            onChange={(e) => setLocationName(e.target.value)}
                            placeholder="e.g. Nigeria"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="locationId">Location ID</Label>
                        <Input
                            id="locationId"
                            value={locationId}
                            onChange={(e) => setLocationId(e.target.value)}
                            placeholder="e.g. 174"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="locationCode">Location Code</Label>
                        <Input
                            id="locationCode"
                            value={locationCode}
                            onChange={(e) => setLocationCode(e.target.value)}
                            placeholder="e.g. ng"
                        />
                    </div>
                </div>

                <div className="p-4 pt-0">
                    <Button
                        onClick={handleSubmit}
                        className="w-full py-2 bg-primary text-black rounded-md"
                        disabled={!locationName || !locationId || !locationCode}
                    >
                        {mode === 'add' ? 'Add Location' : 'Update Location'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

// Loading skeleton components
const TableRowSkeleton = () => (
    <TableRow>
        <TableCell>
            <div className="h-8 w-32 bg-gray-200 animate-pulse rounded"></div>
        </TableCell>
        <TableCell>
            <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
        </TableCell>
        <TableCell>
            <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
        </TableCell>
        <TableCell>
            <div className="flex space-x-2">
                <div className="h-8 w-8 bg-gray-200 animate-pulse rounded-full"></div>
                <div className="h-8 w-8 bg-gray-200 animate-pulse rounded-full"></div>
            </div>
        </TableCell>
    </TableRow>
);

const TableSkeleton = () => (
    <div className="w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 p-4">
            <div className="h-10 w-64 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-10 w-32 bg-gray-200 animate-pulse rounded"></div>
        </div>

        <div className="overflow-auto">
            <Table className="w-full">
                <TableHeader className="bg-primary-fade hover:bg-primary-fade">
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
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {[1, 2, 3, 4, 5].map((i) => (
                        <TableRowSkeleton key={i} />
                    ))}
                </TableBody>
            </Table>
        </div>
    </div>
);

// Main Component
const EsimLocationManagement: React.FC = () => {
    const {
        locations,
        page,
        totalPages,
        limit,
        total,
        isLoading,
        getLocations,
        createLocation,
        updateLocation,
        deleteLocation
    } = useEsimLocationStore();

    const [searchTerm, setSearchTerm] = useState("");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentLocation, setCurrentLocation] = useState<any>(null);

    // Use this ref to track if search was performed
    const searchPerformedRef = useRef(false);

    // Load locations on component mount
    useEffect(() => {
        loadLocations(1);
    }, []);

    // Set up search debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchTerm) {
                performSearch();
                searchPerformedRef.current = true;
            } else if (searchPerformedRef.current) {
                // Only clear search if there was a previous search
                clearSearch();
                searchPerformedRef.current = false;
            }
        }, 300); // 300ms debounce

        return () => clearTimeout(timer);
    }, [searchTerm]);

    const loadLocations = (page: number) => {
        getLocations({
            page,
            limit: 10,
            locationName: '',
            search: searchTerm || ''
        });
    };

    const performSearch = () => {
        getLocations({
            page: 1,
            limit: 10,
            locationName: '',
            search: searchTerm
        });
    };

    const clearSearch = () => {
        getLocations({
            page: 1,
            limit: 10,
            locationName: '',
            search: ''
        });
    };

    const handleClearSearch = () => {
        setSearchTerm('');
        clearSearch();
        searchPerformedRef.current = false;
    };

    const handleAddLocation = async (data: any) => {
        try {
            await createLocation({
                locationName: data.locationName,
                locationId: data.locationId,
                locationCode: data.locationCode
            });
            setIsAddModalOpen(false);
            toast.success("Location added successfully");
            loadLocations(1); // Refresh and go to first page
        } catch (error: any) {
            toast.error("Failed to add location", {
                description: error.message || "An error occurred"
            });
        }
    };

    const handleEditLocation = async (data: any) => {
        try {
            await updateLocation(data.id, {
                locationName: data.locationName,
                locationId: data.locationId,
                locationCode: data.locationCode
            });
            setIsEditModalOpen(false);
            toast.success("Location updated successfully");
            loadLocations(page); // Refresh current page
        } catch (error: any) {
            toast.error("Failed to update location", {
                description: error.message || "An error occurred"
            });
        }
    };

    const handleDeleteLocation = async (id: string, name: string) => {
        if (confirm(`Are you sure you want to delete "${name}"?`)) {
            try {
                await deleteLocation(id);
                toast.success(`"${name}" deleted successfully`);

                // If deleting the last item on a page, go to previous page
                if (locations.length === 1 && page > 1) {
                    loadLocations(page - 1);
                } else {
                    loadLocations(page); // Refresh current page
                }
            } catch (error: any) {
                toast.error("Failed to delete location", {
                    description: error.message || "An error occurred"
                });
            }
        }
    };

    const openEditModal = (location: any) => {
        setCurrentLocation(location);
        setIsEditModalOpen(true);
    };

    // Helper function to get country flag emoji
    const getCountryFlag = (code: string) => {
        if (!code) return '';

        try {
            // Convert country code to flag emoji (each letter is converted to a regional indicator symbol emoji)
            const codePoints = [...code.toUpperCase()]
                .map(char => 127397 + char.charCodeAt(0));
            return String.fromCodePoint(...codePoints);
        } catch (error) {
            console.error("Error creating flag emoji:", error);
            return '';
        }
    };

    if (isLoading && locations.length === 0) {
        return <TableSkeleton />;
    }

    return (
        <div className="w-full">
            {/* Header section - made responsive */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 p-4">
                {/* Search input - full width on mobile */}
                <div className="relative w-full sm:w-auto">
                    <Input
                        type="text"
                        placeholder="Search by name"
                        className="h-10 w-full sm:w-[240px] pr-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 rounded-full"
                            onClick={handleClearSearch}
                        >
                            <X size={14} className="text-gray-500" />
                        </Button>
                    )}
                </div>

                {/* Action buttons - stack on mobile */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
                    <Link
                        href="/dashboard/bill-payments/products/esims/"
                        className="border border-primary-300 bg-background text-text-body font-poppins px-4 sm:px-6 py-2 sm:py-3 rounded-[12px] text-center sm:text-left"
                    >
                        Manage Esim Packages
                    </Link>

                    <Button
                        className="bg-primary text-text-body flex justify-center items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 h-auto w-full sm:w-auto"
                        onClick={() => setIsAddModalOpen(true)}
                    >
                        <Plus size={16} />
                        <span>Add Location</span>
                    </Button>
                </div>
            </div>

            {/* Table section */}
            <div className="overflow-x-auto">
                <Table className="w-full">
                    <TableHeader className="bg-primary-fade text-muted-foreground hover:bg-primary-fade">
                        <TableRow>
                            <TableHead className="text-sm sm:text-base font-poppins text-text-title">Location Name</TableHead>
                            <TableHead className="text-sm sm:text-base font-poppins text-text-title">Location ID</TableHead>
                            <TableHead className="text-sm sm:text-base font-poppins text-text-title">Location Code</TableHead>
                            <TableHead className="text-sm sm:text-base font-poppins text-text-title">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {locations.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                                    {searchTerm ? "No locations found matching your search" : "No locations found"}
                                </TableCell>
                            </TableRow>
                        ) : (
                            locations.map((location) => (
                                <TableRow key={location.id} className="py-2 sm:py-4">
                                    <TableCell className="text-text-body font-poppins text-sm sm:text-base py-2 sm:py-4 flex items-center gap-2">
                                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-full flex items-center justify-center">
                                            <span className="text-green-600 text-xs sm:text-sm">
                                                {location.locationCode && getCountryFlag(location.locationCode)}
                                            </span>
                                        </div>
                                        <span className="truncate max-w-[120px] sm:max-w-none">
                                            {location.locationName}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-text-body font-poppins text-sm sm:text-base py-2 sm:py-4">
                                        {location.locationId}
                                    </TableCell>
                                    <TableCell className="text-text-body font-poppins text-sm sm:text-base py-2 sm:py-4">
                                        {location.locationCode}
                                    </TableCell>
                                    <TableCell className="text-text-body font-poppins text-sm sm:text-base py-2 sm:py-4">
                                        <div className="flex space-x-1 sm:space-x-2">
                                            <Button
                                                variant="ghost"
                                                className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                                                onClick={() => openEditModal(location)}
                                            >
                                                <Edit className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                                                onClick={() => handleDeleteLocation(location.id, location.locationName)}
                                            >
                                                <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Show pagination only if we have locations */}
            {locations.length > 0 && (
                <>
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={loadLocations}
                    />
                    <div className="text-center text-xs sm:text-sm text-gray-500 py-3">
                        Showing {locations.length} of {total} records
                    </div>
                </>
            )}

            {/* Add Location Modal */}
            <LocationModal
                open={isAddModalOpen}
                onOpenChange={setIsAddModalOpen}
                mode="add"
                onSubmit={handleAddLocation}
            />

            {/* Edit Location Modal */}
            <LocationModal
                open={isEditModalOpen}
                onOpenChange={setIsEditModalOpen}
                mode="edit"
                initialData={currentLocation || {}}
                onSubmit={handleEditLocation}
            />
        </div>
    );
};

export default EsimLocationManagement;
// 'use client'

// import { Button } from "@/components/ui/button";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { useEsimLocationStore } from '@/store/EsimStore';
// import { ChevronLeft, ChevronRight, Edit, Plus, Search, Trash2, X } from 'lucide-react';
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

// // Location Modal Component
// interface LocationModalProps {
//     open: boolean;
//     onOpenChange: (open: boolean) => void;
//     mode: 'add' | 'edit';
//     initialData?: {
//         id?: string;
//         locationName: string;
//         locationId: string;
//         locationCode: string;
//     };
//     onSubmit: (data: any) => void;
// }

// const LocationModal: React.FC<LocationModalProps> = ({
//     open,
//     onOpenChange,
//     mode,
//     initialData = { locationName: '', locationId: '', locationCode: '' },
//     onSubmit
// }) => {
//     const [locationName, setLocationName] = useState(initialData.locationName);
//     const [locationId, setLocationId] = useState(initialData.locationId);
//     const [locationCode, setLocationCode] = useState(initialData.locationCode);

//     // Update form when initialData changes (for edit mode)
//     useEffect(() => {
//         if (open && mode === 'edit') {
//             setLocationName(initialData.locationName || '');
//             setLocationId(initialData.locationId || '');
//             setLocationCode(initialData.locationCode || '');
//         }
//     }, [open, mode, initialData]);

//     // Reset form when modal closes
//     useEffect(() => {
//         if (!open && mode === 'add') {
//             setLocationName('');
//             setLocationId('');
//             setLocationCode('');
//         }
//     }, [open, mode]);

//     const handleSubmit = () => {
//         const data: { id?: string; locationName: string; locationId: string; locationCode: string } = {
//             locationName,
//             locationId,
//             locationCode,
//         };

//         if (mode === 'edit' && initialData.id) {
//             data.id = initialData.id;
//         }

//         onSubmit(data);
//     };

//     return (
//         <Dialog open={open} onOpenChange={onOpenChange}>
//             <DialogContent className="sm:max-w-[500px] p-0 overflow-auto max-h-[90vh] w-[95vw] sm:w-full rounded-lg">
//                 <DialogHeader className="p-4 border-b">
//                     <div className="flex justify-between items-center w-full">
//                         <DialogTitle className="text-xl font-bold">
//                             {mode === 'add' ? 'Add eSIM Location' : 'Edit eSIM Location'}
//                         </DialogTitle>
//                         <button
//                             onClick={() => onOpenChange(false)}
//                             className="text-sm text-gray-500 flex items-center"
//                         >
//                             Close <span className="ml-1">×</span>
//                         </button>
//                     </div>
//                 </DialogHeader>

//                 <div className="p-6 space-y-4">
//                     <div className="space-y-2">
//                         <Label htmlFor="locationName">Location Name</Label>
//                         <Input
//                             id="locationName"
//                             value={locationName}
//                             onChange={(e) => setLocationName(e.target.value)}
//                             placeholder="e.g. Nigeria"
//                         />
//                     </div>

//                     <div className="space-y-2">
//                         <Label htmlFor="locationId">Location ID</Label>
//                         <Input
//                             id="locationId"
//                             value={locationId}
//                             onChange={(e) => setLocationId(e.target.value)}
//                             placeholder="e.g. 174"
//                         />
//                     </div>

//                     <div className="space-y-2">
//                         <Label htmlFor="locationCode">Location Code</Label>
//                         <Input
//                             id="locationCode"
//                             value={locationCode}
//                             onChange={(e) => setLocationCode(e.target.value)}
//                             placeholder="e.g. ng"
//                         />
//                     </div>
//                 </div>

//                 <div className="p-4 pt-0">
//                     <Button
//                         onClick={handleSubmit}
//                         className="w-full py-2 bg-primary text-black rounded-md"
//                         disabled={!locationName || !locationId || !locationCode}
//                     >
//                         {mode === 'add' ? 'Add Location' : 'Update Location'}
//                     </Button>
//                 </div>
//             </DialogContent>
//         </Dialog>
//     );
// };

// // Loading skeleton components
// const TableRowSkeleton = () => (
//     <TableRow>
//         <TableCell>
//             <div className="h-8 w-32 bg-gray-200 animate-pulse rounded"></div>
//         </TableCell>
//         <TableCell>
//             <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
//         </TableCell>
//         <TableCell>
//             <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
//         </TableCell>
//         <TableCell>
//             <div className="flex space-x-2">
//                 <div className="h-8 w-8 bg-gray-200 animate-pulse rounded-full"></div>
//                 <div className="h-8 w-8 bg-gray-200 animate-pulse rounded-full"></div>
//             </div>
//         </TableCell>
//     </TableRow>
// );

// const TableSkeleton = () => (
//     <div className="w-full">
//         <div className="flex justify-between items-center mb-4 p-4">
//             <div className="h-10 w-64 bg-gray-200 animate-pulse rounded"></div>
//             <div className="h-10 w-32 bg-gray-200 animate-pulse rounded"></div>
//         </div>

//         <div className="overflow-auto">
//             <Table className="w-full">
//                 <TableHeader className="bg-primary-fade hover:bg-primary-fade">
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
//                     </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                     {[1, 2, 3, 4, 5].map((i) => (
//                         <TableRowSkeleton key={i} />
//                     ))}
//                 </TableBody>
//             </Table>
//         </div>
//     </div>
// );

// // Main Component
// const EsimLocationManagement: React.FC = () => {
//     const {
//         locations,
//         page,
//         totalPages,
//         limit,
//         total,
//         isLoading,
//         getLocations,
//         createLocation,
//         updateLocation,
//         deleteLocation
//     } = useEsimLocationStore();

//     const [searchTerm, setSearchTerm] = useState("");
//     const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//     const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//     const [currentLocation, setCurrentLocation] = useState<any>(null);

//     // Load locations on component mount
//     useEffect(() => {
//         loadLocations(1);
//     }, []);

//     const loadLocations = (page: number) => {
//         // Fix: Remove the extra 'search' parameter that doesn't exist in the interface
//         getLocations({
//             page,
//             limit: 10,
//             locationName: '',
//             search: searchTerm || ''
//         });
//     };

//     const handleSearch = () => {
//         if (searchTerm.trim()) {
//             // Only perform search if there's an actual search term
//             loadLocations(1); // Reset to first page on search
//         }
//     };

//     const handleClearSearch = () => {
//         setSearchTerm('');
//         // Clear search and fetch all locations
//         getLocations({
//             page: 1,
//             limit: 10,
//             search: ''
//         });
//     };

//     const handleAddLocation = async (data: any) => {
//         try {
//             await createLocation({
//                 locationName: data.locationName,
//                 locationId: data.locationId,
//                 locationCode: data.locationCode
//             });
//             setIsAddModalOpen(false);
//             toast.success("Location added successfully");
//             loadLocations(1); // Refresh and go to first page
//         } catch (error: any) {
//             toast.error("Failed to add location", {
//                 description: error.message || "An error occurred"
//             });
//         }
//     };

//     const handleEditLocation = async (data: any) => {
//         try {
//             await updateLocation(data.id, {
//                 locationName: data.locationName,
//                 locationId: data.locationId,
//                 locationCode: data.locationCode
//             });
//             setIsEditModalOpen(false);
//             toast.success("Location updated successfully");
//             loadLocations(page); // Refresh current page
//         } catch (error: any) {
//             toast.error("Failed to update location", {
//                 description: error.message || "An error occurred"
//             });
//         }
//     };

//     const handleDeleteLocation = async (id: string, name: string) => {
//         if (confirm(`Are you sure you want to delete "${name}"?`)) {
//             try {
//                 await deleteLocation(id);
//                 toast.success(`"${name}" deleted successfully`);

//                 // If deleting the last item on a page, go to previous page
//                 if (locations.length === 1 && page > 1) {
//                     loadLocations(page - 1);
//                 } else {
//                     loadLocations(page); // Refresh current page
//                 }
//             } catch (error: any) {
//                 toast.error("Failed to delete location", {
//                     description: error.message || "An error occurred"
//                 });
//             }
//         }
//     };

//     const openEditModal = (location: any) => {
//         setCurrentLocation(location);
//         setIsEditModalOpen(true);
//     };

//     // Helper function to get country flag emoji
//     const getCountryFlag = (code: string) => {
//         if (!code) return '';

//         try {
//             // Convert country code to flag emoji (each letter is converted to a regional indicator symbol emoji)
//             const codePoints = [...code.toUpperCase()]
//                 .map(char => 127397 + char.charCodeAt(0));
//             return String.fromCodePoint(...codePoints);
//         } catch (error) {
//             console.error("Error creating flag emoji:", error);
//             return '';
//         }
//     };

//     if (isLoading && locations.length === 0) {
//         return <TableSkeleton />;
//     }

//     return (
//         <div className="w-full">
//             <div className="flex justify-between items-center mb-4 p-4">
//                 <div className="flex flex-row justify-center items-center">
//                     <Input
//                         type="text"
//                         placeholder="Search by name"
//                         className="rounded-l-md h-10 w-[240px]"
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                         onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
//                     />
//                     <Button
//                         className="bg-primary rounded-r-md h-10 px-4"
//                         onClick={handleSearch}
//                     >
//                         <Search size={18} className="text-text-body" />
//                     </Button>
//                     {searchTerm && (
//                         <Button
//                             className="bg-red-500 h-10 px-4 ml-2"
//                             onClick={handleClearSearch}
//                         >
//                             <X size={18} className="text-white" />
//                         </Button>
//                     )}
//                 </div>
//                 <div className="flex gap-4">
//                     <Link
//                         href="/dashboard/bill-payments/products/esims/"
//                         className="border border-primary-300 bg-background text-text-body font-poppins px-6 py-3 rounded-[12px]"
//                     >
//                         Manage Esim Packages
//                     </Link>

//                     <Button
//                         className="bg-primary text-text-body flex gap-2 items-center px-6 py-3 h-auto"
//                         onClick={() => setIsAddModalOpen(true)}
//                     >
//                         <Plus size={16} />
//                         Add Location
//                     </Button>
//                 </div>
//             </div>

//             <div className="overflow-auto">
//                 <Table className="w-full">
//                     <TableHeader className="bg-primary-fade text-muted-foreground hover:bg-primary-fade">
//                         <TableRow>
//                             <TableHead className="text-base font-poppins text-text-title">Location Name</TableHead>
//                             <TableHead className="text-base font-poppins text-text-title">Location ID</TableHead>
//                             <TableHead className="text-base font-poppins text-text-title">Location Code</TableHead>
//                             <TableHead className="text-base font-poppins text-text-title">Actions</TableHead>
//                         </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                         {locations.length === 0 ? (
//                             <TableRow>
//                                 <TableCell colSpan={4} className="text-center py-8 text-gray-500">
//                                     {searchTerm ? "No locations found matching your search" : "No locations found"}
//                                 </TableCell>
//                             </TableRow>
//                         ) : (
//                             locations.map((location) => (
//                                 <TableRow key={location.id} className="py-4">
//                                     <TableCell className="text-text-body font-poppins text-base py-4 flex items-center gap-2">
//                                         <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
//                                             <span className="text-green-600 text-sm">
//                                                 {location.locationCode && getCountryFlag(location.locationCode)}
//                                             </span>
//                                         </div>
//                                         {location.locationName}
//                                     </TableCell>
//                                     <TableCell className="text-text-body font-poppins text-base py-4">
//                                         {location.locationId}
//                                     </TableCell>
//                                     <TableCell className="text-text-body font-poppins text-base py-4">
//                                         {location.locationCode}
//                                     </TableCell>
//                                     <TableCell className="text-text-body font-poppins text-base py-4">
//                                         <div className="flex space-x-2">
//                                             <Button
//                                                 variant="ghost"
//                                                 className="h-8 w-8 p-0"
//                                                 onClick={() => openEditModal(location)}
//                                             >
//                                                 <Edit className="h-4 w-4 text-blue-500" />
//                                             </Button>
//                                             <Button
//                                                 variant="ghost"
//                                                 className="h-8 w-8 p-0"
//                                                 onClick={() => handleDeleteLocation(location.id, location.locationName)}
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

//             {/* Show pagination only if we have locations */}
//             {locations.length > 0 && (
//                 <>
//                     <Pagination
//                         currentPage={page}
//                         totalPages={totalPages}
//                         onPageChange={loadLocations}
//                     />
//                     <div className="text-center text-sm text-gray-500 py-3">
//                         Showing {locations.length} of {total} records
//                     </div>
//                 </>
//             )}

//             {/* Add Location Modal */}
//             <LocationModal
//                 open={isAddModalOpen}
//                 onOpenChange={setIsAddModalOpen}
//                 mode="add"
//                 onSubmit={handleAddLocation}
//             />

//             {/* Edit Location Modal */}
//             <LocationModal
//                 open={isEditModalOpen}
//                 onOpenChange={setIsEditModalOpen}
//                 mode="edit"
//                 initialData={currentLocation || {}}
//                 onSubmit={handleEditLocation}
//             />
//         </div>
//     );
// };

// export default EsimLocationManagement;

