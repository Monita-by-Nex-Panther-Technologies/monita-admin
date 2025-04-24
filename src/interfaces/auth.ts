export interface LoginCredentials {
  email: string;
  password: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  email: string;
  otp: string;
  otpReference: string;
  password: string;
}

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
}

export interface LoginResponse {
  profile: UserProfile;
  token: string;
}

export interface ForgotPasswordResponse {
  otpReference: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  token: string | null;
  otpReference: string | null;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<ApiResponse<LoginResponse>>;
  forgotPassword: (
    payload: ForgotPasswordPayload
  ) => Promise<ApiResponse<ForgotPasswordResponse>>;
  resetPassword: (payload: ResetPasswordPayload) => Promise<ApiResponse<any>>;
  logout: () => void;
}
