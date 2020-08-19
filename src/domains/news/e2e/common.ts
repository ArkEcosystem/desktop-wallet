import { Selector } from "testcafe";

import { buildTranslations as translations } from "../../../app/i18n/helpers";

export const goToNews = async (t: any) => {
	await t.click(Selector("p").withText("John Doe"));
	await t.click(Selector("a").withText(translations().NEWS.NEWS));
	await t.expect(Selector("h1").withText(translations().NEWS.PAGE_NEWS.TITLE).exists).ok();
};
