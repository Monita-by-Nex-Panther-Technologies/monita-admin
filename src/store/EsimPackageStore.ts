import { bps_endpoint } from "@/constants/string";
import { EsimLocation } from '@/store/EsimStore';
import axiosInstance from "@/utilities/axios";
import { getErrorMessage } from "@/utilities/utils";
import { create } from "zustand";
// Define types for eSIM packages
// export interface EsimLocation {
//     id: string;
//     locationName: string;
//     locationId: string;
//     locationCode: string;
// }

// Special type to handle the price and costPrice structure from API
interface PriceObject {
    s: number; // sign
    e: number; // exponent
    d: number[]; // digits
}

export interface EsimPackage {
    id: string;
    serviceId: string;
    packageNo: string;
    packageName: string;
    costPrice: PriceObject;
    price: PriceObject;
    esimLocationID: string;
    esimLocation?: EsimLocation;
}

// Request payload types
interface EsimPackageQueryParams {
    page: number;
    limit: number;
    esimLocationID?: string;
    packageName?: string;
    search?: string;
}

interface CreateEsimPackagePayload {
    serviceId: string;
    packageNo: string;
    packageName: string;
    costPrice: number;
    price: number;
    esimLocationID: string;
}

interface UpdateEsimPackagePayload {
    serviceId?: string;
    packageNo?: string;
    packageName?: string;
    costPrice?: number;
    price?: number;
    esimLocationID?: string;
}

// Store state interface
interface EsimPackageState {
    packages: EsimPackage[];
    selectedPackage: EsimPackage | null;
    page: number;
    totalPages: number;
    limit: number;
    total: number;
    isLoading: boolean;
    isQueryResult: boolean;
    lastError: string | null;

    // Actions
    getPackages: (params: EsimPackageQueryParams) => Promise<void>;
    getSinglePackage: (id: string) => Promise<void>;
    createPackage: (payload: CreateEsimPackagePayload) => Promise<EsimPackage>;
    updatePackage: (id: string, payload: UpdateEsimPackagePayload) => Promise<EsimPackage>;
    deletePackage: (id: string) => Promise<void>;
    setField: <K extends keyof EsimPackageState>(field: K, value: EsimPackageState[K]) => void;
}

// Helper function to format price for display
export const formatPrice = (priceObject: PriceObject): number => {
    if (!priceObject) return 0;

    try {
        // Try to reconstruct the price from the API's format
        // This is a simplified approach - you might need to adjust based on exact format
        const sign = priceObject.s === -1 ? -1 : 1;
        const digits = priceObject.d.join('');
        const exp = priceObject.e;

        if (exp === -1) {
            // Handle decimal values - divide by 10000000 for 7 decimal places
            return sign * Number(digits) / 10000000;
        } else if (exp === 0) {
            // Single digit followed by decimals
            return sign * (priceObject.d[0] + Number(digits.slice(1)) / Math.pow(10, digits.length - 1));
        } else if (exp === 1) {
            // Two digits followed by decimals
            const firstPart = priceObject.d[0] * 10 + priceObject.d[1];
            return sign * (firstPart + Number(digits.slice(2)) / Math.pow(10, digits.length - 2));
        }

        // Default return when format is unknown
        return Number(digits) / Math.pow(10, Math.abs(exp || 0));
    } catch (error) {
        console.error("Error parsing price:", error);
        return 0;
    }
};

