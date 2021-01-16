import { Selector } from "testcafe";

import { buildTranslations } from "../../../app/i18n/helpers";
import { createFixture, mockRequest } from "../../../utils/e2e-utils";
import { goToProfile } from "../../profile/e2e/common";
import { importWallet } from "../../wallet/e2e/common";
import { goToDelegateRegistrationPage } from "./common";

const translations = buildTranslations();

createFixture(`Delegate Registration action`, [
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

test("should successfully submit delegate registration", async (t) => {
	// Navigate to profile page
	await goToProfile(t);

	// Import wallet
	await importWallet(t, "passphrase");

	// Navigate to Registration page
	await goToDelegateRegistrationPage(t);

	// Choose username
	await t.expect(Selector("[data-testid=Registration__form]").exists).ok();
	await t.typeText(Selector("[data-testid=Input__username]"), "test_delegate");
	await t.click(Selector("button").withText(translations.COMMON.CONTINUE));

	// Check details
	await t.expect(Selector("[data-testid=TransactionDetail]").withText("test_delegate").exists).ok();
	await t.click(Selector("button").withText(translations.COMMON.CONTINUE));

	// Sign transaction
	await t.expect(Selector("h1").withText(translations.TRANSACTION.AUTHENTICATION_STEP.TITLE).exists).ok();

	await t.typeText(Selector("[data-testid=AuthenticationStep__mnemonic]"), "passphrase");
	await t.expect(Selector("[data-testid=AuthenticationStep__mnemonic]").hasAttribute("aria-invalid")).notOk();

	const sendButton = Selector("button").withText(translations.COMMON.SEND);
	await t.expect(sendButton.hasAttribute("disabled")).notOk();

	await t.click(sendButton);

	await t.expect(Selector("h1").withText(translations.TRANSACTION.SUCCESS.TITLE).exists).ok({ timeout: 5000 });
});
