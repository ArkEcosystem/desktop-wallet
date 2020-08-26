import { Selector } from "testcafe";

import { buildTranslations } from "../../../app/i18n/helpers";
import { getPageURL } from "../../../utils/e2e-utils";
import { goToProfile } from "./common";

const translations = buildTranslations();

fixture`My Registrations`.page(getPageURL()).beforeEach(async (t) => await goToProfile(t));

test("should navigate to my registrations from navigation bar", async (t) => {
	await t.expect(Selector("div").withText(translations.COMMON.WALLETS).exists).ok();

	await t.click(Selector('[data-testid="navbar__useractions"]'));
	await t
		.expect(Selector('[data-testid="dropdown__option--1"]').withText(translations.COMMON.REGISTRATIONS).exists)
		.ok();
	await t.click(Selector('[data-testid="dropdown__option--1"]').withText(translations.COMMON.REGISTRATIONS));

	await t.expect(Selector("[data-testid=header__title]").exists).ok();
	await t
		.expect(
			Selector("[data-testid=header__title]").withText(translations.PROFILE.PAGE_MY_REGISTRATIONS.TITLE).exists,
		)
		.ok();
});

test("should navigate to my registrations page", async (t) => {
	// Navigate to wallet details page
	await t.hover(Selector("[data-testid=WalletCard__D5sRKWckH4rE1hQ9eeMeHAepgyC3cvJtwb]"));
	await t.click(Selector("[data-testid=WalletCard__D5sRKWckH4rE1hQ9eeMeHAepgyC3cvJtwb]"));
	await t.expect(Selector("[data-testid=WalletHeader]").exists).ok();

	await t.hover(Selector("[data-testid=WalletRegistrations__show-all]"));
	await t.click(Selector("[data-testid=WalletRegistrations__show-all]"));

	await t.expect(Selector("[data-testid=header__title]").exists).ok();
	await t
		.expect(
			Selector("[data-testid=header__title]").withText(translations.PROFILE.PAGE_MY_REGISTRATIONS.TITLE).exists,
		)
		.ok();
});
