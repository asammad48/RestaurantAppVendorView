// Generic API Repository with error handling and token management
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

export interface ApiConfig {
  baseUrl: string;
  endpoints: {
    [key: string]: string;
  };
  headers?: {
    [key: string]: string;
  };
}

export class ApiRepository {
  private config: ApiConfig;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor(config: ApiConfig) {
    this.config = config;
    this.loadTokensFromStorage();
  }

  // Load tokens from localStorage
  private loadTokensFromStorage() {
    this.accessToken = localStorage.getItem('access_token');
    this.refreshToken = localStorage.getItem('refresh_token');
  }

  // Save tokens to localStorage
  private saveTokensToStorage(accessToken: string, refreshToken?: string) {
    this.accessToken = accessToken;
    localStorage.setItem('access_token', accessToken);
    
    if (refreshToken) {
      this.refreshToken = refreshToken;
      localStorage.setItem('refresh_token', refreshToken);
    }
  }

  // Clear tokens from localStorage
  private clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  // Refresh access token
  private async refreshAccessToken(): Promise<boolean> {
    if (!this.refreshToken) {
      return false;
    }

    try {
      const response = await fetch(`${this.config.baseUrl}${this.config.endpoints.refreshToken}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.config.headers,
        },
        body: JSON.stringify({
          refreshToken: this.refreshToken,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        this.saveTokensToStorage(data.accessToken, data.refreshToken);
        return true;
      } else {
        this.clearTokens();
        return false;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.clearTokens();
      return false;
    }
  }

  // Generic API call method
  async call<T>(
    endpointKey: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' = 'GET',
    data?: any,
    customHeaders?: { [key: string]: string },
    requiresAuth: boolean = true
  ): Promise<ApiResponse<T>> {
    const endpoint = this.config.endpoints[endpointKey];
    if (!endpoint) {
      return {
        error: `Endpoint '${endpointKey}' not found in configuration`,
        status: 404,
      };
    }

    const url = `${this.config.baseUrl}${endpoint}`;
    
    // Prepare headers
    const headers: { [key: string]: string } = {
      'Content-Type': 'application/json',
      'accept': '*/*',
      ...this.config.headers,
      ...customHeaders,
    };

    // Add authorization header if required and token exists
    if (requiresAuth && this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    // Prepare request options
    const requestOptions: RequestInit = {
      method,
      headers,
    };

    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      requestOptions.body = JSON.stringify(data);
    }

    try {
      let response = await fetch(url, requestOptions);

      // Handle 401 Unauthorized - try to refresh token
      if (response.status === 401 && requiresAuth && this.refreshToken) {
        console.log('Token expired, attempting to refresh...');
        
        const refreshSuccess = await this.refreshAccessToken();
        if (refreshSuccess) {
          // Update authorization header with new token
          headers['Authorization'] = `Bearer ${this.accessToken}`;
          requestOptions.headers = headers;
          
          // Retry the original request
          response = await fetch(url, requestOptions);
        } else {
          // Refresh failed, redirect to login
          this.handleAuthenticationFailure();
          return {
            error: 'Authentication failed. Please login again.',
            status: 401,
          };
        }
      }

      // Handle response based on status
      if (response.ok) {
        const responseData = await response.json();
        return {
          data: responseData,
          status: response.status,
        };
      } else {
        let errorMessage = `Request failed with status ${response.status}`;
        
        try {
          const errorData = await response.text();
          if (errorData) {
            // Try to parse JSON error response
            try {
              const parsedError = JSON.parse(errorData);
              
              // Handle 422 validation errors specifically
              if (response.status === 422 && parsedError.errors && parsedError.errors['Validation Error']) {
                const validationErrors = parsedError.errors['Validation Error'];
                if (Array.isArray(validationErrors)) {
                  errorMessage = validationErrors.join('. ');
                } else {
                  errorMessage = validationErrors;
                }
              } else {
                errorMessage = parsedError.message || parsedError.error || parsedError.title || errorData;
              }
            } catch {
              errorMessage = errorData;
            }
          }
        } catch {
          // Use default error message if response body can't be read
        }

        // Handle specific status codes
        switch (response.status) {
          case 400:
            console.error('Bad Request:', errorMessage);
            break;
          case 401:
            console.error('Unauthorized:', errorMessage);
            this.handleAuthenticationFailure();
            break;
          case 403:
            console.error('Forbidden:', errorMessage);
            break;
          case 404:
            console.error('Not Found:', errorMessage);
            break;
          case 422:
            console.error('Validation Error:', errorMessage);
            // Handle 422 validation errors with array processing
            try {
              const errorData = await response.clone().json();
              if (errorData.errors && errorData.errors['Validation Error']) {
                const validationErrors = errorData.errors['Validation Error'];
                if (Array.isArray(validationErrors)) {
                  errorMessage = validationErrors.join('. ');
                }
              }
            } catch {
              // Use default error message if JSON parsing fails
            }
            break;
          case 500:
            console.error('Internal Server Error:', errorMessage);
            break;
          default:
            console.error('API Error:', errorMessage);
        }

        return {
          error: errorMessage,
          status: response.status,
        };
      }
    } catch (error) {
      console.error('Network error:', error);
      return {
        error: error instanceof Error ? error.message : 'Network error occurred',
        status: 0,
      };
    }
  }

  // Handle authentication failure
  private handleAuthenticationFailure() {
    this.clearTokens();
    // You can implement additional logic here like redirecting to login page
    // For now, we'll just clear the tokens
    console.log('Authentication failed. Tokens cleared.');
  }

  // Update configuration
  updateConfig(newConfig: Partial<ApiConfig>) {
    this.config = { ...this.config, ...newConfig };
  }

  // Update specific endpoint
  updateEndpoint(key: string, endpoint: string) {
    this.config.endpoints[key] = endpoint;
  }

  // Get current configuration
  getConfig(): ApiConfig {
    return { ...this.config };
  }

  // Set tokens (useful for login)
  setTokens(accessToken: string, refreshToken?: string) {
    this.saveTokensToStorage(accessToken, refreshToken);
  }

  // Get current access token
  getAccessToken(): string | null {
    return this.accessToken;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.accessToken;
  }
}

// Default API configuration
export const defaultApiConfig: ApiConfig = {
  baseUrl: 'https://81w6jsg0-7261.inc1.devtunnels.ms',
  endpoints: {
    // Authentication endpoints
    login: '/api/auth/login',
    signup: '/api/User/restaurant-owner',
    refreshToken: '/api/auth/refresh',
    
    // User endpoints
    getUsers: '/api/users',
    createUser: '/api/users',
    updateUser: '/api/users/{id}',
    deleteUser: '/api/users/{id}',
    
    // Restaurant/Entity endpoints
    getEntities: '/api/entities',
    createEntity: '/api/entities',
    updateEntity: '/api/entities/{id}',
    deleteEntity: '/api/entities/{id}',
    
    // Branch endpoints
    getBranches: '/api/branches',
    createBranch: '/api/branches',
    updateBranch: '/api/branches/{id}',
    deleteBranch: '/api/branches/{id}',
    
    // Menu endpoints
    getMenuItems: '/api/menu-items',
    createMenuItem: '/api/menu-items',
    updateMenuItem: '/api/menu-items/{id}',
    deleteMenuItem: '/api/menu-items/{id}',
    
    // Order endpoints
    getOrders: '/api/orders',
    createOrder: '/api/orders',
    updateOrder: '/api/orders/{id}',
    deleteOrder: '/api/orders/{id}',
    
    // Other endpoints as needed
    getAnalytics: '/api/analytics',
    getFeedbacks: '/api/feedbacks',
    getTickets: '/api/tickets',
  },
  headers: {
    'Accept': '*/*',
    'Content-Type': 'application/json',
  },
};

// Create singleton instance
export const apiRepository = new ApiRepository(defaultApiConfig);