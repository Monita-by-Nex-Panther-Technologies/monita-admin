import { store } from "@/store";

export interface AuthState {
  user: any | null;
  tokens: any | null;
  loading: boolean;
  error: string | null;
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
