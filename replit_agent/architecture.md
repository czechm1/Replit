# WebCeph Architecture

## Overview

WebCeph is a specialized web application designed for cephalometric analysis in dental/orthodontic contexts. The application provides tools for medical professionals to analyze radiographic images, detect landmarks, perform measurements, and generate comprehensive analyses of patient data.

The system follows a modern web architecture with a clear separation between frontend and backend components:

- React-based frontend with TypeScript for type safety
- Express.js backend with REST API endpoints
- PostgreSQL database with Drizzle ORM
- Vite for development and production builds

## System Architecture

The application follows a client-server architecture with the following components:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│    Frontend     │◄────┤     Backend     │◄────┤    Database     │
│    (React)      │     │    (Express)    │     │  (PostgreSQL)   │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### Directory Structure

```
├─ client/               # Frontend application
│  ├─ src/
│     ├─ components/     # React components
│     ├─ context/        # React context providers
│     ├─ hooks/          # Custom React hooks
│     ├─ lib/            # Shared utilities
│     ├─ pages/          # Main application pages
│     └─ styles/         # CSS and styling
├─ server/               # Backend application
│  ├─ index.ts           # Server entry point
│  ├─ routes.ts          # API route definitions
│  ├─ storage.ts         # Data access layer
│  └─ mock/              # Mock data for development
├─ shared/               # Shared TypeScript types
│  └─ schema.ts          # Database schema and types
```

## Key Components

### Frontend

1. **React Application**
   - Built with React and TypeScript
   - Uses Shadcn UI components based on Radix UI primitives
   - Tailwind CSS for styling

2. **State Management**
   - React Context API for global state (`AnalysisContext`)
   - React Query for remote data fetching and caching

3. **UI Components**
   - Custom Radiograph viewer for image manipulation and analysis
   - Analysis controls and visualization components
   - Responsive layout with mobile considerations

4. **Routing**
   - Uses Wouter for lightweight client-side routing
   - Main routes: home, cephalometric analysis

### Backend

1. **Express Server**
   - RESTful API endpoints for data retrieval and manipulation
   - Static file serving for images and public assets
   - Server-side rendering support with Vite integration

2. **API Endpoints**
   - Landmarks data retrieval
   - Tracing lines and analysis data
   - Patient and analysis management

3. **Data Layer**
   - Connection to PostgreSQL database via Drizzle ORM
   - Schema definitions with data validation using Zod

### Data Models

The application uses several key data models:

1. **Users** - Authentication and authorization information
2. **Landmarks** - Cephalometric landmarks with coordinates and metadata
3. **LandmarksCollection** - Collections of landmarks associated with patients and images
4. **Measurements** - Analysis measurements and results

## Data Flow

### User Interface Flow

1. User uploads or selects a cephalometric radiograph
2. The image is displayed in the RadiographViewer component
3. Landmarks can be detected automatically or placed manually
4. Analysis is performed based on landmark positions
5. Results are displayed in various visualization formats (chart, tracing lines)
6. User can export or save the analysis

### API Data Flow

1. Frontend requests data (landmarks, tracing lines) from the backend
2. Backend retrieves data from the database or mock files (during development)
3. Data is transformed into the appropriate format and returned to the frontend
4. Frontend renders the data in the appropriate visualization components

## External Dependencies

### Frontend Dependencies

- **React** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Radix UI** - Accessible component primitives
- **React Query** - Data fetching and caching
- **Framer Motion** - Animations (implied in README)

### Backend Dependencies

- **Express.js** - Web server
- **Drizzle ORM** - Database ORM
- **Zod** - Schema validation
- **Neon Database** - PostgreSQL database service (from `@neondatabase/serverless`)
- **Swagger UI** - API documentation

## Deployment Strategy

The application is configured to support several deployment options:

1. **Development Mode**
   - Local development server with `npm run dev`
   - Vite for frontend hot module replacement
   - File watching and automatic reloading

2. **Production Build**
   - Vite build process for frontend assets
   - ESBuild for server-side code
   - Combined into single distribution package

3. **Hosting**
   - Configured for Replit deployment
   - Support for cloud deployment (Cloudrun as specified in Replit configuration)
   - Environment variable configuration for database connection

4. **Database**
   - Uses Neon Database (serverless PostgreSQL)
   - Schema management with Drizzle ORM
   - Migration support with `drizzle-kit`

## Authentication and Authorization

The application includes a user model that suggests authentication support, though the implementation details appear to be in progress. The schema defines:

- User accounts with username/password
- Session management (implied by `connect-pg-simple` dependency)

## Future Considerations

1. **AI Integration**
   - The schema includes support for AI-detected landmarks with confidence scores
   - Further AI capabilities for automatic analysis are planned

2. **Collaborative Features**
   - The codebase includes hooks for collaborative annotation
   - Real-time collaboration would require additional infrastructure (WebSockets)

3. **Extended Analysis Types**
   - The system is designed to support multiple analysis methodologies (Ricketts, Tweed, etc.)
   - New analysis types can be added by extending the measurement models