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

**TBD**

## Authentication

- Salted password hashing
- JWT Bearer Tokens
- Role-based authorization

Available roles:

- Admin
- Professor
- Student

## API Endpoints (TBC)

Authentication

```
POST /api/auth/register
POST /api/auth/login
```

Courses

```
GET    /api/courses
GET    /api/courses/{id}
POST   /api/courses
PUT    /api/courses/{id}
DELETE /api/courses/{id}
```

Students

```
GET /api/students/me
POST /api/students/enroll
```