import { type User, type InsertUser, type Entity, type InsertEntity, type Restaurant, type InsertRestaurant, type Branch, type InsertBranch, type Analytics, type InsertAnalytics, type MenuItem, type InsertMenuItem } from "@shared/schema";
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

  // Entities
  getEntity(id: string): Promise<Entity | undefined>;
  createEntity(entity: InsertEntity): Promise<Entity>;
  updateEntity(id: string, entity: Partial<InsertEntity>): Promise<Entity | undefined>;
  deleteEntity(id: string): Promise<boolean>;
  getAllEntities(): Promise<Entity[]>;

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

  // Menu Items
  getMenuItem(id: string): Promise<MenuItem | undefined>;
  createMenuItem(menuItem: InsertMenuItem): Promise<MenuItem>;
  updateMenuItem(id: string, menuItem: Partial<InsertMenuItem>): Promise<MenuItem | undefined>;
  deleteMenuItem(id: string): Promise<boolean>;
  getAllMenuItems(): Promise<MenuItem[]>;
  getMenuItemsByRestaurant(restaurantId: string): Promise<MenuItem[]>;
  getMenuItemsByCategory(category: string): Promise<MenuItem[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private entities: Map<string, Entity>;
  private restaurants: Map<string, Restaurant>;
  private branches: Map<string, Branch>;
  private analytics: Map<string, Analytics>;
  private menuItems: Map<string, MenuItem>;

  constructor() {
    this.users = new Map();
    this.entities = new Map();
    this.restaurants = new Map();
    this.branches = new Map();
    this.analytics = new Map();
    this.menuItems = new Map();
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

    // Seed entities
    const seedEntities: Entity[] = [
      {
        id: "1",
        name: "Grand Plaza Hotel",
        phone: "+1234567890",
        address: "123 Grand Avenue, Downtown City",
        certificateUrl: "https://example.com/certificates/grand-plaza.pdf",
        certificatePicture: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        profilePicture: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        entityType: "hotel",
        status: "active",
        createdAt: new Date(),
      },
      {
        id: "2",
        name: "The Burger House",
        phone: "+1234567891",
        address: "456 Food Street, Midtown",
        certificateUrl: "https://example.com/certificates/burger-house.pdf",
        certificatePicture: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        profilePicture: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        entityType: "restaurant",
        status: "active",
        createdAt: new Date(),
      },
      {
        id: "3",
        name: "Luxury Resort & Spa",
        phone: "+1234567892",
        address: "789 Beach Road, Coastal Area",
        certificateUrl: "https://example.com/certificates/luxury-resort.pdf",
        certificatePicture: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        profilePicture: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        entityType: "hotel",
        status: "active",
        createdAt: new Date(),
      },
      {
        id: "4",
        name: "Pizza Palace",
        phone: "+1234567893",
        address: "321 Italy Square, Little Italy",
        certificateUrl: "https://example.com/certificates/pizza-palace.pdf",
        certificatePicture: "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        profilePicture: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        entityType: "restaurant",
        status: "active",
        createdAt: new Date(),
      },
    ];

    seedEntities.forEach(entity => this.entities.set(entity.id, entity));

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

    // Seed menu items
    const seedMenuItems: MenuItem[] = [
      {
        id: "1",
        name: "Chicken Karahi",
        category: "Cuisine",
        description: "A spicy and flavorful pizza topped with marinated chicken, fajita strips, bell peppers, onions and crust.",
        image: "Image",
        price: 100000, // Rs 1000 in cents
        addOns: ['{"name": "Extra Cheese", "price": 200}', '{"name": "Extra Sauce", "price": 100}'],
        customizations: ['{"name": "Spice Level", "options": ["Mild", "Medium", "Hot", "Extra Hot"]}'],
        variants: ['{"option": "Small", "price": 100000}', '{"option": "Medium", "price": 150000}', '{"option": "Large", "price": 200000}'],
        restaurantId: "1",
        status: "active",
        createdAt: new Date(),
      },
      {
        id: "2",
        name: "Beef Burger",
        category: "Fast Food",
        description: "Juicy beef patty with fresh lettuce, tomato, onion and special sauce.",
        image: "Image",
        price: 80000, // Rs 800 in cents
        addOns: ['{"name": "Extra Patty", "price": 300}', '{"name": "Cheese", "price": 150}'],
        customizations: ['{"name": "Bun Type", "options": ["Regular", "Sesame", "Whole Wheat"]}'],
        variants: ['{"option": "Single", "price": 80000}', '{"option": "Double", "price": 120000}'],
        restaurantId: "1",
        status: "active",
        createdAt: new Date(),
      },
      {
        id: "3",
        name: "Margherita Pizza",
        category: "Italian",
        description: "Classic pizza with fresh mozzarella, tomato sauce and basil.",
        image: "Image",
        price: 120000, // Rs 1200 in cents
        addOns: ['{"name": "Extra Cheese", "price": 200}', '{"name": "Olives", "price": 150}'],
        customizations: ['{"name": "Crust", "options": ["Thin", "Thick", "Stuffed"]}'],
        variants: ['{"option": "Small", "price": 120000}', '{"option": "Medium", "price": 180000}', '{"option": "Large", "price": 250000}'],
        restaurantId: "2",
        status: "active",
        createdAt: new Date(),
      },
      {
        id: "4",
        name: "Caesar Salad",
        category: "Salads",
        description: "Fresh romaine lettuce with caesar dressing, croutons and parmesan cheese.",
        image: "Image",
        price: 60000, // Rs 600 in cents
        addOns: ['{"name": "Grilled Chicken", "price": 300}', '{"name": "Extra Dressing", "price": 50}'],
        customizations: ['{"name": "Dressing Amount", "options": ["Light", "Regular", "Extra"]}'],
        variants: ['{"option": "Regular", "price": 60000}', '{"option": "Large", "price": 80000}'],
        restaurantId: "1",
        status: "active",
        createdAt: new Date(),
      },
      {
        id: "5",
        name: "Fish & Chips",
        category: "Seafood",
        description: "Crispy battered fish served with golden fries and tartar sauce.",
        image: "Image",
        price: 90000, // Rs 900 in cents
        addOns: ['{"name": "Extra Fish", "price": 400}', '{"name": "Mushy Peas", "price": 100}'],
        customizations: ['{"name": "Fish Type", "options": ["Cod", "Haddock", "Plaice"]}'],
        variants: ['{"option": "Regular", "price": 90000}', '{"option": "Large", "price": 130000}'],
        restaurantId: "2",
        status: "active",
        createdAt: new Date(),
      },
    ];

    seedMenuItems.forEach(menuItem => this.menuItems.set(menuItem.id, menuItem));
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

  // Entity methods
  async getEntity(id: string): Promise<Entity | undefined> {
    return this.entities.get(id);
  }

  async createEntity(insertEntity: InsertEntity): Promise<Entity> {
    const id = randomUUID();
    const entity: Entity = { 
      ...insertEntity, 
      id, 
      createdAt: new Date(),
      status: insertEntity.status || "active",
      certificateUrl: insertEntity.certificateUrl || null,
      certificatePicture: insertEntity.certificatePicture || null
    };
    this.entities.set(id, entity);
    return entity;
  }

  async updateEntity(id: string, updateData: Partial<InsertEntity>): Promise<Entity | undefined> {
    const existingEntity = this.entities.get(id);
    if (!existingEntity) return undefined;

    const updatedEntity = { ...existingEntity, ...updateData };
    this.entities.set(id, updatedEntity);
    return updatedEntity;
  }

  async deleteEntity(id: string): Promise<boolean> {
    return this.entities.delete(id);
  }

  async getAllEntities(): Promise<Entity[]> {
    return Array.from(this.entities.values());
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
      restaurantId: insertBranch.restaurantId || null,
      restaurantLogo: insertBranch.restaurantLogo || null,
      instagram: insertBranch.instagram || null,
      whatsapp: insertBranch.whatsapp || null,
      facebook: insertBranch.facebook || null,
      googleMap: insertBranch.googleMap || null
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

  // Menu Item methods
  async getMenuItem(id: string): Promise<MenuItem | undefined> {
    return this.menuItems.get(id);
  }

  async createMenuItem(insertMenuItem: InsertMenuItem): Promise<MenuItem> {
    const id = randomUUID();
    const menuItem: MenuItem = { 
      ...insertMenuItem, 
      id, 
      createdAt: new Date(),
      status: insertMenuItem.status || "active",
      restaurantId: insertMenuItem.restaurantId || null,
      description: insertMenuItem.description || null,
      image: insertMenuItem.image || null,
      addOns: insertMenuItem.addOns || [],
      customizations: insertMenuItem.customizations || [],
      variants: insertMenuItem.variants || []
    };
    this.menuItems.set(id, menuItem);
    return menuItem;
  }

  async updateMenuItem(id: string, updateData: Partial<InsertMenuItem>): Promise<MenuItem | undefined> {
    const existingMenuItem = this.menuItems.get(id);
    if (!existingMenuItem) return undefined;

    const updatedMenuItem = { ...existingMenuItem, ...updateData };
    this.menuItems.set(id, updatedMenuItem);
    return updatedMenuItem;
  }

  async deleteMenuItem(id: string): Promise<boolean> {
    return this.menuItems.delete(id);
  }

  async getAllMenuItems(): Promise<MenuItem[]> {
    return Array.from(this.menuItems.values());
  }

  async getMenuItemsByRestaurant(restaurantId: string): Promise<MenuItem[]> {
    return Array.from(this.menuItems.values()).filter(item => item.restaurantId === restaurantId);
  }

  async getMenuItemsByCategory(category: string): Promise<MenuItem[]> {
    return Array.from(this.menuItems.values()).filter(item => item.category === category);
  }
}

export const storage = new MemStorage();
