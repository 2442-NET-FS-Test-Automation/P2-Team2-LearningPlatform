import { MemoryRouter } from "react-router-dom";
import { mount } from "cypress/react";

import { AuthProvider } from "../../../src/ctx/AuthCtx";
import RegisterPage from "../../../src/pages/auth/RegisterPage"


describe("Register Page Test - TC-AuthN-01 - birth date eligibility", () => {
    it("valid - birth date exactly 12 years ago", () => {
        const today = new Date();
        const twelveYearsAgo = new Date(today);
        twelveYearsAgo.setFullYear(twelveYearsAgo.getFullYear() - 12);
        const validDate = twelveYearsAgo.toISOString().split("T")[0];

        // Research how to stub the context
        mount(
            <MemoryRouter>
                <AuthProvider> 
                    <RegisterPage />
                </AuthProvider>
            </MemoryRouter>
        );

        cy.contains("h1", "Create Account");

        // Fill form

        // submit

        cy.contains("You have to be 12 years old to register").should("not.exist");
    });

    it("invalid - birth date 12 years minus 1 day", () => {
        const today = new Date();
        const twelveYearsAgo = new Date(today);
        twelveYearsAgo.setFullYear(twelveYearsAgo.getFullYear() - 12);
        const invalidDate = new Date(twelveYearsAgo);
        invalidDate.setDate(invalidDate.getDate() - 1);
        const invalidDateStr = invalidDate.toISOString().split("T")[0];

        // Research how to stub the context
        mount(
            <MemoryRouter>
                <AuthProvider>
                    <RegisterPage />
                </AuthProvider>
            </MemoryRouter>
        );

        cy.contains("h1", "Create Account");

        // Fill form

        // submit

        cy.contains("You have to be 12 years old to register").should("exist");
    });
});