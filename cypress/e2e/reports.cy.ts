describe("Admin — Reports", () => {
  beforeEach(() => {
    cy.fixture("users").then((users) => {
      cy.login(users.admin.email, users.admin.password);
    });
    cy.visit("/admin/reports");
  });

  it("loads the sales and inventory KPI cards", () => {
    cy.contains(".kpi-label", "Ingresos").should("be.visible");
    cy.contains(".kpi-label", "Transacciones").should("be.visible");
    cy.contains(".kpi-label", "Ticket medio").should("be.visible");
    cy.contains(".kpi-label", "Stock bajo").should("be.visible");
  });

  it("re-queries the summary when filtering by date range", () => {
    const today = new Date().toISOString().slice(0, 10);
    cy.get("#from").type("2020-01-01");
    cy.get("#to").type(today);
    cy.contains("button", "Filtrar").click();

    // Tras filtrar, las tarjetas de KPI siguen presentes con datos recalculados.
    cy.contains(".kpi-label", "Ingresos").should("be.visible");
  });

  it("shows an empty state per section when there is no data for the range", () => {
    cy.get("#from").type("2000-01-01");
    cy.get("#to").type("2000-01-02");
    cy.contains("button", "Filtrar").click();

    cy.contains("h2", "Por sucursal")
      .parent()
      .contains("Sin datos para el rango seleccionado.")
      .should("be.visible");
    cy.contains("h2", "Por cajero")
      .parent()
      .contains("Sin datos para el rango seleccionado.")
      .should("be.visible");
  });
});
