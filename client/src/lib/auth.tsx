import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { User } from "@shared/schema";

interface AuthContextType {
  user: Omit<User, 'password'> | null;
  login: (username: string, password: string) => Promise<void>;
  signup: (userData: any) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const authState = useAuthState();
  
  return (
    <AuthContext.Provider value={authState}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function useAuthState() {
  const [user, setUser] = useState<Omit<User, 'password'> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("user");
    console.log("Stored user from localStorage:", storedUser); // Debug log
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Convert createdAt string back to Date object if needed
        if (parsedUser.createdAt && typeof parsedUser.createdAt === 'string') {
          parsedUser.createdAt = new Date(parsedUser.createdAt);
        }
        console.log("Parsed user:", parsedUser); // Debug log
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      // Dummy authentication - accept any credentials
      const dummyUser = {
        id: "1",
        username: username,
        email: `${username}@example.com`,
        name: "John Doe",
        phoneNumber: "+1234567890",
        address: null,
        image: null,
        role: "manager",
        assignedTable: null,
        assignedBranch: null,
        status: "active",
        createdAt: new Date(),
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setUser(dummyUser);
      // Convert Date objects to strings for localStorage storage
      const userToStore = {
        ...dummyUser,
        createdAt: dummyUser.createdAt.toISOString()
      };
      localStorage.setItem("user", JSON.stringify(userToStore));
      console.log("User stored in localStorage during login:", JSON.stringify(userToStore));
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: any) => {
    setIsLoading(true);
    try {
      // Dummy signup - accept any data
      const dummyUser = {
        id: "1",
        username: userData.username,
        email: userData.email,
        name: userData.username,
        phoneNumber: userData.phone,
        address: null,
        image: null,
        role: "manager",
        assignedTable: null,
        assignedBranch: null,
        status: "active",
        createdAt: new Date(),
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setUser(dummyUser);
      localStorage.setItem("user", JSON.stringify(dummyUser));
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return {
    user,
    login,
    signup,
    logout,
    isLoading,
  };
}
