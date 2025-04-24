export interface APIErrorResponse {
  success: boolean;
  message: string;
  statusCode: number;
  errors: string[];
  timestamp: string;
  path: string;
  method: string;
}

export interface ErrorState {
  hasError: boolean;
  message: string;
  statusCode?: number;
  errors?: string[];
  timestamp?: string;
  path?: string;
  method?: string;
}
