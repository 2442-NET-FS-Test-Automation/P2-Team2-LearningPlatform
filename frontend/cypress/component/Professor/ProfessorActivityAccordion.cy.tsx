import { mount } from "cypress/react";
import ProfessorActivityAccordion from "../../../src/components/ProfessorActivityAccordion";
import { ActivityWithSubmissions } from "../../../src/lib/types";

describe("ProfessorActivityAccordion - Grade Form (TC-Prof-05) & Activity Actions", () => {
    
    const mockActivity: ActivityWithSubmissions = {
        id: 1,
        courseId: 100,
        title: "Test Activity",
        description: "Test",
        dueDate: new Date().toISOString(),
        isActive: true,
        createdByUserId: 1,
        submissions: [
            {
                id: 1,
                activityId: 1,
                studentId: 2,
                studentName: "Jane Doe",
                file: "homework.pdf",
                submittedAt: new Date().toISOString(),
                gradedAt: null,
                score: undefined,
                feedback: undefined
            }
        ]
    };

    it("displays the correct title and ungraded count", () => {
        mount(
            <ProfessorActivityAccordion
                activity={mockActivity}
                activityTab="active"
                onGrade={cy.stub().as("onGrade")}
                onDelete={cy.stub()}
                onReactivate={cy.stub()}
            />
        );

        cy.contains("Test Activity").should("exist");
        cy.contains("1 awaiting grade").should("exist");
    });

    it("expands to show submissions and grade form", () => {
        mount(
            <ProfessorActivityAccordion
                activity={mockActivity}
                activityTab="active"
                onGrade={cy.stub().as("onGrade")}
                onDelete={cy.stub()}
                onReactivate={cy.stub()}
            />
        );

        // Click to expand
        cy.contains("Test Activity").click();

        // Should show submission details
        cy.contains("Student Jane Doe").should("exist");
        cy.contains("homework.pdf").should("exist");

        // Grade form should exist
        cy.get('input[placeholder="Grade"]').should("exist");
        cy.get('textarea[placeholder="Feedback"]').should("exist");
        cy.contains("button", "Save").should("exist");
    });

    it("calls onGrade when save button is clicked with valid grade", () => {
        const onGradeStub = cy.stub().as("onGradeStub").resolves();
        mount(
            <ProfessorActivityAccordion
                activity={mockActivity}
                activityTab="active"
                onGrade={onGradeStub}
                onDelete={cy.stub()}
                onReactivate={cy.stub()}
            />
        );

        cy.contains("Test Activity").click();

        // Fill grade
        cy.get('input[placeholder="Grade"]').type("95");
        cy.get('textarea[placeholder="Feedback"]').type("Good job");

        // Click save
        cy.contains("button", "Save").click();

        cy.get("@onGradeStub").should("have.been.calledWith", 1, 95, "Good job");
    });

    it("displays Update button if submission is already graded (TC-Prof-05)", () => {
        const gradedActivity = {
            ...mockActivity,
            submissions: [
                {
                    ...mockActivity.submissions[0],
                    gradedAt: new Date().toISOString(),
                    score: 80,
                    feedback: "Needs work"
                }
            ]
        };

        mount(
            <ProfessorActivityAccordion
                activity={gradedActivity}
                activityTab="active"
                onGrade={cy.stub()}
                onDelete={cy.stub()}
                onReactivate={cy.stub()}
            />
        );

        cy.contains("Test Activity").click();

        // Form should be pre-filled
        cy.get('input[placeholder="Grade"]').should("have.value", "80");
        cy.get('textarea[placeholder="Feedback"]').should("have.value", "Needs work");

        // Button should say Update
        cy.contains("button", "Update").should("exist");
    });

    it("calls onDelete when Archive button is clicked in active tab", () => {
        const onDeleteStub = cy.stub().as("onDeleteStub");
        mount(
            <ProfessorActivityAccordion
                activity={mockActivity}
                activityTab="active"
                onGrade={cy.stub()}
                onDelete={onDeleteStub}
                onReactivate={cy.stub()}
            />
        );

        cy.get('button[title="Archive activity"]').click();
        cy.get("@onDeleteStub").should("have.been.calledWith", 1);
    });

    it("calls onReactivate when Reactivate button is clicked in archived tab", () => {
        const onReactivateStub = cy.stub().as("onReactivateStub");
        mount(
            <ProfessorActivityAccordion
                activity={mockActivity}
                activityTab="archived"
                onGrade={cy.stub()}
                onDelete={cy.stub()}
                onReactivate={onReactivateStub}
            />
        );

        cy.get('button[title="Reactivate activity"]').click();
        cy.get("@onReactivateStub").should("have.been.calledWith", 1);
    });
});
