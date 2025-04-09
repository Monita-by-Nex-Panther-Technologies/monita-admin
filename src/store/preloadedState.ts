import { AuthState } from "@/interfaces/store";

const authToken =
  typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
const profile =
  typeof window !== "undefined" ? localStorage.getItem("profile") : null;

export const preloadedState = {
  auth: {
    profile: profile ? JSON.parse(profile) : null,
    token: authToken ? JSON.parse(authToken) : null,
    loading: false,
    error: null,
  } as AuthState,
};
