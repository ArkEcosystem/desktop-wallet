import { Selector } from "testcafe";

fixture`Import Wallet action`.page`http://localhost:3000/`;

test("should import a wallet by mnemonic", async (t) => {
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

	// Input password and import wallet
	const passphraseInput = Selector("input[name=passphrase]");

	await t.typeText(passphraseInput, "this is a top secret passphrase oleg");
	await t.click(Selector("button").withExactText("Go to Wallet"));
});

test("should import a wallet by address", async (t) => {
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
	await t.click(Selector("input[name=isAddressOnly]").parent());
	await t.click(Selector("button").withExactText("Go to Wallet"));
	await t.expect(Selector("fieldset p").withText("Address is required").exists).ok();

	// Input address and import wallet
	const addressInput = Selector("input[name=address]");

	await t.typeText(addressInput, "D61mfSggzbvQgTUe6JhYKH2doHaqJ3Dyib");
	await t.click(Selector("button").withExactText("Go to Wallet"));
});

test("should show an error message if trying to import a duplicate wallet", async (t) => {
	let addressInput;

	await t.click(Selector("p").withText("John Doe"));
	await t.expect(Selector("div").withText("Wallets").exists).ok();

	// Navigate to import page
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
	await t.click(Selector("input[name=isAddressOnly]").parent());
	await t.click(Selector("button").withExactText("Go to Wallet"));
	await t.expect(Selector("fieldset p").withText("Address is required").exists).ok();

	// Input address and import wallet
	addressInput = Selector("input[name=address]");

	await t.typeText(addressInput, "D61mfSggzbvQgTUe6JhYKH2doHaqJ3Dyib");
	await t.click(Selector("button").withExactText("Go to Wallet"));

	// Try to import a duplicate wallet
	await t.click(Selector("a").withExactText("Portfolio"));

	// Navigate to import page
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
	await t.click(Selector("input[name=isAddressOnly]").parent());
	await t.click(Selector("button").withExactText("Go to Wallet"));
	await t.expect(Selector("fieldset p").withText("Address is required").exists).ok();

	// Input address and import wallet
	addressInput = Selector("input[name=address]");

	await t.typeText(addressInput, "D61mfSggzbvQgTUe6JhYKH2doHaqJ3Dyib");
	await t.click(Selector("button").withExactText("Go to Wallet"));

	await t.expect(Selector("p").withText("Error").exists).ok({ timeout: 5000 });
	await t
		.expect(Selector("div").withText("The wallet [D61mfSggzbvQgTUe6JhYKH2doHaqJ3Dyib] already exists.").exists)
		.ok();
});
