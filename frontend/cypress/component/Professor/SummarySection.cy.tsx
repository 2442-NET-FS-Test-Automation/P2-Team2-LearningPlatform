import { mount } from "cypress/react";
import { MemoryRouter } from "react-router-dom";
import SummarySection from "../../../src/pages/dashboard/Professor/SummarySection";

describe("SummarySection - Professor Dashboard Stats (TC-Prof-25)", () => {
    it("displays a loading spinner initially", () => {
        // Intercept with delay to ensure loading state is visible
        cy.intercept("GET", "**/api/Professors/Summary", {
            delay: 500,
            body: {}
        }).as("getSummary");

        mount(
            <MemoryRouter>
                <SummarySection />
            </MemoryRouter>
        );

        cy.get(".animate-spin").should("exist");
    });

    it("displays error message on failed API call", () => {
        cy.intercept("GET", "**/api/Professors/Summary", {
            statusCode: 500,
            body: { error: "Server error" }
        }).as("getSummaryError");

        mount(
            <MemoryRouter>
                <SummarySection />
            </MemoryRouter>
        );

        cy.wait("@getSummaryError");
        cy.contains("Failed to load summary data.").should("exist");
    });

    it("renders metrics and top courses correctly on success", () => {
        const mockSummary = {
            totalCourses: 5,
            totalStudents: 120,
            totalActivities: 10,
            pendingSubmissionsToGrade: 3,
            topCourses: [
                {
                    courseId: 101,
                    name: "Advanced Cypress Testing",
                    category: "QA",
                    enrolledStudentsCount: 45
                },
                {
                    courseId: 102,
                    name: "Intro to React",
                    category: "Programming",
                    enrolledStudentsCount: 30
                }
            ]
        };

        cy.intercept("GET", "**/api/Professors/Summary", {
            statusCode: 200,
            body: mockSummary
        }).as("getSummarySuccess");

        mount(
            <MemoryRouter>
                <SummarySection />
            </MemoryRouter>
        );

        cy.wait("@getSummarySuccess");

        // Metrics
        cy.contains("Total Courses").parent().find("h4").should("have.text", "5");
        cy.contains("Students Enrolled").parent().find("h4").should("have.text", "120");
        cy.contains("Active Activities").parent().find("h4").should("have.text", "10");
        cy.contains("Pending Grading").parent().find("h4").should("have.text", "3");

        // Top Courses
        cy.contains("Top Courses by Enrollments").should("exist");
        cy.contains("Advanced Cypress Testing").should("exist");
        cy.contains("QA").should("exist");
        cy.contains("45").should("exist");
        
        cy.contains("Intro to React").should("exist");
        cy.contains("Programming").should("exist");
        cy.contains("30").should("exist");
    });
});
