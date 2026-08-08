# Course Management related Test Cases
Following naming like:
TC-CM-##

## REQ-06 Anonymous user browses courses

```
TC-CM-01
Trace:        REQ-06 (catalog - capacity status thresholds)
Level:        Unit — Frontend (CourseCard status logic)
Technique:    Boundary-value analysis (IsFull thresholds at 50/80/100)
Precondition: none (pure rendering logic test with mocked props)
Steps:        render CourseCard with IsFull = 49, 50, 79, 80, 99, 100
Expected:     "Open seats" below 50, "Filling up" at 50-79, "Almost full" at
              80-99, "Full" at 100, matching exactly at each boundary
Status:       (not started)
```
```
TC-CM-02
Trace:        REQ-06 (catalog - anonymous access to enabled courses)
Level:        Integration — Backend (CoursesController.GetEnabled)
Technique:    Equivalence partitioning (no Authorization header required)
Precondition: at least one active and one inactive course exist
Steps:        GET /Courses/enabled with no Authorization header
Expected:     200 response; only the active course appears in the results;
              the inactive one is excluded
Status:       (not started)
```
```
TC-CM-03
Trace:        REQ-06 (catalog - combined search and category filter)
Level:        Integration — Backend (CoursesController.GetEnabled)
Technique:    Pairwise/combinatorial testing (search term x category filter)
Precondition: multiple active courses across at least two categories, with
              overlapping and non-overlapping name substrings
Steps:        GET /Courses/enabled with searchName + categoryFilter combined,
              across several combinations
Expected:     each combination returns only courses matching both conditions;
              no combination returns a course failing either filter
Status:       (not started)
```
```
TC-CM-04
Trace:        REQ-06 (catalog - empty result state)
Level:        Integration — Frontend (CoursesPage, mocked API)
Technique:    Equivalence partitioning (zero-result boundary)
Precondition: /Courses/enabled mocked to return an empty items array
Steps:        load the Courses page with a search term matching nothing
Expected:     "No course matches the search." message rendered; no course cards shown
Status:       (not started)
```
```
TC-CM-05
Trace:        REQ-06 (catalog - anonymous browsing journey)
Level:        E2E — Selenium
Technique:    Scenario testing (no session)
Precondition: browser has no session/cookies
Steps:        visit /courses, click into a course's detail page
Expected:     no "Enroll" button state offering direct enrollment (shows
              "Login to Enroll" instead); course details, schedule, and
              instructor are visible; no student-only sections (pending/
              completed activities) render
Status:       (not started)
```
```
TC-CM-06
Trace:        REQ-06 (catalog - direct link to a deactivated course)
Level:        E2E — Selenium
Technique:    Negative testing
Precondition: a course exists with IsActive = false; browser has no session
Steps:        navigate directly to /courses/{id} for that course's id
Expected:     NotFoundPage is shown; no course details, schedule, or activity
              data is exposed in the page or in network responses
Status:       (not started)
```

## REQ-07 Pagination works correctly
```
TC-CM-07
Trace:        REQ-07 (pagination - server-side clamping)
Level:        Unit — Backend (pagination normalization logic)
Technique:    Boundary-value analysis (page: 0, 1; pageSize: 0, 50, 51)
Precondition: none (pure function/logic test)
Steps:        normalize (page=0, pageSize=0), (page=-1, pageSize=51),
              (page=1, pageSize=50)
Expected:     page below 1 clamps to 1; pageSize below 1 falls back to the
              default; pageSize above 50 clamps to 50; page=1/pageSize=50
              passes through unchanged
Status:       (not started)
```
```
TC-CM-08
Trace:        REQ-07 (pagination - control button boundaries)
Level:        Unit — Frontend (PaginationControls handlers)
Technique:    Boundary-value analysis (first/last page edges)
Precondition: component rendered with currentPage=1 and currentPage=totalPages
              in separate test instances
Steps:        call handlePrevious() at currentPage=1; call handleNext() at
              currentPage=totalPages
Expected:     currentPage does not go below 1 or above totalPages in either case;
              the corresponding button is rendered disabled
Status:       (not started)
```
```
TC-CM-09
Trace:        REQ-07 (pagination - end-to-end clamp through the API)
Level:        Integration — Backend (CoursesController.GetAll + DB)
Technique:    Boundary-value analysis, combined with TotalPages calculation check
Precondition: more than 50 active courses exist in the test DB
Steps:        GET /Courses?page=0&pageSize=999
Expected:     response reflects page=1 and pageSize=50; items.length <= 50;
              TotalPages equals ceil(TotalItems / 50)
Status:       (not started)
```
```
TC-CM-10
Trace:        REQ-07 (pagination - items-per-page resets to page 1)
Level:        Integration — Frontend (CoursesPage, mocked API)
Technique:    State transition
Precondition: component on page 3 of a multi-page result set
Steps:        change the "items per page" selector to a new value
Expected:     currentPage resets to 1; the API is re-queried with page=1 and
              the new pageSize
Status:       (not started)
```
```
TC-CM-11
Trace:        REQ-07 (pagination - full navigation journey)
Level:        E2E — Selenium
Technique:    Boundary-value analysis + UI state verification
Precondition: enough courses exist to span at least 3 pages
Steps:        click "Next" repeatedly to reach the last page, then attempt to
              click "Next" again; click "Previous" back to page 1, then attempt
              "Previous" again
Expected:     the "Next" button is disabled on the last page and "Previous" is
              disabled on page 1; page contents update correctly at each step;
              no page beyond totalPages or below 1 is ever reached
Status:       (not started)
```

