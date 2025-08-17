# Restaurant Management System

## Overview
This is a full-stack restaurant and hotel management application. Its main purpose is to provide comprehensive entity management functionality for both hotels and restaurants, including user management, analytics, and reporting through an intuitive dashboard. It supports multiple entities with role-based access control for managers, waiters, and chefs, aiming to streamline operations and enhance decision-making in the hospitality sector. Key capabilities include dynamic page routing, mobile responsiveness, subscription plan integration, comprehensive orders and menu management (including deals and services), ticket reporting, user management, and advanced analytics.

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
- **Framework**: React 18 with TypeScript and Vite.
- **UI Components**: Radix UI primitives and shadcn/ui.
- **Styling**: Tailwind CSS with CSS variables for theming.
- **Routing**: Wouter for client-side routing.
- **State Management**: TanStack Query for server state.
- **Authentication**: Custom auth context with localStorage persistence.
- **Form Handling**: React Hook Form with Zod validation.
- **Charts**: Recharts for data visualization.

### Data Management (Frontend-Only with External APIs)
- **Architecture**: Pure client-side React application.
- **External API Integration**: Generic API repository pattern for all external API calls.
- **Data Storage**: localStorage for session management and local caching.
- **Development Data**: Mock data for development and testing.
- **API Repository**: Centralized error handling, token management, and configurable endpoints, handling 400/401/403/404/422/500 status codes.
- **Server Removal**: All Node.js/Express server code, database dependencies (Drizzle ORM, PostgreSQL) have been removed.

### Authentication & Authorization
- **Strategy**: Username/password authentication with role-based access.
- **Roles**: Manager, Waiter, Chef with distinct permissions.
- **Session Persistence**: localStorage for client-side session management.
- **Protected Routes**: Route-level protection with authentication checks.

### Core Features & Design
- **Unified Entity Management**: Supports both hotels and restaurants, replacing previous restaurant-only system.
- **File Upload**: Image-only file upload for profile/certificate pictures (Base64 encoding, FormData for API).
- **Mobile Responsiveness**: Full responsive design across all components.
- **Comprehensive Management Systems**: Includes Orders, Menu (with CRUD, add-ons, customizations), Deals, Services, and Tickets.
- **User Management**: Comprehensive Add/Edit User modal with profile pictures, role, and branch assignment.
- **Dashboard Analytics**: Sales summary, item performance, occupancy, peak hours, customer feedback with date range toggles and 7 specialized categories.
- **Appearance Customization**: Gradient color picker for real-time UI previews.
- **Enhanced Search**: Clickable search icons in table headers for real-time filtering across sections.
- **Card Design**: Attractive entity and branch cards with gradient overlays, hover effects, and animated buttons.

## External Dependencies

### UI and Styling
- **@radix-ui/react-***: UI primitives.
- **tailwindcss**: Utility-first CSS framework.
- **class-variance-authority**: Type-safe variant API.
- **clsx**: Conditional CSS class utility.

### Data Management
- **@tanstack/react-query**: Server state management.
- **react-hook-form**: Form state management.
- **zod**: Runtime type validation.
- **date-fns**: Date manipulation.

### Development Tools
- **vite**: Build tool and development server.
- **typescript**: Static type checking.
- **@replit/vite-plugin-runtime-error-modal**: Development error overlay.
- **@replit/vite-plugin-cartographer**: Development tooling integration.

### Charts and Visualization
- **recharts**: React charting library.

### Routing and Navigation
- **wouter**: Minimalist routing library.

### API Endpoints
- **Signup API**: `https://l5246g5z-7261.inc1.devtunnels.ms/api/User/restaurant-owner`
- **Entity API**: `https://l5246g5z-7261.inc1.devtunnels.ms/api/Entity`