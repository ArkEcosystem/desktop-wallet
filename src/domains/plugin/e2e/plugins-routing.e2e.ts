import { Selector } from "testcafe";

import { buildTranslations } from "../../../app/i18n/helpers";
import { createFixture, getLocation, scrollToTop } from "../../../utils/e2e-utils";
import { goToPlugins } from "./common";

const translations = buildTranslations();

createFixture(`Plugins routing`).beforeEach(async (t) => await goToPlugins(t));

test("should navigate and apply filters", async (t) => {
	// Filtering by game
	await t.click(Selector("span").withExactText(translations.PLUGINS.PAGE_PLUGIN_MANAGER.VIEW.GAME));
	await t.expect(Selector("h2").withExactText(translations.PLUGINS.PAGE_PLUGIN_MANAGER.VIEW.GAME).exists).ok();

	// Filtering by utility
	await t.click(Selector("span").withExactText(translations.PLUGINS.PAGE_PLUGIN_MANAGER.VIEW.UTILITY));
	await t.expect(Selector("h2").withExactText(translations.PLUGINS.PAGE_PLUGIN_MANAGER.VIEW.UTILITY).exists).ok();

	// Filtering by themes
	await t.click(Selector("span").withExactText(translations.PLUGINS.PAGE_PLUGIN_MANAGER.VIEW.THEMES));
	await t.expect(Selector("h2").withExactText(translations.PLUGINS.PAGE_PLUGIN_MANAGER.VIEW.THEMES).exists).ok();

	// Filtering by other
	await t.click(Selector("span").withExactText(translations.PLUGINS.PAGE_PLUGIN_MANAGER.VIEW.OTHER));
	await t.expect(Selector("h2").withExactText(translations.PLUGINS.PAGE_PLUGIN_MANAGER.VIEW.OTHER).exists).ok();

	// Filtering by user plugins
	await t.click(Selector("span").withExactText(translations.PLUGINS.PAGE_PLUGIN_MANAGER.VIEW.MY_PLUGINS));
	await t.expect(Selector("h2").withExactText(translations.PLUGINS.PAGE_PLUGIN_MANAGER.VIEW.MY_PLUGINS).exists).ok();
});

test("should navigate to plugin details and back", async (t) => {
	await t.click(Selector('[data-testid="PluginGrid"] > div > div').withText("ARK Explorer"));
	await t.expect(Selector("span").withExactText("ARK Explorer").exists).ok();

	await t.expect(getLocation()).contains("/plugins/0");

	await scrollToTop();

	await t.click(Selector("span").withExactText(translations.PLUGINS.PAGE_PLUGIN_MANAGER.TITLE));

	await t.expect(getLocation()).contains("/plugins");
	await t.expect(getLocation()).notContains("/plugins/0");
});
