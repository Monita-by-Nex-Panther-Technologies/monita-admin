import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "@/lib/api";
import { toast } from "sonner";
import { ErrorResponse } from "@/interfaces";
import axios, { AxiosError } from "axios";

interface User {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "USER";
}

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

interface AuthState {
  user: User | null;
  tokens: Tokens | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  tokens: null,
  loading: false,
  error: null,
};

export const signIn = createAsyncThunk(
  "auth/signIn",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      if (typeof window !== "undefined" && (window as any).mockAuthResponse) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const response = (window as any).mockAuthResponse;

        toast.success("Login successful!");

        return response;
      }

      const response = await axiosInstance.post("/auth/login", credentials);
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        return rejectWithValue(
          axiosError.response?.data?.message || "Login failed"
        );
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.tokens = null;
      state.error = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("authTokens");
        localStorage.removeItem("user");
      }
    },
    rehydrate(state, action) {
      state.tokens = action.payload.tokens;
      state.user = action.payload.user;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.tokens = {
          accessToken: action.payload.tokens.accessToken,
          refreshToken: action.payload.tokens.refreshToken,
        };
        if (typeof window !== "undefined") {
          localStorage.setItem("authTokens", JSON.stringify(state.tokens));
          localStorage.setItem("user", JSON.stringify(state.user));
        }
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      });
  },
});

export const { logout, rehydrate } = authSlice.actions;
export default authSlice.reducer;
