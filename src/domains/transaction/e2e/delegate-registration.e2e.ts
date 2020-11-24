import { Selector } from "testcafe";

import { buildTranslations } from "../../../app/i18n/helpers";
import { createFixture, mockRequest } from "../../../utils/e2e-utils";
import { goToProfile } from "../../profile/e2e/common";
import { importWallet } from "../../wallet/e2e/common";
import { goToRegistrationPage } from "./common";

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

	// Navigate to wallet details page
	await t.click(Selector("[data-testid=WalletCard__DDA5nM7KEqLeTtQKv5qGgcnc6dpNBKJNTS]"));
	await t.expect(Selector("[data-testid=WalletHeader]").exists).ok();

	// Navigate to Registration page
	await goToRegistrationPage(t);

	// Choose sender
	await t.click(Selector("[data-testid=SelectAddress__wrapper]"));
	await t.click(Selector("[data-testid=SearchWalletListItem__select-2]"));

	// Choose registration type & go to step 2
	await t.click('[data-testid="SelectRegistrationTypeInput__input"]');
	await t.click(Selector("#SendTransactionForm__registrationType-item-3"));
	await t.click(Selector("button").withText(translations.COMMON.CONTINUE));

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
	await t.click(Selector("button").withText(translations.COMMON.SEND));
	await t.expect(Selector("h1").withText(translations.TRANSACTION.SUCCESS.TITLE).exists).ok();
});
