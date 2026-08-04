# LearnHub User Stories

## 1. Admin Module

### Story 1.1: User Management
**As an** Admin, **I want** to view, manage, and assign roles to user accounts **so that** I can control system access and permissions.

**Acceptance Criteria:**

- **Scenario 1: Viewing All Users**
    - **Given** I am an Admin logged into the system.
    - **When** I navigate to the User Management page.
    - **Then** I should see a list of all registered users with their details (Name, Username, Role).
    - **And** the list should support pagination or infinite scroll if there are many users.

- **Scenario 2: Promoting a User to a New Role**
    - **Given** I am an Admin viewing the list of users.
    - **When** I select a user with the role 'Student'.
    - **And** I choose to 'Promote' them to 'Professor'.
    - **Then** the system should update the user's role.
    - **And** the user's dashboard should change to the Professor dashboard upon their next login.

- **Scenario 3: Promoting a User Who Is Already a Professor or Admin**
    - **Given** I am an Admin viewing a user who already holds the 'Professor' role.
    - **When** I attempt to promote them again.
    - **Then** the system should reject the action with a clear message rather than creating a duplicate or corrupted role assignment.

- **Scenario 4: Deactivating and Reactivating a User**
    - **Given** I am an Admin viewing the list of users.
    - **When** I select an active user and choose to 'Deactivate' them.
    - **Then** the user should be unable to log in.
    - **And** the user should be marked as 'Inactive' in the list.
    - **When** I later select the same user and choose to 'Reactivate' them.
    - **Then** the user should be able to log in normally.

### Story 1.2: Course & Shift Management
**As an** Admin, **I want** to create, update, and delete courses and shifts **so that** I can maintain an up-to-date course catalog and schedule structure.

**Acceptance Criteria:**

- **Scenario 1: Creating a New Course**
    - **Given** I am an Admin on the Course Management page.
    - **When** I fill out the 'Create Course' form with valid data (Name, Description, etc.).
    - **And** I click 'Save'.
    - **Then** the course should be added to the catalog.
    - **And** I should see a success notification or message.

- **Scenario 2: Deleting a Course**
    - **Given** I am an Admin viewing the list of courses.
    - **When** I select a course and choose to 'Delete' it.
    - **Then** the course should be removed from the catalog (deactivated).
    - **And** any related data should be handled gracefully.

- **Scenario 3: Reactivating a Course**
    - **Given** I am an Admin viewing a course marked 'Inactive'.
    - **When** I choose to reactivate it.
    - **Then** the course should become active again.
    - **And** it should reappear in the public course catalog.

- **Scenario 4: Editing Course Details**
    - **Given** I am an Admin viewing an existing course.
    - **When** I open the 'Edit Course' form and change its details.
    - **And** I click 'Save Changes'.
    - **Then** the course should be updated with the new values.
    - **And** And the changes should be reflected the next time the course is viewed.

- **Scenario 5: Editing a Course's Weekly Schedule**
    - **Given** I am an Admin editing a course.
    - **When** I add a new schedule entry (day, start time, end time).
    - **And** I remove an existing schedule entry.
    - **And** I save the course.
    - **Then** the course's schedule should reflect exactly the entries I left in place.

- **Scenario 6: Create a valid Shift**
    - **Given** I am an Admin viewing the Shift Management page.
    - **When** I create a new shift (e.g., "Morning", "Evening") with valid times.
    - **Then** the new shift should be available for assignment to professors.

- **Scenario 7: Editing a Shift**
    - **Given** I am an Admin viewing the Shift Management page.
    - **When** I select a course i click on Edit and input valid data.
    - **Then** the shift should be updated to the new values.

- **Scenario 8: Blocked from Deleting an Assigned Shift**
    - **Given** I am an Admin viewing the Shift Management page.
    - **When** I attempt to delete a shift that currently has one or more professors assigned to it.
    - **Then** the system should reject the deletion with a clear message.
    - **And** the shift should remain in the list, unchanged.

### Story 1.3: Reporting Dashboard
**As an** Admin, **I want** to view enrollment reports **so that** I can monitor course popularity and student activity.

**Acceptance Criteria:**

- **Scenario 1: Viewing General Statistics**
    - **Given** I am an Admin on the Reports page.
    - **When** the page loads.
    - **Then** I should see a summary of key metrics.

