/// <reference types="cypress" />

context("Demo cypress", () => {
	beforeEach(() => {
		cy.visit("https://google.com");
	});
});
