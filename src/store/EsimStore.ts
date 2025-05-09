import { bps_endpoint } from "@/constants/string";
import axiosInstance from "@/utilities/axios";
import { getErrorMessage } from "@/utilities/utils";
import { create } from "zustand";

export interface EsimLocation {
    id: string;
    locationName: string;
    locationId: string;
    locationCode: string;
}

interface EsimLocationQueryParams {
    page: number;
    limit: number;
    search: string;
    locationName?: string;
    locationId?: string;
}

interface CreateEsimLocationPayload {
    locationName: string;
    locationId: string;
    locationCode: string;
}

interface UpdateEsimLocationPayload {
    locationName?: string;
    locationId?: string;
    locationCode?: string;
}

interface EsimLocationState {
    locations: EsimLocation[];
    selectedLocation: EsimLocation | null;
    page: number;
    totalPages: number;
    limit: number;
    total: number;
    isLoading: boolean;
    isQueryResult: boolean;
    lastError: string | null;

    // Actions
    getLocations: (params: EsimLocationQueryParams) => Promise<void>;
    getSingleLocation: (id: string) => Promise<void>;
    createLocation: (payload: CreateEsimLocationPayload) => Promise<EsimLocation>;
    updateLocation: (id: string, payload: UpdateEsimLocationPayload) => Promise<EsimLocation>;
    deleteLocation: (id: string) => Promise<void>;
    setField: <K extends keyof EsimLocationState>(field: K, value: EsimLocationState[K]) => void;
}

