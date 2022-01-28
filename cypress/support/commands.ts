// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
import "cypress-fill-command";

Cypress.Commands.add("clickIfExist", (element) => {
  cy.get("body", { timeout: 5000 }).then((body) => {
    if (body.find(element).length > 0) {
      cy.get(element).click();
    }
  });
});
