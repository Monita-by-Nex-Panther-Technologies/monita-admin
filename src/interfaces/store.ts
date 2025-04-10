import { store } from "@/store";

export interface Profile {
  id: string;
  email: string | null;
  firstName: string;
  lastName: string;
  monitag: string;
}

export interface AuthState {
  profile: Profile | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
