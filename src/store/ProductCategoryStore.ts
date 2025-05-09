import { bps_endpoint } from "@/constants/string";
import axiosInstance from "@/utilities/axios";
import { getErrorMessage } from "@/utilities/utils";
import { create } from "zustand";

export const useProductCategoryStore = create<ProductCategoryState>()(
    (set, get) => ({
        productCategories: [],
        isLoading: false,

        setField: <K extends keyof ProductCategoryState>(field: K, value: ProductCategoryState[K]) => {
            set({ [field]: value } as Pick<ProductCategoryState, K>);
        },

        getProductCategories: async () => {
            set({ isLoading: true });
            try {
                const response = await axiosInstance.get(
                    `${bps_endpoint}/products-categories`
                );
                const categoriesData = response.data || {};
                set({
                    productCategories: categoriesData || [],
                    isLoading: false,
                });
                return categoriesData || [];
            } catch (error: any) {
                set({ isLoading: false });
                throw new Error(getErrorMessage(error));
            }
        },

        getProductCategoryById: async (categoryId: string) => {
            set({ isLoading: true });
            try {
                const response = await axiosInstance.get(
                    `${bps_endpoint}/product-categories/${categoryId}`
                );
                set({ isLoading: false });
                return response.data?.data || null;
            } catch (error: any) {
                set({ isLoading: false });
                throw new Error(getErrorMessage(error));
            }
        },

        addProductCategory: async (categoryData: Omit<ProductCategory, "id">) => {
            set({ isLoading: true });
            try {
                const response = await axiosInstance.post(
                    `${bps_endpoint}/product-categories`,
                    categoryData
                );
                // After successful addition, refresh the categories list
                await get().getProductCategories();
                set({ isLoading: false });
                return response.data;
            } catch (error: any) {
                set({ isLoading: false });
                throw new Error(getErrorMessage(error));
            }
        },

        updateProductCategory: async (categoryId: string, updatedData: Partial<ProductCategory>) => {
            set({ isLoading: true });
            try {
                const response = await axiosInstance.patch(
                    `${bps_endpoint}/product-categories/${categoryId}`,
                    updatedData
                );
                // Update the local store
                set((state) => {
                    const updatedCategories = state.productCategories.map((category) =>
                        category.id === categoryId
                            ? { ...category, ...updatedData }
                            : category
                    );
                    return { productCategories: updatedCategories, isLoading: false };
                });
                return response.data;
            } catch (error: any) {
                set({ isLoading: false });
                throw new Error(getErrorMessage(error));
            }
        },

        deleteProductCategory: async (categoryId: string) => {
            set({ isLoading: true });
            try {
                await axiosInstance.delete(
                    `${bps_endpoint}/product-categories/${categoryId}`
                );
                // Remove the deleted category from the local store
                set((state) => {
                    const filteredCategories = state.productCategories.filter(
                        (category) => category.id !== categoryId
                    );
                    return { productCategories: filteredCategories, isLoading: false };
                });
            } catch (error: any) {
                set({ isLoading: false });
                throw new Error(getErrorMessage(error));
            }
        },
    })
);

interface ProductCategoryState {
    productCategories: ProductCategory[];
    isLoading: boolean;
    setField: <K extends keyof ProductCategoryState>(field: K, value: ProductCategoryState[K]) => void;
    // Product Category methods
    getProductCategories: () => Promise<ProductCategory[]>;
    getProductCategoryById: (categoryId: string) => Promise<ProductCategory | null>;
    addProductCategory: (categoryData: Omit<ProductCategory, "id">) => Promise<any>;
    updateProductCategory: (categoryId: string, updatedData: Partial<ProductCategory>) => Promise<any>;
    deleteProductCategory: (categoryId: string) => Promise<void>;
}

export interface ProductCategory {
    id: string;
    name: string;
    displayName: string;
}