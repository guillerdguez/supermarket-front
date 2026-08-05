describe("Login", () => {
  beforeEach(() => {
    cy.visit("/auth/login");
  });

  it("shows validation errors when submitting empty", () => {
    cy.contains("button", "Entrar").click();
    cy.contains("El email es obligatorio").should("be.visible");
    cy.contains("La contraseña es obligatoria").should("be.visible");
    cy.url().should("include", "/auth/login");
  });

  it("shows an error toast on wrong credentials", () => {
    cy.get("input#email").type("admin@supermarket.com");
    cy.get("p-password#password input").type("wrong-password");
    cy.contains("button", "Entrar").click();
    cy.get(".p-toast-message-error").should("be.visible");
    cy.url().should("include", "/auth/login");
  });

  it("logs an admin in and lands on the admin dashboard", () => {
    cy.fixture("users").then((users) => {
      cy.login(users.admin.email, users.admin.password);
    });
    cy.url().should("include", "/admin/dashboard");
    cy.contains(".role", "ADMIN").should("be.visible");
  });

  it("logs a cashier in and lands on the cashier dashboard", () => {
    cy.fixture("users").then((users) => {
      cy.login(users.cashierCentro.email, users.cashierCentro.password);
    });
    cy.url().should("include", "/cashier/dashboard");
  });
});
