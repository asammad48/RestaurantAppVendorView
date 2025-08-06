import { type User, type InsertUser, type Restaurant, type InsertRestaurant, type Branch, type InsertBranch, type Analytics, type InsertAnalytics } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: string): Promise<boolean>;
  getAllUsers(): Promise<User[]>;
  getUsersByRole(role: string): Promise<User[]>;

  // Restaurants
  getRestaurant(id: string): Promise<Restaurant | undefined>;
  createRestaurant(restaurant: InsertRestaurant): Promise<Restaurant>;
  updateRestaurant(id: string, restaurant: Partial<InsertRestaurant>): Promise<Restaurant | undefined>;
  deleteRestaurant(id: string): Promise<boolean>;
  getAllRestaurants(): Promise<Restaurant[]>;

  // Branches
  getBranch(id: string): Promise<Branch | undefined>;
  createBranch(branch: InsertBranch): Promise<Branch>;
  updateBranch(id: string, branch: Partial<InsertBranch>): Promise<Branch | undefined>;
  deleteBranch(id: string): Promise<boolean>;
  getAllBranches(): Promise<Branch[]>;
  getBranchesByRestaurant(restaurantId: string): Promise<Branch[]>;

  // Analytics
  getAnalytics(date?: string): Promise<Analytics[]>;
  createAnalytics(analytics: InsertAnalytics): Promise<Analytics>;
  getAnalyticsByDateRange(startDate: string, endDate: string): Promise<Analytics[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private restaurants: Map<string, Restaurant>;
  private branches: Map<string, Branch>;
  private analytics: Map<string, Analytics>;

  constructor() {
    this.users = new Map();
    this.restaurants = new Map();
    this.branches = new Map();
    this.analytics = new Map();
    this.seedData();
  }

  private seedData() {
    // Seed users
    const seedUsers: User[] = [
      {
        id: "1",
        username: "john_doe",
        email: "john@example.com",
        password: "password123",
        role: "manager",
        assignedTable: null,
        assignedBranch: "The Burger House",
        status: "active",
        createdAt: new Date(),
      },
      {
        id: "2",
        username: "ali_raza",
        email: "ali@example.com",
        password: "password123",
        role: "waiter",
        assignedTable: "Table No 3",
        assignedBranch: "The Burger House",
        status: "inactive",
        createdAt: new Date(),
      },
      {
        id: "3",
        username: "jane_chef",
        email: "jane@example.com",
        password: "password123",
        role: "chef",
        assignedTable: null,
        assignedBranch: "The Burger House",
        status: "active",
        createdAt: new Date(),
      },
      {
        id: "4",
        username: "mike_waiter",
        email: "mike@example.com",
        password: "password123",
        role: "waiter",
        assignedTable: "Table No 5",
        assignedBranch: "The Burger House",
        status: "active",
        createdAt: new Date(),
      },
      {
        id: "5",
        username: "sarah_manager",
        email: "sarah@example.com",
        password: "password123",
        role: "manager",
        assignedTable: null,
        assignedBranch: "The Burger House",
        status: "active",
        createdAt: new Date(),
      },
    ];

    seedUsers.forEach(user => this.users.set(user.id, user));

    // Seed restaurants
    const seedRestaurants: Restaurant[] = [
      {
        id: "1",
        name: "The Burger House",
        imageUrl: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        status: "active",
        createdAt: new Date(),
      },
      {
        id: "2",
        name: "Pizza Palace",
        imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        status: "active",
        createdAt: new Date(),
      },
      {
        id: "3",
        name: "Sushi Zen",
        imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        status: "active",
        createdAt: new Date(),
      },
      {
        id: "4",
        name: "Steakhouse Elite",
        imageUrl: "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        status: "active",
        createdAt: new Date(),
      },
      {
        id: "5",
        name: "Cafe Corner",
        imageUrl: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        status: "active",
        createdAt: new Date(),
      },
      {
        id: "6",
        name: "Taco Fiesta",
        imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        status: "active",
        createdAt: new Date(),
      },
    ];

    seedRestaurants.forEach(restaurant => this.restaurants.set(restaurant.id, restaurant));

    // Seed branches
    const seedBranches: Branch[] = [
      {
        id: "1",
        name: "Main Branch",
        restaurantType: "fast-food",
        contactNo: "+1234567890",
        address: "123 Main Street, Downtown",
        restaurantLogo: "burger_house_logo.png",
        instagram: "@burgerhousemain",
        whatsapp: "+1234567890",
        facebook: "BurgerHouseMain",
        googleMap: "https://maps.google.com/burgerhousemain",
        restaurantId: "1",
        status: "active",
        createdAt: new Date(),
      },
      {
        id: "2", 
        name: "North Branch",
        restaurantType: "casual-dining",
        contactNo: "+1234567891",
        address: "456 North Avenue, Uptown",
        restaurantLogo: "pizza_palace_logo.png",
        instagram: "@pizzapalacenorth",
        whatsapp: "+1234567891",
        facebook: "PizzaPalaceNorth",
        googleMap: "https://maps.google.com/pizzapalacenorth",
        restaurantId: "2",
        status: "active",
        createdAt: new Date(),
      },
    ];

    seedBranches.forEach(branch => this.branches.set(branch.id, branch));

    // Seed analytics
    const months = ["2024-01", "2024-02", "2024-03", "2024-04", "2024-05", "2024-06", "2024-07", "2024-08", "2024-09", "2024-10", "2024-11", "2024-12"];
    const seedAnalytics: Analytics[] = months.map((month, index) => ({
      id: (index + 1).toString(),
      date: month,
      revenue: Math.floor(Math.random() * 50000) + 20000,
      customers: Math.floor(Math.random() * 500) + 100,
      orders: Math.floor(Math.random() * 1000) + 500,
      menuItems: 345,
    }));

    seedAnalytics.forEach(analytics => this.analytics.set(analytics.id, analytics));
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username || user.email === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date(),
      role: insertUser.role || "waiter",
      assignedTable: insertUser.assignedTable || null,
      assignedBranch: insertUser.assignedBranch || null,
      status: insertUser.status || "active"
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updateData: Partial<InsertUser>): Promise<User | undefined> {
    const existingUser = this.users.get(id);
    if (!existingUser) return undefined;

    const updatedUser = { ...existingUser, ...updateData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.users.delete(id);
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async getUsersByRole(role: string): Promise<User[]> {
    return Array.from(this.users.values()).filter(user => user.role === role);
  }

  // Restaurant methods
  async getRestaurant(id: string): Promise<Restaurant | undefined> {
    return this.restaurants.get(id);
  }

  async createRestaurant(insertRestaurant: InsertRestaurant): Promise<Restaurant> {
    const id = randomUUID();
    const restaurant: Restaurant = { 
      ...insertRestaurant, 
      id, 
      createdAt: new Date(),
      status: insertRestaurant.status || "active"
    };
    this.restaurants.set(id, restaurant);
    return restaurant;
  }

  async updateRestaurant(id: string, updateData: Partial<InsertRestaurant>): Promise<Restaurant | undefined> {
    const existingRestaurant = this.restaurants.get(id);
    if (!existingRestaurant) return undefined;

    const updatedRestaurant = { ...existingRestaurant, ...updateData };
    this.restaurants.set(id, updatedRestaurant);
    return updatedRestaurant;
  }

  async deleteRestaurant(id: string): Promise<boolean> {
    return this.restaurants.delete(id);
  }

  async getAllRestaurants(): Promise<Restaurant[]> {
    return Array.from(this.restaurants.values());
  }

  // Analytics methods
  async getAnalytics(date?: string): Promise<Analytics[]> {
    const allAnalytics = Array.from(this.analytics.values());
    if (date) {
      return allAnalytics.filter(analytics => analytics.date === date);
    }
    return allAnalytics;
  }

  async createAnalytics(insertAnalytics: InsertAnalytics): Promise<Analytics> {
    const id = randomUUID();
    const analytics: Analytics = { ...insertAnalytics, id };
    this.analytics.set(id, analytics);
    return analytics;
  }

  async getAnalyticsByDateRange(startDate: string, endDate: string): Promise<Analytics[]> {
    return Array.from(this.analytics.values()).filter(
      analytics => analytics.date >= startDate && analytics.date <= endDate
    );
  }

  // Branch methods
  async getBranch(id: string): Promise<Branch | undefined> {
    return this.branches.get(id);
  }

  async createBranch(insertBranch: InsertBranch): Promise<Branch> {
    const id = randomUUID();
    const branch: Branch = { 
      ...insertBranch, 
      id, 
      createdAt: new Date(),
      status: insertBranch.status || "active",
      restaurantId: insertBranch.restaurantId || null
    };
    this.branches.set(id, branch);
    return branch;
  }

  async updateBranch(id: string, updateData: Partial<InsertBranch>): Promise<Branch | undefined> {
    const existingBranch = this.branches.get(id);
    if (!existingBranch) return undefined;

    const updatedBranch = { ...existingBranch, ...updateData };
    this.branches.set(id, updatedBranch);
    return updatedBranch;
  }

  async deleteBranch(id: string): Promise<boolean> {
    return this.branches.delete(id);
  }

  async getAllBranches(): Promise<Branch[]> {
    return Array.from(this.branches.values());
  }

  async getBranchesByRestaurant(restaurantId: string): Promise<Branch[]> {
    return Array.from(this.branches.values()).filter(branch => branch.restaurantId === restaurantId);
  }
}

export const storage = new MemStorage();
