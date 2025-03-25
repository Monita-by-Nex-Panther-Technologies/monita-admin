import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/authSlice";
import { preloadedState } from "./preloadedState";

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  preloadedState,
});

export type { RootState, AppDispatch } from "@/interfaces/store";
