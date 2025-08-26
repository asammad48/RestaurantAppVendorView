import { ApiResponse } from './apiRepository';

/**
 * Generic error handler for API responses
 * Converts API response errors into user-friendly messages
 */
export function handleApiResponse<T>(response: ApiResponse<T>): T {
  if (response.error) {
    // Return a standardized error that React Query can handle
    const error = new Error(response.error);
    (error as any).status = response.status;
    throw error;
  }
  
  return response.data as T;
}

/**
 * Generic mutation function that handles API calls with proper error handling
 */
export function createApiMutation<TData, TVariables = any>(
  mutationFn: (variables: TVariables) => Promise<ApiResponse<TData>>
) {
  return async (variables: TVariables): Promise<TData> => {
    const response = await mutationFn(variables);
    return handleApiResponse(response);
  };
}

/**
 * Error formatting for user-friendly display
 */
export function formatApiError(error: any): string {
  if (!error) return 'An unexpected error occurred';
  
  // If it's already a formatted error message from the API
  if (typeof error === 'string') return error;
  
  // If it has a message property
  if (error.message) return error.message;
  
  // If it's a validation error object
  if (error.errors && typeof error.errors === 'object') {
    const messages = Object.values(error.errors).flat();
    return messages.join('. ');
  }
  
  // Default fallback
  return 'An unexpected error occurred';
}

/**
 * Generic query function wrapper for React Query
 */
export function createApiQuery<T>(
  queryFn: () => Promise<ApiResponse<T>>
) {
  return async (): Promise<T> => {
    const response = await queryFn();
    return handleApiResponse(response);
  };
}