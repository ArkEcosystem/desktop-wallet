describe("Setting Routing", () => {
	it("should navigate to settings page", () => {
		cy.visit("/profiles/1/settings");

		cy.get("h1").contains("Wallet Settings");
	});

	it("should error without required fields", () => {
		cy.get("button").contains("Save").click();

		cy.get("fieldset p").contains("Name is required");
		cy.get("fieldset p").contains("Passphrase Language is required");
		cy.get("fieldset p").contains("Currency is required");
		cy.get("fieldset p").contains("Language is required");
		cy.get("fieldset p").contains("Market Provider is required");
		cy.get("fieldset p").contains("Time Format is required");
	});

	it("should save profile", () => {
		cy.get("input[name=name]").type("Test Profile");

		cy.get("button").contains("Select Language").click();
		cy.get("li.select-list-option").contains("Option 1").click();

		cy.get("button").contains("Select Passphrase Language").click();
		cy.get("li.select-list-option").contains("Option 1").click();

		cy.get("button").contains("Select Market Provider").click();
		cy.get("li.select-list-option").contains("Option 1").click();

		cy.get("button").contains("Select Currency").click();
		cy.get("li.select-list-option").contains("Option 1").click();

		cy.get("button").contains("Select Time Format").click();
		cy.get("li.select-list-option").contains("Option 1").click();

		cy.get("input[name=isScreenshotProtection]").parent().click();
		cy.get("input[name=isAdvancedMode]").parent().click();
		cy.get("input[name=isDarkMode]").parent().click();
		cy.get("input[name=isUpdateLedger]").parent().click();

		cy.get("button").contains("Save").click();
	});
});
