import { RequestMock, Selector } from "testcafe";

import { buildTranslations } from "../../../app/i18n/helpers";
import { createFixture } from "../../../utils/e2e-utils";
import { goToProfile } from "../../profile/e2e/common";
import { goToWallet } from "../../wallet/e2e/common";

const translations = buildTranslations();

const walletMock = RequestMock()
	.onRequestTo("https://dwallets.ark.io/api/wallets/DDA5nM7KEqLeTtQKv5qGgcnc6dpNBKJNTS")
	.respond(
		{
			data: {
				address: "DDA5nM7KEqLeTtQKv5qGgcnc6dpNBKJNTS",
				nonce: "0",
				balance: "2500000000",
				isDelegate: false,
				isResigned: false,
				attributes: {},
			},
		},
		200,
		{
			"access-control-allow-origin": "*",
		},
	);

const sendMock = RequestMock()
	.onRequestTo("https://dwallets.ark.io/api/transactions")
	.respond(
		{
			data: {
				accept: ["transaction-id"],
				broadcast: ["transaction-id"],
				excess: [],
				invalid: [],
			},
		},
		200,
		{
			"access-control-allow-origin": "*",
		},
	);

createFixture(`IPFS Transaction action`);

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

test("should show an error if wrong mnemonic", async (t: any) => {
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

test.requestHooks(walletMock, sendMock)("should send IPFS successfully", async (t) => {
	// Navigate to profile page
	await goToProfile(t);

	// Navigate to import wallet page
	await t.click(Selector("button").withExactText(translations.COMMON.IMPORT));
	await t.expect(Selector("div").withText(translations.WALLETS.PAGE_IMPORT_WALLET.NETWORK_STEP.SUBTITLE).exists).ok();
	await t.click(Selector("#ImportWallet__network-item-1"));
	await t.click(Selector("button").withExactText(translations.COMMON.CONTINUE));
	await t.typeText(Selector("[data-testid=ImportWallet__passphrase-input]"), "passphrase");
	await t.click(Selector("button").withExactText(translations.COMMON.CONTINUE));
	await t.typeText(Selector("[data-testid=ImportWallet__name-input]"), "Test Wallet");
	await t.click(Selector("button").withExactText(translations.COMMON.GO_TO_WALLET));

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
