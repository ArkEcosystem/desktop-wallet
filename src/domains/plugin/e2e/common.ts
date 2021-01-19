import { Selector } from "testcafe";

import { buildTranslations } from "../../../app/i18n/helpers";

const translations = buildTranslations();

export const goToPlugins = async (t: any) => {
	await t.click(Selector("span").withText("John Doe"));
	await t.click(Selector("a").withText(translations.COMMON.PLUGINS));
	await t.expect(Selector("h1").withText(translations.PLUGINS.PAGE_PLUGIN_MANAGER.TITLE).exists).ok();
};
