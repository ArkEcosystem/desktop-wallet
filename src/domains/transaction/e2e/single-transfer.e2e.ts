import { Selector } from "testcafe";

import { buildTranslations } from "../../../app/i18n/helpers";
import { createFixture, mockRequest } from "../../../utils/e2e-utils";
import { goToProfile } from "../../profile/e2e/common";
import { goToWallet, importWallet, importWalletByAddress } from "../../wallet/e2e/common";
import { goToTransferPage } from "./common";

const translations = buildTranslations();

createFixture(`Single Transfer action`, [
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

test("should send transfer successfully with a multisig wallet", async (t) => {
	// Navigate to profile page
	await goToProfile(t);

	// Import wallet
	await importWalletByAddress(t, "DJXg9Vqg2tofRNrMAvMzhZTkegu8QyyNQq");

	// Navigate to wallet details page
	await t.click(Selector("[data-testid=WalletCard__DJXg9Vqg2tofRNrMAvMzhZTkegu8QyyNQq]"));
	await t.expect(Selector("[data-testid=WalletHeader]").exists).ok();

	// Navigate to transfer page
	await goToTransferPage(t);

	// Select recipient
	await t.click(Selector("[data-testid=SelectRecipient__select-recipient]"));
	await t.expect(Selector("[data-testid=modal__inner]").exists).ok();
	await t.click(Selector("[data-testid=RecipientListItem__select-button]"));

	// Amount
	await t.click(Selector("[data-testid=AddRecipient__send-all]"));

	// Review step
	await t.click(Selector("button").withText(translations.COMMON.CONTINUE));
	await t
		.expect(Selector("h1").withText(translations.TRANSACTION.PAGE_TRANSACTION_SEND.SECOND_STEP.TITLE).exists)
		.ok();
	await t.click(Selector("button").withText(translations.COMMON.CONTINUE));

	// Transaction successful
	await t.expect(Selector("h1").withText(translations.TRANSACTION.SUCCESS.TITLE).exists).ok();
});

test("should show an error if wrong mnemonic", async (t) => {
	// Navigate to wallet page
	await goToWallet(t);

	// Navigate to transfer page
	await goToTransferPage(t);

	// Select recipient
	await t.click(Selector("[data-testid=SelectRecipient__select-recipient]"));
	await t.expect(Selector("[data-testid=modal__inner]").exists).ok();
	await t.click(Selector("[data-testid=RecipientListItem__select-button]"));

	// Amount
	await t.click(Selector("[data-testid=AddRecipient__send-all]"));

	// Type smartbridge & go to step 2
	await t.typeText(Selector("[data-testid=Input__smartbridge]"), "test smartbridge");
	await t.click(Selector("button").withText(translations.COMMON.CONTINUE));
	await t
		.expect(Selector("h1").withText(translations.TRANSACTION.PAGE_TRANSACTION_SEND.SECOND_STEP.TITLE).exists)
		.ok();
	await t.click(Selector("button").withText(translations.COMMON.CONTINUE));

	// Type wrong mnemonic
	await t.typeText(Selector("[data-testid=AuthenticationStep__mnemonic]"), "wrong mnemonic", { replace: true });
	await t.click(Selector("[data-testid=SendTransfer__button--submit]"));
	await t.expect(Selector("[data-testid=AuthenticationStep__mnemonic]").hasAttribute("aria-invalid")).ok();
});

test("should send transfer successfully", async (t) => {
	// Navigate to profile page
	await goToProfile(t);

	// Import wallet
	await importWallet(t, "passphrase");

	// Navigate to wallet details page
	await t.click(Selector("[data-testid=WalletCard__DDA5nM7KEqLeTtQKv5qGgcnc6dpNBKJNTS]"));
	await t.expect(Selector("[data-testid=WalletHeader]").exists).ok();

	// Navigate to transfer page
	await goToTransferPage(t);

	// Select recipient
	await t.click(Selector("[data-testid=SelectRecipient__select-recipient]"));
	await t.expect(Selector("[data-testid=modal__inner]").exists).ok();
	await t.click(Selector("[data-testid=RecipientListItem__select-button]"));

	// Amount
	await t.click(Selector("[data-testid=AddRecipient__send-all]"));

	// Type smartbridge & go to step 2
	await t.typeText(Selector("[data-testid=Input__smartbridge]"), "test smartbridge");
	await t.click(Selector("button").withText(translations.COMMON.CONTINUE));
	await t
		.expect(Selector("h1").withText(translations.TRANSACTION.PAGE_TRANSACTION_SEND.SECOND_STEP.TITLE).exists)
		.ok();
	await t.click(Selector("button").withText(translations.COMMON.CONTINUE));

	// Type mnemonic
	await t.typeText(Selector("[data-testid=AuthenticationStep__mnemonic]"), "passphrase", { replace: true });
	await t.click(Selector("[data-testid=SendTransfer__button--submit]"));

	// Transaction successful
	await t.expect(Selector("h1").withText(translations.TRANSACTION.SUCCESS.TITLE).exists).ok();
});
