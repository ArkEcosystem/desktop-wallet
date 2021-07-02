import { Selector } from "testcafe";

import { buildTranslations } from "../../../app/i18n/helpers";
import { createFixture, MNEMONICS, mockRequest } from "../../../utils/e2e-utils";
import { goToProfile } from "../../profile/e2e/common";
import { importWallet } from "../../wallet/e2e/common";
import { goToDelegateResignationPage } from "./common";

const translations = buildTranslations();

createFixture("Delegate Resignation action", [
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
	mockRequest("https://dwallets.ark.io/api/wallets/DABCrsfEqhtdzmBrE2AU5NNmdUFCGXKEkr", {
		data: {
			address: "DABCrsfEqhtdzmBrE2AU5NNmdUFCGXKEkr",
			attributes: {
				delegate: {
					username: "testwallet",
				},
			},
			balance: "10000000000",
			isDelegate: true,
			isResigned: false,
			nonce: "1",
			publicKey: "03d3fdad9c5b25bf8880e6b519eb3611a5c0b31adebc8455f0e096175b28321aff",
		},
	}),
]);

test("should successfully submit delegate resignation", async (t) => {
	await goToProfile(t);

	await importWallet(t, MNEMONICS[0]);

	await goToDelegateResignationPage(t);

	// Go to step 2
	await t.click(Selector("button").withText(translations.COMMON.CONTINUE));

	// Go to step 3 (authentication)
	await t.click(Selector("button").withText(translations.COMMON.CONTINUE));

	await t.typeText(Selector("[data-testid=AuthenticationStep__mnemonic]"), MNEMONICS[0], { replace: true });
	await t.expect(Selector("[data-testid=AuthenticationStep__mnemonic]").hasAttribute("aria-invalid")).notOk();

	const sendButton = Selector("button").withText(translations.COMMON.SEND);
	await t.expect(sendButton.hasAttribute("disabled")).notOk();

	await t.click(sendButton);

	await t.expect(Selector("[data-testid=TransactionSuccessfull]").exists).ok({ timeout: 5000 });
});

test("should fail delegate resignation submission", async (t: any) => {
	await goToProfile(t);

	await importWallet(t, MNEMONICS[0]);

	await goToDelegateResignationPage(t);

	// Go to step 2
	await t.click(Selector("button").withText(translations.COMMON.CONTINUE));

	// Go to step 3 (authentication)
	await t.click(Selector("button").withText(translations.COMMON.CONTINUE));

	// Type wrong mnemonic
	await t.typeText(Selector("[data-testid=AuthenticationStep__mnemonic]"), "wrong mnemonic", { replace: true });
	await t.expect(Selector("[data-testid=AuthenticationStep__mnemonic]").hasAttribute("aria-invalid")).ok();

	const sendButton = Selector("button").withText(translations.COMMON.SEND);
	await t.expect(sendButton.hasAttribute("disabled")).ok();
});
