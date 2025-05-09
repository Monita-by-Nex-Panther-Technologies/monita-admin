export interface LoginCredentials {
    email: string;
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
  
 
  export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
  }
  
  export interface AuthState {
    isAuthenticated: boolean;
    token: string | null ;
    isLoading: boolean;
    login: (credentials: LoginCredentials) => Promise<ApiResponse<LoginResponse>>;
    logout: () => void;
  }
  