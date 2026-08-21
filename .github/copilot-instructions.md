# Copilot Instructions for LearnHub

LearnHub is a full-stack learning management system with React/TypeScript frontend and ASP.NET Core backend.

## Build & Test Commands

### Frontend (React/Vite)
```bash
# Development server
npm run dev

# Production build
npm run build

# Type check
tsc -b

# Linting
npm run lint

# E2E tests
npm run cy:open      # Interactive mode
npm run cy:run       # Headless mode

# Component tests
npm run cy:ct
```

### Backend (.NET 10)
```bash
# Build solution
dotnet build

# Run API
cd backend/LearnHub.Api && dotnet run

# Unit tests (xUnit)
dotnet test backend/tests/LearnHub.Tests.Unit

# Integration tests
dotnet test backend/tests/LearnHub.Tests.Integration

# Run specific test by name
dotnet test backend/tests/LearnHub.Tests.Unit -k TestMethodName
```

## Project Architecture

### Frontend Structure
- **src/pages/** - Route-level components organized by feature (auth, courses, dashboard)
- **src/components/** - Reusable UI components (layout, forms, modals, etc.)
- **src/api/** - Axios-based API request modules, one per feature
- **src/ctx/** - React Context for state management
- **src/lib/** - Utility functions and shared types
- **Vite + TailwindCSS** - Build and styling
- **Cypress** - E2E and component testing with code coverage

### Backend Structure
- **LearnHub.Api/** - Controllers, Services, DTOs, Middleware, Filters
- **LearnHub.Data/** - EF Core DbContext, Repositories, Entities, Migrations
- **tests/** - Unit and Integration tests using xUnit + Moq

### Data Flow
1. React components call API request modules (src/api/)
2. Request modules use Axios to hit API endpoints
3. Controllers route to Services
4. Services use Repositories for data access
5. Repositories query EF Core DbContext
6. Database: SQL Server with role-based access (Users, Students, Professors)

### Key Entities
- **User** - Base entity with Username, Email, Role (Student/Professor/Manager)
- **Student** - Student profile extending User
- **Professor** - Professor profile extending User
- **Course** - Course offering with enrollments
- **StudentCourse** - Junction table for enrollments
- **Activity** - Course activities/assignments
- **Notifications** - User notifications

## Key Conventions

### Backend (.NET)
- **Naming:** PascalCase for classes, properties, methods; `Async` suffix on async methods
- **Repositories:** Implement interfaces (IUserRepo, ICourseRepo, etc.) with async CRUD operations
- **DTOs:** Named `{Entity}Dto` for requests/responses; kept separate from entities
- **Controllers:** Use `[ApiController]`, `[Route("api/...")]`; async actions; return `ActionResult<T>`
- **Services:** Business logic here, not in controllers; injected via DI
- **EF Core:** Use DbSet navigation properties; migrations in version control; async queries
- **Auth:** JWT token generation/validation in TokenService; bearer token in Authorization header
- **Logging:** Use Serilog via ILogger interface; structured logging

### Frontend (React/TypeScript)
- **Components:** PascalCase filenames (CourseCard.tsx); functional components with TypeScript
- **Props:** Define type with `ComponentNameProps` interface; no prop spreading without explicit types
- **API Modules:** `camelCaseRequests.ts` for each feature (coursesRequests.ts, usersRequest.ts)
- **Types:** Centralized in src/lib/types.ts; auth types in typesAuth.ts
- **State:** Context API for global state (auth, user data); local state with useState
- **Routing:** React Router v7; protected routes via ProtectedRoute component
- **Styling:** TailwindCSS classes; consistent spacing/colors across components
- **Icons:** Use lucide-react for all icons (Check, AlertCircle, etc.)

### API Contracts
- **Request/Response:** Always use DTOs; POST/PUT bodies use `[FromBody]`
- **Endpoints:** `GET /api/{resource}` list, `GET /api/{resource}/{id}` detail, `POST /api/{resource}` create, `PUT /api/{resource}/{id}` update
- **Error Handling:** Return appropriate HTTP status (400 for validation, 401 for auth, 404 for not found, 500 for server error)
- **Pagination:** Use `PagedResult<T>` for list endpoints with page/pageSize parameters

### Testing
- **Unit Tests (Backend):** xUnit, FluentAssertions, Moq for mocking repositories/services
- **Integration Tests (Backend):** Test database interactions; use in-memory or test database
- **E2E Tests (Frontend):** Cypress with page object pattern; baseUrl is `http://localhost:5173`
- **Component Tests (Frontend):** Cypress component testing for isolated component behavior
- **Code Coverage:** Istanbul for frontend coverage; coverlet for backend

## Development Tips

### Database
- Entity Framework migrations are checked in; run `dotnet ef database update` to apply migrations
- Seed data: Use Seeder service with JSON files in `LearnHub.Api/SeedData/`

### CORS
- Frontend runs on `http://localhost:5173`, API allows it; add other origins to Program.cs AddCors policy

### JWT
- Tokens include UserId and Role claims; validate in middleware/filters
- Token expiry configured in appsettings.Development.json (JwtSettings section)

### Environment
- Frontend: `.env` file for API URL and other config
- Backend: `appsettings.Development.json` for local development settings; connection string in Conn-String key
