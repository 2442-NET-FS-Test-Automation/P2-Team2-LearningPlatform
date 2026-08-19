# Authentication related Test Cases
Following naming like:
TC-AuthN-##

## REQ-01	User registration
```
TC-AuthN-01
Trace:        REQ-01 (registration - birth date eligibility)
Level:        Unit - Frontend (isBirthDateValid, lib/funcs.ts)
Technique:    Boundary-value analysis (12-year cutoff, lower edge)
Precondition: none (pure function test)
Steps:        call isBirthDateValid() with a date exactly 12 years before today,
              then with a date 12 years minus 1 day before today
Expected:     first call returns true (eligible); second call returns false (ineligible)
Status:       (passed)
```
```
TC-AuthN-02
Trace:        REQ-01 (registration - server-side age validation)
Level:        Unit - Backend (age validation logic in RegisterDto/validator)
Technique:    Boundary-value analysis (12-year cutoff, lower edge)
Precondition: none (validator tested in isolation, no DB)
Steps:        validate a RegisterDto with BirthDate = today minus 12 years minus 1 day
Expected:     validation fails with an age-related error; no downstream service call attempted
Status:       (passed)
```
```
TC-AuthN-03
Trace:        REQ-01 (registration - successful account creation)
Level:        Integration - Backend (AuthController.Register + DB)
Technique:    Equivalence partitioning (valid input class)
Precondition: no existing user with the given username or email
Steps:        POST /auth/register with a complete, valid payload (unique username/email,
              password >= 8 chars, birthdate >= 12 years old)
Expected:     201/200 response with created user info; user row persisted; auth cookie
              set on the response; a follow-up GET /auth/me returns the same user
Status:       (passed)
```
```
TC-AuthN-04
Trace:        REQ-01 (registration - redirect after account creation)
Level:        Integration - Frontend (RegisterPage, mocked API)
Technique:    Decision table (role always defaults to Student on self-registration)
Precondition: /auth/register mocked to return a successful Student user
Steps:        fill out and submit the registration form
Expected:     navigate() is called with "/student/dashboard"; no error banner rendered
Status:       (not started)
```
```
TC-AuthN-05
Trace:        REQ-01 (registration - full user journey)
Level:        E2E - Selenium
Technique:    Scenario/state-transition (anonymous -> registered -> authenticated)
Precondition: browser has no session; test DB has no conflicting username/email
Steps:        visit /register, fill every field with valid data, submit, wait for redirect
Expected:     lands on /student/dashboard; navbar shows "Hi, <FirstName>" and the
              "Student" role chip; Profile tab shows the submitted data
Status:       (not started)
```
```
TC-AuthN-06
Trace:        REQ-01 (registration - underage rejection)
Level:        E2E - Selenium
Technique:    Boundary-value analysis (12-year cutoff, upper/ineligible edge)
Precondition: browser has no session
Steps:        submit the registration form with BirthDate set to exactly
              11 years, 364 days before today
Expected:     form is blocked client-side (or server rejects with 400 if client check
              is bypassed via devtools); user remains on /register; no account created
              in either browser
Status:       (not started)
```

## REQ-02	User authentication
```
TC-AuthN-07
Trace:        REQ-02 (login - password length gate)
Level:        Unit - Frontend (LoginPage.handleSubmit logic)
Technique:    Boundary-value analysis (8-char minimum)
Precondition: LoginPage rendered
Steps:        enter a 7-character password, submit
Expected:     "Password should be at least 8 characters long" shown; no API call made
Status:       (passed)
```
```
TC-AuthN-08
Trace:        REQ-02 (login - credential verification)
Level:        Unit - Backend (password hash comparison service)
Technique:    Equivalence partitioning (matching hash vs non-matching hash)
Precondition: a known password hash fixture
Steps:        verify a correct plaintext password against the hash, then an incorrect one
Expected:     first call returns true; second returns false; no exceptions thrown
Status:       (passed)
```
```
TC-AuthN-09
Trace:        REQ-02 (login - invalid credentials)
Level:        Integration - Backend (AuthController.Login + DB)
Technique:    Equivalence partitioning (invalid credential class)
Precondition: a registered, active user exists
Steps:        POST /auth/login with the correct username but wrong password
Expected:     401 response; no auth cookie set; no session created
Status:       (passed)
```
```
TC-AuthN-10
Trace:        REQ-02 (login - deactivated account)
Level:        Integration - Backend (AuthController.Login + DB)
Technique:    Decision table (active/inactive x correct/incorrect credentials)
Precondition: a registered user exists with IsActive = false, correct credentials known
Steps:        POST /auth/login with correct credentials for the deactivated user
Expected:     403 response distinct from the 401 invalid-credentials case; no cookie set
Status:       (passed)
```
```
TC-AuthN-11
Trace:        REQ-02 (login - role-based redirect)
Level:        E2E - Selenium
Technique:    Decision table (3 roles x expected dashboard route)
Precondition: one seeded active user per role: Student, Professor, Admin
Steps:        log in as each user in turn via the UI
Expected:     Student -> /student/dashboard, Professor -> /professor/dashboard,
              Admin -> /manager/dashboard, in every case
Status:       (not started)
```
```
TC-AuthN-12
Trace:        REQ-02 (login - session persists across reload)
Level:        E2E - Selenium
Technique:    State transition (authenticated session surviving a hard refresh)
Precondition: user has just logged in successfully
Steps:        hard-refresh the browser on the dashboard page
Expected:     GET /auth/me on load restores the session; user remains on the dashboard,
              not redirected to /login
Status:       (not started)
```

## REQ-05    Duplicate usernames/emails are rejected
```
TC-AuthN-13
Trace:        REQ-05 (registration - uniqueness check, isolated)
Level:        Unit - Backend (uniqueness validator, mocked repository)
Technique:    Decision table (username unique/dup x email unique/dup - 4 combinations)
Precondition: mocked repo configured to report existing username/email as needed
Steps:        validate all 4 combinations of (username unique|dup) x (email unique|dup)
Expected:     only the "both unique" combination passes; the other 3 fail with a
              field-specific error
Status:       (passed)
```
```
TC-AuthN-14
Trace:        REQ-05 (registration - duplicate username rejected)
Level:        Integration - Backend (AuthController.Register + DB)
Technique:    Negative testing
Precondition: a user with username "jsmith" already exists
Steps:        POST /auth/register with username "jsmith" and a new, unused email
Expected:     4xx response naming the username conflict; no second row created;
              a count query confirms exactly one "jsmith" row before and after
Status:       (passed)
```
```
TC-AuthN-15
Trace:        REQ-05 (registration - duplicate email rejected)
Level:        Integration - Backend (AuthController.Register + DB)
Technique:    Negative testing (independent axis from TC-25)
Precondition: a user with email "j@x.com" already exists, under a different username
Steps:        POST /auth/register with a new username but email "j@x.com"
Expected:     4xx response naming the email conflict; no second row created
Status:       (passed)
```
```
TC-AuthN-16
Trace:        REQ-05 (registration - duplicate error recovery flow)
Level:        E2E - Cypress
Technique:    State transition (error -> correction -> success)
Precondition: a seeded user with username "existinguser" exists
Steps:        attempt to register with username "existinguser", observe the error,
              change only the username to a unique value, resubmit
Expected:     first submission shows a clear duplicate-username error and stays on
              /register; second submission succeeds and redirects to the dashboard
Status:       (not started)
```