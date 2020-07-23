describe("Wallet Details", () => {
	it("should navigate to dashboard page", () => {
		cy.visit("/profiles/1/dashboard");

		cy.get("div").contains("Wallets");
	});

	it("should navigate to import wallet page", () => {
		cy.get("button").contains("Import").click();
		cy.get("h1").contains("Select a Network");
	});

	it("should select a network", () => {
		cy.get("input").should("have.attr", "placeholder", "Enter a network name").type("DARK{enter}");
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

	it("should update wallet name", () => {
		cy.get('[data-testid="WalletHeader__more-button"]').find("div.relative").click();
		cy.get('[data-testid="WalletHeader__more-button"]')
			.find("div.relative")
			.find("ul > li")
			.each(($el) => {
				if ($el.text() === "Wallet Name") {
					cy.wrap($el).contains("Wallet Name");
					cy.wrap($el).click();
				}
			});

		cy.get('[data-testid="modal__inner"]').find("h2").contains("Name Wallet");
		cy.get("input[name=UpdateWalletName__input]").type("New Label");
		cy.get('[data-testid="UpdateWalletName__submit"]').click();

		cy.get('[data-testid="modal__inner"]').should("not.exist");
	});

	it("should error if new wallet name is not provided", () => {
		cy.get('[data-testid="WalletHeader__more-button"]').find("div.relative").click();
		cy.get('[data-testid="WalletHeader__more-button"]')
			.find("div.relative")
			.find("ul > li")
			.each(($el) => {
				if ($el.text() === "Wallet Name") {
					cy.wrap($el).contains("Wallet Name");
					cy.wrap($el).click();
				}
			});

		cy.get('[data-testid="modal__inner"]').find("h2").contains("Name Wallet");
		cy.get('[data-testid="UpdateWalletName__submit"]').click();
		cy.get("fieldset p").contains("is required");
		cy.get('[data-testid="modal__close-btn"]').click();
	});

	it("should delete wallet", () => {
		cy.get('[data-testid="WalletHeader__more-button"]').find("div.relative").click();
		cy.get('[data-testid="WalletHeader__more-button"]')
			.find("div.relative")
			.find("ul > li")
			.each(($el) => {
				if ($el.text() === "Delete") {
					cy.wrap($el).contains("Delete");
					cy.wrap($el).click();
				}
			});

		cy.get('[data-testid="modal__inner"]').find("h2").contains("Delete Wallet");
		cy.get('[data-testid="DeleteResource__submit-button"]').click();

		cy.get("div").contains("Wallets");
		cy.get("button").contains("Create");
		cy.get("button").contains("Import");
	});
});