- **Scenario 2: Viewing Top Courses by Enrollment**
    - **Given** I am an Admin on the Reports page.
    - **When** I view the course enrollment section.
    - **Then** I should see a top list of courses ordered by the number of enrolled students, from highest to lowest.

### Story 1.4 — Searching and Filtering Management Lists
**As an** Admin, **I want** to search and filter the Users, Courses, and Shifts management tables **so that** I can quickly find specific records without paging through the entire list.

**Acceptance Criteria:**

- **Scenario 1: Searching Users by Name or Username**
    - **Given** I am an Admin on the Manage Users page.
    - **When** I type a partial name or username into the search box.
    - **Then** the list should update to show only matching users.

- **Scenario 2: Filtering Users by Role and Status**
    - **Given** I am an Admin on the Manage Users page.
    - **When** I filter by role (Student/Professor/Admin) and by status (Active/Inactive).
    - **Then** only users matching both filters should be displayed.

- **Scenario 3: Searching and Filtering Courses**
    - **Given** I am an Admin on the Manage Courses page.
    - **When** I search by course name and filter by category and active status.
    - **Then** only courses matching all applied filters should be displayed.

- **Scenario 4: Changing Items Per Page**
    - **Given** I am an Admin viewing any paginated management table.
    - **When** I change the "items per page" setting.
    - **Then** the table should reset to page 1 and display the new number of rows per page.

## 2. Professor Module

### Story 2.1: Managing Student Grades
**As a** Professor, **I want** to set and update grades for students in my courses **so that** I can accurately record their performance.

**Acceptance Criteria:**

- **Scenario 1: Viewing a List of Enrolled Students**
    - **Given** I am a Professor logged into the system.
    - **When** I navigate to my 'Assigned Courses' section.
    - **And** I select a specific course.
    - **Then** I should see a list of all students enrolled in that course.

- **Scenario 2: Setting a Grade for a submitted activity by a Student**
    - **Given** I am viewing the submitted activities list for one of my courses.
    - **When** I select an activity and enter a numeric grade (e.g., 85).
    - **And** I click 'Save'.
    - **Then** the grade should be saved to the system.
    - **And** I should see a confirmation message.

- **Scenario 3: Updating a Grade**
    - **Given** I am viewing the submitted activities list for one of my courses.
    - **When** I select an activity which already has a grade (e.g., 75).
    - **And** I change the grade to a new value (e.g., 90) and click 'Update'.
    - **Then** the grade in the system should be updated to the new value.

### Story 2.2: Profile Management
**As a** Professor, **I want** to edit my own professional profile **so that** I can keep my contact details and professional bio up-to-date.

**Acceptance Criteria:**

- **Scenario 1: Updating Profile Information**
    - **Given** I am a Professor on my dashboard.
    - **When** I navigate to the 'Profile' section.
    - **And** I edit my information.
    - **And** I click 'Save'.
    - **Then** my profile information should be updated in the system.
    - **And** the updated information should be visible on my profile.

- **Scenario 2: Viewing Shift Hours Alongside Course Schedule**
    - **Given** I am a Professor viewing my Weekly Schedule.
    - **When** the page loads.
    - **Then** I should see my assigned shift hours displayed faintly in the background.
    - **And** my course schedule blocks should remain clearly visible on top of the shift band.

### Story 2.3: Activity Management
**As a** Professor, **I want** to create, update and remove activities for the courses I teach **so that** I can assign and retire coursework as needed.

**Acceptance Criteria:**

- **Scenario 1: Creating a Valid Activity**
    - **Given** I am a Professor viewing one of my courses.
    - **When** I fill out the 'New Activity' form with a title, description, and a due date in the future.
    - **And** I submit the form.
    - **Then** the activity should be created and appear in the course's activity list.

- **Scenario 2: Rejecting a Past Due Date**
    - **Given** I am a Professor creating a new activity.
    - **When** I set the due date to a date in the past.
    - **And** I submit the form.
    - **Then** the system should reject the submission with a clear error message.
    - **And** no activity should be created.

- **Scenario 3: Archiving an Activity**
    - **Given** I am a Professor viewing an activity I created, in the "Active" tab.
    - **When** I choose to archive it.
    - **Then** the activity should move to the "Archived" tab.
    - **And** it should no longer appear to students as a pending or submittable activity.
    - **And** its existing submissions should remain intact and visible in the archived view.

