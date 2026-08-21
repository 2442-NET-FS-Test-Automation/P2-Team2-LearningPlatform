describe("TC-UserMgmt-08 - Student promotion", () => {
    const student = {
        id: 7,
        username: "student7",
        firstName: "Grace",
        lastName: "Hopper",
        email: "grace@example.com",
        role: "Student",
        isActive: true
    };

    let promoted = false;

    beforeEach(() => {
        cy.intercept("GET", /\/auth\/me/i, (request) => {
            request.reply({
                statusCode: 200,
                body: {
                    user: promoted
                        ? { ...student, role: "Professor" }
                        : { ...student, role: "Admin", id: 1, username: "admin" }
                }
            });
        });

        cy.intercept("GET", "**/api/Users?*", {
            statusCode: 200,
            body: { items: [student], totalItems: 1, totalPages: 1 }
        }).as("getUsers");

        cy.intercept("GET", `**/api/Users/${student.id}`, {
            statusCode: 200,
            body: { ...student, student: { birthDate: "2000-01-01", courses: [] } }
        }).as("getStudent");

        cy.intercept("POST", `**/api/Users/${student.id}/promote`, (request) => {
            expect(request.body.shiftId).to.equal(1);
            expect(request.body.contractDate).to.match(/^\d{4}-\d{2}-\d{2}$/);
            promoted = true;
            request.reply({ statusCode: 204, body: null });
        }).as("promoteUser");

        cy.intercept("GET", "**/api/Professors/MyCourses*", {
            statusCode: 200,
            body: []
        }).as("getProfessorCourses");

        cy.intercept("GET", "**/api/Professors/Shift*", {
            statusCode: 200,
            body: { id: 1, name: "Morning" }
        }).as("getProfessorShift");
    });

    it("promotes a student and allows access to professor features", () => {
        cy.visit("/manager/dashboard");
        cy.contains("Manage Users", { timeout: 10000 }).click();
        cy.wait("@getUsers");

        cy.contains("td", student.username)
            .closest("tr")
            .find('button[title="Promote to Professor"]')
            .click();

        cy.contains("Promote to Professor").should("exist");
        cy.contains("button", "Promote").click({ force: true });
        cy.wait("@promoteUser");

        cy.visit("/professor/dashboard");
        cy.contains("Professor Dashboard").should("be.visible");
        cy.contains(`Welcome back, ${student.firstName}`).should("be.visible");
        cy.contains("My Courses").should("be.visible");
        cy.contains("Schedule").should("be.visible");
        cy.wait("@getProfessorCourses");
        cy.wait("@getProfessorShift");
    });
});
