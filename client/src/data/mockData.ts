// Mock data for client-side only application
export const mockUsers = [
  {
    id: "1",
    username: "admin",
    email: "admin@restaurant.com",
    name: "Admin User",
    phoneNumber: "1234567890",
    address: "123 Main St",
    image: "",
    role: "manager",
    assignedTable: null,
    assignedBranch: "branch-1",
    status: "active",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    username: "waiter1",
    email: "waiter1@restaurant.com",
    name: "John Waiter",
    phoneNumber: "1234567891",
    address: "456 Oak St",
    image: "",
    role: "waiter",
    assignedTable: "Table 1",
    assignedBranch: "branch-1",
    status: "active",
    createdAt: new Date("2024-01-02"),
  },
  {
    id: "3",
    username: "chef1",
    email: "chef1@restaurant.com",
    name: "Maria Chef",
    phoneNumber: "1234567892",
    address: "789 Pine St",
    image: "",
    role: "chef",
    assignedTable: null,
    assignedBranch: "branch-1",
    status: "active",
    createdAt: new Date("2024-01-03"),
  },
];

export const mockEntities = [
  {
    id: "entity-1",
    name: "Grand Restaurant",
    phone: "1234567890",
    address: "123 Food Street, City Center",
    certificateUrl: "",
    certificatePicture: "",
    profilePicture: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzMzNzNkYyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE4IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkdSPC90ZXh0Pjwvc3ZnPg==",
    entityType: "restaurant",
    status: "active",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "entity-2",
    name: "Luxury Hotel",
    phone: "1234567891",
    address: "456 Hotel Avenue, Downtown",
    certificateUrl: "",
    certificatePicture: "",
    profilePicture: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzEwYjk4MSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE4IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxIPC90ZXh0Pjwvc3ZnPg==",
    entityType: "hotel",
    status: "active",
    createdAt: new Date("2024-01-02"),
  },
];

export const mockRestaurants = [
  {
    id: "restaurant-1",
    name: "Grand Restaurant Main",
    imageUrl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y0NTEzZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE4IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkdSPC90ZXh0Pjwvc3ZnPg==",
    status: "active",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "restaurant-2",
    name: "Luxury Hotel Dining",
    imageUrl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzEwYjk4MSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE4IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxIPC90ZXh0Pjwvc3ZnPg==",
    status: "active",
    createdAt: new Date("2024-01-02"),
  },
];

export const mockBranches = [
  {
    id: "branch-1",
    name: "Downtown Branch",
    restaurantType: "Fine Dining",
    contactNo: "1234567890",
    address: "123 Main Street, Downtown",
    restaurantLogo: "",
    instagram: "@downtown_branch",
    whatsapp: "+1234567890",
    facebook: "downtown.branch",
    googleMap: "https://maps.google.com",
    restaurantId: "restaurant-1",
    entityId: "entity-1",
    status: "active",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "branch-2",
    name: "Mall Branch",
    restaurantType: "Casual Dining",
    contactNo: "1234567891",
    address: "456 Mall Street, Shopping Center",
    restaurantLogo: "",
    instagram: "@mall_branch",
    whatsapp: "+1234567891",
    facebook: "mall.branch",
    googleMap: "https://maps.google.com",
    restaurantId: "restaurant-1",
    entityId: "entity-1",
    status: "active",
    createdAt: new Date("2024-01-02"),
  },
  {
    id: "branch-3",
    name: "Luxury Suite Branch",
    restaurantType: "Hotel Restaurant",
    contactNo: "1234567892",
    address: "789 Hotel Avenue, Downtown",
    restaurantLogo: "",
    instagram: "@luxury_suite",
    whatsapp: "+1234567892",
    facebook: "luxury.suite",
    googleMap: "https://maps.google.com",
    restaurantId: "restaurant-2",
    entityId: "entity-2",
    status: "active",
    createdAt: new Date("2024-01-03"),
  },
  {
    id: "branch-4",
    name: "Executive Lounge",
    restaurantType: "Business Dining",
    contactNo: "1234567893",
    address: "321 Business District, City Center",
    restaurantLogo: "",
    instagram: "@executive_lounge",
    whatsapp: "+1234567893",
    facebook: "executive.lounge",
    googleMap: "https://maps.google.com",
    restaurantId: "restaurant-2",
    entityId: "entity-2",
    status: "active",
    createdAt: new Date("2024-01-04"),
  },
];

export const mockAnalytics = [
  {
    id: "1",
    date: "2024-08-01",
    revenue: 15000,
    customers: 45,
    orders: 32,
    menuItems: 125,
  },
  {
    id: "2",
    date: "2024-08-02",
    revenue: 18000,
    customers: 52,
    orders: 38,
    menuItems: 142,
  },
  {
    id: "3",
    date: "2024-08-03",
    revenue: 22000,
    customers: 61,
    orders: 45,
    menuItems: 158,
  },
];

