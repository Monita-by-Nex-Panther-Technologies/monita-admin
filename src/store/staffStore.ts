import { create } from "zustand";
import { ums_endpoint } from "@/constants/string";
import axiosInstance from "@/utilities/axios";
import { getErrorMessage } from "@/utilities/utils";
import { FilterCriteria } from "@/app/dashboard/staffs/components/StaffFilterModal";

export interface CreateStaffPayload {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  roleId: string;
}

export const useStaffStore = create<StaffState>()(
  (set) => ({
    staffs: [],
    page: 1,
    total: 0,
    limit: 10,
    totalPages: 0,
    isLoading: false,
    isSubmitting: false,
    isFilterResult: false,
    isQueryResult: false,
    filterData: null,
    getStaffs: async ({
      page,
      limit,
      status,
      roleId,
      phoneNumber,
      email
    }: StaffQueryParams) => {
      set({ isLoading: true });

      try {
        const query = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          ...(status && { status }),
          ...(roleId && { roleId }),
          ...(phoneNumber && { phoneNumber }),
          ...(email && { email }),
        });

        set({
          isFilterResult: !!(status || roleId), // Explicitly cast to boolean
          isQueryResult: !!(email || phoneNumber), // Explicitly cast to boolean
        });

        const { data } = await axiosInstance.get(
          `${ums_endpoint}/staffs?${query.toString()}`
        );

        set({
          staffs: data.records,
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

    createStaff: async (staffData: CreateStaffPayload) => {
      set({ isSubmitting: true });

      try {
        const response = await axiosInstance.post(
          `${ums_endpoint}/staffs`,
          staffData
        );

        const currentState = useStaffStore.getState();
        await currentState.getStaffs({ 
          page: 1, 
          limit: currentState.limit 
        });
        
        set({ isSubmitting: false });

        return response.data;
      } catch (error: any) {
        set({ isSubmitting: false });
        throw new Error(getErrorMessage(error));
      }
    },

    updateStaff: async (staffId: string, updatedData: Partial<Staff>) => {
      set({ isSubmitting: true });

      try {
        const response = await axiosInstance.patch(
          `${ums_endpoint}/staffs/${staffId}`,
          updatedData
        );

        set((state) => {
          const updatedStaffs = state.staffs.map((staff) =>
            staff.id === staffId
              ? { ...staff, ...updatedData }
              : staff
          );
          return { staffs: updatedStaffs, isLoading: false, isSubmitting: false };
        });

        return response.data;
      } catch (error: any) {
        set({ isSubmitting: false });
        throw new Error(getErrorMessage(error));
      }
    },

    deleteStaff: async (staffId: string) => {
      set({ isLoading: true, isSubmitting: true });

      try {
        const response = await axiosInstance.delete(
          `${ums_endpoint}/staffs/${staffId}`
        );

        // Update the staffs list by removing the deleted staff
        set((state) => {
          const updatedStaffs = state.staffs.filter((staff) => staff.id !== staffId);
          
          // Recalculate total count
          const updatedTotal = state.total - 1;
          const updatedTotalPages = Math.ceil(updatedTotal / state.limit);
          
          return { 
            staffs: updatedStaffs,
            total: updatedTotal,
            totalPages: updatedTotalPages,
            isLoading: false,
            isSubmitting: false
          };
        });

        // If current page is now empty and there are still pages left, go to previous page
        const currentState = useStaffStore.getState();
        if (currentState.staffs.length === 0 && currentState.page > 1) {
          await currentState.getStaffs({
            page: currentState.page - 1,
            limit: currentState.limit,
            ...currentState.filterData
          });
        }

        return response.data;
      } catch (error: any) {
        set({ isLoading: false,  isSubmitting: false });
        throw new Error(getErrorMessage(error));
      }
    },
    
    resendInvite: async (staffId: string) => {
      set({ isSubmitting: true });
      
      try {
        const response = await axiosInstance.post(
          `${ums_endpoint}/staffs/${staffId}/resend-invite`
        );
        
        set({ isSubmitting: false });
        return response.data;
      } catch (error: any) {
        set({ isSubmitting: false });
        throw new Error(getErrorMessage(error));
      }
    },
    
    resetPassword: async (staffId: string) => {
      set({ isSubmitting: true });
      
      try {
        const response = await axiosInstance.post(
          `${ums_endpoint}/staffs/${staffId}/reset-password`
        );
        
        set({ isSubmitting: false });
        return response.data;
      } catch (error: any) {
        set({ isSubmitting: false });
        throw new Error(getErrorMessage(error));
      }
    },

    setField: <K extends keyof StaffState>(field: K, value: StaffState[K]) => {
      set({ [field]: value } as Pick<StaffState, K>);
    },
  })
);

export interface Staff {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isEmailVerified: boolean;
  phoneNumber: string;
  createdAt: string;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  roleId: string;
  role: {
    id: string;
    name: string;
  };
}

export interface StaffQueryParams {
  page: number;
  limit: number;
  status?: string;
  roleId?: string;
  email?: string;
  phoneNumber?: string;
}

interface StaffState {
  staffs: Staff[];
  page: number;
  total: number;
  limit: number;
  totalPages: number;
  isLoading: boolean;
  isSubmitting: boolean;
  isFilterResult: boolean;
  isQueryResult: boolean;
  filterData: Partial<FilterCriteria> | null;
  getStaffs: (params: StaffQueryParams) => Promise<void>;
  createStaff: (staffData: CreateStaffPayload) => Promise<any>;
  updateStaff: (staffId: string, updatedData: Partial<Staff>) => Promise<any>;
  deleteStaff: (staffId: string) => Promise<any>;
  resendInvite: (staffId: string) => Promise<any>;
  resetPassword: (staffId: string) => Promise<any>; 
  setField: <K extends keyof StaffState>(field: K, value: StaffState[K]) => void;
}