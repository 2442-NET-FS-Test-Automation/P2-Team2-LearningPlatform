# Reporting related Test Cases
Following naming like:
TC-Reporting-##

## REQ-12 Admin views reports
```
TC-Reporting-01
Trace:        REQ-12 (reports - view reports dashboard)
Level:        Integration — Backend (ReportsController)
Technique:    Equivalence partitioning (available reports)
Precondition: authenticated Admin user
Steps:        request reports endpoint
Expected:     200 response containing report information
Status:       Passed
```
```
TC-Reporting-02
Trace:        REQ-12 (reports - unauthorized access)
Level:        Integration — Backend (Authorization middleware)
Technique:    Negative testing
Precondition: authenticated Student or Professor user
Steps:        request reports endpoint
Expected:     403 Forbidden and report information is not returned
Status:       Passed
```
```
TC-Reporting-03
Trace:        REQ-12 (reports - Admin reports dashboard)
Level:        E2E — Cypress
Technique:    Scenario testing + UI data verification
Precondition: authenticated Admin user; report data is available
Steps:        open the Manager Dashboard; view Reports; verify summary totals
              and top courses; refresh the report
Expected:     totals and top courses are displayed correctly, and refresh
              requests the report endpoint again
Status:       Implemented in `frontend/cypress/e2e/reporting.cy.ts`
```