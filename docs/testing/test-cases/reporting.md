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
Status:       (not started)
```
```
TC-Reporting-02
Trace:        REQ-12 (reports - unauthorized access)
Level:        Integration — Backend (Authorization middleware)
Technique:    Negative testing
Precondition: authenticated Student or Professor user
Steps:        request reports endpoint
Expected:     403 Forbidden and report information is not returned
Status:       (not started)
```