// Local type definitions to replace @shared/schema
import { z } from "zod";

// User types
export const insertUserSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.string().min(1, "Role is required"),
  status: z.string().default("active"),
  entityId: z.string().optional(),
  assignedBranch: z.string().optional(),
  assignedTable: z.string().optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = InsertUser & { id: string; createdAt: Date; };

// Entity types based on API response
export const insertEntitySchema = z.object({
  Name: z.string().min(1, "Entity name is required"),
  Phone: z.string().min(1, "Phone is required"),
  Address: z.string().min(1, "Address is required"),
  Type: z.number().min(1).max(2), // 1 for hotel, 2 for restaurant
  ProfilePicture: z.any().optional(), // File
  CertificateFile: z.any().optional(), // File
});

export type InsertEntity = z.infer<typeof insertEntitySchema>;

// Entity type based on API response structure
export interface Entity {
  id: number;
  userId: number;
  name: string;
  phone: string;
  address: string;
  profilePictureUrl: string;
  certificateUrl: string;
  type: number; // 1 for hotel, 2 for restaurant
  entityDetails: {
    primaryColor: string;
  };
  // Helper properties for UI compatibility
  entityType?: string;
  image?: string;
}

// Helper function to transform API entity to UI entity
export const transformEntityForUI = (apiEntity: Entity): Entity => ({
  ...apiEntity,
  entityType: apiEntity.type === 1 ? 'hotel' : 'restaurant',
  image: apiEntity.profilePictureUrl,
});

// Branch types
export const insertBranchSchema = z.object({
  name: z.string().min(1, "Branch name is required"),
  entityId: z.string().min(1, "Entity is required"),
  restaurantType: z.string().min(1, "Restaurant type is required"),
  contactNo: z.string().optional(),
  address: z.string().optional(),
  restaurantLogo: z.string().optional(),
  instagram: z.string().optional(),
  whatsapp: z.string().optional(),
  facebook: z.string().optional(),
  googleMap: z.string().optional(),
  status: z.string().default("active"),
  restaurantId: z.string().optional(),
});

export type InsertBranch = z.infer<typeof insertBranchSchema>;
export type Branch = InsertBranch & { id: string; createdAt: Date; };

// Menu item types
export const insertMenuItemSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  description: z.string().optional(),
  price: z.number().min(0, "Price must be positive"),
  category: z.string().min(1, "Category is required"),
  image: z.string().optional(),
  status: z.string().default("active"),
  restaurantId: z.string().optional(),
});

export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;
export type MenuItem = InsertMenuItem & { id: string; createdAt: Date; };

// Category types
export const insertCategorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  description: z.string().optional(),
  restaurantId: z.string().optional(),
});

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = InsertCategory & { id: string; createdAt: Date; };

// Deal types
export const insertDealSchema = z.object({
  name: z.string().min(1, "Deal name is required"),
  description: z.string().optional(),
  items: z.array(z.object({
    itemId: z.string(),
    quantity: z.number().min(1),
  })),
  originalPrice: z.number().min(0),
  discountedPrice: z.number().min(0),
  status: z.string().default("active"),
  expiryDate: z.date().optional(),
  image: z.string().optional(),
});

export type InsertDeal = z.infer<typeof insertDealSchema>;
export type Deal = InsertDeal & { id: string; createdAt: Date; };

// Ticket types
export const insertTicketSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  type: z.enum(["bug", "feature", "support"]),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  status: z.string().default("open"),
  assignedTo: z.string().optional(),
});

export type InsertTicket = z.infer<typeof insertTicketSchema>;
export type Ticket = InsertTicket & { id: string; createdAt: Date; };

// Feedback types
export interface Feedback {
  id: string;
  customerName: string;
  customerImage?: string;
  rating: number;
  comment: string;
  orderNumber: string;
  timestamp: Date;
  response?: string;
  status: "new" | "responded" | "archived";
}

// Analytics types
export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  customerSatisfaction: number;
}

export interface TopPerformingItems {
  name: string;
  revenue: number;
  orders: number;
}

export interface OccupancyData {
  name: string;
  value: number;
  fill: string;
}

export interface HourlyOrders {
  hour: string;
  orders: number;
}

// Table types
export interface Table {
  id: string;
  number: string;
  seatingCapacity: number;
  status: "available" | "occupied" | "reserved" | "maintenance";
  assignedWaiter?: string;
  restaurantId?: string;
}

// Order types
export interface Order {
  id: string;
  orderNumber: string;
  tableNumber: string;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: "pending" | "preparing" | "ready" | "served" | "completed";
  timestamp: Date;
  customerName?: string;
}

// Service types
export const insertServiceSchema = z.object({
  name: z.string().min(1, "Service name is required"),
  type: z.enum(["service", "paid"]),
  price: z.number().min(0),
  description: z.string().optional(),
  status: z.string().default("active"),
});

export type InsertService = z.infer<typeof insertServiceSchema>;
export type Service = InsertService & { id: string; createdAt: Date; };