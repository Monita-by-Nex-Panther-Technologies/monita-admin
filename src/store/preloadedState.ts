import { AuthState } from "@/interfaces/store";

export const getPreloadedState = () => {
  if (typeof window === "undefined") {
    return { auth: { user: null, tokens: null, loading: false, error: null } };
  }

  try {
    const authTokens = localStorage.getItem("authTokens");
    const user = localStorage.getItem("user");

    return {
      auth: {
        tokens: authTokens ? JSON.parse(authTokens) : null,
        user: user ? JSON.parse(user) : null,
        loading: false,
        error: null,
      } as AuthState,
    };
  } catch (error) {
    console.error("Error loading state from localStorage:", error);
    return {
      auth: {
        user: null,
        tokens: null,
        loading: false,
        error: null,
      } as AuthState,
    };
  }
};
