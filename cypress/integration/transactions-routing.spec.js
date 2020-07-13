describe("Transactions routing", () => {
	it("should navigate to transaction send page", () => {
		cy.visit("/");

		cy.get("p").contains("Anne Doe").click();
		cy.get("[data-testid=navbar__buttons--send]").click();
		cy.get("p").contains("Enter details to send your money");
	});

	it("should navigate back to porfolio", () => {
		cy.get("span").contains("Go back to Portfolio").click();
		cy.get("div").contains("Wallets");
	});
});
