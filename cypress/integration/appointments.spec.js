/* eslint-disable no-undef */
describe("Appointment", () => {
  beforeEach(() => {
    cy.request("GET", "/api/debug/reset");
    cy.visit("/");
    cy.contains("Monday");
   });

  it("[1] should book an appointment", () => {
    const typedName = "Erlich Bachman";
    cy.get("[alt=Add]").first().click();

    cy.get('input').type(typedName);

    cy.get("[alt='Sylvia Palmer']").click();

    cy.get('button').contains('Save').click();

    cy.contains(".appointment__card--show", typedName);
    cy.contains(".appointment__card--show", "Sylvia Palmer");
  });

  it("[2] should edit an appointment", () => {
    const newName = "Richard Hendricks";
    cy.get("[alt=Edit]").click({ force: true });

    cy.get('input').clear().type(newName);

    cy.get('button').contains('Save').click();

    cy.contains(".appointment__card--show", newName);
    cy.contains(".appointment__card--show", "Sylvia Palmer");

  });

  it("[3] should delete an appointment", () => {
    cy.get("[alt=Delete]").click({ force: true });

    cy.contains("Confirm").click();

    cy.contains("Deleting").should("exist");
    cy.contains("Deleting").should("not.exist");

    cy.contains(".appointment__card--show", "Archie Cohen").should("not.exist");
  });
});
