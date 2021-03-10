import { Selector } from "testcafe";

import { buildTranslations } from "../../../app/i18n/helpers";
import { BASEURL, createFixture, mockRequest } from "../../../utils/e2e-utils";

const translations = buildTranslations();

createFixture(
	`Import Wallet action`,
	[],
	[
		mockRequest(
			(request: any) => !!request.url.match(new RegExp(BASEURL + "wallets/([-0-9a-zA-Z]{1,34})")),
			"coins/ark/devnet/wallets/not-found",
			404,
		),
	],
);

test("should import a wallet by mnemonic", async (t) => {
	await t.click(Selector("span").withText("John Doe"));
	await t.expect(Selector("div").withText(translations.COMMON.WALLETS).exists).ok();

	// Navigate to import page
	await t.click(Selector("button").withExactText(translations.COMMON.IMPORT));
	await t
		.expect(Selector("div").withText(translations.WALLETS.PAGE_IMPORT_WALLET.CRYPTOASSET_STEP.SUBTITLE).exists)
		.ok();

	// Select a cryptoasset and advance to second step
	await t.click('[data-testid="SelectNetworkInput__input"]');
	await t.click(Selector('[data-testid="NetworkIcon-ARK-ark.devnet"]'));
	await t
		.expect(Selector("button").withText(translations.COMMON.CONTINUE).hasAttribute("disabled"))
		.notOk("Cryptoasset selected", { timeout: 5000 });
	await t.click(Selector("button").withExactText(translations.COMMON.CONTINUE));
	await t.expect(Selector("h1").withExactText(translations.WALLETS.PAGE_IMPORT_WALLET.METHOD_STEP.TITLE).exists).ok();

	// Fill a passphrase and advance to third step
	const passphraseInput = Selector("[data-testid=ImportWallet__mnemonic-input]");

	await t.typeText(passphraseInput, "buddy year cost vendor honey tonight viable nut female alarm duck symptom");
	await t.click(Selector("button").withExactText(translations.COMMON.CONTINUE));

	// Fill a wallet name
	const walletNameInput = Selector("input[name=name]");

	await t.typeText(walletNameInput, "Test Mnemonic");
	await t.click(Selector("button").withExactText(translations.COMMON.SAVE_FINISH));
});

test("should import a wallet by address", async (t) => {
	await t.click(Selector("span").withText("John Doe"));
	await t.expect(Selector("div").withText(translations.COMMON.WALLETS).exists).ok();

	// Navigate to import page
	await t.click(Selector("button").withExactText(translations.COMMON.IMPORT));
	await t
		.expect(Selector("div").withText(translations.WALLETS.PAGE_IMPORT_WALLET.CRYPTOASSET_STEP.SUBTITLE).exists)
		.ok();

	// Select a cryptoasset and advance to the step two
	await t.click('[data-testid="SelectNetworkInput__input"]');
	await t.click(Selector('[data-testid="NetworkIcon-ARK-ark.devnet"]'));
	await t
		.expect(Selector("button").withText(translations.COMMON.CONTINUE).hasAttribute("disabled"))
		.notOk("Cryptoasset selected", { timeout: 5000 });
	await t.click(Selector("button").withExactText(translations.COMMON.CONTINUE));
	await t.expect(Selector("h1").withExactText(translations.WALLETS.PAGE_IMPORT_WALLET.METHOD_STEP.TITLE).exists).ok();

	await t.click('[data-testid="SelectDropdownInput__input"]');
	await t.click(Selector("#ImportWallet__select-item-1"));

	// Fill an address and advance to the third step
	const addressInput = Selector("[data-testid=ImportWallet__address-input]");

	await t.typeText(addressInput, "DC8ghUdhS8w8d11K8cFQ37YsLBFhL3Dq2P");
	await t.click(Selector("button").withExactText(translations.COMMON.CONTINUE));

	// Fill a wallet name
	const walletNameInput = Selector("input[name=name]");

	await t.typeText(walletNameInput, "Test Address");
	await t.click(Selector("button").withExactText(translations.COMMON.SAVE_FINISH));
});

