# LearnHub Web

LearnHub Web is a Vite + React + TypeScript single-page application that consumes the LearnHub ASP.NET Core API.

## Technologies

- React
- TypeScript
- Vite
- Axios

## Features

### Anonymous Users

- Register
- Login
- Browse available courses
- View course details

### Students

- Browse the course catalog
- Enroll in courses
- Unenroll from courses
- View grades
- Manage own profile

### Professors

- View assigned courses
- Manage grades
- View enrolled students
- Manage own profile

### Administrators

- Manage own profile
- Manage courses
- Manage professors
- Manage shifts
- Manage users
- View reports

## Project Structure

```
├── public/                    # Images to display
│   └── course_img/            # Each category has one image assigned, they are here
├── src/                       # All the frontend code is here
│   ├── api/                   # Handles the connection with the backend (axios)
│   ├── components/            # Little reusable components
│   ├── ctx/                   # Context components, holding things like Theme and Auth
│   ├── lib/                   # Contains files with types and general functions
│   ├── pages                  # Main React pages
│   │   └── dashboard/         # Here live the different dashboards and the sections
│   ├── App.tsx                # Handles the App Routing
│   └── Main.tsx               # Holds the main component wraps
└── (other files)              # Config files mostly
```

## Routing

### General Public
```
/login
/register
```
```
/courses
/courses/<courseId>
```

### Only Students
```
/student/dashboard
```
This dashboard contains
- Profile
- My Courses
- Schedule
- Progress

### Only Professors
```
/professor/dashboard
```
This dashboard contains
- Profile
- Courses
- Schedule
- Summary

### Only Managers
```
/admin/dashboard
```
This dashboard contains
- Profile
- User Management
- Course Management
- Shifts Management
- Reports

## Authentication

Authentication is handled using JWT Bearer Tokens.

- Login stores the access token in local storage. (May change to cookies if time allows)
- Axios automatically attaches the token to requests.
- Protected routes require authentication.
- Role-based routing restricts access to administrator pages.
