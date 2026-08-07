describe("Admin — Branches CRUD", () => {
  const unique = Date.now();
  const name = `Sucursal E2E ${unique}`;
  const editedAddress = `Calle Editada ${unique}`;

  beforeEach(() => {
    cy.fixture("users").then((users) => {
      cy.login(users.admin.email, users.admin.password);
    });
    cy.visit("/admin/branches");
  });

  it("does not allow submitting without a name and address", () => {
    cy.contains("a", "Nueva sucursal").click();
    cy.contains("button", "Crear sucursal").should("be.disabled");
  });

  it("creates a branch and lists it", () => {
    cy.contains("a", "Nueva sucursal").click();
    cy.get("#name").type(name);
    cy.get("#address").type(`Calle Falsa ${unique}`);
    cy.contains("button", "Crear sucursal").should("not.be.disabled").click();

    cy.url().should("include", "/admin/branches");
    cy.url().should("not.include", "/create");
    cy.contains("td", name).should("be.visible");
    cy.contains("td", name).parents("tr").contains(".p-tag", "Tienda");
  });

  it("edits the branch address through the row context menu", () => {
    cy.contains("td", name)
      .parents("tr")
      .find("button[aria-label='Más acciones']")
      .click();
    cy.contains(".p-contextmenu li, .p-contextmenu a", "Editar").click();

    cy.url().should("include", "/admin/branches/edit");
    cy.get("#address").clear().type(editedAddress);
    cy.contains("button", "Guardar cambios").click();

    cy.url().should("include", "/admin/branches");
    cy.contains("td", editedAddress).should("be.visible");
  });

  it("deletes the branch after confirming the dialog", () => {
    cy.contains("td", name)
      .parents("tr")
      .find("button[aria-label='Más acciones']")
      .click();
    cy.contains(".p-contextmenu li, .p-contextmenu a", "Eliminar").click();

    cy.contains(".p-dialog", "Eliminar sucursal").should("be.visible");
    cy.contains("button", "Eliminar").click();

    cy.contains("td", name).should("not.exist");
  });
});
