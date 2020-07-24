describe("Transactions routing", () => {
	it("should navigate to transaction send page", () => {
		cy.server().route("/api/wallets/*").as("getWallet");
		cy.visit("/");
		cy.wait("@getWallet");

		cy.get("p").contains("John Doe").click();
		cy.get("[data-testid=navbar__buttons--send]").click();
		cy.get("div").contains("Enter details to send your money");
	});

	it("should handle the sign message action from dropdown", () => {
		cy.get("span").contains("Go back to Portfolio").click();
		cy.get("div").contains("2,000,000 ARK").click();
		cy.get("[data-testid=WalletHeader__more-button]").click();
		cy.get("li").contains("Sign Message").click();
		cy.get("h2").contains("Sign Message").click();
		cy.get("[data-testid=sign-message__sign-button]").click();
		cy.get("h2").contains("Message Successfully Signed").click();
		cy.get("[data-testid=modal__close-btn]").click();
	});

	it("should navigate back to porfolio", () => {
		cy.get("span").contains("Go back to Portfolio").click();
	});

	it("should navigate to registrations", () => {
		cy.get("div").contains("2,000,000 ARK").click();
		cy.get("[data-testid=WalletRegistrations__show-all]").click();
		cy.get("h1").contains("My Registrations");
	});

	it("should navigate to registration", () => {
		cy.get("span").contains("Go back to Portfolio").click();
		cy.get("div").contains("2,000,000 ARK").click();
		cy.get("[data-testid=WalletRegistrations__register]").click();
		cy.get("h1").contains("Registration");
	});
});
