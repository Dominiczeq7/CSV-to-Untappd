describe("Check-in all bears from CSV to Untappd", () => {
  before(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    Cypress.Cookies.preserveOnce("session_id", "remember_token");
    Cypress.Keyboard.defaults({
      keystrokeDelay: 0,
    });
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
    cy.get("#email").clear().type(Cypress.env("fb_login"));
    cy.get("#pass").clear().type(Cypress.env("fb_password"));
    cy.get("#loginbutton").click();
    cy.get(".fb").click();
  });

  it("check-in beers", () => {
    cy.get("a.facebook").should("have.text", "Connect with Facebook").click();

    let success_checkins_count = 0;
    let not_found_beers: String[] = [];
    let already_have_checkin: String[] = [];
    cy.readFile(Cypress.env("file_path"), "utf-8").then((data) => {
      cy.task("csvToJson", data).then((data: []) => {
        data.forEach((item) => {
          const beer_name = item["Piwo"] + " " + item["Browar"];
          const pre_comment = "Imported by bit.ly/3AuPGH8";
          let beer_comment = pre_comment + " " + item["Mój komentarz"];
          beer_comment = beer_comment.substring(0, 255);

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
          )
            .fill(beer_name)
            .type("{enter}");

          cy.get(":nth-child(1)").then((body) => {
            // if beer is already check-in then skip again check-in
            if (
              body.find(".beer-item").length == 0 ||
              body.find(".drankit").length > 0
            ) {
              body.find(".beer-item").length == 0
                ? not_found_beers.push(beer_name)
                : already_have_checkin.push(beer_name);
              cy.visit("/");
            } else {
              cy.get(":nth-child(1) > .beer-details > .name > a").click();
              cy.get(".bottom > .actions > .check").click();
              cy.get(".shout").fill(beer_comment);
              cy.get("#rating_score")
                .invoke("show")
                .invoke("attr", "value", beer_rating);
              cy.get(".checkbottom > .button").click();
              cy.wait(3000).then(() => {
                cy.clickIfExist(".checkin-continue");
              });
              cy.contains("Cheers! We got it!");
              success_checkins_count += 1;
              cy.get(".cheers-area > .inner > .top > .close").click();
            }
          });
        });
      });
    });

    const result = {
      "Success check-ins number": success_checkins_count,
      "Not found": not_found_beers,
      "Already have check-in": already_have_checkin,
    };

    const now = Date.now();
    cy.writeFile(`results/result_${now}.json`, result);
  });
});