export const useEsimLocationStore = create<EsimLocationState>()((set, get) => ({
    locations: [],
    selectedLocation: null,
    page: 1,
    totalPages: 0,
    limit: 10,
    total: 0,
    isLoading: false,
    isQueryResult: false,
    lastError: null,

    setField: <K extends keyof EsimLocationState>(field: K, value: EsimLocationState[K]) => {
        set({ [field]: value } as Pick<EsimLocationState, K>);
    },

    getLocations: async ({ page, limit, locationName, locationId, search }: EsimLocationQueryParams) => {
        set({ isLoading: true, lastError: null });

        try {
            const query = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),

                ...(locationName && { locationName }),
                ...(locationId && { locationId }),
                ...(search && { search }),
            });

            set({
                isQueryResult: !!(locationName || locationId || search),
            });

            // Add debugging console.log to see the URL being called
            console.log(`Calling API: ${bps_endpoint}/esimlocation?${query.toString()}`);

            const response = await axiosInstance.get(
                `${bps_endpoint}/esimlocation?${query.toString()}`
            );

            // Log the response to see what's coming back
            console.log("API Response:", response);

            // CRITICAL FIX: The data structure is different than expected
            // The response.data contains { limit, page, count, records } directly 
            // not nested under data.data as we expected

            if (!response.data) {
                throw new Error("API response is missing data");
            }

            // Check if records is an array
            if (!Array.isArray(response.data.records)) {
                console.error("Unexpected API response structure:", response.data);
                throw new Error("Unexpected API response structure: records is not an array");
            }

            // Extract data directly from response.data
            const records = response.data.records || [];
            const responsePage = response.data.page || page;
            const responseLimit = response.data.limit || limit;
            const responseCount = response.data.count || 0;

            // Log what we're about to set in the store
            console.log("Setting locations:", records);
            console.log("Count:", responseCount);

            set({
                locations: records,
                page: responsePage,
                totalPages: Math.ceil(responseCount / responseLimit),
                limit: responseLimit,
                total: responseCount,
                isLoading: false,
            });

            // Log state after update to verify
            console.log("Store state after update:", get());

        } catch (error: any) {
            console.error("Error fetching locations:", error);
            const errorMsg = getErrorMessage(error);
            set({
                isLoading: false,
                lastError: errorMsg,
                // Ensure we don't lose previous locations on error
                locations: get().locations
            });
            throw new Error(errorMsg);
        }
    },

    getSingleLocation: async (id: string) => {
        set({ isLoading: true, lastError: null });

        try {
            console.log(`Fetching location with ID: ${id}`);

            const response = await axiosInstance.get(
                `${bps_endpoint}/esimlocation/${id}`
            );

            console.log("Single location response:", response);

            if (!response.data) {
                throw new Error("Invalid response data for single location");
            }

            // The single location API probably returns the location directly in data
            // Adapt based on what you see in the console logs
            const locationData = response.data.data || response.data;

            set({
                selectedLocation: locationData,
                isLoading: false,
            });

            return locationData;
        } catch (error: any) {
            console.error("Error fetching single location:", error);
            const errorMsg = getErrorMessage(error);
            set({ isLoading: false, lastError: errorMsg });
            throw new Error(errorMsg);
        }
    },

    createLocation: async (payload: CreateEsimLocationPayload) => {
        set({ isLoading: true, lastError: null });

        try {
            console.log("Creating location with payload:", payload);

            const response = await axiosInstance.post(
                `${bps_endpoint}/esimlocation`,
                payload
            );

            console.log("Create location response:", response);

            // Adapt based on the actual response structure
            const createdLocation = response.data.data || response.data;

            // Refresh locations after creating a new one
            const currentPage = get().page;
            const currentLimit = get().limit;

            // We should await this to ensure store is updated
            await get().getLocations({ page: currentPage, limit: currentLimit, search: '' });

            set({ isLoading: false });
            return createdLocation;
        } catch (error: any) {
            console.error("Error creating location:", error);
            const errorMsg = getErrorMessage(error);
            set({ isLoading: false, lastError: errorMsg });
            throw new Error(errorMsg);
        }
    },

    updateLocation: async (id: string, payload: UpdateEsimLocationPayload) => {
        set({ isLoading: true, lastError: null });

        try {
            console.log(`Updating location ${id} with payload:`, payload);

            const response = await axiosInstance.put(
                `${bps_endpoint}/esimlocation/${id}`,
                payload
            );

            console.log("Update location response:", response);

            // Adapt based on actual response structure
            const updatedLocation = response.data.data || response.data;

            // Update the location in the locations array if it exists
            set((state) => {
                const updatedLocations = state.locations.map((location) =>
                    location.id === id ? { ...location, ...payload } : location
                );

                // Also update the selectedLocation if it matches
                const updatedSelectedLocation = state.selectedLocation?.id === id
                    ? { ...state.selectedLocation, ...payload }
                    : state.selectedLocation;

                return {
                    locations: updatedLocations,
                    selectedLocation: updatedSelectedLocation,
                    isLoading: false,
                };
            });

            return updatedLocation;
        } catch (error: any) {
            console.error("Error updating location:", error);
            const errorMsg = getErrorMessage(error);
            set({ isLoading: false, lastError: errorMsg });
            throw new Error(errorMsg);
        }
    },

    deleteLocation: async (id: string) => {
        set({ isLoading: true, lastError: null });

        try {
            console.log(`Deleting location with ID: ${id}`);

            const response = await axiosInstance.delete(
                `${bps_endpoint}/esimlocation/${id}`
            );

            console.log("Delete location response:", response);

            // Remove the location from the locations array
            set((state) => {
                const updatedLocations = state.locations.filter(
                    (location) => location.id !== id
                );

                // Clear selectedLocation if it matches the deleted ID
                const updatedSelectedLocation = state.selectedLocation?.id === id
                    ? null
                    : state.selectedLocation;

                return {
                    locations: updatedLocations,
                    selectedLocation: updatedSelectedLocation,
                    total: state.total - 1,
                    isLoading: false,
                };
            });
        } catch (error: any) {
            console.error("Error deleting location:", error);
            const errorMsg = getErrorMessage(error);
            set({ isLoading: false, lastError: errorMsg });
            throw new Error(errorMsg);
        }
    },
}));


// import { bps_endpoint } from "@/constants/string";
// import axiosInstance from "@/utilities/axios";
// import { getErrorMessage } from "@/utilities/utils";
// import { create } from "zustand";

// export interface EsimLocation {
//     id: string;
//     locationName: string;
//     locationId: string;
//     locationCode: string;
// }

// interface EsimLocationQueryParams {
//     page: number;
//     limit: number;
//     locationName?: string;
//     locationId?: string;
// }

// interface CreateEsimLocationPayload {
//     locationName: string;
//     locationId: string;
//     locationCode: string;
// }

// interface UpdateEsimLocationPayload {
//     locationName?: string;
//     locationId?: string;
//     locationCode?: string;
// }

// interface EsimLocationState {
//     locations: EsimLocation[];
//     selectedLocation: EsimLocation | null;
//     page: number;
//     totalPages: number;
//     limit: number;
//     total: number;
//     isLoading: boolean;
//     isQueryResult: boolean;

//     // Actions
//     getLocations: (params: EsimLocationQueryParams) => Promise<void>;
//     getSingleLocation: (id: string) => Promise<void>;
//     createLocation: (payload: CreateEsimLocationPayload) => Promise<EsimLocation>;
//     updateLocation: (id: string, payload: UpdateEsimLocationPayload) => Promise<EsimLocation>;
//     deleteLocation: (id: string) => Promise<void>;
//     setField: <K extends keyof EsimLocationState>(field: K, value: EsimLocationState[K]) => void;
// }

