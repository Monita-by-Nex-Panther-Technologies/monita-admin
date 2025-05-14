import { bps_endpoint } from "@/constants/string";
import axiosInstance from "@/utilities/axios";
import { getErrorMessage } from "@/utilities/utils";
import { create } from "zustand";
import { ServiceType } from "./BillpaymentStore";

export const useProductStore = create<ProductState>()(
    (set, get) => ({
        products: [],
        isLoading: false,
        productsTotal: 0,
        productsPage: 1,
        productsLimit: 10,


        // Per-service state management
        productState: {
            airtime: { products: [], total: 0, page: 1, limit: 10, searchTerm: '', brandId: '' },
            data: { products: [], total: 0, page: 1, limit: 10, searchTerm: '', brandId: '' },
            cable: { products: [], total: 0, page: 1, limit: 10, searchTerm: '', brandId: '' },
            education: { products: [], total: 0, page: 1, limit: 10, searchTerm: '', brandId: '' },
            internet: { products: [], total: 0, page: 1, limit: 10, searchTerm: '', brandId: '' },
            electricity: { products: [], total: 0, page: 1, limit: 10, searchTerm: '', brandId: '' },
            esim: { products: [], total: 0, page: 1, limit: 10, searchTerm: '', brandId: '' },
            giftcard: { products: [], total: 0, page: 1, limit: 10, searchTerm: '', brandId: '' },
        },

        setField: <K extends keyof ProductState>(field: K, value: ProductState[K]) => {
            set({ [field]: value } as Pick<ProductState, K>);
        },

        // Update product state for specific service
        updateProductState: (serviceType: ServiceType, updates: Partial<ServiceProductState>) => {
            set((state) => ({
                productState: {
                    ...state.productState,
                    [serviceType]: {
                        ...state.productState[serviceType],
                        ...updates
                    }
                }
            }));
        },

        // Get product state for specific service
        getProductState: (serviceType: ServiceType) => {
            return get().productState[serviceType];
        },

        getProducts: async (params?: ProductQueryParams) => {
            set({ isLoading: true });

            try {
                const query = new URLSearchParams();

                // Add all query parameters if they exist
                if (params) {
                    if (params.page) query.append('page', params.page.toString());
                    if (params.limit) query.append('limit', params.limit.toString());
                    if (params.serviceId) query.append('serviceId', params.serviceId);
                    if (params.brandId) query.append('brandId', params.brandId);
                    if (params.search) query.append('search', params.search);
                }

                // Set defaults if not provided
                if (!query.has('page')) query.append('page', '1');
                if (!query.has('limit')) query.append('limit', '10');

                const response = await axiosInstance.get(
                    `${bps_endpoint}/products?${query.toString()}`
                );

                const productsData = response.data || {};

                // Update global state
                set({
                    products: productsData.product || [],
                    productsTotal: productsData.count || 0,
                    productsPage: productsData.page || 1,
                    productsLimit: productsData.limit || 10,
                    isLoading: false,
                });

                // Also update service-specific state if serviceId is provided
                if (params?.serviceId) {
                    const services = get().productState;
                    const serviceKey = Object.keys(services).find(key => {
                        // You'll need to map serviceId to service type somehow
                        // This is a simplified approach - you may need to adjust based on your data structure
                        return true; // For now, just update the data service
                    });

                    if (serviceKey) {
                        get().updateProductState(serviceKey as ServiceType, {
                            products: productsData.product || [],
                            total: productsData.count || 0,
                            page: productsData.page || 1,
                            limit: productsData.limit || 10,
                            searchTerm: params.search || '',
                            brandId: params.brandId || ''
                        });
                    }
                }

                return productsData.product || [];
            } catch (error: any) {
                set({ isLoading: false });
                throw new Error(getErrorMessage(error));
            }
        },

        getProductById: async (productId: string) => {
            set({ isLoading: true });

            try {
                const response = await axiosInstance.get(
                    `${bps_endpoint}/products/${productId}`
                );

                set({ isLoading: false });
                return response.data?.data || null;
            } catch (error: any) {
                set({ isLoading: false });
                throw new Error(getErrorMessage(error));
            }
        },

        addProduct: async (productData: Omit<Product, "id" | "createdAt" | "updatedAt">) => {
            const state = get();

            try {
                set({ isLoading: true });

                const response = await axiosInstance.post(
                    `${bps_endpoint}/products`,
                    productData
                );

                // Get current params to refresh the list
                const currentParams = {
                    serviceId: productData.serviceId,
                    brandId: productData.brandId,
                    page: state.productsPage,
                    limit: state.productsLimit
                };

                // Refresh the products list after successful addition
                await state.getProducts(currentParams);

                set({ isLoading: false });
                return response.data;
            } catch (error: any) {
                set({ isLoading: false });
                throw new Error(getErrorMessage(error));
            }
        },

        updateProduct: async (productId: string, updatedData: Partial<Product>) => {
            set({ isLoading: true });

            try {
                const response = await axiosInstance.patch(
                    `${bps_endpoint}/products/${productId}`,
                    updatedData
                );

                // Update the local store
                set((state) => {
                    const updatedProducts = state.products.map((product) =>
                        product.id === productId
                            ? { ...product, ...updatedData }
                            : product
                    );
                    return { products: updatedProducts, isLoading: false };
                });

                // Also update service-specific state
                const currentState = get();
                Object.keys(currentState.productState).forEach((serviceType) => {
                    const serviceState = currentState.productState[serviceType as ServiceType];
                    const updatedServiceProducts = serviceState.products.map((product) =>
                        product.id === productId
                            ? { ...product, ...updatedData }
                            : product
                    );

                    currentState.updateProductState(serviceType as ServiceType, {
                        products: updatedServiceProducts
                    });
                });

                return response.data;
            } catch (error: any) {
                set({ isLoading: false });
                throw new Error(getErrorMessage(error));
            }
        },

        toggleProductHot: async (productId: string, isHot: boolean) => {
            set({ isLoading: true });

            try {
                const response = await axiosInstance.patch(
                    `${bps_endpoint}/products/${productId}`,
                    { isHot }
                );

                // Update the local store
                set((state) => {
                    const updatedProducts = state.products.map((product) =>
                        product.id === productId
                            ? { ...product, isHot }
                            : product
                    );
                    return { products: updatedProducts, isLoading: false };
                });

                // Also update service-specific state
                const currentState = get();
                Object.keys(currentState.productState).forEach((serviceType) => {
                    const serviceState = currentState.productState[serviceType as ServiceType];
                    const updatedServiceProducts = serviceState.products.map((product) =>
                        product.id === productId
                            ? { ...product, isHot }
                            : product
                    );

                    currentState.updateProductState(serviceType as ServiceType, {
                        products: updatedServiceProducts
                    });
                });

                return response.data;
            } catch (error: any) {
                set({ isLoading: false });
                throw new Error(getErrorMessage(error));
            }
        },

        deleteProduct: async (productId: string) => {
            set({ isLoading: true });

            try {
                await axiosInstance.delete(
                    `${bps_endpoint}/products/${productId}`
                );

                // Remove the deleted product from the local store
                set((state) => {
                    const filteredProducts = state.products.filter(
                        (product) => product.id !== productId
                    );
                    return { products: filteredProducts, isLoading: false };
                });

                // Also update service-specific state
                const currentState = get();
                Object.keys(currentState.productState).forEach((serviceType) => {
                    const serviceState = currentState.productState[serviceType as ServiceType];
                    const filteredServiceProducts = serviceState.products.filter(
                        (product) => product.id !== productId
                    );

                    currentState.updateProductState(serviceType as ServiceType, {
                        products: filteredServiceProducts,
                        total: Math.max(0, serviceState.total - 1)
                    });
                });
            } catch (error: any) {
                set({ isLoading: false });
                throw new Error(getErrorMessage(error));
            }
        },

        clearProducts: () => {
            set({
                products: [],
                productsTotal: 0,
                productsPage: 1
            });
        },

        // Add this method to clear service-specific products
        clearServiceProducts: (serviceType: ServiceType) => {
            set((state) => ({
                productState: {
                    ...state.productState,
                    [serviceType]: {
                        ...state.productState[serviceType],
                        products: [],
                        total: 0,
                        page: 1,
                        searchTerm: '',
                        brandId: ''
                    }
                }
            }));
        },

    })
);

