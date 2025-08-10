import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  phoneNumber: text("phone_number").notNull(),
  address: text("address"),
  image: text("image"), // Base64 encoded profile image
  role: text("role").notNull().default("waiter"), // waiter, manager, chef
  assignedTable: text("assigned_table"),
  assignedBranch: text("assigned_branch"),
  status: text("status").notNull().default("active"), // active, inactive
  createdAt: timestamp("created_at").defaultNow(),
});

export const entities = pgTable("entities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  certificateUrl: text("certificate_url"),
  certificatePicture: text("certificate_picture"),
  profilePicture: text("profile_picture").notNull(),
  entityType: text("entity_type").notNull(), // hotel, restaurant
  status: text("status").notNull().default("active"), // active, inactive
  createdAt: timestamp("created_at").defaultNow(),
});

// Keep restaurants table for backward compatibility in branches
export const restaurants = pgTable("restaurants", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  imageUrl: text("image_url").notNull(),
  status: text("status").notNull().default("active"), // active, inactive
  createdAt: timestamp("created_at").defaultNow(),
});

export const branches = pgTable("branches", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  restaurantType: text("restaurant_type").notNull(),
  contactNo: text("contact_no").notNull(),
  address: text("address").notNull(),
  restaurantLogo: text("restaurant_logo").default(""),
  instagram: text("instagram").default("").notNull(),
  whatsapp: text("whatsapp").default("").notNull(),
  facebook: text("facebook").default("").notNull(),
  googleMap: text("google_map").default("").notNull(),
  restaurantId: varchar("restaurant_id").references(() => restaurants.id),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const analytics = pgTable("analytics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: text("date").notNull(),
  revenue: integer("revenue").notNull(),
  customers: integer("customers").notNull(),
  orders: integer("orders").notNull(),
  menuItems: integer("menu_items").notNull(),
});

export const categories = pgTable("categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  restaurantId: varchar("restaurant_id").references(() => restaurants.id),
  status: text("status").notNull().default("active"), // active, inactive
  createdAt: timestamp("created_at").defaultNow(),
});

export const menuItems = pgTable("menu_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  category: text("category").notNull(),
  description: text("description"),
  image: text("image"),
  price: integer("price").notNull(), // price in cents
  addOns: text("add_ons").array(), // JSON array of add-ons [{name, price}]
  customizations: text("customizations").array(), // JSON array of customizations [{name, options: []}]
  variants: text("variants").array(), // JSON array of variants [{option, price}]
  restaurantId: varchar("restaurant_id").references(() => restaurants.id),
  status: text("status").notNull().default("active"), // active, inactive
  createdAt: timestamp("created_at").defaultNow(),
});

export const deals = pgTable("deals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  items: text("items").array().notNull(), // JSON array of items with quantities [{itemId, name, quantity}]
  dealPrice: integer("deal_price").notNull(), // price in cents
  image: text("image"),
  expiryTime: timestamp("expiry_time"),
  restaurantId: varchar("restaurant_id").references(() => restaurants.id),
  status: text("status").notNull().default("active"), // active, inactive
  createdAt: timestamp("created_at").defaultNow(),
});

export const services = pgTable("services", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(), // free, paid
  price: integer("price").default(0), // price in cents for paid services
  description: text("description"),
  restaurantId: varchar("restaurant_id").references(() => restaurants.id),
  status: text("status").notNull().default("active"), // active, inactive
  createdAt: timestamp("created_at").defaultNow(),
});