export const mockCategories = [
  {
    id: "cat-1",
    name: "Appetizers",
    restaurantId: "restaurant-1",
    status: "active",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "cat-2",
    name: "Main Course",
    restaurantId: "restaurant-1",
    status: "active",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "cat-3",
    name: "Desserts",
    restaurantId: "restaurant-1",
    status: "active",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "cat-4",
    name: "Beverages",
    restaurantId: "restaurant-1",
    status: "active",
    createdAt: new Date("2024-01-01"),
  },
];

export const mockMenuItems = [
  {
    id: "menu-1",
    name: "Caesar Salad",
    description: "Fresh romaine lettuce with caesar dressing",
    price: 12.99,
    categoryId: "cat-1",
    restaurantId: "restaurant-1",
    image: "",
    status: "active",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "menu-2",
    name: "Grilled Salmon",
    description: "Fresh Atlantic salmon with herbs",
    price: 24.99,
    categoryId: "cat-2",
    restaurantId: "restaurant-1",
    image: "",
    status: "active",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "menu-3",
    name: "Chocolate Cake",
    description: "Rich chocolate cake with vanilla ice cream",
    price: 8.99,
    categoryId: "cat-3",
    restaurantId: "restaurant-1",
    image: "",
    status: "active",
    createdAt: new Date("2024-01-01"),
  },
];

export const mockOrders = [
  {
    id: "order-1",
    orderNumber: "ORD-001",
    customerName: "John Doe",
    tableNumber: "Table 5",
    items: ["Caesar Salad", "Grilled Salmon"],
    total: 37.98,
    status: "completed",
    orderType: "dine-in",
    createdAt: new Date("2024-08-12T10:30:00"),
  },
  {
    id: "order-2",
    orderNumber: "ORD-002",
    customerName: "Jane Smith",
    tableNumber: "Table 3",
    items: ["Chocolate Cake"],
    total: 8.99,
    status: "pending",
    orderType: "dine-in",
    createdAt: new Date("2024-08-12T11:15:00"),
  },
];

export const mockTables = [
  {
    id: "table-1",
    tableNumber: "Table 1",
    seatingCapacity: 4,
    status: "available",
    assignee: "John Waiter",
    restaurantId: "restaurant-1",
  },
  {
    id: "table-2",
    tableNumber: "Table 2",
    seatingCapacity: 2,
    status: "occupied",
    assignee: "John Waiter",
    restaurantId: "restaurant-1",
  },
  {
    id: "table-3",
    tableNumber: "Table 3",
    seatingCapacity: 6,
    status: "available",
    assignee: "John Waiter",
    restaurantId: "restaurant-1",
  },
];

export const mockDeals = [
  {
    id: "deal-1",
    name: "Family Combo",
    description: "Perfect for families",
    items: [
      { name: "Caesar Salad", quantity: 2 },
      { name: "Grilled Salmon", quantity: 2 },
    ],
    originalPrice: 74.96,
    dealPrice: 59.99,
    status: "active",
    image: "",
    expiryTime: new Date("2024-12-31"),
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "deal-2",
    name: "Lunch Special",
    description: "Great lunch deal",
    items: [
      { name: "Caesar Salad", quantity: 1 },
      { name: "Chocolate Cake", quantity: 1 },
    ],
    originalPrice: 21.98,
    dealPrice: 17.99,
    status: "active",
    image: "",
    expiryTime: new Date("2024-12-31"),
    createdAt: new Date("2024-01-01"),
  },
];

export const mockServices = [
  {
    id: "service-1",
    name: "Request for Bottle",
    type: "free",
    isCustom: false,
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "service-2",
    name: "Request for Song",
    type: "free",
    isCustom: false,
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "service-3",
    name: "Extra Napkins",
    type: "free",
    isCustom: false,
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "service-4",
    name: "Special Birthday Setup",
    type: "paid",
    price: 25.00,
    isCustom: false,
    createdAt: new Date("2024-01-01"),
  },
];

