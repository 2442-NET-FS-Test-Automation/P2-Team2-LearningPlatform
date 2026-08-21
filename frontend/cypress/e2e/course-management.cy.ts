describe("TC-CM-18 - Admin course workflow", () => {
    const admin = {
        id: 1,
        firstName: "Ada",
        lastName: "Admin",
        email: "admin@example.com",
        username: "admin",
        role: "Admin"
    };

    const professor = {
        id: 2,
        firstName: "Grace",
        lastName: "Hopper",
        email: "professor@example.com",
        username: "professor",
        role: "Professor",
        professor: { id: 2 }
    };

    let course = {
        id: 42,
        name: "Created Course",
        description: "Course description",
        about: "Course overview",
        category: "Programming",
        price: 25,
        hours: 10,
        capacity: 20,
        certification: false,
        isActive: true,
        enrolledStudents: 0,
        schedule: []
    };

    beforeEach(() => {
        cy.intercept("GET", /\/auth\/me/i, {
            statusCode: 200,
            body: { user: admin }
        }).as("getCurrentUser");
        cy.intercept("GET", "**/api/Users?*", {
            statusCode: 200,
            body: { items: [{ id: professor.id }] }
        }).as("getProfessors");
        cy.intercept("GET", `**/Users/${professor.id}`, {
            statusCode: 200,
            body: professor
        }).as("getProfessor");
        cy.intercept("GET", "**/api/Courses?*", (request) => {
            request.reply({ statusCode: 200, body: { items: [course], totalPages: 1 } });
        }).as("getManagedCourses");
        cy.intercept("POST", "**/Courses", (request) => {
            course = { ...course, ...request.body, id: 42 };
            request.reply({ statusCode: 201, body: course });
        }).as("createCourse");
        cy.intercept("GET", `**/Courses/${course.id}`, (request) => {
            request.reply({ statusCode: 200, body: course });
        }).as("getCourseDetails");
        cy.intercept("PATCH", `**/Courses/${course.id}`, (request) => {
            course = { ...course, ...request.body };
            request.reply({ statusCode: 204, body: null });
        }).as("updateCourse");
        cy.intercept("DELETE", `**/Courses/${course.id}`, (request) => {
            course = { ...course, isActive: false };
            request.reply({ statusCode: 204, body: null });
        }).as("deactivateCourse");
    });

    it("creates, edits, and deactivates a course", () => {
        cy.visit("/manager/dashboard");
        cy.wait("@getCurrentUser");
        cy.contains("Manage Courses", { timeout: 10000 }).click();
        cy.wait("@getManagedCourses");

        cy.contains("button", "Add Course").scrollIntoView().click({ force: true });
        cy.wait("@getProfessors");
        cy.wait("@getProfessor");
        cy.get('input[name="name"]').type(course.name);
        cy.get('select[name="professorId"]').select("2");
        cy.get('textarea[name="description"]').type(course.description);
        cy.get('textarea[name="about"]').type(course.about);
        cy.get('input[name="price"]').clear().type(String(course.price));
        cy.get('input[name="hours"]').clear().type(String(course.hours));
        cy.get('input[name="capacity"]').clear().type(String(course.capacity));
        cy.contains("button", "Create Course").click({ force: true });
        cy.wait("@createCourse");
        cy.contains(course.name).should("be.visible");

        cy.contains("a", course.name).click();
        cy.wait("@getCourseDetails");
        cy.contains("h1", course.name).should("be.visible");
        cy.contains("Edit Course").click();
        cy.wait("@getCourseDetails");
        cy.get('input[name="name"]').clear().type("Updated Course");
        cy.contains("Save Changes").click();
        cy.wait("@updateCourse");
        cy.contains("h1", "Updated Course").should("be.visible");

        cy.visit("/manager/dashboard");
        cy.contains("Manage Courses").click();
        cy.wait("@getManagedCourses");
        cy.contains("Updated Course").closest("tr").find('button[title="Deactivate"]').click();
        cy.contains("Delete Course").should("be.visible");
        cy.contains("Confirm").click();
        cy.wait("@deactivateCourse");

        cy.contains("Updated Course").should("be.visible");
        cy.get('select').filter(":has(option[value='Inactive'])").select("Inactive");
        cy.wait("@getManagedCourses");
        cy.contains("Updated Course").should("be.visible");
        cy.contains("Inactive").should("be.visible");
    });
});
