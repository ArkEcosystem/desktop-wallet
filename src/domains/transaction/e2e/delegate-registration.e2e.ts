import { RequestMock, Selector } from "testcafe";

import { buildTranslations } from "../../../app/i18n/helpers";
import { createFixture } from "../../../utils/e2e-utils";
import { goToProfile } from "../../profile/e2e/common";
import { goToImportWalletPage, goToRegistrationPage } from "./common";

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

createFixture(`Delegate Registration action`);

test.requestHooks(walletMock, sendMock)("should successfully submit delegate registration", async (t) => {
	// Navigate to profile page
	await goToProfile(t);

	// Navigate to import wallet page
	await goToImportWalletPage(t);

	// Navigate to wallet details page
	await t.expect(Selector("[data-testid=WalletHeader]").exists).ok();

	// Navigate to Registration page
	await goToRegistrationPage(t);

	// Choose sender
	await t.click(Selector("[data-testid=SelectAddress__wrapper]"));
	await t.click(Selector("[data-testid=SearchWalletListItem__select-2]"));

	// Choose registration type & go to step 2
	await t.click(Selector("[data-testid=select-list__toggle-button]"));
	await t.click(Selector("li").withText(translations.COMMON.DELEGATE));
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