export const mockFeedbacks = [
  {
    id: "feedback-1",
    customerName: "John Smith",
    customerImage: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjMzM3M2RjIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SlM8L3RleHQ+PC9zdmc+",
    rating: 5,
    comment: "Absolutely amazing dining experience! The Caesar salad was fresh and crispy, and the grilled salmon was perfectly cooked. The staff was attentive and friendly throughout our meal. The ambiance is perfect for both casual dining and special occasions. Will definitely be returning with friends and family. Highly recommend this place!",
    orderNumber: "ORD-001",
    feedbackDate: new Date("2024-08-12T14:30:00"),
    createdAt: new Date("2024-08-12T14:30:00"),
  },
  {
    id: "feedback-2",
    customerName: "Emily Johnson",
    customerImage: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjMTBiOTgxIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+RUo8L3RleHQ+PC9zdmc+",
    rating: 4,
    comment: "Great atmosphere and lovely interior design. The food was good overall, though I felt the chocolate cake could have been a bit more moist. Service was prompt and the waiters were very polite. The location is convenient and parking was easy. Would come back to try other items on the menu.",
    orderNumber: "ORD-002",
    feedbackDate: new Date("2024-08-12T15:45:00"),
    createdAt: new Date("2024-08-12T15:45:00"),
  },
  {
    id: "feedback-3",
    customerName: "Michael Brown",
    customerImage: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjZjU5ZTBiIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+TUI8L3RleHQ+PC9zdmc+",
    rating: 5,
    comment: "Outstanding service and incredible food quality! Every dish was expertly prepared and beautifully presented. The family combo deal was excellent value for money. Our server was knowledgeable about the menu and made great recommendations. This has become our favorite family restaurant in the area.",
    orderNumber: "ORD-003",
    feedbackDate: new Date("2024-08-12T18:15:00"),
    createdAt: new Date("2024-08-12T18:15:00"),
  },
  {
    id: "feedback-4",
    customerName: "Sarah Wilson",
    customerImage: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjZWY0NDQ0Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+U1c8L3RleHQ+PC9zdmc+",
    rating: 3,
    comment: "The food was decent but nothing exceptional. The lunch special was reasonably priced. However, the wait time was quite long even though the restaurant wasn't very busy. The dessert was the highlight of the meal. Room for improvement in service efficiency.",
    orderNumber: "ORD-004",
    feedbackDate: new Date("2024-08-12T12:45:00"),
    createdAt: new Date("2024-08-12T12:45:00"),
  },
];

export const mockTickets = [
  {
    id: "ticket-1",
    title: "Menu item image not loading",
    description: "The image for Caesar Salad is not displaying properly",
    type: "bug",
    priority: "medium",
    status: "open",
    assignee: "Admin User",
    createdAt: new Date("2024-08-12T09:00:00"),
  },
  {
    id: "ticket-2",
    title: "Add online ordering feature",
    description: "Customers want to be able to place orders online",
    type: "feature",
    priority: "high",
    status: "in-progress",
    assignee: "Admin User",
    createdAt: new Date("2024-08-11T16:30:00"),
  },
];

// Local storage keys
export const STORAGE_KEYS = {
  USERS: 'restaurant_users',
  ENTITIES: 'restaurant_entities',
  RESTAURANTS: 'restaurant_restaurants',
  BRANCHES: 'restaurant_branches',
  ANALYTICS: 'restaurant_analytics',
  CATEGORIES: 'restaurant_categories',
  MENU_ITEMS: 'restaurant_menu_items',
  ORDERS: 'restaurant_orders',
  TABLES: 'restaurant_tables',
  DEALS: 'restaurant_deals',
  SERVICES: 'restaurant_services',
  FEEDBACKS: 'restaurant_feedbacks',
  TICKETS: 'restaurant_tickets',
  CURRENT_USER: 'restaurant_current_user',
};

// Initialize local storage with mock data if not exists
export function initializeLocalStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(mockUsers));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ENTITIES)) {
    localStorage.setItem(STORAGE_KEYS.ENTITIES, JSON.stringify(mockEntities));
  }
  if (!localStorage.getItem(STORAGE_KEYS.RESTAURANTS)) {
    localStorage.setItem(STORAGE_KEYS.RESTAURANTS, JSON.stringify(mockRestaurants));
  }
  if (!localStorage.getItem(STORAGE_KEYS.BRANCHES)) {
    localStorage.setItem(STORAGE_KEYS.BRANCHES, JSON.stringify(mockBranches));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ANALYTICS)) {
    localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(mockAnalytics));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(mockCategories));
  }
  if (!localStorage.getItem(STORAGE_KEYS.MENU_ITEMS)) {
    localStorage.setItem(STORAGE_KEYS.MENU_ITEMS, JSON.stringify(mockMenuItems));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(mockOrders));
  }
  if (!localStorage.getItem(STORAGE_KEYS.TABLES)) {
    localStorage.setItem(STORAGE_KEYS.TABLES, JSON.stringify(mockTables));
  }
  if (!localStorage.getItem(STORAGE_KEYS.DEALS)) {
    localStorage.setItem(STORAGE_KEYS.DEALS, JSON.stringify(mockDeals));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SERVICES)) {
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(mockServices));
  }
  if (!localStorage.getItem(STORAGE_KEYS.FEEDBACKS)) {
    localStorage.setItem(STORAGE_KEYS.FEEDBACKS, JSON.stringify(mockFeedbacks));
  }
  if (!localStorage.getItem(STORAGE_KEYS.TICKETS)) {
    localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(mockTickets));
  }
}