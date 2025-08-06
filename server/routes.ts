import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { loginSchema, signupSchema, insertEntitySchema, insertRestaurantSchema, insertUserSchema, insertBranchSchema, insertMenuItemSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = loginSchema.parse(req.body);
      
      const user = await storage.getUserByUsername(username);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/auth/signup", async (req, res) => {
    try {
      const { username, email, password } = signupSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(username) || await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const user = await storage.createUser({
        username,
        email,
        password,
        role: "waiter",
        assignedTable: null,
        assignedBranch: null,
        status: "active",
      });

      const { password: _, ...userWithoutPassword } = user;
      res.status(201).json({ user: userWithoutPassword });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // User routes
  app.get("/api/users", async (req, res) => {
    try {
      const { role } = req.query;
      let users;
      
      if (role && typeof role === "string") {
        users = await storage.getUsersByRole(role);
      } else {
        users = await storage.getAllUsers();
      }

      const usersWithoutPasswords = users.map(({ password, ...user }) => user);
      res.json(usersWithoutPasswords);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      const { password: _, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/api/users/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const user = await storage.updateUser(id, updateData);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/users/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteUser(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Entity routes
  app.get("/api/entities", async (req, res) => {
    try {
      const entities = await storage.getAllEntities();
      res.json(entities);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/entities", async (req, res) => {
    try {
      const entityData = insertEntitySchema.parse(req.body);
      const entity = await storage.createEntity(entityData);
      res.status(201).json(entity);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/api/entities/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const entity = await storage.updateEntity(id, updateData);
      if (!entity) {
        return res.status(404).json({ message: "Entity not found" });
      }

      res.json(entity);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/entities/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteEntity(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Entity not found" });
      }

      res.json({ message: "Entity deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Restaurant routes
  app.get("/api/restaurants", async (req, res) => {
    try {
      const restaurants = await storage.getAllRestaurants();
      res.json(restaurants);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/restaurants", async (req, res) => {
    try {
      const restaurantData = insertRestaurantSchema.parse(req.body);
      const restaurant = await storage.createRestaurant(restaurantData);
      res.status(201).json(restaurant);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/api/restaurants/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const restaurant = await storage.updateRestaurant(id, updateData);
      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }

      res.json(restaurant);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/restaurants/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteRestaurant(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Restaurant not found" });
      }

      res.json({ message: "Restaurant deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Branch routes
  app.get("/api/branches", async (req, res) => {
    try {
      const { restaurantId } = req.query;
      let branches;
      
      if (restaurantId && typeof restaurantId === "string") {
        branches = await storage.getBranchesByRestaurant(restaurantId);
      } else {
        branches = await storage.getAllBranches();
      }

      res.json(branches);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/branches/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const branch = await storage.getBranch(id);
      
      if (!branch) {
        return res.status(404).json({ message: "Branch not found" });
      }

      res.json(branch);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/branches", async (req, res) => {
    try {
      const branchData = insertBranchSchema.parse(req.body);
      const branch = await storage.createBranch(branchData);
      res.status(201).json(branch);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/api/branches/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = insertBranchSchema.partial().parse(req.body);
      
      const branch = await storage.updateBranch(id, updateData);
      if (!branch) {
        return res.status(404).json({ message: "Branch not found" });
      }

      res.json(branch);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/branches/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteBranch(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Branch not found" });
      }

      res.json({ message: "Branch deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Analytics routes
  app.get("/api/analytics", async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      
      let analytics;
      if (startDate && endDate && typeof startDate === "string" && typeof endDate === "string") {
        analytics = await storage.getAnalyticsByDateRange(startDate, endDate);
      } else {
        analytics = await storage.getAnalytics();
      }

      res.json(analytics);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Menu Item routes
  app.get("/api/menu-items", async (req, res) => {
    try {
      const { restaurantId, category } = req.query;
      let menuItems;
      
      if (restaurantId && typeof restaurantId === "string") {
        menuItems = await storage.getMenuItemsByRestaurant(restaurantId);
      } else if (category && typeof category === "string") {
        menuItems = await storage.getMenuItemsByCategory(category);
      } else {
        menuItems = await storage.getAllMenuItems();
      }

      res.json(menuItems);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/menu-items/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const menuItem = await storage.getMenuItem(id);
      
      if (!menuItem) {
        return res.status(404).json({ message: "Menu item not found" });
      }

      res.json(menuItem);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/menu-items", async (req, res) => {
    try {
      const menuItemData = insertMenuItemSchema.parse(req.body);
      const menuItem = await storage.createMenuItem(menuItemData);
      res.status(201).json(menuItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/api/menu-items/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = insertMenuItemSchema.partial().parse(req.body);
      
      const menuItem = await storage.updateMenuItem(id, updateData);
      if (!menuItem) {
        return res.status(404).json({ message: "Menu item not found" });
      }

      res.json(menuItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/menu-items/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteMenuItem(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Menu item not found" });
      }

      res.json({ message: "Menu item deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Dashboard stats route
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const analytics = await storage.getAnalytics();
      const users = await storage.getAllUsers();
      const restaurants = await storage.getAllRestaurants();
      const menuItems = await storage.getAllMenuItems();

      // Calculate totals
      const totalRevenue = analytics.reduce((sum, item) => sum + item.revenue, 0);
      const totalCustomers = analytics.reduce((sum, item) => sum + item.customers, 0);
      const totalOrders = analytics.reduce((sum, item) => sum + item.orders, 0);
      const totalMenuItems = menuItems.length;

      res.json({
        totalRevenue,
        totalCustomers,
        totalOrders,
        totalMenuItems,
        totalUsers: users.length,
        totalRestaurants: restaurants.length,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
