describe("Welcome -> Create Profile routing", () => {
	it("should navigate between welcome and create profile", () => {
		cy.visit("/");

		cy.get("button").contains("Create Profile").click();
		cy.get("button").contains("Back").click();
		cy.get("h1").should("have.text", "Welcome to ARK");
	});
});
