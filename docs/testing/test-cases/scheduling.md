# Scheduling related Test Cases
Following naming like:
TC-Scheduling-##

## REQ-11 Admin manages shifts
```
TC-Scheduling-01
Trace:        REQ-11 (shift management - create shift)
Level:        Integration — Backend (ShiftController + DB)
Technique:    Equivalence partitioning (valid shift data)
Precondition: authenticated Admin user
Steps:        create a shift with valid start and end times
Expected:     shift is created successfully
Status:       Passed
```
```
TC-Scheduling-02
Trace:        REQ-11 (shift management - update shift)
Level:        Integration — Backend (ShiftController + DB)
Technique:    State transition (old shift -> updated shift)
Precondition: existing shift exists
Steps:        modify shift information
Expected:     shift information is updated
Status:       Passed
```
```
TC-Scheduling-03
Trace:        REQ-11 (shift management - invalid schedule)
Level:        Unit — Backend (shift validation)
Technique:    Boundary-value analysis
Precondition: none
Steps:        create shift where ending time is before starting time
Expected:     validation fails
Status:       Passed
```

```
TC-Scheduling-04
Trace:        REQ-11 (shift management - admin workflow)
Level:        E2E — Cypress
Technique:    Scenario testing + state transitions
Precondition: authenticated Admin user
Steps:        open Manage Shifts; create a shift; edit its name and end time;
              delete the shift after confirming the action
Expected:     the shift is created and displayed in the table; edited values
              are reflected; after deletion the shift is no longer displayed
Status:       Implemented in `frontend/cypress/e2e/shift-management.cy.ts`
```

## REQ-21 Student schedule conflicts are validated

## REQ-22	Professor shift constraints are validated
