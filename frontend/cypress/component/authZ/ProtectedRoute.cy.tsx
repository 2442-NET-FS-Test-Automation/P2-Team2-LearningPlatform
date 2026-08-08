import { mount } from "cypress/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { AuthContext } from "../../../src/ctx/AuthCtx";
import ProtectedRoute from "../../../src/components/layout/ProtectedRoute";
import type { AuthContextType } from "../../../src/lib/typesAuth";

describe("ProtectedRoute - TC-AuthZ-07 - ProtectedRoute branching", () => {
    const renderWithContext = (contextValue: AuthContextType) => {
        mount(
            <AuthContext.Provider value={contextValue}>
                <MemoryRouter initialEntries={["/protected"]}>
                    <Routes>
                        <Route element={<ProtectedRoute allowedRoles={["Student"]} />}>
                            <Route path="/protected" element={<div data-testid="outlet">Protected Content</div>} />
                        </Route>
                        <Route path="/login" element={<div data-testid="login">Login Page</div>} />
                        <Route path="/unauthorized" element={<div data-testid="unauthorized">Unauthorized Page</div>} />
                    </Routes>
                </MemoryRouter>
            </AuthContext.Provider>
        );
    };

    // Base mock context – overriden per test
    const baseMockContext: AuthContextType = {
        user: null,
        setUser: () => { },
        isLoading: false,
        login: async () => ({ id: 0, firstName: "", lastName: "", username: "", email: "", role: "Student" }),
        register: async () => ({ id: 0, firstName: "", lastName: "", username: "", email: "", role: "Student" }),
        logout: () => { },
    };

    it("renders null when isLoading is true", () => {
        const mockContext: AuthContextType = {
            ...baseMockContext,
            isLoading: true
        };
        renderWithContext(mockContext);

        cy.get('[data-testid="outlet"]').should("not.exist");
        cy.get('[data-testid="login"]').should("not.exist");
        cy.get('[data-testid="unauthorized"]').should("not.exist");
    });

    it("redirects to /login when user is null", () => {
        renderWithContext(baseMockContext);

        cy.get('[data-testid="outlet"]').should("not.exist");
        cy.get('[data-testid="login"]').should("exist");
    });

    it("redirects to /unauthorized when user role is not allowed", () => {
        const mockContext: AuthContextType = {
            ...baseMockContext,
            user: { id: 1, firstName: "Test", lastName: "User", username: "test", email: "test@example.com", role: "Admin" }
        };
        renderWithContext(mockContext);

        cy.get('[data-testid="outlet"]').should("not.exist");
        cy.get('[data-testid="unauthorized"]').should("exist");
    });

    it("renders the outlet when user role is allowed", () => {
        const mockContext: AuthContextType = {
            ...baseMockContext,
            user: { id: 1, firstName: "Test", lastName: "User", username: "test", email: "test@example.com", role: "Student" }
        };
        renderWithContext(mockContext);

        cy.get('[data-testid="outlet"]').should("exist").and("contain.text", "Protected Content");
    });
});