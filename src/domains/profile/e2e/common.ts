import { Selector } from "testcafe";

import { buildTranslations } from "../../../app/i18n/helpers";

const translations = buildTranslations();

export const goToProfile = async (t: any) => {
	await t.click(Selector("p").withText("John Doe"));
	await t.expect(Selector("div").withText(translations.COMMON.WALLETS).exists).ok();
};