test("should show an error message for invalid address", async (t) => {
	await t.click(Selector("span").withText("John Doe"));
	await t.expect(Selector("div").withText("Wallets").exists).ok();

	// Navigate to import page
	await t.click(Selector("button").withExactText("Import"));
	await t
		.expect(Selector("div").withText(translations.WALLETS.PAGE_IMPORT_WALLET.CRYPTOASSET_STEP.SUBTITLE).exists)
		.ok();

	// Select a cryptoasset and advance to step two
	await t.click('[data-testid="SelectNetworkInput__input"]');
	await t.click(Selector('[data-testid="NetworkIcon-ARK-ark.devnet"]'));
	await t
		.expect(Selector("button").withText(translations.COMMON.CONTINUE).hasAttribute("disabled"))
		.notOk("Cryptoasset selected", { timeout: 5000 });
	await t.click(Selector("button").withExactText(translations.COMMON.CONTINUE));
	await t.expect(Selector("h1").withExactText("Import Wallet").exists).ok();

	await t.click('[data-testid="SelectDropdownInput__input"]');
	await t.click(Selector("#ImportWallet__select-item-1"));

	// Input address
	const addressInput = Selector("[data-testid=ImportWallet__address-input]");
	await t.typeText(addressInput, "123");

	await t.click(Selector("button").withExactText(translations.COMMON.CONTINUE));

	await t.expect(Selector('[data-testid="Input-error"]').exists).ok({ timeout: 5000 });
});

test("should show an error message for duplicate address", async (t) => {
	let passphraseInput: Selector;

	await t.click(Selector("span").withText("John Doe"));
	await t.expect(Selector("div").withText("Wallets").exists).ok();

	// Navigate to import page
	await t.click(Selector("button").withExactText("Import"));
	await t
		.expect(Selector("div").withText(translations.WALLETS.PAGE_IMPORT_WALLET.CRYPTOASSET_STEP.SUBTITLE).exists)
		.ok();

	// Select a cryptoasset and advance to step two
	await t.click('[data-testid="SelectNetworkInput__input"]');
	await t.click(Selector('[data-testid="NetworkIcon-ARK-ark.devnet"]'));
	await t
		.expect(Selector("button").withText(translations.COMMON.CONTINUE).hasAttribute("disabled"))
		.notOk("Cryptoasset selected", { timeout: 5000 });
	await t.click(Selector("button").withExactText(translations.COMMON.CONTINUE));
	await t.expect(Selector("h1").withExactText("Import Wallet").exists).ok();

	// Input passphrase
	passphraseInput = Selector("[data-testid=ImportWallet__mnemonic-input]");

	await t.typeText(passphraseInput, "imaginary passphrase", { replace: true, paste: true });
	await t.click(Selector("button").withExactText(translations.COMMON.CONTINUE));

	// Try to import a duplicate wallet
	await t.click(Selector("a").withExactText("Portfolio"));

	// Navigate to import page
	await t.click(Selector("button").withExactText("Import"));
	await t
		.expect(Selector("div").withText(translations.WALLETS.PAGE_IMPORT_WALLET.CRYPTOASSET_STEP.SUBTITLE).exists)
		.ok();

	// Select a cryptoasset and advance to step two
	await t.click('[data-testid="SelectNetworkInput__input"]');
	await t.click(Selector('[data-testid="NetworkIcon-ARK-ark.devnet"]'));
	await t
		.expect(Selector("button").withText(translations.COMMON.CONTINUE).hasAttribute("disabled"))
		.notOk("Cryptoasset selected", { timeout: 5000 });
	await t.click(Selector("button").withExactText(translations.COMMON.CONTINUE));
	await t.expect(Selector("h1").withExactText("Import Wallet").exists).ok();

	// Input passphrase
	passphraseInput = Selector("[data-testid=ImportWallet__mnemonic-input]");

	await t.typeText(passphraseInput, "imaginary passphrase", { replace: true, paste: true });
	await t.click(Selector("button").withExactText(translations.COMMON.CONTINUE));

	await t.expect(Selector('[data-testid="Input-error"]').exists).ok();
});