- **Scenario 4: Reactivating an Archived Activity**
    - **Given** I am a Professor viewing the "Archived" tab for one of my courses.
    - **When** I choose to reactivate an activity.
    - **Then** it should move back to the "Active" tab.
    - **And** students should once again be able to view and submit to it (if not yet past due).

### Story 2.4: Authorization Boundaries on Courses You Don't Teach
**As a** Professor, **I want** the system to prevent me from managing courses I'm not assigned to **so that** course data stays isolated between professors.

**Acceptance Criteria:**

- **Scenario 1: Blocked from Creating an Activity**
    - **Given** I am a Professor who does not teach a given course.
    - **When** I attempt to create an activity for that course.
    - **Then** the system should deny the request with a 'Forbidden' response.

- **Scenario 2: Blocked from Deleting or Grading**
    - **Given** I am a Professor who does not teach a given course.
    - **When** I attempt to delete one of its activities, or grade one of its submissions.
    - **Then** the system should deny the request with a 'Forbidden' response.

- **Scenario 3: Blocked from Viewing the Enrollment Details**
    - **Given** I am a Professor who does not teach a given course.
    - **When** I attempt to view its list of activities or enrolled students.
    - **Then** the system should deny the request with a 'Forbidden' response.

### Story 2.5 — Viewing a Performance Summary
**As a** Professor, **I want** to see a summary of my teaching activity **so that** I can quickly gauge my workload and student engagement without digging through each course.

**Acceptance Criteria:**

- **Scenario 1: Viewing Summary Metrics**
    - **Given** I am a Professor on my dashboard's Summary tab.
    - **When** the page loads.
    - **Then** I should see my total courses, total students across all courses, total active activities, and the count of submissions still awaiting my grade.

- **Scenario 2: Viewing My Top Courses by Enrollment**
    - **Given** I am a Professor viewing my Summary tab.
    - **When** the page loads.
    - **Then** I should see my own courses ranked by enrollment count, distinct from the platform-wide ranking Admins see.

## 3. Student Module

### Story 3.1: Course Enrollment
**As a** Student, **I want** to enroll in and unenroll from courses **so that** I can register for the classes I wish to take.

**Acceptance Criteria:**

- **Scenario 1: Enrolling in a Course**
    - **Given** I am a Student logged into the system, viewing the course catalog.
    - **When** I select a course and click the 'Enroll' button.
    - **Then** I should be enrolled in the course.
    - **And** I should see a confirmation message.
    - **And** the course should appear in my "My Courses" list.

- **Scenario 2: Unenrolling from a Course**
    - **Given** I am a Student viewing my list of enrolled courses.
    - **When** I select a course and click the 'Unenroll' button.
    - **Then** I should be unenrolled from the course.
    - **And** I should see a confirmation message.
    - **And** the course should no longer appear in my "My Courses" list.

### Story 3.2: Tracking Progress and Grades
**As a** Student, **I want** to see my grades and a clear view of my current and completed courses **so that** I can track my academic performance.

**Acceptance Criteria:**

- **Scenario 1: Viewing Grades**
    - **Given** I am a Student on my dashboard.
    - **When** I navigate to the 'My Courses' section.
    - **Then** I should see a list of my pending and completed courses.
    - **And** each completed course should display the grade that have been assigned.
    - **And** a numeric grade should be displayed (e.g., 85%).

- **Scenario 2: Distinguishing Between Current and Completed Courses**
    - **Given** I am a Student on my dashboard.
    - **When** I view my course list.
    - **Then** the courses should be clearly organized.
    - **And** I should be able to see a section for 'Current Courses' and another for 'Completed Courses'.

- **Scenario 3: Viewing a Submitted but Ungraded Activity**
    - **Given** I am a Student who has submitted an activity that has not yet been graded.
    - **When** I view my completed activities section.
    - **Then** the activity should display an "Awaiting grade" status instead of a numeric grade.
    - **And** it should not show any feedback text, since none has been given yet.

### Story 3.3: Submitting an Activity
**As a** Student, **I want** to submit my work for an assigned activity **so that** my professor can review and grade it.

**Acceptance Criteria:**

- **Scenario 1: Successful Submission Before the Due Date**
    - **Given** I am a Student enrolled in a course with a pending activity.
    - **When** I write my submission and click 'Submit'.
    - **Then** the submission should be saved.
    - **And** the activity should move from 'Pending' to 'Awaiting Grade' in my course view.

