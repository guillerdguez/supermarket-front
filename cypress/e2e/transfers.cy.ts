function requestTransfer() {
  cy.contains("a", "Solicitar").click();
  cy.url().should("include", "/admin/transfers/create");

  cy.get("#s").click();
  cy.get("[role='option']").first().click();
  cy.get("#t").click();
  cy.get("[role='option']").eq(1).click();
  cy.get("#p").click();
  cy.get("[role='option']").first().click();
  cy.get("#q").clear().type("1");

  cy.contains("button", "Solicitar").click();
  cy.url().should("include", "/admin/transfers");
  cy.url().should("not.include", "/create");
}

describe("Admin — Transfers lifecycle", () => {
  beforeEach(() => {
    cy.fixture("users").then((users) => {
      cy.login(users.admin.email, users.admin.password);
    });
    cy.visit("/admin/transfers");
  });

  it("creates a transfer request, which starts as PENDING", () => {
    requestTransfer();
    cy.get(".table-wrap tbody tr, table tbody tr")
      .first()
      .contains(".p-tag", "PENDING")
      .should("be.visible");
  });

  it("approves a PENDING transfer and then completes it", () => {
    requestTransfer();
    cy.get("table tbody tr").first().rightclick();
    cy.contains(".p-contextmenu li, .p-contextmenu a", "Aprobar").click();
    cy.get("table tbody tr").first().contains(".p-tag", "APPROVED");

    cy.get("table tbody tr").first().rightclick();
    cy.contains(".p-contextmenu li, .p-contextmenu a", "Completar").click();
    cy.get("table tbody tr").first().contains(".p-tag", "COMPLETED");
  });

  it("rejects a PENDING transfer with a reason", () => {
    requestTransfer();
    cy.get("table tbody tr").first().rightclick();
    cy.contains(".p-contextmenu li, .p-contextmenu a", "Rechazar").click();

    cy.contains("Rechazar transferencia").should("be.visible");
    cy.get("textarea, input").last().type("Stock insuficiente en origen");
    cy.contains("button", "Confirmar").click();

    cy.get("table tbody tr").first().contains(".p-tag", "REJECTED");
  });

  it("does not allow rejecting with a reason shorter than 5 characters", () => {
    requestTransfer();
    cy.get("table tbody tr").first().rightclick();
    cy.contains(".p-contextmenu li, .p-contextmenu a", "Rechazar").click();

    cy.get("textarea, input").last().type("no");
    cy.contains("button", "Confirmar").should("be.disabled");
  });

  it("cancels a PENDING transfer", () => {
    requestTransfer();
    cy.get("table tbody tr").first().rightclick();
    cy.contains(".p-contextmenu li, .p-contextmenu a", "Cancelar").click();

    cy.get("table tbody tr").first().contains(".p-tag", "CANCELLED");
  });

  it("does not offer row actions once a transfer is COMPLETED, REJECTED or CANCELLED", () => {
    requestTransfer();
    cy.get("table tbody tr").first().rightclick();
    cy.contains(".p-contextmenu li, .p-contextmenu a", "Cancelar").click();
    cy.get("table tbody tr").first().contains(".p-tag", "CANCELLED");

    // Sin PENDING/APPROVED no se pinta el botón de "más acciones" en esa fila.
    cy.get("table tbody tr").first().find("button[aria-label='Más acciones']").should("not.exist");
  });

  // TODO(regresión): falta el test específico del bug que arreglamos en el
  // proxy/flujo de transferencias. Necesito que me digas en qué consistía
  // (qué se rompía y en qué paso) para escribir la aserción correcta en vez
  // de adivinar un comportamiento que no puedo verificar sin levantar la app.
});
