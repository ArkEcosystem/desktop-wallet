describe("Plugins Routing", () => {
	it("should navigate to plugins manager page", () => {
		cy.visit("/");

		cy.get("p").contains("Anne Doe").click();

		cy.get("a").contains("Plugins").click();
		cy.get("h1").contains("Plugin Manager");
	});

	it("should filter by game", () => {
		cy.get("span").contains("Game").click();
		cy.get("h2").contains("Game").click();
	});

	it("should filter by utility", () => {
		cy.get("span").contains("Utility").click();
		cy.get("h2").contains("Utility").click();
	});

	it("should filter by themes", () => {
		cy.get("span").contains("Themes").click();
		cy.get("h2").contains("Themes").click();
	});

	it("should filter by other", () => {
		cy.get("span").contains("Other").click();
		cy.get("h2").contains("Other").click();
	});

	it("should filter by user plugins", () => {
		cy.get("span").contains("MyPlugin").click();
		cy.get("h2").contains("My Plugins").click();
	});

	it("should navigate to plugin details", () => {
		cy.get('[data-testid="PluginCard--ark-explorer-0"]').click();
		cy.get("span").contains("ARK Explorer");
	});

	it("should navigate back to plugin store", () => {
		cy.get("span").contains("Go back to plugin store").click();
		cy.get("h1").contains("Plugin Manager");
	});
});
