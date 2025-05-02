import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { removeAuthToken } from "@/utilities/api";
import {
  AuthState,
  LoginCredentials,
} from "../app/signin/interfaces";
import { appname, base_endpoint } from "@/constants/string";
import axiosInstance from "@/utilities/axios";
import { getErrorMessage } from "@/utilities/utils";
import { log } from "console";


export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      token: null,
      refreshToken: null,
      isLoading: false,
      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true });
        try {

          const { data } = await axiosInstance.post(
            `${base_endpoint}/auth/login`,
            credentials
          );

          console.log(data?.token)

          set({
            isAuthenticated: true,
            token: data.token,
            refreshToken: data.refreshToken ?? null,
            isLoading: false,
          });

          return data;
        } catch (error: any) {
          const errorMsg = getErrorMessage(error);
          set({
            isLoading: false,
          });
          throw new Error(errorMsg);
        }
      },

      logout: () => {
        removeAuthToken();
        set({
          isAuthenticated: false,
          token: null,
          refreshToken: null
        });
      },
    }),
    {
      name: `${appname}-storage`,
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isLoading = false;
        }
      },
    }
  )
);
