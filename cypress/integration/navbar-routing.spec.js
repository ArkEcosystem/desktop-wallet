describe("NavBar Routing", () => {
	it("should navigate to dashboard", () => {
		cy.visit("/");

		cy.get("p").contains("Anne Doe").click();
	});

	it("should navigate to plugins", () => {
		cy.get("a").contains("Plugins").click();
		cy.get("h1").contains("Plugin Manager");
	});

	it("should navigate to exchange", () => {
		cy.get("a").contains("Exchange").click();
		cy.get("h1").contains("Exchange");
	});

	it("should navigate to news", () => {
		cy.get("a").contains("News").click();
		cy.get("h1").contains("Blockchain News");
	});

	it("should navigate to transaction send page", () => {
		cy.get("[data-testid=navbar__buttons--send]").click();
		cy.get("div").contains("Enter details to send your money");
	});

	it("should navigate to portfolio", () => {
		cy.get("a").contains("Go back to Portfolio").click();
		cy.get("div").contains("Wallets");
	});
});
