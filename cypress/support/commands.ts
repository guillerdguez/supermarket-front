/// <reference types="cypress" />

export interface CashRegister {
  id: number;
  branchId: number;
  status: "OPEN" | "CLOSED";
  openingBalance: number;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      /** Logs in through the real login form and waits for the post-login redirect. */
      login(email: string, password: string): Chainable<void>;
      /** Gets a JWT via the API only — used to arrange backend state, never to skip the UI login under test. */
      apiToken(email: string, password: string): Chainable<string>;
      /** Makes sure the given branch has no open cash register before a test starts. */
      ensureRegisterClosed(branchId: number, email: string, password: string): Chainable<void>;
      /** Makes sure the given branch has an open cash register before a test starts. */
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
