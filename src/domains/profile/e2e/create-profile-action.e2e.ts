import { Selector } from "testcafe";

import { buildTranslations } from "../../../app/i18n/helpers";
import { createFixture, getLocation } from "../../../utils/e2e-utils";

const translations = buildTranslations();

createFixture(`Create Profile action`);

const nameInput = Selector("input[name=name]");

test("should return an error when submit without required fields", async (t) => {
	await t.click(Selector("button").withExactText(translations.PROFILE.CREATE_PROFILE));

	await t.click(Selector("button").withExactText(translations.COMMON.CREATE));
	await t.click(Selector("fieldset p").withText("'Name' is required"));
	await t.click(Selector("fieldset p").withText("'Currency' is required"));
	await t.click(Selector("h1").withExactText(translations.PROFILE.PAGE_CREATE_PROFILE.TITLE));
});

test("should create a profile and navigate to welcome screen", async (t) => {
	await t.click(Selector("button").withExactText(translations.PROFILE.CREATE_PROFILE));

	await t.expect(getLocation()).contains("/profiles/create");

	await t.typeText(nameInput, "Anne Doe");
	await t.click('[data-testid="SelectDropdownInput__input"]');
	await t.click('[data-testid="select-list__toggle-option-0"]');
	await t.click(Selector("input[name=isDarkMode]").parent());
	await t.click(Selector("button").withExactText(translations.COMMON.CREATE));

	await t.wait(1000); // TODO: the profile loading is async so we need to give it a moment

	// Check welcome with created profiles
	await t.expect(getLocation()).notContains("/profiles/create");
	await t.expect(Selector("p").withText("John Doe").exists).ok();
	await t.expect(Selector("p").withText("Anne Doe").exists).ok();
});

test("should create a profile with password and navigate to welcome screen", async (t) => {
	await t.click(Selector("button").withExactText(translations.PROFILE.CREATE_PROFILE));

	await t.expect(getLocation()).contains("/profiles/create");

	await t.typeText(nameInput, "Joe Bloggs");
	await t.typeText(Selector("input[name=password]"), "password");
	await t.click('[data-testid="SelectDropdownInput__input"]');
	await t.click('[data-testid="select-list__toggle-option-0"]');
	await t.click(Selector("input[name=isDarkMode]").parent());
	await t.click(Selector("button").withExactText(translations.COMMON.CREATE));

	await t.wait(1000); // TODO: the profile loading is async so we need to give it a moment

	// Check welcome with created profiles
	await t.expect(getLocation()).notContains("/profiles/create");
	await t.expect(Selector("p").withText("John Doe").exists).ok();
	await t.expect(Selector("p").withText("Joe Bloggs").exists).ok();
	await t.expect(Selector("span").withText("N/A").exists).ok();
});
