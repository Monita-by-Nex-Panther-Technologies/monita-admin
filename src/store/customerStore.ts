import { create } from "zustand";
import {  ums_endpoint } from "@/constants/string";
import axiosInstance from "@/utilities/axios";
import { getErrorMessage } from "@/utilities/utils";
import { FilterCriteria } from "@/app/dashboard/transactions/components/TransactionFilterModal";

export const useCustomerStore = create<CustomerState>()(
  (set) => ({
    customers: [],
    page: 1,
    total: 0,
    limit: 10,
    totalPages: 0,
    isLoading: false,
    isFilterResult:false,
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
  createdAt:  string;
  status: "ACTIVE" | "INACTIVE";
  dob: string;
  tier: number
}

export interface CustomerQueryParams {
  page: number;
  limit: number;
  status?: string;
  tierId?: string;
  email?: string;
  phone?: string;
}

interface CustomerState {
  customers: Customer[];
  page: number;
  total: number;
  limit: number;
  totalPages: number;
  isLoading: boolean;
  isFilterResult:boolean;
  isQueryResult: boolean;
  filterData: Partial<FilterCriteria> | null;
  getCustomers: (params: CustomerQueryParams) => Promise<void>;
  updateCustomer: (customerId: string, updatedData: Partial<Customer>) => Promise<void>;
  setField: <K extends keyof CustomerState>(field: K, value: CustomerState[K]) => void;
}
