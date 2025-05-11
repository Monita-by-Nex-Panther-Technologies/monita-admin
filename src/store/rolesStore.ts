import { create } from "zustand";
import { ums_endpoint } from "@/constants/string";
import axiosInstance from "@/utilities/axios";
import { getErrorMessage } from "@/utilities/utils";

export const useRolesStore = create<RolesState>()(
  (set) => ({
    roles: [],
    isLoading: false,

    getRoles: async () => {
      set({ isLoading: true });

      try {
        const { data } = await axiosInstance.get(
          `${ums_endpoint}/staff-roles`
        );

        set({
          roles: data,
          isLoading: false,
        });

        return data;
      } catch (error: any) {
        set({ isLoading: false });
        throw new Error(getErrorMessage(error));
      }
    },

    createRole: async (roleData: CreateRolePayload) => {
      set({ isLoading: true });

      try {
        const response = await axiosInstance.post(
          `${ums_endpoint}/staff-roles`,
          roleData
        );

        // After successful creation, refresh the roles list
        const currentState = useRolesStore.getState();
        await currentState.getRoles();

        return response.data;
      } catch (error: any) {
        set({ isLoading: false });
        throw new Error(getErrorMessage(error));
      }
    },

    updateRole: async (roleId: string, updatedData: Partial<Role>) => {
      set({ isLoading: true });

      try {
        const response = await axiosInstance.patch(
          `${ums_endpoint}/staff-roles/${roleId}`,
          updatedData
        );

        set((state) => {
          const updatedRoles = state.roles.map((role) =>
            role.id === roleId ? { ...role, ...updatedData } : role
          );
          return { roles: updatedRoles, isLoading: false };
        });

        return response.data;
      } catch (error: any) {
        set({ isLoading: false });
        throw new Error(getErrorMessage(error));
      }
    },

    deleteRole: async (roleId: string) => {
      set({ isLoading: true });

      try {
        const response = await axiosInstance.delete(
          `${ums_endpoint}/staff-roles/${roleId}`
        );

        set((state) => {
          const filteredRoles = state.roles.filter((role) => role.id !== roleId);
          return { roles: filteredRoles, isLoading: false };
        });

        return response.data;
      } catch (error: any) {
        set({ isLoading: false });
        throw new Error(getErrorMessage(error));
      }
    },
  })
);

export interface Role {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  permissions?: Permission[];
}

export interface Permission {
  action: "Accept" | "Reject";
  value: any;
  id: string;
  name: string;
  module?: string;
}

export interface CreateRolePayload {
  name: string;
  permissionIds?: string[];
}

interface RolesState {
  roles: Role[];
  isLoading: boolean;
  getRoles: () => Promise<Role[]>;
  createRole: (roleData: CreateRolePayload) => Promise<any>;
  updateRole: (roleId: string, updatedData: Partial<Role>) => Promise<any>;
  deleteRole: (roleId: string) => Promise<any>;
}