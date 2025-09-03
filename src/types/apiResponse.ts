// Unified API Response structure
export interface ApiResponseDto<T> {
  success: boolean;
  message: string;
  data?: T | null;
  errors: string[];
  metadata?: any;
}

// Helper type for extracting data from API responses
export type ApiData<T> = T extends ApiResponseDto<infer U> ? U : never;