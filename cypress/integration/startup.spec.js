describe("Startup application", () => {
	it("should load profiles welcome page", () => {
		cy.visit("/");
		cy.wait(2000); // eslint-disable-line cypress/no-unnecessary-waiting

		cy.get("h1").should("have.text", "Welcome to ARK");
		cy.get("img").should("have.length", 2);
		cy.get("svg").should("have.length", 3);
		cy.get("button").should("have.length", 2);
	});
});
