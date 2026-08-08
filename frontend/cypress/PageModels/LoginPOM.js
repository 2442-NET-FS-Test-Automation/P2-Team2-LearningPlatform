export class LoginPOM {
    visit() {
        cy.visit("/login");
        cy.contains("h1", "Welcome Back");

        return this;
    }

    fillForm(usernameEmail, password) {
        cy.get('input[placeholder="Enter username or email"]').type(usernameEmail);
        cy.get('input[placeholder="Enter your password"]').type(password);

        return this;
    }

    submit() {
        cy.get('button.btn-primary').contains("Login").click();

        return this;
    }

    ErrorMessage() {
        return cy.get('div#errorMessage');
    }
}