export const tickets = pgTable("tickets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  subject: text("subject").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  image: text("image"), // Base64 encoded image
  status: text("status").notNull().default("in_progress"), // in_progress, resolved, closed
  restaurantId: varchar("restaurant_id").references(() => restaurants.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const feedbacks = pgTable("feedbacks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerName: text("customer_name").notNull(),
  customerImage: text("customer_image"), // Profile picture URL or Base64
  rating: integer("rating").notNull(), // 1-5 star rating
  comment: text("comment").notNull(),
  orderNumber: text("order_number").notNull(),
  feedbackDate: timestamp("feedback_date").notNull(),
  restaurantId: varchar("restaurant_id").references(() => restaurants.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const dashboardStats = pgTable("dashboard_stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  period: text("period").notNull(), // today, this_week, this_month
  totalRevenue: integer("total_revenue").notNull(),
  totalOrders: integer("total_orders").notNull(),
  averageOrderValue: integer("average_order_value").notNull(),
  restaurantId: varchar("restaurant_id").references(() => restaurants.id),
  date: timestamp("date").defaultNow(),
});

export const topPerformingItems = pgTable("top_performing_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  itemName: text("item_name").notNull(),
  category: text("category").notNull(),
  salesAmount: integer("sales_amount").notNull(),
  orderCount: integer("order_count").notNull(),
  restaurantId: varchar("restaurant_id").references(() => restaurants.id),
  date: text("date").notNull(), // YYYY-MM-DD format
});

export const occupancyData = pgTable("occupancy_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  totalTables: integer("total_tables").notNull(),
  occupiedTables: integer("occupied_tables").notNull(),
  occupancyPercentage: integer("occupancy_percentage").notNull(),
  restaurantId: varchar("restaurant_id").references(() => restaurants.id),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const hourlyOrders = pgTable("hourly_orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  hour: integer("hour").notNull(), // 0-23
  orderCount: integer("order_count").notNull(),
  restaurantId: varchar("restaurant_id").references(() => restaurants.id),
  date: text("date").notNull(), // YYYY-MM-DD format
});

// Enhanced Analytics Tables
export const salesAnalytics = pgTable("sales_analytics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: text("date").notNull(),
  branchId: varchar("branch_id").references(() => branches.id),
  orderType: text("order_type").notNull(), // dine-in, takeaway, delivery
  totalRevenue: integer("total_revenue").notNull(),
  totalOrders: integer("total_orders").notNull(),
  averageOrderValue: integer("average_order_value").notNull(),
  restaurantId: varchar("restaurant_id").references(() => restaurants.id),
});

export const menuPerformance = pgTable("menu_performance", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  itemId: varchar("item_id").references(() => menuItems.id),
  itemName: text("item_name").notNull(),
  category: text("category").notNull(),
  totalSales: integer("total_sales").notNull(),
  orderCount: integer("order_count").notNull(),
  profitMargin: integer("profit_margin").notNull(), // percentage * 100
  seasonalRating: integer("seasonal_rating").default(0), // 0-100
  date: text("date").notNull(),
  restaurantId: varchar("restaurant_id").references(() => restaurants.id),
});

export const customerAnalytics = pgTable("customer_analytics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerId: text("customer_id").notNull(),
  customerType: text("customer_type").notNull(), // repeat, new
  totalSpend: integer("total_spend").notNull(),
  visitCount: integer("visit_count").notNull(),
  loyaltyPoints: integer("loyalty_points").default(0),
  lastVisit: timestamp("last_visit"),
  averageRating: integer("average_rating").default(0), // rating * 100
  date: text("date").notNull(),
  restaurantId: varchar("restaurant_id").references(() => restaurants.id),
});

export const operationalAnalytics = pgTable("operational_analytics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tableId: text("table_id").notNull(),
  turnoverRate: integer("turnover_rate").notNull(), // times per day * 100
  averageServiceTime: integer("average_service_time").notNull(), // minutes
  orderType: text("order_type").notNull(), // dine-in, takeaway, delivery
  performanceScore: integer("performance_score").notNull(), // 0-100
  date: text("date").notNull(),
  restaurantId: varchar("restaurant_id").references(() => restaurants.id),
});

export const inventoryAnalytics = pgTable("inventory_analytics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ingredientName: text("ingredient_name").notNull(),
  usageAmount: integer("usage_amount").notNull(),
  wastageAmount: integer("wastage_amount").default(0),
  stockLevel: integer("stock_level").notNull(),
  costPerUnit: integer("cost_per_unit").notNull(), // price in cents
  reorderLevel: integer("reorder_level").notNull(),
  date: text("date").notNull(),
  restaurantId: varchar("restaurant_id").references(() => restaurants.id),
});

export const staffPerformance = pgTable("staff_performance", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  staffId: varchar("staff_id").references(() => users.id),
  staffName: text("staff_name").notNull(),
  role: text("role").notNull(),
  salesAmount: integer("sales_amount").notNull(),
  ordersHandled: integer("orders_handled").notNull(),
  averageHandlingTime: integer("average_handling_time").notNull(), // minutes
  upsellCount: integer("upsell_count").default(0),
  customerRating: integer("customer_rating").default(0), // rating * 100
  date: text("date").notNull(),
  restaurantId: varchar("restaurant_id").references(() => restaurants.id),
});

export const revenueBreakdown = pgTable("revenue_breakdown", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  category: text("category").notNull(),
  subcategory: text("subcategory"),
  amount: integer("amount").notNull(),
  percentage: integer("percentage").notNull(), // percentage * 100
  date: text("date").notNull(),
  restaurantId: varchar("restaurant_id").references(() => restaurants.id),
});

