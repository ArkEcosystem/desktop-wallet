import { Selector } from "testcafe";

fixture`Import Wallet action`.page`http://localhost:3000/`;

test("should import a wallet", async (t) => {
	await t.click(Selector("p").withText("John Doe"));
	await t.expect(Selector("div").withText("Wallets").exists).ok();
	// Navigate to create page
	await t.click(Selector("button").withExactText("Import"));
	await t.expect(Selector("div").withText("Select a Network to import your existing wallet address").exists).ok();

	// Select a network and advance to step two
	await t.click(Selector("#ImportWallet__network-item-1"));
	await t
		.expect(Selector("button").withText("Continue").hasAttribute("disabled"))
		.notOk("Network selected", { timeout: 5000 });
	await t.click(Selector("button").withExactText("Continue"));
	await t.expect(Selector("h1").withExactText("Import Wallet").exists).ok();

	// Error without the required fields
	await t.click(Selector("button").withExactText("Go to Wallet"));
	await t.expect(Selector("fieldset p").withText("Your Passphrase is required").exists).ok();
	await t.click(Selector("input[name=isAddressOnly]").parent());
	await t.click(Selector("button").withExactText("Go to Wallet"));
	await t.expect(Selector("fieldset p").withText("Address is required").exists).ok();

	await t.click(Selector("input[name=isAddressOnly]").parent());

	// Input password and import wallet
	const passphraseInput = Selector("input[name=passphrase]");

	await t.typeText(passphraseInput, "this is a top secret passphrase oleg");
	await t.click(Selector("button").withExactText("Go to Wallet"));
});
