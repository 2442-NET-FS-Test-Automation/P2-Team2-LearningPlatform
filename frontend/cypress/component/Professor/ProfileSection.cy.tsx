import { mount } from "cypress/react";
import ProfileSection from "../../../src/pages/dashboard/ProfileSection";
import { AuthContext } from "../../../src/ctx/AuthCtx";

describe("ProfileSection - Professor Profile Management (TC-Prof-09)", () => {
    
    const mountWithAuth = (user: any, setUser = cy.stub()) => {
        mount(
            <AuthContext.Provider value={{ user, setUser, login: cy.stub(), logout: cy.stub(), isLoading: false }}>
                <ProfileSection />
            </AuthContext.Provider>
        );
    };

    it("displays professor information correctly", () => {
        const mockProfUser = {
            id: 1,
            firstName: "John",
            lastName: "Doe",
            username: "johndoe",
            email: "john@prof.com",
            role: "Professor",
            bio: "I am a professor of testing."
        };

        mountWithAuth(mockProfUser);

        cy.contains("John Doe").should("exist");
        cy.contains("johndoe").should("exist");
        cy.contains("Professor").should("exist");
        cy.contains("john@prof.com").should("exist");
        cy.contains("I am a professor of testing.").should("exist");
    });

    it("opens the Edit Profile modal when clicking Edit Profile", () => {
        const mockProfUser = {
            id: 1,
            firstName: "John",
            lastName: "Doe",
            username: "johndoe",
            email: "john@prof.com",
            role: "Professor",
            bio: ""
        };

        mountWithAuth(mockProfUser);

        // Click Edit Profile button
        cy.contains("button", "Edit Profile").click();

        // Check if modal opens (assuming EditProfileModal has some specific text like 'Save Changes' or 'Update Profile')
        // We look for common labels inside the modal
        cy.contains("Edit Profile").should("exist"); // Modal title
        cy.get("input").should("exist"); // Input fields
    });
});
