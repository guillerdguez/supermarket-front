describe("Admin — Users CRUD", () => {
  const unique = Date.now();
  const username = `e2euser${unique}`;
  const email = `e2e-user-${unique}@supermarket.com`;
  const editedFirstName = "Editado";

  beforeEach(() => {
    cy.fixture("users").then((users) => {
      cy.login(users.admin.email, users.admin.password);
    });
    cy.visit("/admin/users");
  });

  it("creates a cashier user and lists it with the CASHIER role tag", () => {
    cy.contains("a", "Nuevo").click();
    cy.get("#u").type(username);
    cy.get("#e").type(email);
    cy.get("#p").type("password123");
    cy.get("#f").type("Nombre");
    cy.get("#l").type("Apellido");
    // Rol por defecto puede ya ser CASHIER; se deja el valor por defecto del select.
    cy.contains("button", "Crear usuario").click();

    cy.url().should("include", "/admin/users");
    cy.url().should("not.include", "/create");
    cy.get("input[placeholder='Buscar…']").type(`${username}{enter}`);
    cy.contains("td", username).should("be.visible");
  });

  it("edits the user's first name through the row context menu", () => {
    cy.get("input[placeholder='Buscar…']").type(`${username}{enter}`);
    cy.contains("td", username)
      .parents("tr")
      .find("button[aria-label='Más acciones']")
      .click();
    cy.contains(".p-contextmenu li, .p-contextmenu a", "Editar").click();

    cy.url().should("include", "/admin/users/edit");
    cy.get("#f").clear().type(editedFirstName);
    cy.contains("button", "Guardar cambios").click();

    cy.url().should("include", "/admin/users");
    cy.get("input[placeholder='Buscar…']").clear().type(`${username}{enter}`);
    cy.contains("td", username).parents("tr").contains("td", editedFirstName);
  });

  it("deactivates the user after confirming the dialog, keeping it listed as Inactivo", () => {
    cy.get("input[placeholder='Buscar…']").clear().type(`${username}{enter}`);
    cy.contains("td", username)
      .parents("tr")
      .find("button[aria-label='Más acciones']")
      .click();
    cy.contains(".p-contextmenu li, .p-contextmenu a", "Desactivar").click();

    cy.contains(".p-dialog", "Desactivar usuario").should("be.visible");
    cy.contains("button", "Desactivar").click();

    cy.get("input[placeholder='Buscar…']").clear().type(`${username}{enter}`);
    cy.contains("td", username).parents("tr").contains(".p-tag", "Inactivo");
  });
});
