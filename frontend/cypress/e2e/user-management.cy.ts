describe("TC-UserMgmt-09 - Admin user management workflow", () => {
    const admin = {
        id: 1,
        firstName: "Ada",
        lastName: "Admin",
        email: "admin@example.com",
        username: "admin",
        role: "Admin"
    };

    let user = {
        id: 7,
        username: "student7",
        firstName: "Grace",
        lastName: "Hopper",
        email: "grace@example.com",
        role: "Student",
        isActive: true,
        bio: "Student bio"
    };

    beforeEach(() => {
        cy.intercept("GET", /\/auth\/me/i, {
            statusCode: 200,
            body: { user: admin }
        });

        cy.intercept("GET", "**/api/Users?*", (request) => {
            request.reply({
                statusCode: 200,
                body: {
                    items: [user],
                    totalItems: 1,
                    totalPages: 1
                }
            });
        }).as("getUsers");

        cy.intercept("GET", `**/api/Users/${user.id}`, {
            statusCode: 200,
            body: {
                ...user,
                student: {
                    birthDate: "2000-01-01",
                    courses: []
                }
            }
        }).as("getUserDetails");

        cy.intercept("GET", "**/api/Courses/enabled*", {
            statusCode: 200,
            body: { items: [] }
        }).as("getEnabledCourses");

        cy.intercept("PATCH", `**/api/Users/${user.id}`, (request) => {
            user = { ...user, ...request.body };
            request.reply({ statusCode: 200, body: { user } });
        }).as("updateUser");

        cy.intercept("DELETE", `**/api/Users/${user.id}`, (request) => {
            user = { ...user, isActive: false };
            request.reply({ statusCode: 204, body: null });
        }).as("deactivateUser");

        cy.intercept("POST", `**/api/Users/${user.id}/reactivate`, (request) => {
            user = { ...user, isActive: true };
            request.reply({ statusCode: 204, body: null });
        }).as("reactivateUser");
    });

    it("edits, deactivates, and reactivates a user from the dashboard", () => {
        cy.visit("/manager/dashboard");
        cy.contains("Manage Users", { timeout: 10000 }).click();
        cy.wait("@getUsers");

        const userRow = () => cy.contains("td", user.username).closest("tr");

        userRow().contains("Active").should("be.visible");
        userRow().find("button").eq(1).click();
        cy.wait("@getUserDetails");
        cy.wait("@getEnabledCourses");

        cy.get('input[name="firstName"]').scrollIntoView().clear().type("Updated", { force: true });
        cy.contains("button", "Save Changes").scrollIntoView().click({ force: true });
        cy.wait("@updateUser");
        cy.contains("td", "Updated").should("be.visible");

        userRow().find('button[title="Deactivate"]').click();
        cy.contains("Deactivate User").should("exist");
        cy.contains("button", "Deactivate").click({ force: true });
        cy.wait("@deactivateUser");
        cy.contains("td", "Inactive").should("be.visible");

        userRow().find('button[title="Reactivate"]').click();
        cy.contains("Reactivate User").should("exist");
        cy.contains("button", "Reactivate").click({ force: true });
        cy.wait("@reactivateUser");
        cy.contains("td", "Active").should("be.visible");
    });
});
