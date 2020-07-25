import { Selector } from "testcafe";

fixture`Plugins screen routing`.page`http://localhost:3000/`;

test("should navigate and apply filters", async (t) => {
	await t.click(Selector("p").withText("Anne Doe"));
	await t.click(Selector("a").withText("Plugins"));
	await t.expect(Selector("h1").withText("Plugin Manager").exists).ok();

	// Filtering by game
	await t.click(Selector("span").withExactText("Game"));
	await t.expect(Selector("h2").withExactText("Game").exists).ok();

	// Filtering by utility
	await t.click(Selector("span").withExactText("Utility"));
	await t.expect(Selector("h2").withExactText("Utility").exists).ok();

	// Filtering by themes
	await t.click(Selector("span").withExactText("Themes"));
	await t.expect(Selector("h2").withExactText("Themes").exists).ok();

	// Filtering by other
	await t.click(Selector("span").withExactText("Other"));
	await t.expect(Selector("h2").withExactText("Other").exists).ok();

	// Filtering by user plugins
	await t.click(Selector("span").withExactText("MyPlugin"));
	await t.expect(Selector("h2").withExactText("My Plugins").exists).ok();
});

test("should navigate to plugin details", async (t) => {
	await t.click(Selector("p").withText("Anne Doe"));
	await t.click(Selector("a").withText("Plugins"));
	await t.expect(Selector("h1").withText("Plugin Manager").exists).ok();

	await t.click(Selector('[data-testid="PluginCard--ark-explorer-0"]'));
	await t.expect(Selector("span").withExactText("ARK Explorer").exists).ok();
});

test("should navigate back to plugin store from plugin details", async (t) => {
	await t.click(Selector("p").withText("Anne Doe"));
	await t.click(Selector("a").withText("Plugins"));
	await t.expect(Selector("h1").withText("Plugin Manager").exists).ok();
	await t.click(Selector('[data-testid="PluginCard--ark-explorer-0"]'));
	await t.expect(Selector("span").withExactText("ARK Explorer").exists).ok();

	await t.click(Selector("span").withExactText("Go back to plugin store"));
});
