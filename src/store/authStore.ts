import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { AuthState, LoginCredentials } from "../app/signin/interfaces";
import { appname, ums_endpoint } from "@/constants/string";
import axiosInstance from "@/utilities/axios";
import { getErrorMessage } from "@/utilities/utils";
import { removeAccessToken, setAccessToken } from "@/utilities/tokenHelpers";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      token: null,
      isLoading: false,

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true });
        try {
          const { data } = await axiosInstance.post(
            `${ums_endpoint}/auth/login`,
            credentials
          );

          setAccessToken({access_token:data.token, refresh_token: "fdhjgjghdfjhdfjhdf"}); // optional helper

            set({
            isAuthenticated: true,
            token: data.token,
            isLoading: false,
          });

          return data;
        } catch (error: any) {
          set({ isLoading: false });
          throw new Error(getErrorMessage(error));
        }
      },

      logout: () => {
        set({
          isAuthenticated: false,
          token: null,
        });
        removeAccessToken()
       
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
