describe("Smoke test", () => {
    it("loads", () => {
        cy.visit("/");
        cy.contains("LearnHub");
    })
})