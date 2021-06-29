import { Selector } from "testcafe";

import { buildTranslations } from "../../../app/i18n/helpers";
import { goToProfile } from "../../profile/e2e/common";

const translations = buildTranslations();

export const goToPlugins = async (t: any) => {
	await goToProfile(t);

	await t.click(Selector("a").withText(translations.COMMON.PLUGINS));
	await t.expect(Selector("h1").withText(translations.PLUGINS.PAGE_PLUGIN_MANAGER.TITLE).exists).ok();
};
