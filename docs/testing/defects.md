```
DEFECT-01
Description:    CreateCourseDto accepts invalid values (empty name, negative price, zero capacity) with no server-side rejection.

Found bu:       TC-CM-15 design phase - No Data Annotations on DTO, no manual validation in controller or repo.
REQ:            REQ-10
Status:         Fixed
FIX PR:         #200
```