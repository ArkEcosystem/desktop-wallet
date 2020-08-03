import { RequestMock, Selector } from "testcafe";

import { buildTranslations as translations } from "../../../app/i18n/helpers";

fixture`Import Wallet action`.page`http://localhost:3000/`;

const neoscanMock = RequestMock()
	.onRequestTo(
		"https://neoscan.io/api/main_net/v1/get_last_transactions_by_address/AGuf6U4ZeNA2P8FHYiQZPXypLbPAtCNGFN/1",
	)
	.respond(require("../../../tests/fixtures/coins/ark/neo-duplicate.json"), 200, {
		"access-control-allow-origin": "*",
	});

test("should import a wallet by mnemonic", async (t) => {
	await t.click(Selector("p").withText("John Doe"));
	await t.expect(Selector("div").withText(translations().COMMON.WALLETS).exists).ok();

	// Navigate to create page
	await t.click(Selector("button").withExactText(translations().COMMON.IMPORT));
	await t
		.expect(Selector("div").withText(translations().WALLETS.PAGE_IMPORT_WALLET.NETWORK_STEP.SUBTITLE).exists)
		.ok();

	// Select a network and advance to step two
	await t.click(Selector("#ImportWallet__network-item-1"));
	await t
		.expect(Selector("button").withText(translations().COMMON.CONTINUE).hasAttribute("disabled"))
		.notOk("Network selected", { timeout: 5000 });
	await t.click(Selector("button").withExactText(translations().COMMON.CONTINUE));
	await t
		.expect(Selector("h1").withExactText(translations().WALLETS.PAGE_IMPORT_WALLET.METHOD_STEP.TITLE).exists)
		.ok();

	// Error without the required fields
	await t.click(Selector("button").withExactText(translations().COMMON.GO_TO_WALLET));
	await t.expect(Selector("fieldset p").withText("Your Passphrase is required").exists).ok();

	// Input password and import wallet
	const passphraseInput = Selector("input[name=passphrase]");

	await t.typeText(passphraseInput, "this is a top secret passphrase oleg");
	await t.click(Selector("button").withExactText(translations().COMMON.GO_TO_WALLET));
});

test("should import a wallet by address", async (t) => {
	await t.click(Selector("p").withText("John Doe"));
	await t.expect(Selector("div").withText(translations().COMMON.WALLETS).exists).ok();

	// Navigate to create page
	await t.click(Selector("button").withExactText(translations().COMMON.IMPORT));
	await t
		.expect(Selector("div").withText(translations().WALLETS.PAGE_IMPORT_WALLET.NETWORK_STEP.SUBTITLE).exists)
		.ok();

	// Select a network and advance to step two
	await t.click(Selector("#ImportWallet__network-item-1"));
	await t
		.expect(Selector("button").withText(translations().COMMON.CONTINUE).hasAttribute("disabled"))
		.notOk("Network selected", { timeout: 5000 });
	await t.click(Selector("button").withExactText(translations().COMMON.CONTINUE));
	await t
		.expect(Selector("h1").withExactText(translations().WALLETS.PAGE_IMPORT_WALLET.METHOD_STEP.TITLE).exists)
		.ok();

	// Use the address only
	await t.click(Selector("input[name=isAddressOnly]").parent());

	// Error without the required fields
	await t.click(Selector("button").withExactText(translations().COMMON.GO_TO_WALLET));
	await t.expect(Selector("fieldset p").withText("Address is required").exists).ok();

	// Input address and import wallet
	const addressInput = Selector("input[name=address]");

	await t.typeText(addressInput, "D61mfSggzbvQgTUe6JhYKH2doHaqJ3Dyib");
	await t.click(Selector("button").withExactText(translations().COMMON.GO_TO_WALLET));
});

test("should show an error message for invalid address", async (t) => {
	await t.click(Selector("p").withText("John Doe"));
	await t.expect(Selector("div").withText("Wallets").exists).ok();

	// Navigate to import page
	await t.click(Selector("button").withExactText("Import"));
	await t
		.expect(Selector("div").withText(translations().WALLETS.PAGE_IMPORT_WALLET.NETWORK_STEP.SUBTITLE).exists)
		.ok();

	// Select a network and advance to step two
	await t.click(Selector("#ImportWallet__network-item-1"));
	await t
		.expect(Selector("button").withText(translations().COMMON.CONTINUE).hasAttribute("disabled"))
		.notOk("Network selected", { timeout: 5000 });
	await t.click(Selector("button").withExactText(translations().COMMON.CONTINUE));
	await t.expect(Selector("h1").withExactText("Import Wallet").exists).ok();

	// Use the address only
	await t.click(Selector("input[name=isAddressOnly]").parent());

	// Input address and import wallet
	const addressInput = Selector("input[name=address]");

	await t.typeText(addressInput, "123");
	await t.click(Selector("button").withExactText("Go to Wallet"));

	await t.expect(Selector("p").withText("Error").exists).ok({ timeout: 5000 });
	await t
		.expect(Selector("div").withText("Failed to retrieve information for 123 because it is invalid.").exists)
		.ok();
});

