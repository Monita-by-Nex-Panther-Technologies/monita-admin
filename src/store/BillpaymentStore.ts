import { bps_endpoint } from "@/constants/string";
import axiosInstance from "@/utilities/axios";
import { getErrorMessage } from "@/utilities/utils";
import { create } from "zustand";

export const useServiceStore = create<ServiceState>()(
    (set, get) => ({
        services: [],
        isLoading: false,
        brands: [],
        brandsTotal: 0,
        brandsPage: 1,
        brandsLimit: 10,

        // New state for current selected service
        selectedService: null,
        selectedServiceId: '',

        // State management for search and filters per service type
        searchState: {
            airtime: { term: '', serviceId: '', page: 1, limit: 10 },
            data: { term: '', serviceId: '', page: 1, limit: 10 },
            cable: { term: '', serviceId: '', page: 1, limit: 10 },
            education: { term: '', serviceId: '', page: 1, limit: 10 },
            internet: { term: '', serviceId: '', page: 1, limit: 10 },
            electricity: { term: '', serviceId: '', page: 1, limit: 10 },
            esim: { term: '', serviceId: '', page: 1, limit: 10 },
            giftcard: { term: '', serviceId: '', page: 1, limit: 10 },
        },

        setField: <K extends keyof ServiceState>(field: K, value: ServiceState[K]) => {
            set({ [field]: value } as Pick<ServiceState, K>);
        },

        // New method to set current selected service
        setSelectedService: (serviceType: ServiceType, serviceId: string) => {
            set({
                selectedService: serviceType,
                selectedServiceId: serviceId
            });

            // Update the searchState for this service type with the serviceId
            set((state) => ({
                searchState: {
                    ...state.searchState,
                    [serviceType]: {
                        ...state.searchState[serviceType],
                        serviceId: serviceId
                    }
                }
            }));
        },

        // Update search state for specific service type
        updateSearchState: (serviceType: ServiceType, searchTerm: string) => {
            set((state) => ({
                searchState: {
                    ...state.searchState,
                    [serviceType]: {
                        ...state.searchState[serviceType],
                        term: searchTerm
                    }
                }
            }));
        },

        // Update pagination state for specific service type
        updatePaginationState: (serviceType: ServiceType, page: number, limit: number) => {
            set((state) => ({
                searchState: {
                    ...state.searchState,
                    [serviceType]: {
                        ...state.searchState[serviceType],
                        page: page,
                        limit: limit
                    }
                }
            }));
        },

        // Get search state for specific service type
        getSearchState: (serviceType: ServiceType) => {
            return get().searchState[serviceType];
        },

        getServices: async () => {
            set({ isLoading: true });

            try {
                const response = await axiosInstance.get(
                    `${bps_endpoint}/services`
                );

                const servicesData = response.data || [];

                set({
                    services: servicesData,
                    isLoading: false,
                });

                return servicesData;
            } catch (error: any) {
                set({ isLoading: false });
                throw new Error(getErrorMessage(error));
            }
        },

        addService: async (serviceData: Omit<Service, "id">) => {
            set({ isLoading: true });

            try {
                const response = await axiosInstance.post(
                    `${bps_endpoint}/service`,
                    serviceData
                );

                set({ isLoading: false });
                return response.data;
            } catch (error: any) {
                set({ isLoading: false });
                throw new Error(getErrorMessage(error));
            }
        },

        updateService: async (serviceId: string, updatedData: Partial<Service>) => {
            set({ isLoading: true });

            try {
                const response = await axiosInstance.patch(
                    `${bps_endpoint}/services/${serviceId}`,
                    updatedData
                );

                // Update the local store after successful update
                set((state) => {
                    const updatedServices = state.services.map((service) =>
                        service.id === serviceId
                            ? { ...service, ...updatedData }
                            : service
                    );
                    return { services: updatedServices, isLoading: false };
                });

                return response.data;
            } catch (error: any) {
                set({ isLoading: false });
                throw new Error(getErrorMessage(error));
            }
        },

        toggleServiceStatus: async (serviceId: string, isEnabled: boolean) => {
            set({ isLoading: true });

            try {
                const response = await axiosInstance.patch(
                    `${bps_endpoint}/services/${serviceId}`,
                    { isEnabled }
                );

                // Update the local store
                set((state) => {
                    const updatedServices = state.services.map((service) =>
                        service.id === serviceId
                            ? { ...service, isEnabled }
                            : service
                    );
                    return { services: updatedServices, isLoading: false };
                });

                return response.data;
            } catch (error: any) {
                set({ isLoading: false });
                throw new Error(getErrorMessage(error));
            }
        },

        deleteService: async (serviceId: string) => {
            set({ isLoading: true });

            try {
                await axiosInstance.delete(
                    `${bps_endpoint}/services/${serviceId}`
                );

                // Remove the deleted service from the local store
                set((state) => {
                    const filteredServices = state.services.filter(
                        (service) => service.id !== serviceId
                    );
                    return { services: filteredServices, isLoading: false };
                });
            } catch (error: any) {
                set({ isLoading: false });
                throw new Error(getErrorMessage(error));
            }
        },

        getBrands: async (serviceId: string, page: number = 1, limit: number = 10, search?: string) => {
            set({ isLoading: true });

            try {
                const query = new URLSearchParams({
                    page: page.toString(),
                    limit: limit.toString()
                });

                // IMPORTANT: Always include serviceId in the query to filter by service
                if (serviceId) {
                    query.append('serviceId', serviceId);
                }

                // Add search parameter if provided
                if (search) {
                    query.append('search', search);
                }

                

                const response = await axiosInstance.get(
                    `${bps_endpoint}/brands?${query}`
                );

                const brandsData = response.data || {};

                set({
                    brands: brandsData.brands || [],
                    brandsTotal: brandsData.count || 0,
                    brandsPage: brandsData.page || 1,
                    brandsLimit: brandsData.limit || 10,
                    isLoading: false,
                });

                return brandsData.brands || [];
            } catch (error: any) {
                set({ isLoading: false });
                throw new Error(getErrorMessage(error));
            }


        },
        clearBrands: () => {
            set({
                brands: [],
                brandsTotal: 0,
                brandsPage: 1
            });
        },

        addBrand: async (brandData: Omit<Brand, "id" | "createdAt" | "updatedAt">) => {
            set({ isLoading: true });

            try {
                const response = await axiosInstance.post(
                    `${bps_endpoint}/brands`,
                    brandData
                );

                // After successful addition, refresh the brands list if we have a serviceId
                if (brandData.serviceId) {
                    await get().getBrands(brandData.serviceId, get().brandsPage, get().brandsLimit);
                }

                set({ isLoading: false });
                return response.data;
            } catch (error: any) {
                set({ isLoading: false });
                throw new Error(getErrorMessage(error));
            }
        },

        updateBrand: async (brandId: string, updatedData: Partial<Brand>) => {
            set({ isLoading: true });

            try {
                const response = await axiosInstance.patch(
                    `${bps_endpoint}/brands/${brandId}`,
                    updatedData
                );

                // Update the local store
                set((state) => {
                    const updatedBrands = state.brands.map((brand) =>
                        brand.id === brandId
                            ? { ...brand, ...updatedData }
                            : brand
                    );
                    return { brands: updatedBrands, isLoading: false };
                });

                return response.data;
            } catch (error: any) {
                set({ isLoading: false });
                throw new Error(getErrorMessage(error));
            }
        },

        toggleBrandStatus: async (brandId: string, isEnabled: boolean) => {
            set({ isLoading: true });

            try {
                const response = await axiosInstance.patch(
                    `${bps_endpoint}/brands/${brandId}`,
                    { isEnabled }
                );

                // Update the local store
                set((state) => {
                    const updatedBrands = state.brands.map((brand) =>
                        brand.id === brandId
                            ? { ...brand, isEnabled }
                            : brand
                    );
                    return { brands: updatedBrands, isLoading: false };
                });

                return response.data;
            } catch (error: any) {
                set({ isLoading: false });
                throw new Error(getErrorMessage(error));
            }
        },

        deleteBrand: async (brandId: string) => {
            set({ isLoading: true });

            try {
                await axiosInstance.delete(
                    `${bps_endpoint}/brands/${brandId}`
                );

                // Remove the deleted brand from the local store
                set((state) => {
                    const filteredBrands = state.brands.filter(
                        (brand) => brand.id !== brandId
                    );
                    return { brands: filteredBrands, isLoading: false };
                });
            } catch (error: any) {
                set({ isLoading: false });
                throw new Error(getErrorMessage(error));
            }
        },
    })
);

