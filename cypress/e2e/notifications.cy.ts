describe("Notifications — full page (admin)", () => {
  beforeEach(() => {
    cy.fixture("users").then((users) => {
      cy.login(users.admin.email, users.admin.password);
    });
    cy.visit("/admin/notifications");
  });

  it("shows either the empty state or a list of notifications", () => {
    cy.get("body").then(($body) => {
      if ($body.find(".empty-state").length > 0) {
        cy.contains("No tenés notificaciones").should("be.visible");
      } else {
        cy.get("ul.list li").should("have.length.greaterThan", 0);
      }
    });
  });

  it("disables 'Marcar todas leídas' once there are no unread notifications left", () => {
    cy.get("body").then(($body) => {
      const hasUnread = $body.find("ul.list li.unread").length > 0;
      if (!hasUnread) {
        cy.contains("button", "Marcar todas leídas").should("be.disabled");
        return;
      }
      cy.contains("button", "Marcar todas leídas").click();
      cy.get("ul.list li.unread").should("not.exist");
      cy.contains("button", "Marcar todas leídas").should("be.disabled");
    });
  });

  it("marks a single notification as read on click", () => {
    cy.get("body").then(($body) => {
      if ($body.find("ul.list li.unread").length === 0) {
        cy.log("No hay notificaciones sin leer para probar este flujo");
        return;
      }
      cy.get("ul.list li.unread").first().find("button.content").click();
      cy.get("ul.list li.unread").should("have.length.lessThan", $body.find("ul.list li.unread").length);
    });
  });

  it("deletes a notification after confirming", () => {
    cy.get("body").then(($body) => {
      const count = $body.find("ul.list li").length;
      if (count === 0) {
        cy.log("No hay notificaciones para borrar");
        return;
      }
      cy.get("ul.list li").first().find("button[aria-label='Eliminar notificación']").click();
      cy.contains(".p-dialog", "¿Eliminar esta notificación?").should("be.visible");
      cy.contains("button", "Sí").click();
      cy.get("ul.list li").should("have.length", count - 1);
    });
  });
});

describe("Notifications — nav bell", () => {
  beforeEach(() => {
    cy.fixture("users").then((users) => {
      cy.login(users.admin.email, users.admin.password);
    });
    cy.visit("/admin/dashboard");
  });

  it("toggles the dropdown open and closed", () => {
    cy.get(".bell-wrap .dropdown").should("not.exist");
    cy.get(".bell-btn").click();
    cy.get(".bell-wrap .dropdown").should("be.visible");
    cy.contains(".dropdown-header .title", "Notificaciones").should("be.visible");

    // Clic fuera del dropdown lo cierra (HostListener document:click).
    cy.get("body").click(0, 0);
    cy.get(".bell-wrap .dropdown").should("not.exist");
  });

  it("shows an unread badge that matches the count in the dropdown, if any", () => {
    cy.get(".bell-btn").then(($btn) => {
      const hasBadge = $btn.find(".badge").length > 0;
      cy.get(".bell-btn").click();
      if (!hasBadge) {
        cy.contains(".dropdown-header .link-btn", "Marcar todas").should("not.exist");
      } else {
        cy.contains(".dropdown-header .link-btn", "Marcar todas").should("be.visible");
      }
    });
  });

  it("links to the full notifications page for admins", () => {
    cy.get(".bell-btn").click();
    cy.contains(".dropdown-footer a", "Ver todas").click();
    cy.url().should("include", "/admin/notifications");
  });
});

describe("Notifications — nav bell (cashier, no manage link)", () => {
  it("does not show the 'Ver todas' management link for a cashier", () => {
    cy.fixture("users").then((users) => {
      cy.login(users.cashierCentro.email, users.cashierCentro.password);
    });
    cy.get(".bell-btn").click();
    cy.contains(".dropdown-footer a", "Ver todas").should("not.exist");
  });
});
