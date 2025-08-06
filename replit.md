# Restaurant Management System

## Overview

This is a full-stack restaurant and hotel management application built with React/TypeScript frontend and Express.js backend. The system provides comprehensive Entity management functionality for both hotels and restaurants, including user management, analytics, and reporting through an intuitive dashboard interface. It's designed to handle multiple entities with role-based access control for managers, waiters, and chefs.

## Recent Changes (August 2025)

- **Entity System Implementation**: Replaced restaurant-only system with unified Entity management supporting both hotels and restaurants
- **File Upload Functionality**: Implemented image-only file upload for profile pictures and certificate pictures (Base64 encoding)
- **Dynamic Page Routing**: Added hotel-management and restaurant-management pages with context-aware titles
- **Mobile Responsive Design**: Full responsive design implementation for all Entity components

## User Preferences

Preferred communication style: Simple, everyday language.

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

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Data Storage**: In-memory storage implementation with interface for easy database migration
- **API Design**: RESTful API with proper error handling and request logging
- **Session Management**: Express session handling with PostgreSQL session store
- **Development Server**: Vite integration for hot module replacement

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