// Type definitions
export type ServiceType = 'airtime' | 'data' | 'cable' | 'education' | 'internet' | 'electricity' | 'esim' | 'giftcard';

interface SearchState {
    term: string;
    serviceId: string;
    page: number;
    limit: number;
}

interface ServiceState {
    brands: Brand[];
    brandsTotal: number;
    brandsPage: number;
    brandsLimit: number;
    services: Service[];
    isLoading: boolean;

    // New state for selected service
    selectedService: ServiceType | null;
    selectedServiceId: string;

    // Search state for each service type
    searchState: Record<ServiceType, SearchState>;

    setField: <K extends keyof ServiceState>(field: K, value: ServiceState[K]) => void;
    getServices: () => Promise<Service[]>;
    addService: (serviceData: Omit<Service, "id">) => Promise<any>;
    updateService: (serviceId: string, updatedData: Partial<Service>) => Promise<any>;
    toggleServiceStatus: (serviceId: string, isEnabled: boolean) => Promise<any>;
    deleteService: (serviceId: string) => Promise<void>;

    // New methods for state management
    setSelectedService: (serviceType: ServiceType, serviceId: string) => void;
    updateSearchState: (serviceType: ServiceType, searchTerm: string) => void;
    updatePaginationState: (serviceType: ServiceType, page: number, limit: number) => void;
    getSearchState: (serviceType: ServiceType) => SearchState;

    // Brand methods
    getBrands: (serviceId: string, page?: number, limit?: number, search?: string) => Promise<Brand[]>;
    addBrand: (brandData: Omit<Brand, "id" | "createdAt" | "updatedAt">) => Promise<any>;
    updateBrand: (brandId: string, updatedData: Partial<Brand>) => Promise<any>;
    toggleBrandStatus: (brandId: string, isEnabled: boolean) => Promise<any>;
    deleteBrand: (brandId: string) => Promise<void>;
}

export interface Service {
    id: string;
    name: string;
    label: string;
    isEnabled: boolean;
}

export interface Brand {
    id: string;
    name: string;
    category?: string;
    label: string;
    logoUrl?: string;
    serviceId: string;
    providerInternalId: string;
    providerBrandId: string;
    isEnabled: boolean;
    createdAt: string;
    updatedAt: string;
}