test.requestHooks(neoscanMock)("should show an error if import a NEO mainnet address", async (t) => {
	await t.click(Selector("p").withText("John Doe"));
	await t.expect(Selector("div").withText("Wallets").exists).ok();

	// Navigate to import page
	await t.click(Selector("button").withExactText("Import"));
	await t
		.expect(Selector("div").withText(translations().WALLETS.PAGE_IMPORT_WALLET.NETWORK_STEP.SUBTITLE).exists)
		.ok();

	// Select a network and advance to step two
	await t.click(Selector("#ImportWallet__network-item-0"));
	await t
		.expect(Selector("button").withText(translations().COMMON.CONTINUE).hasAttribute("disabled"))
		.notOk("Network selected", { timeout: 5000 });
	await t.click(Selector("button").withExactText(translations().COMMON.CONTINUE));
	await t.expect(Selector("h1").withExactText("Import Wallet").exists).ok();

	// Use the address only
	await t.click(Selector("input[name=isAddressOnly]").parent());

	// Input address and import wallet
	const addressInput = Selector("input[name=address]");

	// NEO address: https://neoscan.io/address/AGuf6U4ZeNA2P8FHYiQZPXypLbPAtCNGFN/1
	await t.typeText(addressInput, "AGuf6U4ZeNA2P8FHYiQZPXypLbPAtCNGFN");
	await t.click(Selector("button").withExactText("Go to Wallet"));

	await t.expect(Selector("p").withText("Error").exists).ok();
	await t.expect(Selector("div").withText("This address exists on the NEO Mainnet.").exists).ok();
});

test("should show an error message if trying to import a duplicate address", async (t) => {
	let addressInput: Selector;

	await t.click(Selector("p").withText("John Doe"));
	await t.expect(Selector("div").withText("Wallets").exists).ok();

	// Navigate to import page
	await t.click(Selector("button").withExactText("Import"));
	await t
		.expect(Selector("div").withText(translations().WALLETS.PAGE_IMPORT_WALLET.NETWORK_STEP.SUBTITLE).exists)
		.ok();

	// Select a network and advance to step two
	await t.click(Selector("#ImportWallet__network-item-1"));
	await t
		.expect(Selector("button").withText(translations().COMMON.CONTINUE).hasAttribute("disabled"))
		.notOk("Network selected", { timeout: 5000 });
	await t.click(Selector("button").withExactText(translations().COMMON.CONTINUE));
	await t.expect(Selector("h1").withExactText("Import Wallet").exists).ok();

	// Use the address only
	await t.click(Selector("input[name=isAddressOnly]").parent());

	// Input address and import wallet
	addressInput = Selector("input[name=address]");

	await t.typeText(addressInput, "D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD");
	await t.click(Selector("button").withExactText("Go to Wallet"));

	// Try to import a duplicate wallet
	await t.click(Selector("a").withExactText("Portfolio"));

	// Navigate to import page
	await t.click(Selector("button").withExactText("Import"));
	await t
		.expect(Selector("div").withText(translations().WALLETS.PAGE_IMPORT_WALLET.NETWORK_STEP.SUBTITLE).exists)
		.ok();

	// Select a network and advance to step two
	await t.click(Selector("#ImportWallet__network-item-1"));
	await t
		.expect(Selector("button").withText(translations().COMMON.CONTINUE).hasAttribute("disabled"))
		.notOk("Network selected", { timeout: 5000 });
	await t.click(Selector("button").withExactText(translations().COMMON.CONTINUE));
	await t.expect(Selector("h1").withExactText("Import Wallet").exists).ok();

	// Use the address only
	await t.click(Selector("input[name=isAddressOnly]").parent());

	// Input address and import wallet
	addressInput = Selector("input[name=address]");

	// Import a duplicate wallet
	await t.typeText(addressInput, "D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD");
	await t.click(Selector("button").withExactText("Go to Wallet"));

	await t.expect(Selector("p").withText("Error").exists).ok({ timeout: 5000 });
	await t
		.expect(Selector("div").withText("The wallet [D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD] already exists.").exists)
		.ok();
});