// export const useEsimLocationStore = create<EsimLocationState>()((set, get) => ({
//     locations: [],
//     selectedLocation: null,
//     page: 1,
//     totalPages: 0,
//     limit: 10,
//     total: 0,
//     isLoading: false,
//     isQueryResult: false,

//     setField: <K extends keyof EsimLocationState>(field: K, value: EsimLocationState[K]) => {
//         set({ [field]: value } as Pick<EsimLocationState, K>);
//     },

//     getLocations: async ({ page, limit, locationName, locationId }: EsimLocationQueryParams) => {
//         set({ isLoading: true });

//         try {
//             const query = new URLSearchParams({
//                 page: page.toString(),
//                 limit: limit.toString(),
//                 ...(locationName && { locationName }),
//                 ...(locationId && { locationId }),
//             });

//             set({
//                 isQueryResult: !!(locationName || locationId), // Explicitly cast to boolean
//             });

//             const { data } = await axiosInstance.get(
//                 `${bps_endpoint}/esimlocation?${query.toString()}`
//             );

//             set({
//                 locations: data.data.records,
//                 page: data.data.page,
//                 totalPages: Math.ceil(data.data.count / data.data.limit),
//                 limit: data.data.limit,
//                 total: data.data.count,
//                 isLoading: false,
//             });
//         } catch (error: any) {
//             set({ isLoading: false });
//             throw new Error(getErrorMessage(error));
//         }
//     },

//     getSingleLocation: async (id: string) => {
//         set({ isLoading: true });

//         try {
//             const { data } = await axiosInstance.get(
//                 `${bps_endpoint}/esimlocation/${id}`
//             );

//             set({
//                 selectedLocation: data.data,
//                 isLoading: false,
//             });
//         } catch (error: any) {
//             set({ isLoading: false });
//             throw new Error(getErrorMessage(error));
//         }
//     },

//     createLocation: async (payload: CreateEsimLocationPayload) => {
//         set({ isLoading: true });

//         try {
//             const { data } = await axiosInstance.post(
//                 `${bps_endpoint}/esimlocation`,
//                 payload
//             );

//             // Refresh locations after creating a new one
//             const currentPage = get().page;
//             const currentLimit = get().limit;
//             await get().getLocations({ page: currentPage, limit: currentLimit });

//             set({ isLoading: false });
//             return data.data;
//         } catch (error: any) {
//             set({ isLoading: false });
//             throw new Error(getErrorMessage(error));
//         }
//     },

//     updateLocation: async (id: string, payload: UpdateEsimLocationPayload) => {
//         set({ isLoading: true });

//         try {
//             const { data } = await axiosInstance.put(
//                 `${bps_endpoint}/esimlocation/${id}`,
//                 payload
//             );

//             // Update the location in the locations array if it exists
//             set((state) => {
//                 const updatedLocations = state.locations.map((location) =>
//                     location.id === id ? { ...location, ...payload } : location
//                 );

//                 // Also update the selectedLocation if it matches
//                 const updatedSelectedLocation = state.selectedLocation?.id === id
//                     ? { ...state.selectedLocation, ...payload }
//                     : state.selectedLocation;

//                 return {
//                     locations: updatedLocations,
//                     selectedLocation: updatedSelectedLocation,
//                     isLoading: false,
//                 };
//             });

//             return data.data;
//         } catch (error: any) {
//             set({ isLoading: false });
//             throw new Error(getErrorMessage(error));
//         }
//     },

//     deleteLocation: async (id: string) => {
//         set({ isLoading: true });

//         try {
//             await axiosInstance.delete(
//                 `${bps_endpoint}/esimlocation/${id}`
//             );

//             // Remove the location from the locations array
//             set((state) => {
//                 const updatedLocations = state.locations.filter(
//                     (location) => location.id !== id
//                 );

//                 // Clear selectedLocation if it matches the deleted ID
//                 const updatedSelectedLocation = state.selectedLocation?.id === id
//                     ? null
//                     : state.selectedLocation;

//                 return {
//                     locations: updatedLocations,
//                     selectedLocation: updatedSelectedLocation,
//                     total: state.total - 1,
//                     isLoading: false,
//                 };
//             });
//         } catch (error: any) {
//             set({ isLoading: false });
//             throw new Error(getErrorMessage(error));
//         }
//     },
// }));