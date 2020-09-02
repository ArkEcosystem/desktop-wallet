import { Selector } from "testcafe";

import { buildTranslations as translations } from "../../../app/i18n/helpers";
import { createFixture } from "../../../utils/e2e-utils";

createFixture(`Import Wallet action`);

test("should import a wallet by mnemonic", async (t) => {
	await t.click(Selector("p").withText("John Doe"));
	await t.expect(Selector("div").withText(translations().COMMON.WALLETS).exists).ok();

	// Navigate to import page
	await t.click(Selector("button").withExactText(translations().COMMON.IMPORT));
	await t
		.expect(Selector("div").withText(translations().WALLETS.PAGE_IMPORT_WALLET.NETWORK_STEP.SUBTITLE).exists)
		.ok();

	// Select a network and advance to second step
	await t.click(Selector("#ImportWallet__network-item-1"));
	await t
		.expect(Selector("button").withText(translations().COMMON.CONTINUE).hasAttribute("disabled"))
		.notOk("Network selected", { timeout: 5000 });
	await t.click(Selector("button").withExactText(translations().COMMON.CONTINUE));
	await t
		.expect(Selector("h1").withExactText(translations().WALLETS.PAGE_IMPORT_WALLET.METHOD_STEP.TITLE).exists)
		.ok();

	// Fill a passphrase and advance to third step
	const passphraseInput = Selector("input[name=passphrase]");

	await t.typeText(passphraseInput, "this is a top secret passphrase oleg");
	await t.click(Selector("button").withExactText(translations().COMMON.GO_TO_WALLET));

	// Fill a wallet name
	const walletNameInput = Selector("input[name=name]");

	await t.typeText(walletNameInput, "Test");
	await t.click(Selector("button").withExactText(translations().COMMON.SAVE_FINISH));
});

test("should import a wallet by address", async (t) => {
	await t.click(Selector("p").withText("John Doe"));
	await t.expect(Selector("div").withText(translations().COMMON.WALLETS).exists).ok();

	// Navigate to import page
	await t.click(Selector("button").withExactText(translations().COMMON.IMPORT));
	await t
		.expect(Selector("div").withText(translations().WALLETS.PAGE_IMPORT_WALLET.NETWORK_STEP.SUBTITLE).exists)
		.ok();

	// Select a network and advance to the step two
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

	// Fill an address and advance to the third step
	const addressInput = Selector("input[name=address]");

	await t.typeText(addressInput, "D61mfSggzbvQgTUe6JhYKH2doHaqJ3Dyib");
	await t.click(Selector("button").withExactText(translations().COMMON.GO_TO_WALLET));

	// Fill a wallet name
	const walletNameInput = Selector("input[name=name]");

	await t.typeText(walletNameInput, "Test");
	await t.click(Selector("button").withExactText(translations().COMMON.SAVE_FINISH));
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

	// Input address
	const addressInput = Selector("input[name=address]");

	await t.typeText(addressInput, "123");
	await t.click(Selector("button").withExactText("Go to Wallet"));

	await t.expect(Selector("fieldset p").withText("The address is not valid").exists).ok({ timeout: 5000 });
});

test("should show an error message for duplicate address", async (t) => {
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

	// Input address
	addressInput = Selector("input[name=address]");

	await t.typeText(addressInput, "D61mfSggzbvQgTUe6JhYKH2doHaqJ3Dyib", { replace: true, speed: 1, paste: true });
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

	// Input address
	addressInput = Selector("input[name=address]");

	await t.typeText(addressInput, "D61mfSggzbvQgTUe6JhYKH2doHaqJ3Dyib", { replace: true, speed: 1, paste: true });
	await t.click(Selector("button").withExactText("Go to Wallet"));

	await t
		.expect(Selector("fieldset p").withText("Address D61mfSggzbvQgTUe6JhYKH2doHaqJ3Dyib already exists").exists)
		.ok();
});
