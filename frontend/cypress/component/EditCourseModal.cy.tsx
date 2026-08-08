import EditCourseModal from "../../src/components/modals/EditCourseModal";

describe("TC-CM-17 - EditCourseModal error handling", () => {
    it("displays an error when updating the course fails", () => {
        cy.intercept("GET", "**/api/Courses/1", {
            statusCode: 200,
            body: {
                id: 1,
                name: "Algorithms",
                description: "Introduction to algorithms",
                about: "Learn algorithms",
                category: "Programming",
                price: 499.99,
                hours: 40,
                capacity: 30,
                certification: true,
                isActive: true,
                schedule: []
            }
        }).as("getCourse");

        cy.intercept("PATCH", "**/api/Courses/1", {
            statusCode: 400,
            body: {
                error: "Failed to update course"
            }
        }).as("updateCourse");

        const onClose = cy.stub().as("onClose");
        const onUpdated = cy.stub().as("onUpdated");

        cy.mount(
            <EditCourseModal
                courseId={1}
                onClose={onClose}
                onUpdated={onUpdated}
            />
        );

        cy.wait("@getCourse");

        cy.contains("Edit Course").should("be.visible");

        cy.get('input[name="name"]')
            .clear()
            .type("Updated Algorithms");

        cy.contains("Save Changes").click();

        cy.wait("@updateCourse");

        cy.contains("Failed to update course.")
            .should("be.visible");

        cy.get("@onUpdated")
            .should("not.have.been.called");

    });
});