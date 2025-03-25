import { AuthState } from "@/interfaces/store";

// Handle server-side rendering
const authTokens =
  typeof window !== "undefined" ? localStorage.getItem("authTokens") : null;
const user =
  typeof window !== "undefined" ? localStorage.getItem("user") : null;

export const preloadedState = {
  auth: {
    user: user ? JSON.parse(user) : null,
    tokens: authTokens
      ? JSON.parse(authTokens)
      : { accessToken: null, refreshToken: null },
    loading: false,
    error: null,
  } as AuthState,
};
