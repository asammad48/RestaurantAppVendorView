# Restaurant Management System

## Overview

This is a full-stack restaurant and hotel management application built with React/TypeScript frontend and Express.js backend. The system provides comprehensive Entity management functionality for both hotels and restaurants, including user management, analytics, and reporting through an intuitive dashboard interface. It's designed to handle multiple entities with role-based access control for managers, waiters, and chefs.

## Recent Changes (August 2025)

- **Entity System Implementation**: Replaced restaurant-only system with unified Entity management supporting both hotels and restaurants
- **File Upload Functionality**: Implemented image-only file upload for profile pictures and certificate pictures (Base64 encoding)
- **Dynamic Page Routing**: Added hotel-management and restaurant-management pages with context-aware titles
- **Mobile Responsive Design**: Full responsive design implementation for all Entity components
- **Pricing Plans Modal**: Added subscription pricing modal with Basic/Standard/Premium tiers that shows after entity creation
- **Orders Management System**: Comprehensive orders dashboard with tabs for Orders, Menu, Tables, Deals, and Discount management
- **Menu Management**: Complete menu CRUD operations with Add Menu modal featuring add-ons, customizations, and variants
- **Apply Discount Modal**: Multi-select menu items discount application with category selection and percentage-based pricing adjustments
- **Menu Section Implementation**: Full menu management interface with searchable item listings, category filtering, and comprehensive CRUD operations
- **Migration to Replit**: Successfully migrated from Replit Agent environment with all dependencies and functionality intact
- **Replit Environment Migration Complete (August 2025)**: Successfully completed full migration to Replit environment with proper dependency installation, workflow configuration, and application verification
- **Branch Management System**: Implemented missing branches functionality with intermediate branch selection screen between entities and management pages
- **Trial User Integration**: Added pricing plans modal that shows when trial users try to access branch management or create new branches
- **Entity-to-Branch Navigation Flow**: Fixed navigation flow so entity "Manage" button goes to branches page, then branch "Manage" button goes to management screens
- **Deals & Services System**: Replaced "Discount" tab with "Deals" and "Services" tabs in orders section
- **Add Deals Modal**: Complete deals management with deal name, items with quantities, pricing, status, image upload, and expiry time
- **Add Services Modal**: Multi-select services system with predefined free and paid options (Request for Bottle, Request for Song, etc.) plus custom service creation
- **Ticket Management System**: Added complete ticket reporting system with Add Ticket modal for bug reports, feature requests, and support tickets
- **Enhanced User Management**: Implemented comprehensive Add/Edit User modal with profile pictures, role assignment, and branch management
- **Reporting Page Redesign**: Transformed reporting page to display ticket management table with search, filtering, and pagination functionality
- **Complete Feedback System Implementation**: Built comprehensive customer feedback system with customer profiles, star ratings, order numbers, feedback timestamps, and pagination functionality
- **Enhanced Card Design System**: Implemented attractive entity and branch cards with gradient overlays, hover effects, fascinating animated buttons with green color scheme, proper text centering, and visual feedback effects
- **Comprehensive Dashboard Analytics**: Built complete analytics dashboard with sales summary cards (Revenue, Orders, Average Order Value), top performing items bar chart, occupancy gauge chart, peak hours line chart, and customer feedback pie chart with Today/This Week/This Month toggle functionality
- **Advanced Analytics System Migration (August 2025)**: Successfully migrated and implemented comprehensive analytics model with 7 specialized analytics categories: Sales Analytics (filterable by date range, branch, order type with daily/weekly/monthly trends), Menu Performance (top/worst performing dishes, profit margins, seasonal performance), Customer Analytics (repeat vs new customers, average spend, loyalty program engagement, feedback ratings), Operational Analytics (table turnover rate, service time, delivery performance), Inventory & Wastage Analytics (ingredient usage, shrinkage reports, stock levels), Staff Performance Reports (sales per staff, handling time, upsell effectiveness), and Order Volume Heatmap (time-of-day distribution patterns)
- **UI Improvements Implementation (August 2025)**: Successfully implemented comprehensive UI improvements: removed checkboxes from deals table and added edit/delete dropdown menus, removed edit/delete buttons from all service cards, styled Add Table button green, added edit/delete functionality to menu and category context menus, and fixed Apply Discount modal to have only one close button
- **Appearance Customization System (August 2025)**: Implemented complete appearance customization page with professional gradient color picker interface, horizontal color strip selector, real-time preview functionality showing dynamic color changes across restaurant header, pricing text, and action buttons, RGB/Hex color value display, and integrated navigation from branches page with dedicated Appearance button
- **Enhanced Search Functionality (August 2025)**: Implemented comprehensive search system across all hotel/restaurant management sections with clickable search icons in table headers that trigger prompt-based search inputs, real-time filtering, and proper tooltip integration for Orders (search by order number/table), Menu (search by item name/category), Category (search by category name), and Deals (search by deal name/items) sections
- **Replit Environment Migration Complete (August 2025)**: Successfully completed full migration from Replit Agent to Replit environment with proper dependency installation, workflow configuration, application verification, and login navigation fix to automatically redirect users to dashboard after successful authentication
- **Login Navigation & Authentication Persistence Fix (August 2025)**: Fixed login flow to redirect users to dashboard instead of entities page and resolved localStorage persistence issues for maintaining authentication state across page refreshes with proper Date serialization handling
- **External API Integration for Signup (August 2025)**: Successfully integrated external restaurant owner signup API endpoint (https://81w6jsg0-7261.inc1.devtunnels.ms/api/User/restaurant-owner) with proper error handling, user data mapping, and local session management while maintaining the existing restaurant management system functionality
- **Generic API Repository Implementation (August 2025)**: Implemented comprehensive API repository pattern with centralized error handling, automatic token refresh on 401 responses, configurable base URL and endpoints, and standardized error message display for 400/401/403/404/422/500 status codes with helper functions for CRUD operations and special handling for 422 validation error arrays that are joined with periods for user-friendly display
- **Server-Side Code Complete Removal (August 2025)**: Successfully removed all Node.js/Express server code, database dependencies (Drizzle ORM, PostgreSQL), and backend routes. Replaced shared schema with local type definitions. Application now runs purely on Vite development server with external API integration through generic repository pattern
- **Entity API Integration (August 2025)**: Successfully integrated complete Entity CRUD operations with external API endpoints (/api/Entity) including FormData support for profile and certificate picture uploads, proper authentication token handling, and entity type mapping (1=hotel, 2=restaurant) with real-time data fetching and display
- **Replit Migration Complete (August 2025)**: Successfully completed migration from Replit Agent to Replit environment with proper dependency installation (tsx, esbuild), API repository configuration for multipart/form-data uploads with authentication tokens, and full EditEntityModal implementation ensuring all Entity operations use proper FormData structure for file uploads and token-based authentication
- **EditEntityModal Fixes (August 2025)**: Fixed image upload crash prevention by adding proper error handling and safe URL validation for profile and certificate pictures, corrected entity type mapping logic to properly handle API response values (hotel=1, restaurant=2), and resolved API URL parameter replacement issue where entity ID wasn't being properly passed to updateEntity endpoint

## User Preferences

Preferred communication style: Simple, everyday language.
Technical preferences:
- Use dummy/mock data instead of database connections
- Remove API endpoints and render data directly from React components
- UI styling: Order buttons should have gray background matching tables
- Services: "Free Services" should be labeled as "Services"
- Remove edit/delete buttons from all service cards (including paid services) 
- Table modals: Fix duplicate close buttons, edit modal should only allow editing seating capacity and assignee
- Menu section: Menu and category buttons should have gray background, only down border, highlighted items have green border
- Add Table button should be green
- Deals table: Remove checkboxes, add edit/delete context menu functionality
- Apply Discount modal: Should have only one close button
- Menu and category context menus: Add edit/delete buttons with proper functionality

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite as the build tool
- **UI Components**: Radix UI primitives with shadcn/ui component library for consistent design
- **Styling**: Tailwind CSS with CSS variables for theming support (light/dark modes)
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **Authentication**: Custom auth context with localStorage persistence
- **Form Handling**: React Hook Form with Zod validation
- **Charts**: Recharts for data visualization (donut charts, bar charts)

### Data Management (Frontend-Only with External APIs)
- **Framework**: Pure client-side React application with TypeScript
- **External API Integration**: Generic API repository pattern for all external API calls
- **Data Storage**: localStorage-based session management and local data caching
- **Mock Data**: Fallback dataset for development and testing purposes
- **API Repository**: Centralized error handling, token management, and configurable endpoints
- **Development Server**: Vite development server for frontend-only architecture

### Authentication & Authorization
- **Strategy**: Simple username/password authentication with role-based access
- **Roles**: Manager, Waiter, Chef with different permissions
- **Session Persistence**: localStorage for client-side session management
- **Protected Routes**: Route-level protection with authentication checks

### Data Models
- **Users**: Username, email, password, role, assigned table/branch, status
- **Restaurants**: Name, image URL, status (active/inactive)
- **Analytics**: Date-based metrics for revenue, customers, orders, menu items

### Component Architecture
- **Layout System**: Sidebar navigation with header and main content area
- **Reusable Components**: Card-based UI with consistent styling patterns
- **Data Tables**: Paginated tables with sorting, filtering, and search capabilities
- **Charts**: Responsive chart components with consistent theming
- **Forms**: Validated forms with error handling and loading states

## External Dependencies

### Core Framework Dependencies
- **@neondatabase/serverless**: PostgreSQL database driver for serverless environments
- **drizzle-orm**: Type-safe ORM with PostgreSQL support
- **drizzle-kit**: Database migration and schema management tools

### UI and Styling
- **@radix-ui/react-***: Comprehensive set of accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Type-safe variant API for component styling
- **clsx**: Conditional CSS class utility

### Data Management
- **@tanstack/react-query**: Server state management and caching
- **react-hook-form**: Form state management and validation
- **zod**: Runtime type validation and schema definition
- **date-fns**: Date manipulation and formatting

### Development Tools
- **vite**: Fast build tool and development server
- **typescript**: Static type checking
- **@replit/vite-plugin-runtime-error-modal**: Development error overlay
- **@replit/vite-plugin-cartographer**: Development tooling integration

### Charts and Visualization
- **recharts**: React charting library for analytics dashboards

### Routing and Navigation
- **wouter**: Minimalist routing library for React

The application is structured as a monorepo with shared schema definitions, enabling type safety across the full stack while maintaining clear separation between client and server code.