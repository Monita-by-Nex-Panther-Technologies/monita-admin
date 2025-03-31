import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "@/lib/api";
import { toast } from "sonner";
import { ErrorResponse } from "@/interfaces";
import axios, { AxiosError } from "axios";

interface Profile {
  id: string;
  email: string | null;
  firstName: string;
  lastName: string;
  monitag: string;
}

interface AuthState {
  profile: Profile | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  profile: null,
  token: null,
  loading: false,
  error: null,
};

export const signIn = createAsyncThunk(
  "auth/signIn",
  async (
    credentials: { phone: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const payload = {
        phoneNumber: credentials.phone,
        passcode: credentials.password,
      };

      console.log("Attempting login with payload:", {
        phoneNumber: payload.phoneNumber,
        passcode: "****",
      });

      if (typeof window !== "undefined" && (window as any).mockAuthResponse) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        console.log("Using mock response for login");
        const response = (window as any).mockAuthResponse;

        toast.success("Login successful!");

        return response;
      }

      // Now using the local API route that proxies to the real API
      const response = await axiosInstance.post("/auth/login", payload);
      console.log("Login successful, response:", response.data);
      toast.success("Login successful!");
      return response.data.data;
    } catch (error) {
      console.error("Login error:", error);
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
      state.profile = null;
      state.token = null;
      state.error = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("authToken");
        localStorage.removeItem("profile");
      }
    },
    rehydrate(state, action) {
      state.token = action.payload.token;
      state.profile = action.payload.profile;
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
        state.profile = action.payload.profile;
        state.token = action.payload.token;

        if (typeof window !== "undefined") {
          localStorage.setItem("authToken", JSON.stringify(state.token));
          localStorage.setItem("profile", JSON.stringify(state.profile));
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
