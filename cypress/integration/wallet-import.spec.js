describe("Import Wallet", () => {
	it("should navigate to dashboard page", () => {
		cy.wait(2000); // eslint-disable-line cypress/no-unnecessary-waiting
		cy.visit("/profiles/b999d134-7a24-481e-a95d-bc47c543bfc9/dashboard");

		cy.get("div").contains("Wallets");
	});

	it("should navigate to import wallet page", () => {
		cy.get("button").contains("Import").click();
		cy.get("h1").contains("Select a Network");
	});

	it("should select a network", () => {
		cy.get("input").should("have.attr", "placeholder", "Enter a network name").type("Ark D{enter}");
		cy.get("button").contains("Continue").click();
		cy.get("h1").contains("Import Wallet");
	});

	it("should error without required fields", () => {
		cy.get("button").contains("Go to Wallet").click();
		cy.get("fieldset p").contains("Your Passphrase is required");

		cy.get("input[name=isAddressOnly]").parent().click();
		cy.get("button").contains("Go to Wallet").click();
		cy.get("fieldset p").contains("Address is required");

		cy.get("input[name=isAddressOnly]").parent().click();
	});

	it("should import a wallet", () => {
		cy.get("label").contains("Your Passphrase");
		cy.get("input[name=passphrase]").type("this is a top secret passphrase");

		cy.get("button").contains("Go to Wallet").click();
		cy.get("button").contains("Send");
	});
});
