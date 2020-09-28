import { Selector } from "testcafe";

import { buildTranslations } from "../../../app/i18n/helpers";

const translations = buildTranslations();

export const goToProfile = async (t: any) => {
	await t.click(Selector("p").withText("John Doe"));
	await t.expect(Selector("div").withText(translations.COMMON.WALLETS).exists).ok();
};

export const goToMyRegistrations = async (t: any) => {
	await t.expect(Selector("div").withText(translations.COMMON.WALLETS).exists).ok();

	await t.click(Selector('[data-testid="navbar__useractions"]'));
	await t
		.expect(Selector('[data-testid="dropdown__option--2"]').withText(translations.COMMON.REGISTRATIONS).exists)
		.ok();
	await t.click(Selector('[data-testid="dropdown__option--2"]').withText(translations.COMMON.REGISTRATIONS));

	await t.expect(Selector("[data-testid=header__title]").exists).ok();
	await t
		.expect(
			Selector("[data-testid=header__title]").withText(translations.PROFILE.PAGE_MY_REGISTRATIONS.TITLE).exists,
		)
		.ok();
};
