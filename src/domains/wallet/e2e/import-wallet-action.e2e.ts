import { Selector } from "testcafe";

import { buildTranslations as translations } from "../../../app/i18n/helpers";

fixture`Import Wallet action`.page`http://localhost:3000/`;

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

	// Error without the required fields
	await t.click(Selector("input[name=isAddressOnly]").parent());
	await t.click(Selector("button").withExactText(translations().COMMON.GO_TO_WALLET));
	await t.expect(Selector("fieldset p").withText("Address is required").exists).ok();

	// Input address and import wallet
	const addressInput = Selector("input[name=address]");

	await t.typeText(addressInput, "D61mfSggzbvQgTUe6JhYKH2doHaqJ3Dyib");
	await t.click(Selector("button").withExactText(translations().COMMON.GO_TO_WALLET));
});
