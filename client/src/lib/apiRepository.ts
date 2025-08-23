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
    this.accessToken = localStorage.getItem('access_token') || localStorage.getItem('auth_token');
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

  // Generic API call method with support for FormData
  async call<T>(
    endpointKey: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' = 'GET',
    data?: any,
    customHeaders?: { [key: string]: string },
    requiresAuth: boolean = true,
    pathParams?: { [key: string]: string | number }
  ): Promise<ApiResponse<T>> {
    let endpoint = this.config.endpoints[endpointKey];
    if (!endpoint) {
      return {
        error: `Endpoint '${endpointKey}' not found in configuration`,
        status: 404,
      };
    }

    // Replace path parameters if provided
    if (pathParams) {
      Object.entries(pathParams).forEach(([key, value]) => {
        endpoint = endpoint.replace(`{${key}}`, String(value));
      });
    }

    const url = `${this.config.baseUrl}${endpoint}`;
    
    // Prepare headers
    const headers: { [key: string]: string } = {
      'accept': '*/*',
      ...this.config.headers,
      ...customHeaders,
    };

    // Don't set Content-Type for FormData - browser will set it with boundary
    const isFormData = data instanceof FormData;
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    } else {
      // Explicitly remove Content-Type for FormData to let browser set it with boundary
      delete headers['Content-Type'];
      console.log('FormData detected - Content-Type header removed for multipart/form-data');
    }

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
      if (isFormData) {
        requestOptions.body = data;
      } else {
        requestOptions.body = JSON.stringify(data);
      }
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
        // Handle 204 No Content responses
        if (response.status === 204) {
          return {
            data: null as T,
            status: response.status,
          };
        }
        
        // Try to parse JSON response
        try {
          const responseData = await response.json();
          return {
            data: responseData,
            status: response.status,
          };
        } catch {
          // If JSON parsing fails, return null data for successful responses
          return {
            data: null as T,
            status: response.status,
          };
        }
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

  // GET request
  async get(endpoint: string) {
    return this.call(endpoint, 'GET');
  }

  // POST request with FormData
  async postFormData(endpoint: string, formData: FormData) {
    return this.call(endpoint, 'POST', formData);
  }

  // PUT request with FormData
  async putFormData(endpoint: string, formData: FormData) {
    return this.call(endpoint, 'PUT', formData);
  }

  // DELETE request
  async delete(endpoint: string) {
    return this.call(endpoint, 'DELETE');
  }
}

// API Base URL and Endpoints
export const API_BASE_URL = 'https://5dtrtpzg-7261.inc1.devtunnels.ms';

export const API_ENDPOINTS = {
  // Authentication endpoints
  LOGIN: '/api/User/login',
  SIGNUP: '/api/User/restaurant-owner',
  REFRESH_TOKEN: '/api/auth/refresh',
  
  // User endpoints
  USERS: '/api/User/users',
  USER_BY_ID: '/api/User/user/{id}',
  CREATE_USER: '/api/User/user',
  UPDATE_USER: '/api/User/user',
  DELETE_USER: '/api/User/user/{id}',
  
  // Generic endpoints
  ROLES: '/api/Generic/roles',
  ENTITIES_AND_BRANCHES: '/api/Generic/entities-and-branches',
  
  // Entity endpoints
  ENTITIES: '/api/Entity',
  ENTITY_BY_ID: '/api/Entity/{id}',
  
  // Branch endpoints
  BRANCHES: '/api/Branch',
  BRANCH_BY_ID: '/api/Branch/{id}',
  BRANCHES_BY_ENTITY: '/api/Branch/entity/{entityId}',
  
  // Location/Table endpoints
  LOCATIONS: '/api/Location',
  LOCATION_BY_ID: '/api/Location/{id}',
  LOCATIONS_BY_BRANCH: '/api/Location/branch/{branchId}',
  
  // Menu endpoints
  MENU_ITEMS: '/api/menu-items',
  MENU_ITEM_BY_ID: '/api/menu-items/{id}',
  
  // Order endpoints
  ORDERS: '/api/orders',
  ORDER_BY_ID: '/api/orders/{id}',
  
  // MenuCategory endpoints
  MENU_CATEGORIES: '/api/MenuCategory',
  MENU_CATEGORY_BY_ID: '/api/MenuCategory/{id}',
  MENU_CATEGORIES_BY_BRANCH: '/api/MenuCategory/branch/{branchId}',

  // MenuItem endpoints
  MENU_ITEMS_BY_BRANCH: '/api/MenuItem/branch/{branchId}',

  // Other endpoints
  ANALYTICS: '/api/analytics',
  FEEDBACKS: '/api/feedbacks',
  TICKETS: '/api/tickets',
};

