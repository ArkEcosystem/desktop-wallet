import { ClientFunction, Selector } from "testcafe";

fixture`Transactions routing`.page`http://localhost:3000/`;

const scrollBy = ClientFunction((x, y) => {
	window.scrollBy(x, y);
});

test("should navigate to portfolio and sign message", async (t) => {
	await t.click(Selector("p").withText("John Doe"));
	await t.expect(Selector("div").withText("Wallets").exists).ok();
	await t.click(Selector("[data-testid=navbar__buttons--send]"));
	await t.expect(Selector("div").withText("Enter details to send your money").exists).ok();

	// Handle sign message
	await t.click(Selector("span").withText("Go back to Portfolio"));
	await t.click(Selector("[data-testid=WalletCard__1ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT]"));
	await scrollBy(0, -200);
	await t.click(Selector("[data-testid=WalletHeader__more-button]"));
	await t.click(Selector("li").withText("Sign Message"));

	await t.click(Selector("[data-testid=sign-message__sign-button]"));
	await t.expect(Selector("h2").withText("Message Successfully Signed").exists).ok();
	await t.click(Selector("[data-testid=modal__close-btn]"));
});

test("should navigate to portfolio and access registrations", async (t) => {
	await t.click(Selector("p").withText("John Doe"));
	await t.expect(Selector("div").withText("Wallets").exists).ok();
	// Go to registrations
	await t.click(Selector("[data-testid=WalletCard__1ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT]"));
	await t.click(Selector("[data-testid=WalletRegistrations__show-all]"));
	await t.expect(Selector("h1").withText("My Registrations").exists).ok();
});

test("should navigate to portfolio and registrate", async (t) => {
	await t.click(Selector("p").withText("John Doe"));
	await t.expect(Selector("div").withText("Wallets").exists).ok();
	// Go to registrations
	await t.click(Selector("[data-testid=WalletCard__1ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT]"));
	await t.click(Selector("[data-testid=WalletRegistrations__register]"));
	await t.expect(Selector("h1").withText("Registration").exists).ok();
});
