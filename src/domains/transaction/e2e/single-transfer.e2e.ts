import { Selector } from "testcafe";

import { buildTranslations } from "../../../app/i18n/helpers";
import { createFixture, MNEMONICS, mockRequest } from "../../../utils/e2e-utils";
import { goToProfile } from "../../profile/e2e/common";
import { goToWallet, importWallet } from "../../wallet/e2e/common";
import { goToTransferPage } from "./common";

const translations = buildTranslations();

createFixture("Single Transfer action", [
	mockRequest(
		{
			method: "POST",
			url: "https://dwallets.ark.io/api/transactions",
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
			method: "POST",
			url: "https://dmusig1.ark.io/transaction",
		},
		{
			id: "transaction-id",
		},
	),
]);

test("should send transfer successfully", async (t) => {
	// Navigate to profile page
	await goToProfile(t);

	// Import wallet
	await importWallet(t, MNEMONICS[0]);

	// Navigate to transfer page
	await goToTransferPage(t);

	// Select recipient
	await t.click(Selector("[data-testid=SelectRecipient__select-recipient]"));
	await t.expect(Selector("[data-testid=modal__inner]").exists).ok();
	await t.click(Selector("[data-testid=RecipientListItem__select-button]"));

	// Amount
	await t.click(Selector("[data-testid=AddRecipient__send-all]"));

	// Type memo & go to step 2
	await t.typeText(Selector("[data-testid=Input__memo]"), "test memo");
	await t.click(Selector("button").withText(translations.COMMON.CONTINUE));
	await t.expect(Selector("h1").withText(translations.TRANSACTION.REVIEW_STEP.TITLE).exists).ok();

	await t.expect(Selector("button").withText(translations.COMMON.CONTINUE).hasAttribute("disabled")).notOk();
	await t.click(Selector("button").withText(translations.COMMON.CONTINUE));

	// Type mnemonic
	await t.expect(Selector("[data-testid=AuthenticationStep__mnemonic]").exists).ok({ timeout: 4000 });
	await t.typeText(Selector("[data-testid=AuthenticationStep__mnemonic]"), MNEMONICS[0], { replace: true });
	await t.click(Selector("[data-testid=SendTransfer__button--submit]"));

	// Transaction successful
	await t.expect(Selector("h1").withText(translations.TRANSACTION.SUCCESS.TITLE).exists).ok({ timeout: 5000 });
});

test("should show an error if wrong mnemonic", async (t) => {
	// Navigate to profile page
	await goToProfile(t);

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

	// Type memo & go to step 2
	await t.typeText(Selector("[data-testid=Input__memo]"), "test memo");
	await t.expect(Selector("button").withText(translations.COMMON.CONTINUE).hasAttribute("disabled")).notOk();
	await t.click(Selector("button").withText(translations.COMMON.CONTINUE));
	await t.expect(Selector("h1").withText(translations.TRANSACTION.REVIEW_STEP.TITLE).exists).ok();
	await t.click(Selector("button").withText(translations.COMMON.CONTINUE));

	// Type wrong mnemonic
	await t.typeText(Selector("[data-testid=AuthenticationStep__mnemonic]"), "wrong mnemonic", { replace: true });
	await t.click(Selector("[data-testid=SendTransfer__button--submit]"));
	await t.expect(Selector("[data-testid=AuthenticationStep__mnemonic]").hasAttribute("aria-invalid")).ok();
});
