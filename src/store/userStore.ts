import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { appname, base_endpoint, ums_endpoint } from "@/constants/string";
import axiosInstance from "@/utilities/axios";
import { getErrorMessage } from "@/utilities/utils";

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      getUser: async () => {
        set({ isLoading: true });
        try {
          const { data } = await axiosInstance.get(
            `${ums_endpoint}/profile`
          );
            set({
            user: data,
            isLoading: false,
          });

          return data;
        } catch (error: any) {
          set({ isLoading: false });
          throw new Error(getErrorMessage(error));
        }
      },
    }),
    {
      name: `${appname}-user`,
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isLoading = false;
        }
      },
    }
  )
);


interface Permissions {
    [key: string]: {
      value: string;
      action: string;
    };
  }
  
  // Role interface
  interface Role {
    id: string;
    name: string;
    description: string | null;
    permissions: Permissions;
    createdAt: string;  // ISO string format
    updatedAt: string;  // ISO string format
  }
  
  // Main User interface
  interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    passwordResetRequired: boolean;
    role: Role;  // Role is nested inside User
  }
  

  export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
  }
  
  export interface UserState {
      user: User | null;
      isLoading: boolean;
      getUser:() => void;
    }
    