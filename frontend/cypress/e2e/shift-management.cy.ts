describe("TC-Scheduling-04 - Admin shift management workflow", () => {
    const admin = {
        id: 1,
        firstName: "Ada",
        lastName: "Admin",
        email: "admin@example.com",
        username: "admin",
        role: "Admin"
    };

    let shift = {
        id: 12,
        name: "Morning",
        startTime: "08:00",
        endTime: "12:00",
        assignees: 0
    };
    let deleted = false;

    beforeEach(() => {
        cy.intercept("GET", /\/auth\/me/i, {
            statusCode: 200,
            body: { user: admin }
        });

        cy.intercept("GET", "**/api/Shifts?*", (request) => {
            request.reply({
                statusCode: 200,
                body: deleted
                    ? { items: [], totalItems: 0, totalPages: 0 }
                    : { items: [shift], totalItems: 1, totalPages: 1 }
            });
        }).as("getShifts");

        cy.intercept("POST", "**/api/Shifts", (request) => {
            shift = { ...shift, ...request.body, id: 12 };
            request.reply({ statusCode: 200, body: shift });
        }).as("createShift");

        cy.intercept("PATCH", `**/api/Shifts/${shift.id}`, (request) => {
            shift = { ...shift, ...request.body };
            request.reply({ statusCode: 200, body: shift });
        }).as("updateShift");

        cy.intercept("DELETE", `**/api/Shifts/${shift.id}`, (request) => {
            deleted = true;
            request.reply({ statusCode: 200, body: null });
        }).as("deleteShift");
    });

    it("creates, edits, and deletes a shift from the manager dashboard", () => {
        cy.visit("/manager/dashboard");
        cy.contains("Manage Shifts", { timeout: 10000 }).click();
        cy.wait("@getShifts");

        cy.contains("Add Shift").scrollIntoView().click({ force: true });
        cy.contains("Create Shift").should("exist");
        cy.get('input[name="name"]').type("Evening", { force: true });
        cy.get('input[name="startTime"]').type("16:00", { force: true });
        cy.get('input[name="endTime"]').type("20:00", { force: true });
        cy.contains("button", "Save Changes").click({ force: true });
        cy.wait("@createShift");
        cy.contains("Evening").should("be.visible");

        cy.contains("Evening").closest("tr").find("button").first().click({ force: true });
        cy.contains("Edit Shifts").should("exist");
        cy.get('input[name="name"]').clear({ force: true }).type("Updated Evening", { force: true });
        cy.get('input[name="endTime"]').clear({ force: true }).type("21:00", { force: true });
        cy.contains("button", "Save Changes").click({ force: true });
        cy.wait("@updateShift");
        cy.contains("Updated Evening").should("be.visible");
        cy.contains("21:00").should("be.visible");

        cy.contains("Updated Evening").closest("tr").find("button").eq(1).click({ force: true });
        cy.contains("About to delete a Shift").should("exist");
        cy.contains("button", "Confirm").click({ force: true });
        cy.wait("@deleteShift");
        cy.contains("Updated Evening").should("not.exist");
    });
});
