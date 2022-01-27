describe("Check-in all bears from CSV to Untappd", () => {
  before(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  beforeEach(() => {
    cy.visit("/");
  });

  // login worked for first facebook login; next time this test can be failed and does not affect to next test
  it("login by facebook", () => {
    cy.get("a.facebook").should("have.text", "Connect with Facebook").click();
    cy.clickIfExist('button[data-cookiebanner="accept_button"]');
    cy.get('[data-testid="royal_email"]').clear().type(Cypress.env("fb_login"));
    cy.get('[data-testid="royal_pass"]')
      .clear()
      .type(Cypress.env("fb_password"));
    cy.get('[data-testid="royal_login_button"]').click();
    cy.get(".fb").click();
  });

  it("check-in beers", () => {
    cy.get("a.facebook").should("have.text", "Connect with Facebook").click();

    cy.readFile(Cypress.env("file_path"), "utf-8").then((data) => {
      cy.task("csvToJson", data).then((data: []) => {
        data.forEach((item) => {
          const beer_name = item["Piwo"] + " " + item["Browar"];
          const pre_comment = "Imported by bit.ly/3AuPGH8";
          // limit is 255 chars on this time (maybe in future can be more), but cutting it do not crash check-in
          let beer_comment = pre_comment + " " + item["Mój komentarz"];

          // to avoid integer numbers and make the assessment more realistic ("Średnia ocena" is my optional field)
          let beer_rating =
            item["Średnia ocena"] == undefined || item["Średnia ocena"] == ""
              ? Number(item["Moja ocena"])
              : (Number(item["Moja ocena"]) + Number(item["Średnia ocena"])) /
                2;
          // round to the nearest quarter
          beer_rating = Number((Math.round(beer_rating * 4) / 4).toFixed(2));

          cy.get(".mobile_menu_btn").click();
          cy.get(
            "#mobile_nav_site > .search_box > .algolia-autocomplete > .aa-input"
          ).type(beer_name + "{enter}");

          cy.get(":nth-child(1)").then((body) => {
            // if beer is already check-in then skip again check-in
            if (body.find(".drankit").length > 0) {
              cy.visit("/");
            } else {
              cy.get(":nth-child(1) > .beer-details > .name > a").click();
              cy.get(".bottom > .actions > .check").click();
              cy.get(".shout").type(beer_comment);
              cy.get("#rating_score")
                .invoke("show")
                .invoke("attr", "value", beer_rating);
              cy.get(".checkbottom > .button").click();
              cy.contains("Cheers! We got it!");
              cy.get(".cheers-area > .inner > .top > .close").click();
            }
          });
        });
      });
    });
  });
});