// Default API configuration
export const defaultApiConfig: ApiConfig = {
  baseUrl: API_BASE_URL,
  headers: {
    'Accept': '*/*',
    // No Content-Type header here - let API repository handle it dynamically
  },
  endpoints: {
    // Authentication endpoints
    login: API_ENDPOINTS.LOGIN,
    signup: API_ENDPOINTS.SIGNUP,
    refreshToken: API_ENDPOINTS.REFRESH_TOKEN,
    
    // User endpoints
    getUsers: API_ENDPOINTS.USERS,
    getUserById: API_ENDPOINTS.USER_BY_ID,
    createUser: API_ENDPOINTS.CREATE_USER,
    updateUser: API_ENDPOINTS.UPDATE_USER,
    deleteUser: API_ENDPOINTS.DELETE_USER,
    
    // Generic endpoints
    getRoles: API_ENDPOINTS.ROLES,
    getEntitiesAndBranches: API_ENDPOINTS.ENTITIES_AND_BRANCHES,
    
    // Entity endpoints
    getEntities: API_ENDPOINTS.ENTITIES,
    createEntity: API_ENDPOINTS.ENTITIES,
    getEntityById: API_ENDPOINTS.ENTITY_BY_ID,
    updateEntity: API_ENDPOINTS.ENTITY_BY_ID,
    deleteEntity: API_ENDPOINTS.ENTITY_BY_ID,
    
    // Branch endpoints
    getBranches: API_ENDPOINTS.BRANCHES,
    getBranchesByEntity: API_ENDPOINTS.BRANCHES_BY_ENTITY,
    getBranchById: API_ENDPOINTS.BRANCH_BY_ID,
    createBranch: API_ENDPOINTS.BRANCHES,
    updateBranch: API_ENDPOINTS.BRANCH_BY_ID,
    deleteBranch: API_ENDPOINTS.BRANCH_BY_ID,
    
    // Location/Table endpoints
    getLocations: API_ENDPOINTS.LOCATIONS,
    createLocation: API_ENDPOINTS.LOCATIONS,
    getLocationById: API_ENDPOINTS.LOCATION_BY_ID,
    getLocationsByBranch: API_ENDPOINTS.LOCATIONS_BY_BRANCH,
    updateLocation: API_ENDPOINTS.LOCATION_BY_ID,
    deleteLocation: API_ENDPOINTS.LOCATION_BY_ID,
    
    // Menu endpoints
    getMenuItems: API_ENDPOINTS.MENU_ITEMS,
    createMenuItem: API_ENDPOINTS.MENU_ITEMS,
    updateMenuItem: API_ENDPOINTS.MENU_ITEM_BY_ID,
    deleteMenuItem: API_ENDPOINTS.MENU_ITEM_BY_ID,
    
    // Order endpoints
    getOrders: API_ENDPOINTS.ORDERS,
    createOrder: API_ENDPOINTS.ORDERS,
    updateOrder: API_ENDPOINTS.ORDER_BY_ID,
    deleteOrder: API_ENDPOINTS.ORDER_BY_ID,
    
    // MenuCategory endpoints
    getMenuCategories: API_ENDPOINTS.MENU_CATEGORIES,
    createMenuCategory: API_ENDPOINTS.MENU_CATEGORIES,
    getMenuCategoryById: API_ENDPOINTS.MENU_CATEGORY_BY_ID,
    updateMenuCategory: API_ENDPOINTS.MENU_CATEGORY_BY_ID,
    deleteMenuCategory: API_ENDPOINTS.MENU_CATEGORY_BY_ID,
    getMenuCategoriesByBranch: API_ENDPOINTS.MENU_CATEGORIES_BY_BRANCH,

    // MenuItem endpoints
    getMenuItemsByBranch: API_ENDPOINTS.MENU_ITEMS_BY_BRANCH,

    // Other endpoints
    getAnalytics: API_ENDPOINTS.ANALYTICS,
    getFeedbacks: API_ENDPOINTS.FEEDBACKS,
    getTickets: API_ENDPOINTS.TICKETS,
  },
};

// Create singleton instance
export const apiRepository = new ApiRepository(defaultApiConfig);