- **Scenario 2: Rejecting a Duplicate Submission**
    - **Given** I am a Student who has already submitted an activity.
    - **When** I attempt to submit to the same activity again.
    - **Then** the system should reject the second submission with a clear "already submitted" message.
    - **And** my original submission should remain unchanged.

- **Scenario 3: Viewing an Overdue, Unsubmitted Activity**
    - **Given** I am a Student with a pending activity whose due date has passed.
    - **When** I view my list of pending activities.
    - **Then** the activity should be visibly flagged as overdue.

- **Scenario 4: Blocked from Submitting to a Course I'm Not Enrolled In**
    - **Given** I am a Student who is not enrolled in a given course.
    - **When** I attempt to submit an activity belonging to that course.
    - **Then** the system should deny the request with a 'Forbidden' response.

### Story 3.4 — Marking a Course as Completed
**As a** Student, **I want** to mark a course as completed once I've finished its activities **so that** my transcript accurately reflects my progress.

**Acceptance Criteria:**

- **Scenario 1: Completing a Course After All Activities Are Submitted**
    - **Given** I am a Student enrolled in a course where I have submitted 100% of its activities.
    - **When** I click 'Mark as Completed'.
    - **Then** the course should move from my enrolled list to my completed list.
    - **And** it should no longer allow unenrollment.

- **Scenario 2: Blocked from Completing with Outstanding Activities**
    - **Given** I am a Student enrolled in a course with at least one unsubmitted activity.
    - **When** I attempt to mark the course as completed.
    - **Then** the 'Mark as Completed' action should be unavailable, or rejected with a clear message telling me to finish my activities first.

- **Scenario 3: Viewing Completion Progress**
    - **Given** I am a Student viewing a course I'm enrolled in.
    - **When** I look at the course sidebar.
    - **Then** I should see a percentage and a count (e.g. "3/5 activities") reflecting how many of the course's activities I've completed.

- **Scenario 4: Completing a Course with no Activities**
    - **Given** I am a Student viewing a course I'm enrolled in that has no activities yet.
    - **When** I click on Complete Course.
    - **Then** it should show an error telling that you can't complete a course without activities.

## 4. Anonymous Users

### Story 4.1: Registration
**As an** Anonymous User, **I want** to register for an account **so that** I can gain full access to the learning platform.

**Acceptance Criteria:**

- **Scenario 1: Successful Registration**
    - **Given** I am on the registration page.
    - **When** I fill out the registration form with valid data.
    - **And** I click 'Register'.
    - **Then** a new user account should be created in the system.
    - **And** I should be logged in directly.

- **Scenario 2: Registration Failure (Email Already Exists)**
    - **Given** I am on the registration page.
    - **When** I fill out the form with an email or username that already exists in the system.
    - **And** I click 'Register'.
    - **Then** the system should display a clear error message.
    - **And** the user account should not be created.

- **Scenario 3: Registration Failure (User is not at least 12 years old)**
    - **Given** I am on the registration page.
    - **When** I fill out the form with a birthdate less than 12 years old.
    - **And** I click 'Register'.
    - **Then** the system should display a clear error message.
    - **And** the user account should not be created.

### Story 4.2: Browsing Courses
**As an** Anonymous User, **I want** to browse the course catalog with limited preview information **so that** I can explore what the platform offers before registering.

**Acceptance Criteria:**

- **Scenario 1: Viewing the Catalog**
    - **Given** I am not logged into the system.
    - **When** I navigate to the 'Courses' section.
    - **Then** I should see a list of all available courses.
    - **And** I should not see an 'Enroll' button.
    - **And** if I click on a course, I should be able to see more details.

- **Scenario 2: Seeing Seat Availability at a Glance**
    - **Given** I am browsing the course catalog, logged in or not.
    - **When** I view the course grid.
    - **Then** each course card should indicate its capacity status (e.g. "Open seats," "Filling up," "Almost full," or "Full") based on how close it is to capacity.
    - **And** a course at 100% capacity should not be enrollable, showing "Course Full" instead of an active enroll button.

### Story 4.3: Blocked Access to Protected Routes
 
**As an** Anonymous User, **I want** to be redirected to the login page when I try to access a protected route **so that** I understand I need to log in first.
 
**Acceptance Criteria:**
 
