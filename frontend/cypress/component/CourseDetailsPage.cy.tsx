import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "../../src/ctx/AuthCtx";
import CourseDetailsPage from "../../src/pages/courses/CourseDetailsPage";

describe("TC-CM-19 - CourseDetailsPage admin edit flow", () => {
    const course = {
        id: 1,
        name: "Algorithms",
        description: "Introduction to algorithms",
        about: "Learn algorithms",
        category: "Programming",
        instructor: "Grace Hopper",
        price: 50,
        hours: 20,
        capacity: 30,
        certification: true,
        isActive: true,
        enrolledStudents: 5,
        schedule: []
    };

    beforeEach(() => {
        cy.intercept("GET", "**/auth/me", {
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
        cy.intercept("GET", "**/Courses/1", { statusCode: 200, body: course }).as("getCourse");
        cy.intercept("GET", "**/Activities/course/1*", { statusCode: 200, body: [] });
    });

    it("opens and closes EditCourseModal for the selected course", () => {
        cy.mount(
            <AuthProvider>
                <MemoryRouter initialEntries={["/courses/1"]}>
                    <Routes>
                        <Route path="/courses/:id" element={<CourseDetailsPage />} />
                    </Routes>
                </MemoryRouter>
            </AuthProvider>
        );

        cy.wait("@getCourse");
        cy.contains("Edit Course").scrollIntoView().should("be.visible").click();
        cy.contains("Edit details of an existing course").should("be.visible");
        cy.get('input[name="name"]').should("have.value", course.name);
        cy.contains("Cancel").click();
        cy.contains("Edit details of an existing course").should("not.exist");
    });
});