export const orderVolumeHeatmap = pgTable("order_volume_heatmap", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  hour: integer("hour").notNull(), // 0-23
  dayOfWeek: integer("day_of_week").notNull(), // 0-6 (Sunday-Saturday)
  orderCount: integer("order_count").notNull(),
  intensity: integer("intensity").notNull(), // 0-100
  date: text("date").notNull(),
  restaurantId: varchar("restaurant_id").references(() => restaurants.id),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertEntitySchema = createInsertSchema(entities).omit({
  id: true,
  createdAt: true,
});

export const insertRestaurantSchema = createInsertSchema(restaurants).omit({
  id: true,
  createdAt: true,
});

export const insertBranchSchema = createInsertSchema(branches).omit({
  id: true,
  createdAt: true,
});

export const insertAnalyticsSchema = createInsertSchema(analytics).omit({
  id: true,
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
  createdAt: true,
});

export const insertMenuItemSchema = createInsertSchema(menuItems).omit({
  id: true,
  createdAt: true,
});

export const insertDealSchema = createInsertSchema(deals).omit({
  id: true,
  createdAt: true,
});

export const insertServiceSchema = createInsertSchema(services).omit({
  id: true,
  createdAt: true,
});

export const insertTicketSchema = createInsertSchema(tickets).omit({
  id: true,
  createdAt: true,
});

export const insertSalesAnalyticsSchema = createInsertSchema(salesAnalytics).omit({
  id: true,
});

export const insertMenuPerformanceSchema = createInsertSchema(menuPerformance).omit({
  id: true,
});

export const insertCustomerAnalyticsSchema = createInsertSchema(customerAnalytics).omit({
  id: true,
});

export const insertOperationalAnalyticsSchema = createInsertSchema(operationalAnalytics).omit({
  id: true,
});

export const insertInventoryAnalyticsSchema = createInsertSchema(inventoryAnalytics).omit({
  id: true,
});

export const insertStaffPerformanceSchema = createInsertSchema(staffPerformance).omit({
  id: true,
});

export const insertRevenueBreakdownSchema = createInsertSchema(revenueBreakdown).omit({
  id: true,
});

export const insertOrderVolumeHeatmapSchema = createInsertSchema(orderVolumeHeatmap).omit({
  id: true,
});

// Type exports for enhanced analytics
export type SalesAnalytics = typeof salesAnalytics.$inferSelect;
export type MenuPerformance = typeof menuPerformance.$inferSelect;
export type CustomerAnalytics = typeof customerAnalytics.$inferSelect;
export type OperationalAnalytics = typeof operationalAnalytics.$inferSelect;
export type InventoryAnalytics = typeof inventoryAnalytics.$inferSelect;
export type StaffPerformance = typeof staffPerformance.$inferSelect;
export type RevenueBreakdown = typeof revenueBreakdown.$inferSelect;
export type OrderVolumeHeatmap = typeof orderVolumeHeatmap.$inferSelect;

export const insertFeedbackSchema = createInsertSchema(feedbacks).omit({
  id: true,
  createdAt: true,
});

export const insertDashboardStatsSchema = createInsertSchema(dashboardStats).omit({
  id: true,
  date: true,
});

export const insertTopPerformingItemsSchema = createInsertSchema(topPerformingItems).omit({
  id: true,
});

export const insertOccupancyDataSchema = createInsertSchema(occupancyData).omit({
  id: true,
  timestamp: true,
});

export const insertHourlyOrdersSchema = createInsertSchema(hourlyOrders).omit({
  id: true,
});

export const loginSchema = z.object({
  username: z.string().min(1, "Username or email is required"),
  password: z.string().min(1, "Password is required"),
});

export const signupSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm password is required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertEntity = z.infer<typeof insertEntitySchema>;
export type Entity = typeof entities.$inferSelect;
export type InsertRestaurant = z.infer<typeof insertRestaurantSchema>;
export type Restaurant = typeof restaurants.$inferSelect;
export type InsertBranch = z.infer<typeof insertBranchSchema>;
export type Branch = typeof branches.$inferSelect;
export type InsertAnalytics = z.infer<typeof insertAnalyticsSchema>;
export type Analytics = typeof analytics.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;
export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;
export type MenuItem = typeof menuItems.$inferSelect;
export type InsertDeal = z.infer<typeof insertDealSchema>;
export type Deal = typeof deals.$inferSelect;
export type InsertService = z.infer<typeof insertServiceSchema>;
export type Service = typeof services.$inferSelect;
export type InsertTicket = z.infer<typeof insertTicketSchema>;
export type Ticket = typeof tickets.$inferSelect;
export type InsertFeedback = z.infer<typeof insertFeedbackSchema>;
export type Feedback = typeof feedbacks.$inferSelect;
export type InsertDashboardStats = z.infer<typeof insertDashboardStatsSchema>;
export type DashboardStats = typeof dashboardStats.$inferSelect;
export type InsertTopPerformingItems = z.infer<typeof insertTopPerformingItemsSchema>;
export type TopPerformingItems = typeof topPerformingItems.$inferSelect;
export type InsertOccupancyData = z.infer<typeof insertOccupancyDataSchema>;
export type OccupancyData = typeof occupancyData.$inferSelect;
export type InsertHourlyOrders = z.infer<typeof insertHourlyOrdersSchema>;
export type HourlyOrders = typeof hourlyOrders.$inferSelect;
export type LoginRequest = z.infer<typeof loginSchema>;
export type SignupRequest = z.infer<typeof signupSchema>;