- **Scenario 1: Redirect on Direct Navigation**
    - **Given** I am not logged into the system.
    - **When** I navigate directly to a protected URL.
    - **Then** I should be redirected to the login page.
    - **And** no protected data should be loaded or displayed beforehand.

- **Scenario 2: Redirect Back After Login**
    - **Given** I was redirected to the login page after trying to access a protected route.
    - **When** I log in successfully.
    - **Then** I should be taken to my dashboard.

## 5. Cross-Cutting Concerns

### Story 5.1: Authentication and Authorization
**As a** User, **I want** to log in and out securely **so that** my account remains protected.

**Acceptance Criteria:**

- **Scenario 1: Successful Login**
    - **Given** I am a registered user on the login page.
    - **When** I enter my correct email and password.
    - **And** I click 'Login'.
    - **Then** I should be redirected to my specific dashboard (Student, Professor, Admin).
    - **And** a JWT token should be stored in the browser as a secure cookie.

- **Scenario 2: Login Failure**
    - **Given** I am on the login page.
    - **When** I enter an incorrect password.
    - **And** I click 'Login'.
    - **Then** the system should display an error message ("Invalid username/email or password.").
    - **And** I should remain on the login page.

- **Scenario 3: Role-Based Access Control**
    - **Given** I am a user with the 'Student' role.
    - **When** I try to access an administrative URL directly (e.g., `/manager/dashboard`).
    - **Then** the system should deny access and redirect me to an "Unauthorized" page.

- **Scenario 4: Logout**
    - **Given** I am a logged-in user.
    - **When** I click the 'Logout' button.
    - **Then** I should be logged out of the system.
    - **And** I should be redirected to the home page.
    - **And** the stored JWT token should be invalidated on the client side.

- **Scenario 5: Deactivated User Attempts to Log In**
    - **Given** my account has been deactivated by an Admin.
    - **When** I attempt to log in with correct credentials.
    - **Then** I should see a message specifically indicating my account was deactivated, distinct from an "invalid credentials" error.
    - **And** I should not be logged in.

- **Scenario 6: Malformed ID in a Request**
    - **Given** I am a logged-in user of any role.
    - **When** I access an endpoint with a malformed or invalid ID (e.g., a negative number or non-numeric value).
    - **Then** the system should return a clear 400 error.
    - **And** no server error or stack trace should be exposed.

### Story 5.2: Pagination Consistency
**As a** User of any role, **I want** paginated lists to behave predictably **so that** I can browse large result sets without errors or unexpected data volumes.
 
**Acceptance Criteria:**
 
- **Scenario 1: Requesting an Invalid Page Number**
    - **Given** I am viewing any paginated list (users, courses, activities, shifts).
    - **When** I request page 0 or a negative page number.
    - **Then** the system should default to page 1 rather than erroring.

- **Scenario 2: Requesting an Oversized Page**
    - **Given** I am viewing any paginated list.
    - **When** I request a page size larger than the system maximum (50).
    - **Then** the system should cap the page size at the maximum.

- **Scenario 3: Requesting a Zero or Negative Page Size**
    - **Given** I am viewing any paginated list.
    - **When** I request a page size of 0 or a negative number.
    - **Then** the system should fall back to the default page size rather than returning an empty or invalid result.

### Story 5.3 — In-App Notifications
**As a** User, **I want** to receive and manage notifications **so that** I stay informed about relevant activity (grades, submissions, etc.) without having to check every course manually.

**Acceptance Criteria:**

- **Scenario 1: Viewing Unread Notifications**
    - **Given** I am a logged-in user with unread notifications.
    - **When** I open the notifications panel from the navbar.
    - **Then** I should see my unread notifications with a badge showing the unread count.

- **Scenario 2: Marking a Single Notification as Read**
    - **Given** I have an unread notification.
    - **When** I mark it as read individually.
    - **Then** it should disappear from the unread list and the badge count should decrease.

- **Scenario 3: Marking All Notifications as Read**
    - **Given** I have multiple unread notifications.
    - **When** I choose "Mark all as read."
    - **Then** all notifications should be cleared from the unread list and the badge should disappear.

- **Scenario 4: Navigating from a Notification**
    - **Given** I have a notification that links to a specific page (e.g. a graded activity).
    - **When** I click on it.
    - **Then** I should be marked as having read it, and taken directly to the linked page.