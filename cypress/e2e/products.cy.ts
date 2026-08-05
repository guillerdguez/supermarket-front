describe("Admin — Products CRUD", () => {
  const unique = Date.now();
  const name = `Producto E2E ${unique}`;
  const editedName = `Producto E2E ${unique} (editado)`;

  beforeEach(() => {
    cy.fixture("users").then((users) => {
      cy.login(users.admin.email, users.admin.password);
    });
    cy.visit("/admin/products");
  });

  it("shows validation state on the create form (submit stays disabled)", () => {
    cy.contains("a", "Nuevo producto").click();
    cy.url().should("include", "/admin/products/create");
    // Sin nombre ni precio > 0 el submit permanece deshabilitado.
    cy.contains("button", "Crear producto").should("be.disabled");
  });

  it("creates a product and shows it in the catalog", () => {
    cy.contains("a", "Nuevo producto").click();
    cy.get("#name").type(name);
    cy.get("#barcode").type(`999${unique}`);
    cy.get("#category").type("E2E");
    cy.get("#price").clear().type("9.99");
    cy.contains("button", "Crear producto").should("not.be.disabled").click();

    cy.url().should("include", "/admin/products");
    cy.url().should("not.include", "/create");
    cy.get("input[placeholder='Buscar por nombre o código…']").type(`${name}{enter}`);
    cy.contains("td", name).should("be.visible");
  });

  it("edits an existing product through the row context menu", () => {
    cy.get("input[placeholder='Buscar por nombre o código…']").type(`${name}{enter}`);
    cy.contains("td", name)
      .parents("tr")
      .find("button[aria-label='Más acciones']")
      .click();
    cy.contains(".p-contextmenu li, .p-contextmenu a", "Editar").click();

    cy.url().should("include", "/admin/products/edit");
    cy.get("#name").clear().type(editedName);
    cy.contains("button", "Guardar cambios").click();

    cy.url().should("include", "/admin/products");
    cy.get("input[placeholder='Buscar por nombre o código…']").clear().type(`${editedName}{enter}`);
    cy.contains("td", editedName).should("be.visible");
  });

  it("deletes the product after confirming the dialog", () => {
    cy.get("input[placeholder='Buscar por nombre o código…']").type(`${editedName}{enter}`);
    cy.contains("td", editedName)
      .parents("tr")
      .find("button[aria-label='Más acciones']")
      .click();
    cy.contains(".p-contextmenu li, .p-contextmenu a", "Eliminar").click();

    cy.contains(".p-dialog", "Eliminar producto").should("be.visible");
    cy.contains("button", "Eliminar").click();

    cy.get("input[placeholder='Buscar por nombre o código…']").clear().type(`${editedName}{enter}`);
    cy.contains("p", "No hay productos").should("be.visible");
  });
});
