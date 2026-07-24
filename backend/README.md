# LearnHub API

The LearnHub API is an ASP.NET Core Web API responsible for authentication, business logic, and data persistence for the LearnHub platform.

## Architecture

### Layers

- **Controllers**
  - Expose REST endpoints
  - Validate requests
  - Return HTTP responses

- **Services**
  - Contain business logic
  - Coordinate operations
  - Call repositories

- **Repositories**
  - Handle data access
  - Encapsulate Entity Framework queries
  - Keep persistence concerns isolated

## Technologies

- ASP.NET Core Web API
- Entity Framework Core
- SQL Server
- JWT Authentication
- AutoMapper

## Features

- JWT Authentication
- Role-based Authorization
- CRUD operations
- Course Enrollment
- Student Grade Management
- Business Reports

## Project Structure

```
├── LearnHub.Api/              # Services and Controllers live here
│   ├── Controllers/           # Each Controller mapping endpoints
│   ├── DTOs/                  # Model the Controllers I/O formats
│   ├── Mapping/               # AutoMapper Profiles
│   ├── Middleware/            # Custom middleware
│   ├── Services/              # Services like token generation
│   └── logs/                  # Directory for Serilog logging (not uploaded)
├── LearnHub.Data/             # Repository and Entities are here
│   ├── Entities/              # Data first Entity models
│   ├── Enums/                 # Some enums used to restrict fields
│   ├── Migrations/            # EF Core migrations
│   ├── Repositories/          # Repositories following the Repository Design Pattern
│   ├── Tools/                 # Other models not considered Entities and Helper classes
│   └── LearnHubDBContext.cs   # DbContext for EF Core linking
└── Learnhub.slnx              # Solution of the project API
```

## Authentication

- Salted password hashing
- JWT Bearer Tokens
- Role-based authorization

Available roles:

- Manager
- Professor
- Student

## API Endpoints Per Controller (TBC)

### Authentication

```
POST /api/auth/register
POST /api/auth/login
GET /api/auth/me
```

### Courses

```
GET    /api/Courses
GET    /api/Courses/enabled
GET    /api/Courses/disabled
GET    /api/Courses/{id}
POST   /api/Courses           # Admin
PATCH  /api/Courses/{id}      # Admin and Professor
DELETE /api/Courses/{id}      # Admin
```

### Users
```
```

### Students

```
GET /api/students/me
POST /api/students/enroll
```

### Professors
```

```

### Reports
```

```
