describe("Create Wallet", () => {
	it("should navigate to portfolio page", () => {
		cy.visit("/");

		cy.get("p").contains("Anne Doe").click();
		cy.get("div").contains("Wallets");
	});

	it("should navigate to create wallet page", () => {
		cy.get("button").contains("Create").click();
		cy.get("h1").contains("Select a Cryptoasset");
	});

	it("should select a network", () => {
		cy.get("input").should("have.attr", "placeholder", "Enter a network name").type("ARK{enter}");
		cy.get("button").contains("Continue").click();
		cy.get("h1").contains("Your Passphrase");
	});

	it("it should confirm passphrase", () => {
		const mnemonicWords = [];

		cy.get("li[data-testid=MnemonicList__item]").each(($el) => {
			mnemonicWords.push(
				$el
					.text()
					.replace(/[0-9]+/, "")
					.trim(),
			);
		});

		cy.get("button").contains("Continue").click();
		cy.get("h1").contains("Confirm your passphrase");
		cy.get("button").contains("Continue").should("be.disabled");

		for (let i = 0; i < 3; i++) {
			cy.get("p[data-testid=MnemonicVerificationOptions__title]")
				.invoke("text")
				.then((selectWordTitle) => {
					const wordNumber = selectWordTitle.replace(/Select word #/, "");
					cy.get("button[data-testid=MnemonicVerificationOptions__button]")
						.contains(new RegExp(`^${mnemonicWords[wordNumber - 1]}$`))
						.click();
				});
		}

		cy.get("button").contains("Continue").click();
		cy.get("h1").contains("Completed");
	});

	it("should navigate back to portfolio page", () => {
		cy.get("button").contains("Save & Finish").click();
		cy.get("div").contains("Wallets");
	});
});
