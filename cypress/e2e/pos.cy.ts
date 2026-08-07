describe("POS — full sale flow", () => {
  beforeEach(() => {
    cy.fixture("users").then((users) => {
      const cashier = users.cashierCentro;
      cy.ensureRegisterOpen(
        cashier.branchId,
        cashier.email,
        cashier.password,
        150,
      ).then(() => {
        cy.login(cashier.email, cashier.password);
      });
    });
    cy.visit("/pos");
  });

  it("shows the register as open and the catalog loaded", () => {
    cy.contains(".badge.open", "abierta").should("be.visible");
    cy.get(".product-card").should("have.length.greaterThan", 0);
  });

  it("adds a product to the cart and updates the total", () => {
    cy.get(".product-card:not(:disabled)").first().click();
    cy.get(".cart-list li").should("have.length", 1);
    cy.get(".total-row strong").should("not.contain", "0,00");
  });

  it("increases and decreases the quantity from the cart", () => {
    cy.get(".product-card:not(:disabled)").first().click();
    cy.get(".cart-list li").first().find(".qty span").should("contain", "1");

    cy.get(".cart-list li").first().find("button[aria-label='Más']").click();
    cy.get(".cart-list li").first().find(".qty span").should("contain", "2");

    cy.get(".cart-list li").first().find("button[aria-label='Menos']").click();
    cy.get(".cart-list li").first().find(".qty span").should("contain", "1");
  });

  it("blocks confirming a cash payment when the amount received is insufficient", () => {
    cy.get(".product-card:not(:disabled)").first().click();
    cy.contains("button", "Cobrar").click();

    cy.contains("Confirmar pago").should("be.visible");
    cy.get("#received").clear().type("0");
    cy.contains("El monto recibido es inferior al total").should("be.visible");
    cy.contains("button", "Confirmar").should("be.disabled");
  });

  it("completes a cash sale and clears the cart", () => {
    cy.get(".product-card:not(:disabled)").first().click();
    cy.contains("button", "Cobrar").click();

    cy.contains("Confirmar pago").should("be.visible");
    cy.contains("button", "Confirmar").should("not.be.disabled").click();

    cy.contains("Confirmar pago").should("not.exist");
    cy.contains("El carrito está vacío").should("be.visible");
  });

  it("completes a card sale without asking for an amount received", () => {
    cy.get(".product-card:not(:disabled)").first().click();
    cy.contains("button", "Cobrar").click();
    cy.contains("button", "Tarjeta").click();

    cy.get("#received").should("not.exist");
    cy.contains("button", "Confirmar").should("not.be.disabled").click();
    cy.contains("El carrito está vacío").should("be.visible");
  });
});
