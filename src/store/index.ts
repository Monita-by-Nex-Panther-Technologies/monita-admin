import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/authSlice";
import { getPreloadedState } from "./preloadedState";

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  preloadedState: getPreloadedState(),
});

export type { RootState, AppDispatch } from "@/interfaces/store";
