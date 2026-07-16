# LearnHub Web

LearnHub Web is a React + TypeScript single-page application that consumes the LearnHub ASP.NET Core API.

## Technologies

- React
- TypeScript
- React Router
- Axios

## Features

### Anonymous Users

- Register
- Login
- Browse available courses

### Students

- Browse the course catalog
- View course details
- Enroll in courses
- Unenroll from courses
- View grades
- Manage profile

### Professors

- View assigned courses
- Manage grades
- View enrolled students
- Update profile

### Administrators

- Manage courses
- Manage professors
- Manage shifts
- Manage users
- View reports

## Project Structure

**TBD**

## Routing (TBC)
```
/login
/register
/courses
/courses/<courseId>
/my-profile
```
```
/student/dashboard
/student/my-courses
```
```
/professor/dashboard
/professor/courses
/professor/courses/students
```
```
/admin/dashboard
/admin/users
/admin/professors
/admin/courses
/admin/shifts
/admin/reports
```

## Authentication

Authentication is handled using JWT Bearer Tokens.

- Login stores the access token
- Axios automatically attaches the token to requests
- Protected routes require authentication
- Role-based routing restricts access to administrator pages
