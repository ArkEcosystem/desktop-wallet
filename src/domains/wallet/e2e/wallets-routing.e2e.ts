import { Selector } from "testcafe";

fixture`Wallets routing`.page`http://localhost:3000/`;

test("should navigate to portfolio and access a wallet details", async (t) => {
	await t.click(Selector("p").withText("John Doe"));
	await t.expect(Selector("div").withText("Wallets").exists).ok();

	await t.click(Selector("[data-testid=WalletCard__1ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT]"));
	await t.expect(Selector("h2").withText("ARK Wallet 1").exists).ok();
});

test("should navigate to create wallet page", async (t) => {
	await t.click(Selector("p").withText("John Doe"));
	await t.expect(Selector("div").withText("Wallets").exists).ok();
	// Go to create wallet page
	await t.click(Selector("button").withText("Create"));
	await t.expect(Selector("div").withText("Select a Network to create your new wallet address").exists).ok();
});

test("should navigate to import wallet page", async (t) => {
	await t.click(Selector("p").withText("John Doe"));
	await t.expect(Selector("div").withText("Wallets").exists).ok();
	// Go to create wallet page
	await t.click(Selector("button").withText("Import"));
	await t.expect(Selector("div").withText("Select a Network to import your existing wallet address").exists).ok();
});
