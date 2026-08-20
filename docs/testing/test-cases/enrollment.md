# Enrollment related Test Cases

Following naming like:
TC-Enroll-##

## REQ-13	Student enrolls in courses

```
TC-Enroll-01
Trace:        REQ-13 (enroll - successful enrollment, controller)
Level:        Unit - Backend (StudentsController.EnrollStudent)
Technique:    Equivalence partitioning (valid enroll class)
Precondition: mocked IStudentRepo; student exists for the given userId
Steps:        call EnrollStudent(userId, courseId)
Expected:     200 OK; EnrollAsync was called once with that student's Id and courseId
Status:       (passed)
```

```
TC-Enroll-02
Trace:        REQ-13 (enroll - user is not a student)
Level:        Unit - Backend (StudentsController.EnrollStudent)
Technique:    Negative testing
Precondition: mocked IStudentRepo; GetByUserIdAsync returns null
Steps:        call EnrollStudent(userId, courseId)
Expected:     400 Bad Request; EnrollAsync is never called
Status:       (passed)
```
```
TC-Enroll-03
Trace:        REQ-13 (enroll - already enrolled)
Level:        Unit - Backend (StudentsController.EnrollStudent)
Technique:    Negative testing
Precondition: mocked IStudentRepo; student exists; EnrollAsync returns false
Steps:        call EnrollStudent(userId, courseId)
Expected:     409 Conflict; EnrollAsync was called once
Status:       (not started)
```



## REQ-14	Student unenrolls from courses



## REQ-21	Student schedule conflicts are validated

