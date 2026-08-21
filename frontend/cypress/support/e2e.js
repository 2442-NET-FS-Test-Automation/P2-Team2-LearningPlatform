import "./commands";

if (Cypress.expose("live")) {
    Cypress.Commands.overwrite("visit", (originalVisit, url, options = {}) => 
        originalVisit(url, { failOnStatusCode: false, ...options})
    );
}