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

## REQ-14	Student unenrolls from courses

## REQ-21	Student schedule conflicts are validated

