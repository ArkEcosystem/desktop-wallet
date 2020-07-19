describe("Import Wallet", () => {
	it("should navigate to dashboard page", () => {
		cy.visit("/profiles/1/dashboard");

		cy.get("div").contains("Wallets");
	});

	it("should navigate to import wallet page", () => {
		cy.get("button").contains("Import").click();
		cy.get("h1").contains("Select a Cryptoasset");
	});

	it("should select a network", () => {
		cy.get("input").should("have.attr", "placeholder", "Enter a network name").type("DARK{enter}");
		cy.get("button").contains("Continue").click();
		cy.get("h1").contains("Import Wallet");
	});

	it("should import a wallet", () => {
		cy.get("label").contains("Your Password");
		cy.get("input[name=password]").type("this is a top secret passphrase");

		cy.get("button").contains("Go to Wallet").click();
		cy.get("button").contains("Send");
	});
});
