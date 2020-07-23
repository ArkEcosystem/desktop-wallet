describe("Wallets Routing", () => {
	it("should navigate to portfolio page", () => {
		cy.visit("/");

		cy.get("p").contains("Anne Doe").click();
		cy.get("div").contains("Wallets");
	});

	it("should navigate to wallet details", () => {
		cy.get("div").contains("2,000,000 ARK").click();
		cy.get("h2").contains("ARK Wallet 1");
		cy.get("a").contains("Go back to Portfolio").click();
	});

	it("it should navigate to create page", () => {
		cy.get("button").contains("Create").click();
		cy.get("div").contains("Select a Network to create your new wallet address");
		cy.get("a").contains("Go back to Portfolio").click();
	});

	it("should navigate to import page", () => {
		cy.get("button").contains("Import").click();
		cy.get("div").contains("Select a Network to import your existing wallet address");
	});
});
