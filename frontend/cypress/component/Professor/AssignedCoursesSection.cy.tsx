import { mount } from "cypress/react";
import { MemoryRouter } from "react-router-dom";
import AssignedCoursesSection from "../../../src/pages/dashboard/Professor/AssignedCoursesSection";

describe("AssignedCoursesSection - Professor Assigned Courses (TC-Prof-02)", () => {
    it("displays a loading state", () => {
        mount(
            <MemoryRouter>
                <AssignedCoursesSection courses={[]} loading={true} error={null} />
            </MemoryRouter>
        );

        cy.contains("Loading courses...").should("exist");
    });

    it("displays an error state", () => {
        mount(
            <MemoryRouter>
                <AssignedCoursesSection courses={[]} loading={false} error="Failed to fetch courses" />
            </MemoryRouter>
        );

        cy.contains("Failed to fetch courses").should("exist");
    });

    it("displays empty state when no courses", () => {
        mount(
            <MemoryRouter>
                <AssignedCoursesSection courses={[]} loading={false} error={null} />
            </MemoryRouter>
        );

        cy.contains("You have no assigned courses.").should("exist");
    });

    it("displays the list of assigned courses and view links", () => {
        const mockCourses = [
            {
                id: 1,
                name: "React 101",
                categoryName: "Programming",
                isActive: true,
                capacity: 30,
                description: "",
                certification: false,
                price: 0
            },
            {
                id: 2,
                name: "Advanced UX",
                categoryName: "Design",
                isActive: true,
                capacity: 20,
                description: "",
                certification: true,
                price: 50
            }
        ];

        mount(
            <MemoryRouter>
                <AssignedCoursesSection courses={mockCourses} loading={false} error={null} />
            </MemoryRouter>
        );

        cy.contains("React 101").should("exist");
        cy.contains("Advanced UX").should("exist");

        // The View links should point to /courses/:id
        cy.get('a[href="/courses/1"]').should("exist");
        cy.get('a[href="/courses/2"]').should("exist");
    });
});
