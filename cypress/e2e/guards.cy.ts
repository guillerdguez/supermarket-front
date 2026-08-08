describe("Route guards", () => {
  it("redirects an anonymous visitor to login", () => {
    cy.visit("/admin/dashboard");
    cy.url().should("include", "/auth/login");
  });

  it("redirects a cashier away from an admin-only route", () => {
    cy.fixture("users").then((users) => {
      cy.login(users.cashierCentro.email, users.cashierCentro.password);
    });
    cy.visit("/admin/users");
    cy.url().should("include", "/auth/login");
  });

  it("keeps an admin on an admin-only route", () => {
    cy.fixture("users").then((users) => {
      cy.login(users.admin.email, users.admin.password);
    });
    cy.visit("/admin/users");
    cy.url().should("include", "/admin/users");
    cy.get("h1").should("contain.text", "Usuarios");
  });

  it("clears the session and redirects to login on logout", () => {
    cy.fixture("users").then((users) => {
      cy.login(users.admin.email, users.admin.password);
    });
    cy.get("[aria-label='Cerrar sesión']").click();
    cy.contains("button", "Sí, salir").click();
    cy.url().should("include", "/auth/login");
    cy.visit("/admin/dashboard");
    cy.url().should("include", "/auth/login");
  });
});
