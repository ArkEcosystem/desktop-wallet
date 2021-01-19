import { Selector } from "testcafe";

import { buildTranslations } from "../../../app/i18n/helpers";

const translations = buildTranslations();

export const goToNews = async (t: any) => {
	await t.click(Selector("span").withText("John Doe"));
	await t.click(Selector("a").withText(translations.NEWS.NEWS));
	await t.expect(Selector("h1").withText(translations.NEWS.PAGE_NEWS.TITLE).exists).ok();
};
