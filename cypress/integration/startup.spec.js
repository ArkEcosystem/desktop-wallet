describe("Startup application", () => {
	it("should load profiles welcome page", () => {
		cy.visit("/");

		cy.get("h1").should("have.text", "Welcome to ARK");
		cy.get("img").should("have.length", 2);
		cy.get("button").should("have.length", 2);
	});
});
