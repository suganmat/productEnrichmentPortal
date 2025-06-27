# Category Management System

## Overview

This is a full-stack TypeScript application built with Express.js backend and React frontend that manages product categorization and variant grouping. The system uses machine learning suggestions to help categorize products and organize product variants into logical groups through an intuitive drag-and-drop interface.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: Wouter for lightweight client-side routing
- **Drag & Drop**: react-dnd with HTML5 backend

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Development**: tsx for TypeScript execution
- **Deployment**: esbuild for production bundling

### Data Storage
- **Database**: PostgreSQL (configured for Neon serverless)
- **ORM**: Drizzle ORM with schema-first approach
- **Migrations**: Drizzle Kit for database schema management
- **Connection**: @neondatabase/serverless driver

## Key Components

### Database Schema
1. **Category Mappings Table**: Stores incoming seller categories, ML suggestions, and user selections
2. **Product Variants Table**: Manages product grouping with tags and seller information
3. **Users Table**: Basic user authentication structure

### API Endpoints
- `GET /api/category-mappings` - Fetch all category mappings
- `PATCH /api/category-mappings/:id` - Update selected category
- `POST /api/category-mappings/approve` - Approve all mappings
- `GET /api/product-variants` - Fetch product variants
- `PATCH /api/product-variants/:id` - Update product tags

### Frontend Pages
1. **Dashboard**: Main interface with tabbed navigation
   - Category Mapping tab for managing product categories
   - Product-variant Grouping tab for organizing variants

### Core Features
1. **Category Mapping**: Review ML suggestions and manually select appropriate categories
2. **Product Grouping**: Drag-and-drop interface for organizing product variants
3. **Validation**: Business logic ensures proper grouping (same seller, category, brand)
4. **Approval Workflow**: Batch approval of category mappings

## Data Flow

1. **Category Mapping Flow**:
   - System receives incoming seller categories
   - ML model provides category suggestions
   - Users review and select appropriate categories
   - Approved mappings are processed

2. **Product Variant Flow**:
   - Products are loaded with existing tags
   - Users can drag group tags between products
   - System validates compatibility before allowing drops
   - Changes are persisted to database

## External Dependencies

### Backend Dependencies
- **Database**: Neon PostgreSQL serverless
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Validation**: Zod for schema validation
- **Session**: connect-pg-simple for PostgreSQL session storage

### Frontend Dependencies
- **UI Components**: Extensive shadcn/ui component library
- **Icons**: Lucide React icons
- **Date Handling**: date-fns for date operations
- **Form Handling**: React Hook Form with resolvers

## Deployment Strategy

### Development
- **Runtime**: Node.js 20
- **Database**: PostgreSQL 16 module
- **Dev Server**: Vite dev server with Express API
- **Port**: 5000 (mapped to external port 80)

### Production Build
1. Frontend built with Vite to `dist/public`
2. Backend bundled with esbuild to `dist/index.js`
3. Static files served from Express in production
4. Auto-scaling deployment target

### Environment Setup
- Requires `DATABASE_URL` environment variable
- Uses Replit modules for Node.js, web, and PostgreSQL
- Drizzle migrations stored in `./migrations` directory

## Changelog

Changelog:
- June 27, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.