/// <reference types="cypress" />

export interface CashRegister {
  id: number;
  branchId: number;
  status: "OPEN" | "CLOSED";
  openingBalance: number;
}

declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
      apiToken(email: string, password: string): Chainable<string>;
      ensureRegisterClosed(
        branchId: number,
        email: string,
        password: string,
      ): Chainable<void>;
      ensureRegisterOpen(
        branchId: number,
        email: string,
        password: string,
        openingBalance?: number,
      ): Chainable<void>;
    }
  }
}

Cypress.Commands.add("login", (email: string, password: string) => {
  cy.visit("/auth/login");
  cy.get("input#email").type(email);
  cy.get("p-password#password input").type(password);
  cy.contains("button", "Entrar").click();
  cy.url().should("not.include", "/auth/login");
});

Cypress.Commands.add("apiToken", (email: string, password: string) => {
  return cy
    .request("POST", "/api/auth/login", { email, password })
    .then((res) => res.body.token as string);
});

Cypress.Commands.add(
  "ensureRegisterClosed",
  (branchId: number, email: string, password: string) => {
    cy.apiToken(email, password).then((token) => {
      const headers = { Authorization: `Bearer ${token}` };
      cy.request({
        method: "GET",
        url: `/cash-registers/branches/${branchId}/current`,
        headers,
        failOnStatusCode: false,
      }).then((res) => {
        if (res.status === 200 && res.body?.status === "OPEN") {
          const register = res.body as CashRegister;
          cy.request({
            method: "POST",
            url: `/cash-registers/${register.id}/close`,
            headers,
            body: { closingBalance: register.openingBalance },
          });
        }
      });
    });
  },
);

Cypress.Commands.add(
  "ensureRegisterOpen",
  (branchId: number, email: string, password: string, openingBalance = 150) => {
    cy.apiToken(email, password).then((token) => {
      const headers = { Authorization: `Bearer ${token}` };
      cy.request({
        method: "GET",
        url: `/cash-registers/branches/${branchId}/current`,
        headers,
        failOnStatusCode: false,
      }).then((res) => {
        if (res.status !== 200 || res.body?.status !== "OPEN") {
          cy.request({
            method: "POST",
            url: "/cash-registers/open",
            headers,
            body: { branchId, openingBalance },
          });
        }
      });
    });
  },
);

export {};
