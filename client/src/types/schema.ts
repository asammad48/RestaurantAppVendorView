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

// MenuCategory types (matching API response)
export interface MenuCategory {
  id: number;
  branchId: number;
  name: string;
  isActive: boolean;
}

export const insertMenuCategorySchema = z.object({
  branchId: z.number().min(1, "Branch ID is required"),
  name: z.string().min(1, "Category name is required"),
});

export type InsertMenuCategory = z.infer<typeof insertMenuCategorySchema>;

// Branch types (matching API response)
export type Branch = {
  id: number;
  entityId: number;
  userId: number;
  name: string;
  address: string;
  subscriptionId: number;
  contactNumber?: string;
  trialEndDate: string;
  gracePeriodEndDate: string;
  billingStartDate: string;
  restaurantLogo: string;
  restaurantBanner: string;
  instagramLink: string;
  whatsappLink: string;
  facebookLink: string;
  googleMapsLink: string;
  // UI helper properties
  restaurantType?: string;
  status?: string;
};

// Branch creation/update schema for forms
export const insertBranchSchema = z.object({
  Name: z.string().min(1, "Branch name is required"),
  Address: z.string().min(1, "Address is required"),
  ContactNumber: z.string().optional(),
  EntityId: z.number().min(1, "Entity ID is required"),
  SubscriptionId: z.number().default(1),
  InstagramLink: z.string().optional(),
  WhatsappLink: z.string().optional(),
  FacebookLink: z.string().optional(),
  GoogleMapsLink: z.string().optional(),
});

export type InsertBranch = z.infer<typeof insertBranchSchema>;

// Menu item types for API
export interface MenuItemVariant {
  name: string;
  price: number;
}

export interface MenuItemModifier {
  name: string;
  price: number;
}

export interface MenuItemCustomizationOption {
  id: number;
  name: string;
}

export interface MenuItemCustomization {
  id: number;
  name: string;
  options: MenuItemCustomizationOption[];
}

export interface MenuItem {
  id: number;
  menuCategoryId: number;
  name: string;
  description: string;
  isActive: boolean;
  preparationTime: number;
  menuItemPicture: string;
  variants: MenuItemVariant[];
  modifiers: MenuItemModifier[];
  customizations: MenuItemCustomization[];
}

// Menu item creation/update schema for forms
export const insertMenuItemSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  description: z.string().optional(),
  price: z.number().min(0, "Price must be positive"),
  category: z.string().min(1, "Category is required"),
  image: z.string().optional(),
  status: z.string().default("active"),
  restaurantId: z.string().optional(),
  preparationTime: z.number().min(1, "Preparation time must be at least 1 minute"),
  addOns: z.array(z.string()).optional(),
  customizations: z.array(z.string()).optional(),
  variants: z.array(z.string()).optional(),
});

export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;

// Category types
export const insertCategorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  description: z.string().optional(),
  restaurantId: z.string().optional(),
});

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = InsertCategory & { id: string; createdAt: Date; };

// Simple Menu Item types for deals (from API response)
export interface SimpleMenuItem {
  menuItemId: number;
  menuItemName: string;
}

// Deal types (matching API structure)
export interface DealMenuItem {
  menuItemId: number;
  quantity: number;
}

export interface Deal {
  id: number;
  branchId: number;
  name: string;
  description: string;
  price: number;
  packagePicture: string;
  expiryDate: string;
  isActive: boolean;
  menuItems: Array<{
    menuItemId: number;
    menuItemName: string;
    quantity: number;
  }>;
}

// Discount types
export const insertDiscountSchema = z.object({
  name: z.string().min(1, "Discount name is required"),
  discountType: z.enum(["Flat", "Percentage"], {
    required_error: "Please select discount type"
  }),
  discountValue: z.number().min(0, "Discount value must be positive"),
  maxDiscountAmount: z.number().min(0, "Max discount amount must be positive").optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
});

export type InsertDiscount = z.infer<typeof insertDiscountSchema>;

export interface Discount {
  id: number;
  name: string;
  discountType: "Flat" | "Percentage";
  discountValue: number;
  maxDiscountAmount?: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  branchId: number;
}

export const insertDealSchema = z.object({
  branchId: z.number().min(1, "Branch ID is required"),
  name: z.string().min(1, "Deal name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(0, "Price must be positive"),
  packagePicture: z.string().optional(),
  expiryDate: z.string().optional(),
  menuItems: z.array(z.object({
    menuItemId: z.number(),
    quantity: z.number().min(1),
  })).min(1, "At least one menu item is required"),
});

export type InsertDeal = z.infer<typeof insertDealSchema>;

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