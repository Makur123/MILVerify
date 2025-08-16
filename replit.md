# Overview

MIL Guard is a Media & Information Literacy application that helps users detect AI-generated content and develop critical thinking skills through interactive education. The application provides a comprehensive suite of tools for analyzing text, images, and audio content for AI generation indicators, combined with structured learning modules and verification tools for developing media literacy skills.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client is built using **React with TypeScript** and follows a component-based architecture:
- **Build System**: Vite for fast development and optimized production builds
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent design
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management and caching
- **UI Components**: Radix UI primitives wrapped with custom styling via shadcn/ui

## Backend Architecture
The server uses **Express.js with TypeScript** in a full-stack monorepo setup:
- **API Layer**: RESTful endpoints for content analysis, user management, and learning modules
- **File Handling**: Multer middleware for file uploads with 25MB size limits
- **Authentication**: JWT-based authentication with bcrypt password hashing
- **AI Integration**: OpenAI API integration for content analysis capabilities

## Data Storage Solutions
The application uses **PostgreSQL** as the primary database with **Drizzle ORM**:
- **Schema Design**: Structured tables for users, analyses, learning modules, user progress, and achievements
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Migration Strategy**: Drizzle Kit for schema migrations and management
- **In-Memory Fallback**: MemStorage implementation for development/testing scenarios

## Authentication and Authorization
**JWT-based authentication system**:
- User registration and login with email/password
- Password hashing using bcrypt with salt rounds
- JWT tokens for stateless authentication
- Client-side token storage in localStorage
- Protected routes requiring authentication for analysis features

## External Dependencies

### AI and Machine Learning
- **OpenAI API**: Primary service for content analysis and AI detection
- **Content Analysis**: Text, image, and audio processing capabilities

### Database and Storage
- **Neon Database**: Serverless PostgreSQL hosting
- **Drizzle ORM**: Type-safe database queries and schema management

### UI and Styling
- **shadcn/ui**: Component library built on Radix UI primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Unstyled, accessible component primitives
- **Lucide React**: Icon library for consistent iconography

### Development and Build Tools
- **Vite**: Build tool and development server
- **TypeScript**: Type safety across the full stack
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Tailwind CSS integration

### Additional Libraries
- **TanStack Query**: Server state management and caching
- **React Hook Form**: Form handling with validation
- **date-fns**: Date manipulation utilities
- **class-variance-authority**: Utility for managing component variants
- **Wouter**: Lightweight routing library for React