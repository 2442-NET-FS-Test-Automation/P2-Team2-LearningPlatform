# User Management related Test Cases
Following naming like:
TC-UserMgmt-##

## REQ-08 Admin manages users
```
TC-UserMgmt-01
Trace:        REQ-08 (user management - view users list)
Level:        Integration — Backend (UsersController + DB)
Technique:    Equivalence partitioning (users exist vs empty list)
Precondition: authenticated Admin user; database contains registered users
Steps:        send GET /api/users as Admin
Expected:     200 response containing users list; returned users include required
              information (name, email, role, and status)
Status:       Passed
```
```
TC-UserMgmt-02
Trace:        REQ-08 (user management - create user)
Level:        Integration — Backend (UsersController + DB)
Technique:    Equivalence partitioning (valid vs invalid user data)
Precondition: authenticated Admin user; username and email do not already exist
Steps:        send POST /api/users with valid user information
Expected:     user is created successfully; database contains the new user;
              response returns created user information
Status:       Passed
```
```
TC-UserMgmt-03
Trace:        REQ-08 (user management - update user information)
Level:        Integration — Backend (UsersController + DB)
Technique:    State transition (before update -> after update)
Precondition: authenticated Admin user; existing user exists
Steps:        update user information using PATCH /api/users/{id}
Expected:     user information is updated and persisted in database
Status:       Passed
```
```
TC-UserMgmt-04
Trace:        REQ-08 (user management - deactivate user)
Level:        Integration — Backend (UsersController + DB)
Technique:    State transition (active -> inactive)
Precondition: authenticated Admin user; active user exists
Steps:        deactivate selected user
Expected:     user status changes to inactive and user cannot authenticate
Status:       Passed
```
```
TC-UserMgmt-05
Trace:        REQ-08 (user management - unauthorized access)
Level:        Integration — Backend (Authorization middleware)
Technique:    Negative testing
Precondition: authenticated Student or Professor user
Steps:        attempt to access user management endpoints
Expected:     response returns 403 Forbidden and user information is not exposed
Status:       Passed
```
```
TC-UserMgmt-06
Trace:        REQ-08 (user management - assign professor)
Level:        Integration — Backend (UsersController + DB)
Technique:    State transition (professor without courses -> assigned courses)
Precondition: authenticated Admin user; existing course and valid professor
Steps:        assign the course to the professor
Expected:     professor is successfully updated with the selecteds courses;
              subsequent course retrieval returns the assigned professor
Status:       Passed
```
```
TC-UserMgmt-07
Trace:        REQ-08 (user management - admin dashboard workflow)
Level:        E2E — Cypress
Technique:    Scenario testing + state transitions
Precondition: authenticated Admin user; an active student is visible in the
              Manage Users table
Steps:        open Manage Users; edit the student's first name; deactivate
              the user; reactivate the same user
Expected:     edited information appears in the table; the status changes to
              Inactive after deactivation and returns to Active after
              reactivation
Status:       Passed
```

## REQ-09 Admin promotes students
```
TC-UserMgmt-06
Trace:        REQ-09 (promotion - student to professor)
Level:        Integration — Backend (UsersController + Professor entity + DB)
Technique:    State transition (Student -> Professor)
Precondition: authenticated Admin user; existing Student account
Steps:        send POST /api/users/{id}/promote with valid professor information
Expected:     student receives Professor role and professor record is created
Status:       Passed
```
```
TC-UserMgmt-07
Trace:        REQ-09 (promotion - required professor information validation)
Level:        Integration — Backend (UsersController + UserService)
Technique:    Boundary-value analysis (required fields)
Precondition: none
Steps:        attempt promotion without required professor information
Expected:     validation fails and promotion is rejected
Status:       Passed
```
```
TC-UserMgmt-08
Trace:        REQ-09 (promotion - verify new permissions)
Level:        E2E — Cypress
Technique:    State transition (Student -> Professor)
Precondition: Admin has promoted a student account
Steps:        login using the promoted account and access professor features
Expected:     user can access professor dashboard and professor actions
Status:       Implemented in `frontend/cypress/e2e/user-promotion.cy.ts`
```