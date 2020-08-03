import { Selector } from "testcafe";

import { buildTranslations as translations } from "../../../app/i18n/helpers";

fixture`Create Profile action`.page`http://localhost:3000/profiles/create`;

test("should return an error when submit without required fields", async (t) => {
	await t.click(Selector("button").withExactText(translations().COMMON.COMPLETE));
	await t.click(Selector("fieldset p").withText("Name is required"));
	await t.click(Selector("fieldset p").withText("Market Provider is required"));
	await t.click(Selector("fieldset p").withText("Currency is required"));
	await t.click(Selector("h1").withExactText(translations().PROFILE.PAGE_CREATE_PROFILE.TITLE));
});

test("should create a profile and navigate to welcome screen", async (t) => {
	const nameInput = Selector("input[name=name]");

	await t.typeText(nameInput, "Anne Doe");
	await t.click(Selector("button").withText("Select Market Provider"));
	await t.click(Selector("li.select-list-option").withText("CoinGecko"));
	await t.click(Selector("button").withText("Select Currency"));
	await t.click(Selector("li.select-list-option").withText("ETH"));
	await t.click(Selector("input[name=isDarkMode]").parent());
	await t.click(Selector("button").withExactText(translations().COMMON.COMPLETE));

	// Check welcome with created profiles
	await t.wait(1000); // TODO: the profile loading is async so we need to give it a moment
	await t.expect(Selector("p").withText("John Doe").exists).ok();
	await t.expect(Selector("p").withText("Anne Doe").exists).ok();
});
