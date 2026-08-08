import { MemoryRouter } from "react-router-dom";
import { mount } from "cypress/react";

import { AuthProvider } from "../../../src/ctx/AuthCtx";
import LoginPage from "../../../src/pages/auth/LoginPage"
import { LoginPOM } from "../../PageModels/LoginPOM";

const user = {
    id: 1,
    firstName: "Test",
    lastName: "User",
    email: "test@example.com",
    username: "testuser",
    role: "Student",
}

describe("Login Page Test - TC-AuthN-07 - password length gate", () => {
    let loginSpy: Cypress.Agent<sinon.SinonSpy>;

    beforeEach(() => {
        cy.intercept("GET", "**/auth/me", {
            statusCode: 200,
            body: { user: null },
        }).as("getMe");

        loginSpy = cy.spy().as("loginSpy");

        cy.intercept("POST", "**/auth/login", (req) => {
            loginSpy();
            req.reply({
                statusCode: 200,
                body: { user },
            });
        }).as("login");
    });

    it("invalid - 7-character password shows error and does NOT call API", () => {
        const loginPOM = new LoginPOM();

        mount(
            <MemoryRouter>
                <AuthProvider>
                    <LoginPage />
                </AuthProvider>
            </MemoryRouter>
        );

        loginPOM
            .fillForm("testuser", "1234567")
            .submit();

        // Assert
        const error = loginPOM.ErrorMessage();
        error.should("exist");
        error.should("contain.text", "Password should be at least 8 characters long");
        cy.get("@loginSpy").should("not.be.called");
    });

    it("valid - 8-character password does NOT show error and calls API", () => {
        const loginPOM = new LoginPOM();

        mount(
            <MemoryRouter>
                <AuthProvider>
                    <LoginPage />
                </AuthProvider>
            </MemoryRouter>
        );

        loginPOM
            .fillForm("testuser", "12345678")
            .submit();

        // Assert
        loginPOM.ErrorMessage().should("not.exist");
        cy.get("@loginSpy").should("be.called", 1);
        cy.wait("@login");
    });
});