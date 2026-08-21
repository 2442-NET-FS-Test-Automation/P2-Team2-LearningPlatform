import { mount } from "cypress/react";
import { MemoryRouter } from "react-router-dom";
import CourseCard, { CourseCardProps } from "../../src/components/CourseCard";

describe("CourseCard - TC-CM-01 capacity status thresholds", () => {
    // Helper to mount CourseCard with given props
    const mountCard = (props: Partial<CourseCardProps> = {}) => {
        const defaultProps: CourseCardProps = {
            Id: 1,
            Name: "Test Course",
            Description: "A test course",
            CategoryName: "Programming",
            IsFull: 0,
            IsEnrolled: false,
            Completed: false,
        };
        const mergedProps = { ...defaultProps, ...props };
        mount(
            <MemoryRouter>
                <CourseCard {...mergedProps} />
            </MemoryRouter>
        );
    };

    it('displays "Open seats" for IsFull < 50 (49)', () => {
        mountCard({ IsFull: 49 });
        cy.contains("Open seats").should("exist");
    });

    it('displays "Filling up" for IsFull = 50 (boundary)', () => {
        mountCard({ IsFull: 50 });
        cy.contains("Filling up").should("exist");
    });

    it('displays "Filling up" for IsFull = 79 (within 50-79)', () => {
        mountCard({ IsFull: 79 });
        cy.contains("Filling up").should("exist");
    });

    it('displays "Almost full" for IsFull = 80 (boundary)', () => {
        mountCard({ IsFull: 80 });
        cy.contains("Almost full").should("exist");
    });

    it('displays "Almost full" for IsFull = 99 (within 80-99)', () => {
        mountCard({ IsFull: 99 });
        cy.contains("Almost full").should("exist");
    });

    it('displays "Full" for IsFull = 100 (boundary)', () => {
        mountCard({ IsFull: 100 });
        cy.contains("Full").should("exist");
    });

    it('displays "Enrolled" when IsEnrolled is true, regardless of capacity', () => {
        mountCard({ IsFull: 100, IsEnrolled: true });
        cy.contains("Enrolled").should("exist");

        // Ensure capacity status is not shown
        cy.contains("Full").should("not.exist");
        cy.contains("Almost full").should("not.exist");
    });

    it('displays "Completed" when Completed is true, regardless of everything else', () => {
        mountCard({ IsFull: 100, IsEnrolled: true, Completed: true });
        cy.contains("Completed").should("exist");

        // Ensure other status is not shown
        cy.contains("Enrolled").should("not.exist");
        cy.contains("Full").should("not.exist");
        cy.contains("Almost full").should("not.exist");
    });
});