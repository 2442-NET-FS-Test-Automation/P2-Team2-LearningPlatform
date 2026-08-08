export class RegisterPOM {
    visit() {
        cy.visit("/register");
        cy.contains("h1", "Create Account");
        
        return this;
    }

    fillForm(firstName, lastName, birthDate, username, email, password) {
        cy.get('input[placeholder="Enter your first name"]').type(firstName);
        cy.get('input[placeholder="Enter your last name"]').type(lastName);
        cy.get('input[type="date"]').clear().type(birthDate);
        cy.get('input[placeholder="Enter your username"]').type(username);
        cy.get('input[placeholder="Enter your email"]').type(email);
        cy.get('input[placeholder="Enter your password"]').type(password);

        return this;
    }

    submit() {
        cy.get('button.btn-primary').contains("Create Account").click();

        return this;
    }

    ErrorMessage() {
        return cy.get('div#errorMessage');
    } 
}