// Create the Zustand store
export const useEsimPackageStore = create<EsimPackageState>()((set, get) => ({
    packages: [],
    selectedPackage: null,
    page: 1,
    totalPages: 0,
    limit: 10,
    total: 0,
    isLoading: false,
    isQueryResult: false,
    lastError: null,

    setField: <K extends keyof EsimPackageState>(field: K, value: EsimPackageState[K]) => {
        set({ [field]: value } as Pick<EsimPackageState, K>);
    },

    getPackages: async ({ page, limit, esimLocationID, packageName, search }: EsimPackageQueryParams) => {
        set({ isLoading: true, lastError: null });

        try {
            const query = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
                ...(esimLocationID && { esimLocationID }),
                ...(packageName && { packageName }),
                ...(search && { search }),
            });

            set({
                isQueryResult: !!(esimLocationID || packageName || search),
            });

            console.log(`Calling API: ${bps_endpoint}/esimpackages?${query.toString()}`);

            const response = await axiosInstance.get(
                `${bps_endpoint}/esimpackages?${query.toString()}`
            );

            console.log("API Response:", response);

            if (!response.data) {
                throw new Error("API response is missing data");
            }

            // Extract data from response
            const records = response.data.records || [];
            const responsePage = response.data.data?.page || page;
            const responseLimit = response.data.data?.limit || limit;
            const responseCount = response.data.data?.count || 0;

            console.log("Setting packages:", records);
            console.log("Count:", responseCount);

            set({
                packages: records,
                page: responsePage,
                totalPages: Math.ceil(responseCount / responseLimit),
                limit: responseLimit,
                total: responseCount,
                isLoading: false,
            });

            console.log("Store state after update:", get());

        } catch (error: any) {
            console.error("Error fetching packages:", error);
            const errorMsg = getErrorMessage(error);
            set({
                isLoading: false,
                lastError: errorMsg,
                // Keep existing packages on error
                packages: get().packages
            });
            throw new Error(errorMsg);
        }
    },

    getSinglePackage: async (id: string) => {
        set({ isLoading: true, lastError: null });

        try {
            console.log(`Fetching package with ID: ${id}`);

            const response = await axiosInstance.get(
                `${bps_endpoint}/esimpackages/${id}`
            );

            console.log("Single package response:", response);

            if (!response.data || !response.data.data) {
                throw new Error("Invalid response data for single package");
            }

            set({
                selectedPackage: response.data.data,
                isLoading: false,
            });

            return response.data.data;
        } catch (error: any) {
            console.error("Error fetching single package:", error);
            const errorMsg = getErrorMessage(error);
            set({ isLoading: false, lastError: errorMsg });
            throw new Error(errorMsg);
        }
    },

    createPackage: async (payload: CreateEsimPackagePayload) => {
        set({ isLoading: true, lastError: null });

        try {
            console.log("Creating package with payload:", payload);

            const response = await axiosInstance.post(
                `${bps_endpoint}/esimpackages`,
                payload
            );

            console.log("Create package response:", response);

            if (!response.data) {
                throw new Error("Invalid response data when creating package");
            }

            // Refresh packages after creating a new one
            const currentPage = get().page;
            const currentLimit = get().limit;

            // Wait for the packages to be refreshed
            await get().getPackages({ page: currentPage, limit: currentLimit });

            set({ isLoading: false });
            return response.data.data;
        } catch (error: any) {
            console.error("Error creating package:", error);
            const errorMsg = getErrorMessage(error);
            set({ isLoading: false, lastError: errorMsg });
            throw new Error(errorMsg);
        }
    },

    updatePackage: async (id: string, payload: UpdateEsimPackagePayload) => {
        set({ isLoading: true, lastError: null });

        try {
            console.log(`Updating package ${id} with payload:`, payload);

            const response = await axiosInstance.patch(
                `${bps_endpoint}/esimpackages/${id}`,
                payload
            );

            console.log("Update package response:", response);

            if (!response.data) {
                throw new Error("Invalid response data when updating package");
            }

            // Update the package in the packages array if it exists
            set((state) => {
                const updatedPackages = state.packages.map((pkg) =>
                    pkg.id === id
                        ? {
                            ...pkg,
                            ...payload,
                            costPrice: typeof payload.costPrice === "number" ? { s: 1, e: 0, d: [payload.costPrice] } : pkg.costPrice,
                            price: typeof payload.price === "number" ? { s: 1, e: 0, d: [payload.price] } : pkg.price,
                        }
                        : pkg
                );

                // Also update the selectedPackage if it matches
                const updatedSelectedPackage = state.selectedPackage?.id === id
                    ? {
                        ...state.selectedPackage,
                        ...payload,
                        costPrice: typeof payload.costPrice === "number" ? { s: 1, e: 0, d: [payload.costPrice] } : state.selectedPackage.costPrice,
                        price: typeof payload.price === "number" ? { s: 1, e: 0, d: [payload.price] } : state.selectedPackage.price,
                    }
                    : state.selectedPackage;

                return {
                    packages: updatedPackages,
                    selectedPackage: updatedSelectedPackage,
                    isLoading: false,
                };
            });

            return response.data.data;
        } catch (error: any) {
            console.error("Error updating package:", error);
            const errorMsg = getErrorMessage(error);
            set({ isLoading: false, lastError: errorMsg });
            throw new Error(errorMsg);
        }
    },

    deletePackage: async (id: string) => {
        set({ isLoading: true, lastError: null });

        try {
            console.log(`Deleting package with ID: ${id}`);

            await axiosInstance.delete(
                `${bps_endpoint}/esimpackages/${id}`
            );

            // Remove the package from the packages array
            set((state) => {
                const updatedPackages = state.packages.filter(
                    (pkg) => pkg.id !== id
                );

                // Clear selectedPackage if it matches the deleted ID
                const updatedSelectedPackage = state.selectedPackage?.id === id
                    ? null
                    : state.selectedPackage;

                return {
                    packages: updatedPackages,
                    selectedPackage: updatedSelectedPackage,
                    total: state.total - 1,
                    isLoading: false,
                };
            });
        } catch (error: any) {
            console.error("Error deleting package:", error);
            const errorMsg = getErrorMessage(error);
            set({ isLoading: false, lastError: errorMsg });
            throw new Error(errorMsg);
        }
    },
}));