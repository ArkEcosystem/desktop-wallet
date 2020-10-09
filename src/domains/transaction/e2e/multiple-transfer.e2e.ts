import { RequestMock, Selector } from "testcafe";

import { buildTranslations } from "../../../app/i18n/helpers";
import { createFixture } from "../../../utils/e2e-utils";
import { goToProfile } from "../../profile/e2e/common";
import { goToWallet, importWallet } from "../../wallet/e2e/common";
import { goToTransferPage } from "./common";

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

createFixture(`Multiple Transfer action`);

test("should show an error if wrong mnemonic", async (t: any) => {
	// Navigate to wallet page
	await goToWallet(t);

	// Navigate to transfer page
	await goToTransferPage(t);

	// Select multiple button
	await t.click(Selector("[data-testid=add-recipient-is-multiple-toggle]"));

	// Add recipient #1
	await t.typeText(Selector("[data-testid=SelectRecipient__input]"), "DReUcXWdCz2QLKzHM9NdZQE7fAwAyPwAmd");
	await t.typeText(Selector("[data-testid=add-recipient__amount-input]"), "10", { replace: true });
	await t.click(Selector("button").withText("Add Recipient"));

	// Add recipient #2
	await t.typeText(Selector("[data-testid=SelectRecipient__input]"), "D7JJ4ZfkJDwDCwuwzhtbCFapBUCWU3HHGP");
	await t.typeText(Selector("[data-testid=add-recipient__amount-input]"), "10", { replace: true });
	await t.click(Selector("button").withText("Add Recipient"));

	// Go to step 2
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

test.requestHooks(walletMock, sendMock)("should send multiple transfer successfully", async (t) => {
	// Navigate to profile page
	await goToProfile(t);

	// Import wallet
	await importWallet(t, "passphrase");

	// Navigate to wallet details page
	await t.expect(Selector("[data-testid=WalletHeader]").exists).ok();

	// Navigate to transfer page
	await goToTransferPage(t);

	// Select multiple button
	await t.click(Selector("[data-testid=add-recipient-is-multiple-toggle]"));

	// Add recipient #1
	await t.typeText(Selector("[data-testid=SelectRecipient__input]"), "DReUcXWdCz2QLKzHM9NdZQE7fAwAyPwAmd");
	await t.typeText(Selector("[data-testid=add-recipient__amount-input]"), "10", { replace: true });
	await t.click(Selector("button").withText(translations.TRANSACTION.ADD_RECIPIENT));

	// Add recipient #2
	await t.typeText(Selector("[data-testid=SelectRecipient__input]"), "D7JJ4ZfkJDwDCwuwzhtbCFapBUCWU3HHGP");
	await t.typeText(Selector("[data-testid=add-recipient__amount-input]"), "10", { replace: true });
	await t.click(Selector("button").withText(translations.TRANSACTION.ADD_RECIPIENT));

	// Go to step 2
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
