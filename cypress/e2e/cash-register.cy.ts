describe("Cash register open/close", () => {
  beforeEach(() => {
    cy.fixture("users").then((users) => {
      const cashier = users.cashierCentro;
      cy.ensureRegisterClosed(cashier.branchId, cashier.email, cashier.password);
      cy.login(cashier.email, cashier.password);
    });
  });

  it("shows the register closed on the cashier dashboard", () => {
    cy.contains(".status.closed", "Caja cerrada").should("be.visible");
    cy.get(".actions").contains("a", "Abrir caja").should("be.visible");
  });

  it("does not open a register with a negative opening balance", () => {
    cy.get(".actions").contains("a", "Abrir caja").click();
    cy.url().should("include", "/cashier/open-register");
    cy.get("#openingBalance").clear().type("-10");
    cy.contains("button", "Abrir caja").click();
    cy.url().should("include", "/cashier/open-register");
  });

  it("opens a register with the assigned branch and a starting balance", () => {
    cy.get(".actions").contains("a", "Abrir caja").click();
    cy.get("#branchName").should("have.value", "Sucursal Centro");
    cy.get("#openingBalance").clear().type("150");
    cy.contains("button", "Abrir caja").click();

    cy.url().should("include", "/cashier/dashboard");
    cy.contains(".status.open", "abierta").should("be.visible");
  });

  it("closes the open register with a closing balance", () => {
    cy.fixture("users").then((users) => {
      const cashier = users.cashierCentro;
      cy.ensureRegisterOpen(cashier.branchId, cashier.email, cashier.password, 150).then(() => {
        cy.visit("/cashier/dashboard");
      });
    });

    cy.contains(".status.open", "abierta").should("be.visible");
    cy.get(".actions").contains("a", "Cerrar caja").click();
    cy.url().should("include", "/cashier/close-register");
    cy.get("#closing").clear().type("310.50");
    cy.contains("button", "Cerrar caja").click();

    cy.url().should("include", "/cashier/dashboard");
    cy.contains(".status.closed", "Caja cerrada").should("be.visible");
  });
});
