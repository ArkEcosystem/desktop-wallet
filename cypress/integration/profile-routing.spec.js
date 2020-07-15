describe("Profile Routing", () => {
	it("should navigate to create profile", () => {
		cy.visit("/");

		cy.get("button").contains("Create Profile").click();
		cy.get("h1").contains("Create Profile");
	});

	it("should create profile & navigate to welcome screen", () => {
		cy.get("input[name=name]").type("Test Profile");
		cy.get("button").contains("Select Market Provider").click();
		cy.get("li.select-list-option").contains("Option 1").click();
		cy.get("button").contains("Select Currency").click();
		cy.get("li.select-list-option").contains("Option 1").click();
		cy.get("input[name=isDarkMode]").parent().click();

		cy.get("button").contains("Complete").click();
		cy.get("h1").contains("Welcome");
	});

	it("should navigate to dashboard", () => {
		cy.get("p").contains("Test Profile").click();
		cy.get("div").contains("Wallets");
	});
});
