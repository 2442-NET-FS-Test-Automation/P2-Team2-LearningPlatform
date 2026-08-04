# Authorization related Test Cases
Following naming like:
TC-AuthZ-##

## REQ-03	API authorization
```
TC-AuthZ-01
Trace:        REQ-03 (authorization - role membership check)
Level:        Unit — Backend (role-check helper / policy, isolated from HTTP pipeline)
Technique:    Equivalence partitioning (Student / Professor / Admin / unauthenticated)
Precondition: none (helper tested directly with mocked ClaimsPrincipal)
Steps:        evaluate the helper against each of the four role classes for an
              Admin-only rule
Expected:     only the Admin class passes; the other three are rejected
Status:       (not started)
```
```
TC-AuthZ-02
Trace:        REQ-03 (authorization - ownership boundary, Professor)
Level:        Integration — Backend (ActivitiesController.Create + DB)
Technique:    Negative testing / access-control boundary
Precondition: Professor A is authenticated; a course exists that is taught by
              Professor B, not A
Steps:        POST /Activities for Professor B's course, authenticated as Professor A
Expected:     403 Forbidden; no activity row created for that course
Status:       (not started)
```
```
TC-AuthZ-03
Trace:        REQ-03 (authorization - enrollment boundary, Student)
Level:        Integration — Backend (ActivitiesController.Submit + DB)
Technique:    Negative testing / access-control boundary
Precondition: Student is authenticated but not enrolled in the target course
Steps:        POST /Activities/{id}/submissions for an activity in that course
Expected:     403 Forbidden; no submission row created
Status:       (not started)
```
```
TC-AuthZ-04
Trace:        REQ-03 (authorization - Admin bypasses ownership checks)
Level:        Integration — Backend (ActivitiesController, multiple endpoints)
Technique:    Equivalence partitioning (Admin as the "always authorized" class)
Precondition: Admin authenticated; a course taught by an unrelated Professor
Steps:        as Admin, create and delete an activity for that course
Expected:     all three operations succeed with 2xx responses regardless of
              course ownership
Status:       (not started)
```
```
TC-AuthZ-05
Trace:        REQ-03 (authorization - malformed route id)
Level:        Integration — Backend (any [HttpGet("{id:int}")]-style endpoint)
Technique:    Error guessing / input validation boundary
Precondition: authenticated user of any role with endpoint access rights
Steps:        request the endpoint with id = -1, then id = 0
Expected:     both return 400 (via DataTypeVerification.IsNumValid) rather than a
              500 or a misleading 404
Status:       (not started)
```
```
TC-AuthZ-06
Trace:        REQ-03 (authorization - tampered/expired token)
Level:        Integration — Backend (any [Authorize] endpoint)
Technique:    Security testing (negative, token integrity)
Precondition: a valid auth cookie/token captured, then manually altered or expired
Steps:        call a protected endpoint using the tampered token
Expected:     401 Unauthorized; request never reaches controller action logic
Status:       (not started)
```

## REQ-04	UI authorization
```
TC-AuthZ-07
Trace:        REQ-04 (UI authorization - ProtectedRoute branching)
Level:        Unit — Frontend (ProtectedRoute component, mocked useAuth)
Technique:    Decision table (isLoading x user x allowedRoles match)
Precondition: component rendered with each combination via mocked context values
Steps:        render with (loading=true), (user=null), (user role not in
              allowedRoles), (user role in allowedRoles)
Expected:     renders null, <Navigate to="/login">, <Navigate to="/unauthorized">,
              and <Outlet/> respectively, one per case
Status:       (not started)
```
```
TC-AuthZ-08
Trace:        REQ-04 (UI authorization - unauthenticated direct navigation)
Level:        Integration — Frontend (React Router memory history test)
Technique:    Negative testing
Precondition: no user in AuthCtx
Steps:        navigate directly to /professor/dashboard
Expected:     redirected to /login; no dashboard data-fetching calls fired beforehand
Status:       (not started)
```
```
TC-AuthZ-09
Trace:        REQ-04 (UI authorization - wrong-role direct navigation)
Level:        Integration — Frontend (React Router memory history test)
Technique:    Negative testing
Precondition: authenticated Student user in AuthCtx
Steps:        navigate directly to /manager/dashboard
Expected:     redirected to /unauthorized; manager dashboard component never mounts
Status:       (not started)
```
```
TC-AuthZ-10
Trace:        REQ-04 (UI authorization - protected route via URL bar)
Level:        E2E — Cypress
Technique:    Negative testing (unauthenticated, direct URL entry)
Precondition: no session/cookies
Steps:        type /student/dashboard directly into the address bar and load it
Expected:     browser ends on /login; no flash of dashboard content; network tab
              shows no calls to student-only endpoints
Status:       (not started)
```
```
TC-AuthZ-11
Trace:        REQ-04 (UI authorization - nav link visibility by role)
Level:        E2E — Selenium
Technique:    Equivalence partitioning (per-role nav rendering)
Precondition: one seeded user per role, logged in one at a time
Steps:        inspect the navbar's "Dashboard" link target for each role
Expected:     link points to /student, /professor, or /manager dashboard matching
              the logged-in user's actual role in every case
Status:       (not started)
```