// Branch API Helper Functions
export const branchApi = {
  // Get all branches by entity ID
  getBranchesByEntity: async (entityId: number): Promise<any[]> => {
    const response = await apiRepository.call('getBranchesByEntity', 'GET', undefined, {}, true, { entityId });
    return Array.isArray(response.data) ? response.data : [];
  },

  // Get branch by ID
  getBranchById: async (branchId: number) => {
    const response = await apiRepository.call('getBranchById', 'GET', undefined, {}, true, { id: branchId });
    return response.data;
  },

  // Create new branch with FormData
  createBranch: async (branchData: any, logoFile?: File, bannerFile?: File) => {
    const formData = new FormData();
    
    // Add text fields
    Object.keys(branchData).forEach(key => {
      if (branchData[key] !== undefined && branchData[key] !== null) {
        formData.append(key, branchData[key].toString());
      }
    });

    // Add files if provided
    if (logoFile) {
      formData.append('RestaurantLogo', logoFile);
    }
    if (bannerFile) {
      formData.append('RestaurantBanner', bannerFile);
    }

    const response = await apiRepository.call('createBranch', 'POST', formData);
    return response.data;
  },

  // Update branch with FormData
  updateBranch: async (branchId: number, branchData: any, logoFile?: File, bannerFile?: File) => {
    console.log('updateBranch called with:', { branchId, branchData, logoFile, bannerFile });
    
    const formData = new FormData();
    
    // Add text fields - Make sure EntityId is included
    Object.keys(branchData).forEach(key => {
      if (branchData[key] !== undefined && branchData[key] !== null) {
        console.log(`Adding field ${key}:`, branchData[key]);
        formData.append(key, branchData[key].toString());
      }
    });

    // Add files if provided - for updates, these should be optional but backend requires them
    // If no new files provided, we should not include empty file fields
    if (logoFile) {
      formData.append('RestaurantLogo', logoFile);
      console.log('Added logo file to form data');
    }
    if (bannerFile) {
      formData.append('RestaurantBanner', bannerFile);
      console.log('Added banner file to form data');
    }

    console.log('Sending PUT request to update branch...');
    console.log('FormData being sent for update branch:');
    // Log formData contents for debugging
    console.log('Number of form entries:', Array.from(formData.entries()).length);
    
    const response = await apiRepository.call('updateBranch', 'PUT', formData, {}, true, { id: branchId });
    console.log('Update branch response:', response);
    
    if (response.error) {
      throw new Error(response.error);
    }
    
    return response.data;
  },

  // Delete branch
  deleteBranch: async (branchId: number) => {
    const response = await apiRepository.call('deleteBranch', 'DELETE', undefined, {}, true, { id: branchId });
    return response.data;
  },
};

// User API Helper Functions
export const userApi = {
  // Get users with pagination
  getUsers: async (queryString: string) => {
    // For query parameters, we need to modify the endpoint temporarily
    const originalEndpoint = apiRepository.getConfig().endpoints['getUsers'];
    apiRepository.updateEndpoint('getUsers', `${originalEndpoint}?${queryString}`);
    
    const response = await apiRepository.call('getUsers', 'GET', undefined, {}, true);
    
    // Restore original endpoint
    apiRepository.updateEndpoint('getUsers', originalEndpoint);
    
    return response;
  },

  // Get user by ID
  getUserById: async (userId: string) => {
    return await apiRepository.call('getUserById', 'GET', undefined, {}, true, { id: userId });
  },

  // Create user with FormData
  createUser: async (formData: FormData) => {
    return await apiRepository.call('createUser', 'POST', formData);
  },

  // Update user with JSON
  updateUser: async (userData: any) => {
    return await apiRepository.call('updateUser', 'PUT', userData);
  },

  // Delete user
  deleteUser: async (userId: string) => {
    return await apiRepository.call('deleteUser', 'DELETE', undefined, {}, true, { id: userId });
  },
};

// Generic API Helper Functions  
export const genericApi = {
  // Get roles
  getRoles: async () => {
    return await apiRepository.call('getRoles', 'GET', undefined, {}, false);
  },

  // Get entities and branches
  getEntitiesAndBranches: async () => {
    return await apiRepository.call('getEntitiesAndBranches', 'GET');
  },
};

// Location/Table API Helper Functions
export const locationApi = {
  // Create a new table/location
  createLocation: async (locationData: { branchId: number; name: string; capacity: number }) => {
    return await apiRepository.call('createLocation', 'POST', locationData);
  },

  // Get location by ID
  getLocationById: async (locationId: string) => {
    return await apiRepository.call('getLocationById', 'GET', undefined, {}, true, { id: locationId });
  },

  // Get locations by branch ID
  getLocationsByBranch: async (branchId: number) => {
    return await apiRepository.call('getLocationsByBranch', 'GET', undefined, {}, true, { branchId: branchId.toString() });
  },

  // Update location
  updateLocation: async (locationId: string, locationData: { branchId?: number; name?: string; capacity?: number }) => {
    return await apiRepository.call('updateLocation', 'PUT', locationData, {}, true, { id: locationId });
  },

  // Delete location
  deleteLocation: async (locationId: string) => {
    return await apiRepository.call('deleteLocation', 'DELETE', undefined, {}, true, { id: locationId });
  },
};

// Auth API Helper Functions
export const authApi = {
  // Login
  login: async (credentials: { email: string; password: string }) => {
    return await apiRepository.call('login', 'POST', credentials, undefined, false);
  },

  // Signup  
  signup: async (userData: any) => {
    return await apiRepository.call('signup', 'POST', userData, undefined, false);
  },
};

// Helper to get full URL for images
export const getImageUrl = (relativePath: string): string => {
  if (!relativePath) return '';
  return `${API_BASE_URL}/${relativePath}`;
};