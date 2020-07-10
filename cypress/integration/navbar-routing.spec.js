describe("NavBar Routing", () => {
	it("should navigate between menu links", () => {
		cy.visit("/");

		cy.get("p").contains("Anne Doe").click();

		// Navigate to plugins
		cy.get("a").contains("Plugins").click();
		cy.get("h1").contains("Plugin Manager");

		// Navigate to Exchange
		cy.get("a").contains("Exchange").click();
		cy.get("h1").contains("Exchange");

		// Navigate back to Portfolio
		cy.get("a").contains("Portfolio").click();
		cy.get("div").contains("Wallets");
	});
});
