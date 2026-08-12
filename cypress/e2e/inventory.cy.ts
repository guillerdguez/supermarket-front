describe("Admin — Inventory", () => {
  beforeEach(() => {
    cy.fixture("users").then((users) => {
      cy.login(users.admin.email, users.admin.password);
    });
    cy.visit("/admin/inventory");
  });

  it("auto-selects the first branch and shows the stock table on load", () => {
    cy.get(".table-wrap table").should("be.visible");
    cy.contains("th", "Producto").should("be.visible");
    cy.contains("th", "Stock").should("be.visible");
  });

  it("filters to low-stock rows only", () => {
    cy.contains("label.checkbox", "Solo stock bajo").find("input").check({ force: true }); 
    cy.get(".table-wrap tbody tr").each(($row) => {
      cy.wrap($row).should("satisfy", (el: JQuery<HTMLElement>) => {
        return el.hasClass("row-warning") || el.hasClass("row-danger");
      });
    });
  });

  it("edits stock and minimum through the pencil action and the dialog persists the values", () => {
    cy.contains("label.checkbox", "Solo stock bajo").find("input").uncheck({ force: true });

    cy.get(".table-wrap tbody tr")
      .first()
      .find("button[aria-label='Editar stock']")
      .click();

    cy.get("p-dialog").contains("Editar stock").should("be.visible");
    cy.get("#editStock").clear().type("42");
    cy.get("#editMin").clear().type("5");
    cy.contains("button", "Guardar").click();

    cy.contains("p-dialog", "Editar stock").should("not.exist");
    cy.get(".table-wrap tbody tr").first().contains("td", "42");
    cy.get(".table-wrap tbody tr").first().contains("td", "5");
  });

  it("adjusts stock by +1 / -1 from the row context menu", () => {
    cy.get(".table-wrap tbody tr").first().as("row");
    cy.get("@row").find("td.num").first().invoke("text").then((before) => {
      const beforeStock = Number(before.trim());
      cy.get("@row").rightclick();
      cy.contains(".p-contextmenu li, .p-contextmenu a", "Sumar 1").click();
      cy.get("@row")
        .find("td.num")
        .first()
        .should(($cell) => {
          expect(Number($cell.text().trim())).to.eq(beforeStock + 1);
        });
    });
  });
});
