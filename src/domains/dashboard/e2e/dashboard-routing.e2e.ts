import { Selector } from "testcafe";

import { buildTranslations } from "../../../app/i18n/helpers";
import { createFixture, getLocation } from "../../../utils/e2e-utils";

const translations = buildTranslations();

createFixture(`Dashboard routing`);

test("should navigate to dashboard", async (t) => {
	await t.click(Selector("span").withText("John Doe"));
	await t.expect(Selector("div").withText(translations.COMMON.WALLETS).exists).ok();
	await t.expect(getLocation()).contains("/dashboard");
});

test("should navigate to dashboard of protected profile", async (t) => {
	await t.click(Selector("span").withText("Jane Doe"));
	await t
		.expect(Selector('[data-testid="modal__inner"]').withText(translations.PROFILE.MODAL_SIGN_IN.TITLE).exists)
		.ok();

	await t.typeText(Selector('[data-testid="SignIn__input--password"]'), "password");
	await t.click(Selector('[data-testid="SignIn__submit-button"]'));

	await t.expect(Selector("div").withText(translations.COMMON.WALLETS).exists).ok();
	await t.expect(getLocation()).contains("/dashboard");
});

test("should show ledger waiting device modal", async (t) => {
	await t.click(Selector("span").withText("John Doe"));
	await t.expect(Selector("div").withText(translations.COMMON.WALLETS).exists).ok();

	await t.click(Selector("button").withExactText(translations.DASHBOARD.WALLET_CONTROLS.IMPORT_LEDGER));
	await t.expect(Selector("span").withText(translations.WALLETS.MODAL_LEDGER_WALLET.WAITING_DEVICE).exists).ok();
});