// Type definitions
// export type ServiceType = 'airtime' | 'data' | 'cable' | 'education' | 'internet' | 'electricity' | 'esim' | 'giftcard';

interface ServiceProductState {
    products: Product[];
    total: number;
    page: number;
    limit: number;
    searchTerm: string;
    brandId: string;

}

interface ProductQueryParams {
    page?: number;
    limit?: number;
    serviceId?: string;
    brandId?: string;
    search?: string;
}

interface ProductState {
    products: Product[];
    isLoading: boolean;
    productsTotal: number;
    productsPage: number;
    productsLimit: number;
    clearProducts: () => void;
    clearServiceProducts: (serviceType: ServiceType) => void;
    // Per-service state
    productState: Record<ServiceType, ServiceProductState>;

    setField: <K extends keyof ProductState>(field: K, value: ProductState[K]) => void;
    updateProductState: (serviceType: ServiceType, updates: Partial<ServiceProductState>) => void;
    getProductState: (serviceType: ServiceType) => ServiceProductState;

    // Product methods
    getProducts: (params?: ProductQueryParams) => Promise<Product[]>;
    getProductById: (productId: string) => Promise<Product | null>;
    addProduct: (productData: Omit<Product, "id" | "createdAt" | "updatedAt">) => Promise<any>;
    updateProduct: (productId: string, updatedData: Partial<Product>) => Promise<any>;
    toggleProductHot: (productId: string, isHot: boolean) => Promise<any>;
    deleteProduct: (productId: string) => Promise<void>;
}

export interface Product {
    id: string;
    name: string;
    logoUrl?: string;
    description: string;
    serviceId: string;
    brandId: string;
    cost: number;
    price: number;
    cashback?: number;
    providerProductId: string;
    serviceProductCategoryId: string;
    validity?: string;
    isHot: boolean;
    metadata?: Record<string, any>;
    createdAt: string;
    updatedAt: string;
}