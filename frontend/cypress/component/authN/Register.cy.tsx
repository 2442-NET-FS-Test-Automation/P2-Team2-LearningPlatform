import { MemoryRouter } from "react-router-dom";
import { mount } from "cypress/react";

import { AuthProvider } from "../../../src/ctx/AuthCtx";
import RegisterPage from "../../../src/pages/auth/RegisterPage"
import { RegisterPOM } from "../../PageModels/RegisterPOM";

const user = {
    id: 1,
    firstName: "Test",
    lastName: "User",
    email: "test@example.com",
    username: "testuser",
    role: "Student",
}

describe("Register Page Test - TC-AuthN-01 - birth date eligibility", () => {
    let registerSpy: Cypress.Agent<sinon.SinonSpy>;

    beforeEach(() => {
        // Stub API calls to avoid real requests
        cy.intercept("GET", "**/auth/me", {
            statusCode: 200,
            body: { user: null },
        }).as("getMe");

        registerSpy = cy.spy().as("registerSpy");

        cy.intercept("POST", "**/auth/register", (req) => {
            registerSpy();
            req.reply({
                statusCode: 200,
                body: { user },
            });
        }).as("register");
    });

    it("valid - birth date exactly 12 years ago", () => {
        const registerPOM = new RegisterPOM();
        const today = new Date();
        const twelveYearsAgo = new Date(today);
        twelveYearsAgo.setFullYear(twelveYearsAgo.getFullYear() - 12);
        const validDate = twelveYearsAgo.toISOString().split("T")[0];

        mount(
            <MemoryRouter>
                <AuthProvider> 
                    <RegisterPage />
                </AuthProvider>
            </MemoryRouter>
        );

        cy.contains("h1", "Create Account");

        // Fill all required fields and submit
        registerPOM
            .fillForm(user.firstName, user.lastName, validDate, user.username, user.email, "Password123!")
            .submit();

        registerPOM.ErrorMessage().should("not.exist");

        cy.get("@registerSpy").should("be.called", 1);
        cy.wait("@register");
    });

    it("invalid - birth date 12 years minus 1 day", () => {
        const registerPOM = new RegisterPOM();
        const today = new Date();
        const elevenYearsAgo = new Date(today);
        elevenYearsAgo.setFullYear(elevenYearsAgo.getFullYear() - 11);
        const invalidDate = elevenYearsAgo.toISOString().split("T")[0];

        mount(
            <MemoryRouter>
                <AuthProvider>
                    <RegisterPage />
                </AuthProvider>
            </MemoryRouter>
        );

        cy.contains("h1", "Create Account");

        // Fill all required fields and submit
        registerPOM
            .fillForm(user.firstName, user.lastName, invalidDate, user.username, user.email, "Password123!")
            .submit();

        // Assert that the error message appears
        const error = registerPOM.ErrorMessage();
        error.should("exist");
        error.should("contain.text", "You have to be 12 years old to register");

        // Ensure the registration API was NOT called (validation fails before network)
        cy.get("@registerSpy").should("not.be.called");
    });
});