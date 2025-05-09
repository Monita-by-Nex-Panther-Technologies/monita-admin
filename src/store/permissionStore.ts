import { create } from "zustand";
import { ums_endpoint } from "@/constants/string";
import axiosInstance from "@/utilities/axios";
import { getErrorMessage } from "@/utilities/utils";

export const usePermissionStore = create<PermissionState>()((set) => ({
  permissions: [],
  scopes: [],
  isLoading: false,

  getPermissions: async () => {
    set({ isLoading: true });

    try {
      const { data } = await axiosInstance.get(
        `${ums_endpoint}/permissions`
      );

      set({ permissions: data, isLoading: false });
      return data;
    } catch (error: any) {
      set({ isLoading: false });
      throw new Error(getErrorMessage(error));
    }
  },

  getPermissionScopes: async () => {
    set({ isLoading: true });

    try {
      const { data } = await axiosInstance.get(
        `${ums_endpoint}/permissions/scopes`
      );

      set({ scopes: data, isLoading: false });
      return data;
    } catch (error: any) {
      set({ isLoading: false });
      throw new Error(getErrorMessage(error));
    }
  },
}));

// Types
export interface Permission {
  id: string;
  name: string;
  module?: string;
}

export interface PermissionScope {
  id: string;
  name: string;
  module: string;
}

interface PermissionState {
  permissions: Permission[];
  scopes: PermissionScope[];
  isLoading: boolean;
  getPermissions: () => Promise<Permission[]>;
  getPermissionScopes: () => Promise<PermissionScope[]>;
}
