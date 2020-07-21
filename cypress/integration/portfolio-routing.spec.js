describe("Dashboard Routing", () => {
	it("should navigate to portfolio page", () => {
		cy.visit("/");
		cy.wait(2000); // eslint-disable-line cypress/no-unnecessary-waiting

		cy.get("p").contains("John Doe").click();
		cy.get("div").contains("Wallets");
	});
});
