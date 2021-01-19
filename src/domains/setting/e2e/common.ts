import { Selector } from "testcafe";

import { buildTranslations } from "../../../app/i18n/helpers";

const translations = buildTranslations();

export const goToSettings = async (t: any) => {
	await t.click(Selector("span").withText("John Doe"));
	await t.expect(Selector("div").withText(translations.COMMON.WALLETS).exists).ok();

	await t.click(Selector('[data-testid="navbar__useractions"]'));
	await t.expect(Selector('[data-testid="dropdown__options"] li').withText(translations.COMMON.SETTINGS).exists).ok();
	await t.click(Selector('[data-testid="dropdown__options"] li').withText(translations.COMMON.SETTINGS));
	await t.expect(Selector("h1").withText(translations.SETTINGS.GENERAL.TITLE).exists).ok();
};
