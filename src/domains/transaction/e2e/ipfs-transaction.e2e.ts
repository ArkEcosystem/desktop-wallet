import {  Selector } from "testcafe";

import { buildTranslations } from "../../../app/i18n/helpers";
import { createFixture, mockRequest } from "../../../utils/e2e-utils";
import { goToProfile } from "../../profile/e2e/common";
import { goToWallet, importWallet } from "../../wallet/e2e/common";

const translations = buildTranslations();

createFixture(`IPFS Transaction action`, [
	mockRequest(
		{
			url: "https://dwallets.ark.io/api/transactions",
			method: "POST",
		},
		{
			data: {
				accept: ["transaction-id"],
				broadcast: ["transaction-id"],
				excess: [],
				invalid: [],
			},
		},
	),
]);

test("should navigate to IPFS page", async (t) => {
	// Navigate to wallet page
	await goToWallet(t);

	// Click store hash option in dropdown menu
	await t.click(Selector('[data-testid="WalletHeader__more-button"]'));
	await t.click(
		Selector('[data-testid="WalletHeader__more-button"] li').withText(
			translations.WALLETS.PAGE_WALLET_DETAILS.OPTIONS.STORE_HASH,
		),
	);

	// Navigate to IPFS page
	await t.expect(Selector("h1").withText(translations.TRANSACTION.PAGE_IPFS.FIRST_STEP.TITLE).exists).ok();
});

test("should show an error if an invalid IPFS hash is entered", async (t) => {
	// Navigate to wallet page
	await goToWallet(t);

	// Click store hash option in dropdown menu
	await t.click(Selector('[data-testid="WalletHeader__more-button"]'));
	await t.click(
		Selector('[data-testid="WalletHeader__more-button"] li').withText(
			translations.WALLETS.PAGE_WALLET_DETAILS.OPTIONS.STORE_HASH,
		),
	);

	// Navigate to IPFS page
	await t.expect(Selector("h1").withText(translations.TRANSACTION.PAGE_IPFS.FIRST_STEP.TITLE).exists).ok();

	// Type an invalid IPFS hash
	await t.typeText(Selector("[data-testid=Input__hash]"), "invalid-ipfs-hash");
	await t.expect(Selector("[data-testid=Input__hash]").hasAttribute("aria-invalid")).ok();
});

test("should show an error if wrong mnemonic", async (t) => {
	// Navigate to wallet page
	await goToWallet(t);

	// Click store hash option in dropdown menu
	await t.click(Selector('[data-testid="WalletHeader__more-button"]'));
	await t.click(
		Selector('[data-testid="WalletHeader__more-button"] li').withText(
			translations.WALLETS.PAGE_WALLET_DETAILS.OPTIONS.STORE_HASH,
		),
	);

	// Navigate to IPFS page
	await t.expect(Selector("h1").withText(translations.TRANSACTION.PAGE_IPFS.FIRST_STEP.TITLE).exists).ok();

	// Type IPFS hash & go to step 2
	await t.typeText(Selector("[data-testid=Input__hash]"), "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco");
	await t.click(Selector("button").withText(translations.COMMON.CONTINUE));
	await t.expect(Selector("h1").withText(translations.TRANSACTION.PAGE_IPFS.SECOND_STEP.TITLE).exists).ok();
	await t.click(Selector("button").withText(translations.COMMON.CONTINUE));

	// Type wrong mnemonic
	await t.typeText(Selector("[data-testid=AuthenticationStep__mnemonic]"), "wrong mnemonic", { replace: true });
	await t.click(Selector("[data-testid=SendIpfs__button--submit]"));
	await t.expect(Selector("[data-testid=AuthenticationStep__mnemonic]").hasAttribute("aria-invalid")).ok();
});

test("should send IPFS successfully", async (t) => {
	// Navigate to profile page
	await goToProfile(t);

	// Import wallet
	await importWallet(t, "passphrase");

	// Navigate to wallet details page
	await t.expect(Selector("[data-testid=WalletHeader]").exists).ok();

	// Click store hash option in dropdown menu
	await t.click(Selector('[data-testid="WalletHeader__more-button"]'));
	await t.click(
		Selector('[data-testid="WalletHeader__more-button"] li').withText(
			translations.WALLETS.PAGE_WALLET_DETAILS.OPTIONS.STORE_HASH,
		),
	);

	// Navigate to IPFS page
	await t.expect(Selector("h1").withText(translations.TRANSACTION.PAGE_IPFS.FIRST_STEP.TITLE).exists).ok();

	// Type IPFS hash & go to step 2
	await t.typeText(Selector("[data-testid=Input__hash]"), "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco");
	await t.click(Selector("button").withText(translations.COMMON.CONTINUE));
	await t.expect(Selector("h1").withText(translations.TRANSACTION.PAGE_IPFS.SECOND_STEP.TITLE).exists).ok();
	await t.click(Selector("button").withText(translations.COMMON.CONTINUE));

	// Type mnemonic
	await t.typeText(Selector("[data-testid=AuthenticationStep__mnemonic]"), "passphrase", { replace: true });
	await t.click(Selector("[data-testid=SendIpfs__button--submit]"));

	// Transaction successful
	await t.expect(Selector("h1").withText(translations.TRANSACTION.SUCCESS.TITLE).exists).ok();
});
