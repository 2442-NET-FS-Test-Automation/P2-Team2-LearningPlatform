import { MemoryRouter } from "react-router-dom";
import { mount } from "cypress/react";

import { AuthProvider } from "../../../src/ctx/AuthCtx";
import RegisterPage from "../../../src/pages/auth/RegisterPage"


describe("Register Page Tests", () => {
    it("TC-AuthN-01 - birth date eligibility", () => {
        mount(
            <MemoryRouter>
                <AuthProvider>
                    <RegisterPage />
                </AuthProvider>
            </MemoryRouter>
        );
    });
});