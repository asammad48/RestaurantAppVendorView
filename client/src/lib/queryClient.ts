import { QueryClient } from "@tanstack/react-query";
import { STORAGE_KEYS } from "../data/mockData";

// Client-side data operations using localStorage
export async function getLocalData(key: string): Promise<any> {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

export async function setLocalData(key: string, data: any): Promise<void> {
  localStorage.setItem(key, JSON.stringify(data));
}

export async function addLocalData(key: string, newItem: any): Promise<any> {
  const data = await getLocalData(key);
  const item = { ...newItem, id: newItem.id || `${key}-${Date.now()}` };
  const updatedData = [...data, item];
  await setLocalData(key, updatedData);
  return item;
}

export async function updateLocalData(key: string, id: string, updates: any): Promise<any> {
  const data = await getLocalData(key);
  const index = data.findIndex((item: any) => item.id === id);
  if (index !== -1) {
    data[index] = { ...data[index], ...updates };
    await setLocalData(key, data);
    return data[index];
  }
  throw new Error('Item not found');
}

export async function deleteLocalData(key: string, id: string): Promise<void> {
  const data = await getLocalData(key);
  const filteredData = data.filter((item: any) => item.id !== id);
  await setLocalData(key, filteredData);
}

// Mock API functions for authentication
export async function mockLogin(username: string, password: string) {
  const users = await getLocalData(STORAGE_KEYS.USERS);
  const user = users.find((u: any) => u.username === username && u.password === password);
  
  if (!user) {
    throw new Error('Invalid credentials');
  }
  
  const { password: _, ...userWithoutPassword } = user;
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(userWithoutPassword));
  return userWithoutPassword;
}

export async function mockSignup(userData: any) {
  const users = await getLocalData(STORAGE_KEYS.USERS);
  const existingUser = users.find((u: any) => 
    u.username === userData.username || u.email === userData.email
  );
  
  if (existingUser) {
    throw new Error('User already exists');
  }
  
  const newUser = {
    ...userData,
    id: `user-${Date.now()}`,
    name: userData.username,
    phoneNumber: "0000000000",
    role: "waiter",
    assignedTable: null,
    assignedBranch: null,
    status: "active",
    createdAt: new Date(),
  };
  
  await addLocalData(STORAGE_KEYS.USERS, newUser);
  const { password: _, ...userWithoutPassword } = newUser;
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(userWithoutPassword));
  return userWithoutPassword;
}

export async function getCurrentUser() {
  const userStr = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return userStr ? JSON.parse(userStr) : null;
}

export async function logout() {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
}

// API request function for mutations
export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  // Mock API responses based on URL patterns
  if (url.includes('/auth/login')) {
    const result = await mockLogin((data as any).username, (data as any).password);
    return new Response(JSON.stringify({ user: result }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  if (url.includes('/auth/signup')) {
    const result = await mockSignup(data);
    return new Response(JSON.stringify({ user: result }), { 
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  // Handle other API calls by mapping URLs to storage operations
  if (method === 'POST') {
    let storageKey = '';
    if (url.includes('/users')) storageKey = STORAGE_KEYS.USERS;
    else if (url.includes('/entities')) storageKey = STORAGE_KEYS.ENTITIES;
    else if (url.includes('/restaurants')) storageKey = STORAGE_KEYS.RESTAURANTS;
    else if (url.includes('/branches')) storageKey = STORAGE_KEYS.BRANCHES;
    else if (url.includes('/categories')) storageKey = STORAGE_KEYS.CATEGORIES;
    else if (url.includes('/menu-items')) storageKey = STORAGE_KEYS.MENU_ITEMS;
    else if (url.includes('/orders')) storageKey = STORAGE_KEYS.ORDERS;
    else if (url.includes('/tables')) storageKey = STORAGE_KEYS.TABLES;
    else if (url.includes('/deals')) storageKey = STORAGE_KEYS.DEALS;
    else if (url.includes('/services')) storageKey = STORAGE_KEYS.SERVICES;
    else if (url.includes('/feedbacks')) storageKey = STORAGE_KEYS.FEEDBACKS;
    else if (url.includes('/tickets')) storageKey = STORAGE_KEYS.TICKETS;
    
    if (storageKey) {
      const result = await addLocalData(storageKey, data);
      return new Response(JSON.stringify(result), { 
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
  
  // Default success response
  return new Response(JSON.stringify({ success: true }), { 
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => {
        const url = queryKey.join('/');
        
        // Map API URLs to localStorage keys
        if (url.includes('/api/users')) {
          const users = await getLocalData(STORAGE_KEYS.USERS);
          return users.map(({ password, ...user }) => user);
        }
        if (url.includes('/api/entities')) {
          return await getLocalData(STORAGE_KEYS.ENTITIES);
        }
        if (url.includes('/api/restaurants')) {
          return await getLocalData(STORAGE_KEYS.RESTAURANTS);
        }
        if (url.includes('/api/branches')) {
          return await getLocalData(STORAGE_KEYS.BRANCHES);
        }
        if (url.includes('/api/analytics')) {
          return await getLocalData(STORAGE_KEYS.ANALYTICS);
        }
        if (url.includes('/api/categories')) {
          return await getLocalData(STORAGE_KEYS.CATEGORIES);
        }
        if (url.includes('/api/menu-items')) {
          return await getLocalData(STORAGE_KEYS.MENU_ITEMS);
        }
        if (url.includes('/api/orders')) {
          return await getLocalData(STORAGE_KEYS.ORDERS);
        }
        if (url.includes('/api/tables')) {
          return await getLocalData(STORAGE_KEYS.TABLES);
        }
        if (url.includes('/api/deals')) {
          return await getLocalData(STORAGE_KEYS.DEALS);
        }
        if (url.includes('/api/services')) {
          return await getLocalData(STORAGE_KEYS.SERVICES);
        }
        if (url.includes('/api/feedbacks')) {
          return await getLocalData(STORAGE_KEYS.FEEDBACKS);
        }
        if (url.includes('/api/tickets')) {
          return await getLocalData(STORAGE_KEYS.TICKETS);
        }
        
        return [];
      },
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
