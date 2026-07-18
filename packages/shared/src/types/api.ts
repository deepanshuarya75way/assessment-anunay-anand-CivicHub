export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T | null;
  meta?: Record<string, any>;
  timestamp: string;
  requestId?: string;
  error?: {
    code?: string;
    details?: any;
    stack?: string;
  };
}

export interface PaginatedData<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
