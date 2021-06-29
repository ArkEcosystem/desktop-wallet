import { Selector } from "testcafe";

import { buildTranslations } from "../../../app/i18n/helpers";
import { goToProfile } from "../../profile/e2e/common";

const translations = buildTranslations();

export const goToNews = async (t: any) => {
	await goToProfile(t);

	await t.click(Selector("a").withText(translations.NEWS.NEWS));
	await t.expect(Selector("h1").withText(translations.NEWS.PAGE_NEWS.TITLE).exists).ok();
};
