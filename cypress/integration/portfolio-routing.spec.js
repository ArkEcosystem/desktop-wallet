describe("Dashboard Routing", () => {
	it("should navigate to portfolio page", () => {
		cy.visit("/");

		cy.get("p").contains("John Doe").click();
		cy.get("div").contains("Wallets");
	});
});
