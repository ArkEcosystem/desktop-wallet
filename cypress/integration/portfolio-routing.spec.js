describe("Dashboard Routing", () => {
	it("should navigate to portfolio page", () => {
		cy.server().route("/api/wallets/*").as("getWallet");
		cy.visit("/");
		cy.wait("@getWallet");

		cy.get("p").contains("John Doe").click();
		cy.get("div").contains("Wallets");
	});
});