## REQ-10 Admin manages courses
```
TC-CM-12
Trace:        REQ-10 (course management - create course)
Level:        Integration — Backend (CoursesController.Create + DB)
Technique:    Equivalence partitioning (valid course information)
Precondition: authenticated Admin user
Steps:        create a new course with valid information
Expected:     course is created successfully and persisted in the database
Status:       Passed
```
```
TC-CM-13
Trace:        REQ-10 (course management - update course)
Level:        Integration — Backend (CoursesController.Update + DB)
Technique:    State transition (existing course -> updated course)
Precondition: authenticated Admin user; existing course
Steps:        modify the course information
Expected:     updated values are stored and returned by subsequent requests
Status:       Passed
```
```
TC-CM-14
Trace:        REQ-10 (course management - deactivate course)
Level:        Integration — Backend (CoursesController.Delete + DB)
Technique:    State transition (active -> inactive)
Precondition: authenticated Admin user; active course exists
Steps:        deactivate the course
Expected:     course becomes inactive and no longer appears in the public catalog
Status:       Passed
```
```
TC-CM-15a
Trace:        REQ-10 (course management - name below minimum length)
Level:        Integration — Backend (CoursesController.Create)
Technique:    Boundary-value analysis (MinLength=3, value=2)
Precondition: authenticated Admin; valid ProfessorId exists
Steps:        POST /api/Courses with Name = "AB" (2 chars)
Expected:     400 — validation error naming the Name field; no course persisted
```

```
TC-CM-15b
Trace:        REQ-10 (course management - name at minimum length)
Level:        Integration — Backend
Technique:    Boundary-value analysis (MinLength=3, value=3)
Precondition: same as TC-CM-15a
Steps:        POST /api/Courses with Name = "ABC" (3 chars), all other fields valid
Expected:     201 — course created successfully
```

```
TC-CM-15c
Trace:        REQ-10 (course management - name at maximum length)
Level:        Integration — Backend
Technique:    Boundary-value analysis (MaxLength=100, value=100)
Precondition: same as TC-CM-15a
Steps:        POST /api/Courses with Name = string of exactly 100 chars
Expected:     201 — course created successfully
```

```
TC-CM-15d
Trace:        REQ-10 (course management - name above maximum length)
Level:        Integration — Backend
Technique:    Boundary-value analysis (MaxLength=100, value=101)
Precondition: same as TC-CM-15a
Steps:        POST /api/Courses with Name = string of 101 chars
Expected:     400 — validation error naming the Name field
```

```
TC-CM-15e
Trace:        REQ-10 (course management - invalid professor)
Level:        Integration — Backend
Technique:    Equivalence partitioning (invalid ProfessorId class)
Precondition: authenticated Admin
Steps:        POST /api/Courses with ProfessorId = 99999 (non-existent)
Expected:     400 — professor not found; no course persisted
```

```
TC-CM-16
Trace:        REQ-10 (course management - course retrieval after creation/update)
Level:        Integration — Backend (CoursesController.GetById + DB)
Technique:    State transition (course created/updated -> retrieved)
Precondition: authenticated Admin user; existing course
Steps:        create or update a course, then retrieve the course by its ID
Expected:     the course is returned successfully with the latest persisted
              information, including its name, description, category, price,
              hours, certification status, schedule, and assigned professor
Status:       (not started)
```

```
TC-CM-17
Trace:        REQ-10 (course management - assign professor)
Level:        Integration — Backend (CoursesController + DB)
Technique:    State transition (course without professor -> assigned professor)
Precondition: authenticated Admin user; existing course and valid professor
Steps:        assign the professor to the course
Expected:     course is successfully updated with the selected professor;
              subsequent course retrieval returns the assigned professor
Status:       (not started)
```

```
TC-CM-18
Trace:        REQ-10 (course management - complete admin workflow)
Level:        E2E — Selenium
Technique:    Scenario testing
Precondition: authenticated Admin user
Steps:        create a course, open the course details page, edit the course
              information, verify the changes, and deactivate the course
Expected:     the course is created and displayed correctly; edited
              information is reflected in the UI; after deactivation the
              course is no longer available in the public catalog
Status:       (not started)
```

```
TC-CM-19
Trace:        REQ-10 (course management - edit course UI)
Level:        Unit — Frontend (CourseDetailsPage/EditCourseModal)
Technique:    State transition + component interaction
Precondition: CourseDetailsPage is rendered with a valid course and an
              authenticated Admin user; API calls are mocked
Steps:        render CourseDetailsPage; click the "Edit Course" button;
              verify that EditCourseModal is displayed; close the modal
Expected:     "Edit Course" button is visible for the Admin; clicking it
              opens EditCourseModal with the selected courseId; closing
              the modal removes it from the rendered UI
Status:       (not started)
```

## REQ-20 Professor only manages assigned courses

