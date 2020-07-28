import { Selector } from "testcafe";

import { buildTranslations as translations } from "../../../app/i18n/helpers";

fixture`Settings screen routing`.page`http://localhost:3000/profiles/1/settings`;

test("should return an error when submit without required fields", async (t) => {
	await t.click(Selector("button").withExactText(translations().COMMON.SAVE));
	await t.click(Selector("fieldset p").withText("Name is required"));
	await t.click(Selector("fieldset p").withText("Passphrase Language is required"));
	await t.click(Selector("fieldset p").withText("Currency is required"));
	await t.click(Selector("fieldset p").withText("Language is required"));
	await t.click(Selector("fieldset p").withText("Market Provider is required"));
	await t.click(Selector("fieldset p").withText("Time Format is required"));
});

test("should salve settings", async (t) => {
	const nameInput = Selector("input[name=name]");

	await t.typeText(nameInput, "Anne Doe");

	await t.click(Selector("button").withText("Select Language"));
	await t.click(Selector("li.select-list-option").withText("Option 1"));

	await t.click(Selector("button").withText("Select Passphrase Language"));
	await t.click(Selector("li.select-list-option").withText("Option 1"));

	await t.click(Selector("button").withText("Select Market Provider"));
	await t.click(Selector("li.select-list-option").withText("Option 1"));

	await t.click(Selector("button").withText("Select Currency"));
	await t.click(Selector("li.select-list-option").withText("Option 1"));

	await t.click(Selector("button").withText("Select Time Format"));
	await t.click(Selector("li.select-list-option").withText("Option 1"));

	await t.click(Selector("input[name=isScreenshotProtection]").parent());
	await t.click(Selector("input[name=isAdvancedMode]").parent());
	await t.click(Selector("input[name=isDarkMode]").parent());
	await t.click(Selector("input[name=isUpdateLedger]").parent());

	await t.click(Selector("button").withText(translations().COMMON.SAVE));
});
