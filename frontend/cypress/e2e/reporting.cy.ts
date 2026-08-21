describe("TC-Reporting-03 - Admin reports dashboard", () => {
    const report = {
        totalCourses: 12,
        totalStudents: 48,
        totalEnrollments: 96,
        topCourses: [
            {
                courseId: 1,
                courseName: "Algorithms",
                enrollmentCount: 24
            },
            {
                courseId: 2,
                courseName: "Web Development",
                enrollmentCount: 18
            }
        ]
    };

    beforeEach(() => {
        cy.intercept("GET", /\/auth\/me/i, {
            statusCode: 200,
            body: {
                user: {
                    id: 1,
                    firstName: "Ada",
                    lastName: "Admin",
                    email: "admin@example.com",
                    username: "admin",
                    role: "Admin"
                }
            }
        });

        cy.intercept("GET", "**/api/Reports/general", {
            statusCode: 200,
            body: report
        }).as("getGeneralReport");
    });

    it("displays report totals and top courses and refreshes the data", () => {
        cy.visit("/manager/dashboard");
        cy.wait("@getGeneralReport");

        cy.contains("Reports").should("be.visible");
        cy.contains("12").should("be.visible");
        cy.contains("Total Courses").should("be.visible");
        cy.contains("48").should("be.visible");
        cy.contains("Total Students").should("be.visible");
        cy.contains("96").should("be.visible");
        cy.contains("Total Enrollments").should("be.visible");
        cy.contains("1. Algorithms").should("be.visible");
        cy.contains("24 enrolled").should("be.visible");
        cy.contains("2. Web Development").should("be.visible");

        cy.contains("button", "Refresh").click();
        cy.wait("@getGeneralReport");
        cy.contains("Top Courses by Enrollment").should("be.visible");
    });
});
