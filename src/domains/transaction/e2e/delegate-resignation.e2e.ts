import { Selector } from "testcafe";

import { buildTranslations } from "../../../app/i18n/helpers";
import { createFixture, mockRequest } from "../../../utils/e2e-utils";
import { goToProfile } from "../../profile/e2e/common";
import { importWallet } from "../../wallet/e2e/common";
import { goToDelegateResignationPage } from "./common";

const translations = buildTranslations();

createFixture(`Delegate Resignation action`, [
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
	mockRequest("https://dwallets.ark.io/api/wallets/DDA5nM7KEqLeTtQKv5qGgcnc6dpNBKJNTS", {
		data: {
			address: "DDA5nM7KEqLeTtQKv5qGgcnc6dpNBKJNTS",
			publicKey: "02e012f0a7cac12a74bdc17d844cbc9f637177b470019c32a53cef94c7a56e2ea9",
			nonce: "1",
			balance: "10000000000",
			attributes: {
				delegate: {
					username: "testwallet",
				},
			},
			isDelegate: true,
			isResigned: false,
		},
	}),
]);

test("should successfully submit delegate resignation", async (t) => {
	await goToProfile(t);

	await importWallet(t, "passphrase");

	await goToDelegateResignationPage(t);

	const continueButton = "[data-testid=SendDelegateResignation__continue-button]";

	// Go to step 2
	await t.hover(Selector(continueButton));
	await t.click(Selector(continueButton));

	// Go to step 3 (authentication)
	await t.hover(Selector(continueButton));
	await t.click(Selector(continueButton));

	await t.typeText(Selector("[data-testid=AuthenticationStep__mnemonic]"), "passphrase", { replace: true });
	await t.expect(Selector("[data-testid=AuthenticationStep__mnemonic]").hasAttribute("aria-invalid")).notOk();

	const sendButton = Selector("button").withText(translations.COMMON.SEND);
	await t.expect(sendButton.hasAttribute("disabled")).notOk();

	await t.click(sendButton);

	await t.expect(Selector("[data-testid=SendDelegateResignation__summary-step]").exists).ok({ timeout: 5000 });
});

test("should fail delegate resignation submission", async (t: any) => {
	await goToProfile(t);

	await importWallet(t, "passphrase");

	await goToDelegateResignationPage(t);

	const continueBtn = "[data-testid=SendDelegateResignation__continue-button]";

	// Go to step 2
	await t.hover(Selector(continueBtn));
	await t.click(Selector(continueBtn));

	// Go to step 3 (authentication)
	await t.hover(Selector(continueBtn));
	await t.click(Selector(continueBtn));

	// Type wrong mnemonic
	await t.typeText(Selector("[data-testid=AuthenticationStep__mnemonic]"), "wrong mnemonic", { replace: true });
	await t.expect(Selector("[data-testid=AuthenticationStep__mnemonic]").hasAttribute("aria-invalid")).ok();

	const sendButton = Selector("button").withText(translations.COMMON.SEND);
	await t.expect(sendButton.hasAttribute("disabled")).ok();
});
