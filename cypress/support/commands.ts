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
Cypress.Commands.add("clickIfExist", (element) => {
  cy.get("body").then((body) => {
    if (body.find(element).length > 0) {
      cy.get(element).click();
    }
  });
});
