import { Selector } from "testcafe";

import { buildTranslations } from "../../../app/i18n/helpers";
import { createFixture, mockRequest } from "../../../utils/e2e-utils";
import { goToProfile } from "../../profile/e2e/common";
import { importWalletByAddress } from "../../wallet/e2e/common";

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
	mockRequest(
		{
			url: "https://dmusig1.ark.io/transaction",
			method: "POST",
		},
		{
			id: "transaction-id",
		},
	),
]);

test("should send IPFS successfully with a multisig wallet", async (t) => {
	// Navigate to profile page
	await goToProfile(t);

	// Import wallet
	await importWalletByAddress(t, "DJXg9Vqg2tofRNrMAvMzhZTkegu8QyyNQq");

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

	await t.wait(2000);
	// Transaction successful
	await t.expect(Selector("h1").withText(translations.TRANSACTION.SUCCESS.TITLE).exists).ok({ timeout: 10000 });
});
