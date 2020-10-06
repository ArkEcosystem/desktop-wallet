import { Selector } from "testcafe";

import { buildTranslations } from "../../../app/i18n/helpers";
import { createFixture, getLocation } from "../../../utils/e2e-utils";
import { goToSettings } from "./common";

const translations = buildTranslations();

createFixture(`Settings routing`);

test("should navigate to settings page", async (t) => await goToSettings(t));

test("should require password in settings page for protected profile", async (t) => {
	await t.click(Selector("p").withText("Jane Doe"));
	await t
		.expect(Selector('[data-testid="modal__inner"]').withText(translations.PROFILE.MODAL_SIGN_IN.TITLE).exists)
		.ok();

	await t.typeText(Selector('[data-testid="SignIn__input--password"]'), "password");
	await t.click(Selector('[data-testid="SignIn__submit-button"]'));

	await t.expect(Selector("div").withText(translations.COMMON.WALLETS).exists).ok();
	await t.expect(getLocation()).contains("/dashboard");

	await t.click(Selector('[data-testid="navbar__useractions"]'));
	await t.expect(Selector('[data-testid="dropdown__option--3"]').withText(translations.COMMON.SETTINGS).exists).ok();
	await t.click(Selector('[data-testid="dropdown__option--3"]').withText(translations.COMMON.SETTINGS));

	await t
		.expect(Selector('[data-testid="modal__inner"]').withText(translations.PROFILE.MODAL_SIGN_IN.TITLE).exists)
		.ok();

	await t.typeText(Selector('[data-testid="SignIn__input--password"]'), "password");
	await t.click(Selector('[data-testid="SignIn__submit-button"]'));

	await t.expect(Selector("h1").withText(translations.SETTINGS.GENERAL.TITLE).exists).ok();
});
