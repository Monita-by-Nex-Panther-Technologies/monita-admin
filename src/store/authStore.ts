import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { api, setAuthToken, removeAuthToken } from "@/lib/api";
import {
  AuthState,
  LoginCredentials,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  LoginResponse,
  ForgotPasswordResponse,
  APIErrorResponse,
} from "@/interfaces";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      token: null,
      otpReference: null,
      isLoading: false,
      error: null,

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post<{
            success: boolean;
            message: string;
            data: LoginResponse;
          }>("/internals/auth/login", credentials);

          if (response.data.success) {
            const { profile, token } = response.data.data;
            setAuthToken(token);
            set({
              isAuthenticated: true,
              user: profile,
              token,
              isLoading: false,
            });
            return response.data;
          } else {
            set({
              isLoading: false,
              error: response.data.message || "Login failed",
            });
            throw new Error(response.data.message || "Login failed");
          }
        } catch (error: any) {
          const apiError = error as APIErrorResponse;
          const errorMessage =
            apiError.message || "An error occurred during login";
          set({
            isLoading: false,
            error: errorMessage,
          });
          throw new Error(errorMessage);
        }
      },

      forgotPassword: async (payload: ForgotPasswordPayload) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post<{
            success: boolean;
            message: string;
            data: ForgotPasswordResponse;
          }>("/internals/auth/forgot-password", payload);

          if (response.data.success) {
            set({
              isLoading: false,
              otpReference: response.data.data.otpReference,
            });
            return response.data;
          } else {
            set({
              isLoading: false,
              error: response.data.message || "Password reset request failed",
            });
            throw new Error(
              response.data.message || "Password reset request failed"
            );
          }
        } catch (error: any) {
          const apiError = error as APIErrorResponse;
          const errorMessage =
            apiError.message ||
            "An error occurred during password reset request";
          set({
            isLoading: false,
            error: errorMessage,
          });
          throw new Error(errorMessage);
        }
      },

      resetPassword: async (payload: ResetPasswordPayload) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post<{
            success: boolean;
            message: string;
            data: any;
          }>("/internals/auth/reset-password", payload);

          if (response.data.success) {
            set({
              isLoading: false,
              otpReference: null,
            });
            return response.data;
          } else {
            set({
              isLoading: false,
              error: response.data.message || "Password reset failed",
            });
            throw new Error(response.data.message || "Password reset failed");
          }
        } catch (error: any) {
          const apiError = error as APIErrorResponse;
          const errorMessage =
            apiError.message || "An error occurred during password reset";
          set({
            isLoading: false,
            error: errorMessage,
          });
          throw new Error(errorMessage);
        }
      },

      logout: () => {
        removeAuthToken();
        set({
          isAuthenticated: false,
          user: null,
          token: null,
        });
      },
    }),
    {
      name: "monita-auth-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isLoading = false;
        }
      },
    }
  )
);
