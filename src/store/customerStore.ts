import { create } from "zustand";
import {  ums_endpoint, wms_endpoint } from "@/constants/string";
import axiosInstance from "@/utilities/axios";
import { getErrorMessage } from "@/utilities/utils";
import { UserFilterCriteria } from "@/app/dashboard/customers/components/CustomerFilterModal";

export const useCustomerStore = create<CustomerState>()(
  (set) => ({
    customers: [],
    customer:null,
    wallets:null,
    page: 1,
    total: 0,
    limit: 10,
    totalPages: 0,
    isLoading: false,
    isLoadingWallet: false,
    isFilterResult:false,
    isLoadingAction: false,
    isQueryResult: false,
    filterData: null,

    getCustomers: async ({
      page,
      limit,
      status,
      tierId,
      phone,
      email
    }: CustomerQueryParams) => {
      set({ isLoading: true });

      try {
        const query = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          ...(status && { status }),
          ...(tierId && { tierId }),
          ...(phone && { phone }),
          ...(email && { email }),
        });

        set({
         isFilterResult: !!(status || tierId), // Explicitly cast to boolean
          isQueryResult: !!(email || phone), // Explicitly cast to boolean
        });

        const { data } = await axiosInstance.get(
          `${ums_endpoint}/users?${query.toString()}`
        );

        set({
          customers: data.records,
          page: data.page,
          totalPages: Math.ceil(data.count / data.limit),
          limit: data.limit,
          total: data.count,
          isLoading: false,
        });
      } catch (error: any) {
        set({ isLoading: false });
        throw new Error(getErrorMessage(error));
      }
    },

    getCustomer: async (id:string) => {
      set({ isLoading: true });

      try {
      
        const { data } = await axiosInstance.get(
          `${ums_endpoint}/users/${id}`
        );

        set({
          customer: data,
          isLoading: false,});


      } catch (error: any) {
        set({ isLoading: false });
        throw new Error(getErrorMessage(error));
      }
    },

    getWallet: async (userId:string) => {
      set({ isLoadingWallet: true });

      try {
      
        const { data } = await axiosInstance.get(
          `${wms_endpoint}/wallet?userId=${userId}`
        );

        set({
          wallets: data,
          isLoadingWallet: false,});


      } catch (error: any) {
        set({ isLoadingWallet: false });
        throw new Error(getErrorMessage(error));
      }
    },

    blockAndUnblockUser: async (userId: string,action:string) => {
      set({ isLoadingAction: true });

      try {
        const response = await axiosInstance.patch(
          `${ums_endpoint}/users/${userId}/${action}`
        );

        set((state) => {
          const updatedCustomers = state.customers.map((customer) =>
            customer.id === userId
              ? { ...customer, status: response.data.status }
              : customer
          );
          return { customers: updatedCustomers, isLoadingAction: false };
        });
      } catch (error: any) {
        set({ isLoadingAction: false });
        throw new Error(getErrorMessage(error));
      }
    },

    updateCustomer: async (customerId: string, updatedData: Partial<Customer>) => {
      set({ isLoading: true });

      try {
        const response = await axiosInstance.patch(
          `${ums_endpoint}/user/${customerId}`,
          updatedData
        );

        set((state) => {
          const updatedCustomers = state.customers.map((customer) =>
            customer.id === customerId
              ? { ...customer, ...updatedData }
              : customer
          );
          return { customers: updatedCustomers, isLoading: false };
        });
      } catch (error: any) {
        set({ isLoading: false });
        throw new Error(getErrorMessage(error));
      }
    },

    setField: <K extends keyof CustomerState>(field: K, value: CustomerState[K]) => {
      set({ [field]: value } as Pick<CustomerState, K>);
    },
  })
);

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  middleName: string;
  monitag: string;
  email: string | null;
  isEmailVerified: boolean;
  phone: string;
  phoneCountryCode: string;
  createdAt: string; // ISO 8601 format
  updatedAt: string; // ISO 8601 format
  status: "ACTIVE" | "INACTIVE";
  dob: string;
  avatar: string;
  bvn: string;
  nin: string;
  referralEarnings: number;
  tier: number; // Or `CustomerAccountTier` if you're using an enum
  referralCode: string;
  lastLogin: string; // ISO 8601 format
  gender: string;
  role: string;
}


export interface CustomerQueryParams {
  page: number;
  limit: number;
  status?: string;
  tierId?: string;
  email?: string;
  phone?: string;
}

export interface CustomerWallet {

  currencyCode: string;
  currentBalance: number;
  availableBalance: number;
}

interface CustomerState {
  customers: Customer[];
  customer: Customer | null;
  wallets: CustomerWallet | null;
  page: number;
  total: number;
  limit: number;
  totalPages: number;
  isLoading: boolean;
  isLoadingWallet: boolean;
  isLoadingAction: boolean;
  isFilterResult:boolean;
  isQueryResult: boolean;
  filterData: Partial<UserFilterCriteria> | null;
  getCustomers: (params: CustomerQueryParams) => Promise<void>;
  getCustomer: (id: string) => Promise<void>;
  getWallet: (userId: string) => Promise<void>;
  blockAndUnblockUser: (userId: string,action:string) => Promise<void>;
  updateCustomer: (customerId: string, updatedData: Partial<Customer>) => Promise<void>;
  setField: <K extends keyof CustomerState>(field: K, value: CustomerState[K]) => void;
}
