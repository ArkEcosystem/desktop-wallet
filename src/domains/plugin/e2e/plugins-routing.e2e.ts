import { ClientFunction, Selector } from "testcafe";

import { buildTranslations as translations } from "../../../app/i18n/helpers";
import { getPageURL } from "../../../utils/e2e-utils";

const scrollTop = ClientFunction(() => {
	window.scrollTo({ top: 0 });
});

fixture`Plugins screen routing`.page(getPageURL());

test("should navigate and apply filters", async (t) => {
	await t.click(Selector("p").withText("John Doe"));
	await t.click(Selector("a").withText(translations().COMMON.PLUGINS));
	await t.expect(Selector("h1").withText(translations().PLUGINS.PAGE_PLUGIN_MANAGER.TITLE).exists).ok();

	// Filtering by game
	await t.click(Selector("span").withExactText(translations().PLUGINS.CATEGORIES.GAME));
	await t.expect(Selector("h2").withExactText(translations().PLUGINS.CATEGORIES.GAME).exists).ok();

	// Filtering by utility
	await t.click(Selector("span").withExactText(translations().PLUGINS.CATEGORIES.UTILITY));
	await t.expect(Selector("h2").withExactText(translations().PLUGINS.CATEGORIES.UTILITY).exists).ok();

	// Filtering by themes
	await t.click(Selector("span").withExactText(translations().PLUGINS.CATEGORIES.THEMES));
	await t.expect(Selector("h2").withExactText(translations().PLUGINS.CATEGORIES.THEMES).exists).ok();

	// Filtering by other
	await t.click(Selector("span").withExactText(translations().PLUGINS.CATEGORIES.OTHER));
	await t.expect(Selector("h2").withExactText(translations().PLUGINS.CATEGORIES.OTHER).exists).ok();

	// Filtering by user plugins
	await t.click(Selector("span").withExactText("MyPlugin"));
	await t.expect(Selector("h2").withExactText(translations().PLUGINS.CATEGORIES.MY_PLUGINS).exists).ok();
});

test("should navigate to plugin details", async (t) => {
	await t.click(Selector("p").withText("John Doe"));
	await t.click(Selector("a").withText(translations().COMMON.PLUGINS));
	await t.expect(Selector("h1").withText(translations().PLUGINS.PAGE_PLUGIN_MANAGER.TITLE).exists).ok();

	await t.click(Selector('[data-testid="PluginCard--ark-explorer-0"]'));
	await t.expect(Selector("span").withExactText("ARK Explorer").exists).ok();
});

test("should navigate back to plugin store from plugin details", async (t) => {
	await t.click(Selector("p").withText("John Doe"));
	await t.click(Selector("a").withText(translations().COMMON.PLUGINS));
	await t.expect(Selector("h1").withText(translations().PLUGINS.PAGE_PLUGIN_MANAGER.TITLE).exists).ok();
	await t.click(Selector('[data-testid="PluginCard--ark-explorer-0"]'));
	await t.expect(Selector("span").withExactText("ARK Explorer").exists).ok();
	await scrollTop();

	await t.click(Selector("span").withExactText(translations().PLUGINS.GO_BACK_TO_PLUGIN_STORE));
});
