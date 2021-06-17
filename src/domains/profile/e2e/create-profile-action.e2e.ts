import { Selector } from "testcafe";

import { buildTranslations } from "../../../app/i18n/helpers";
import { createFixture, getLocation } from "../../../utils/e2e-utils";

const translations = buildTranslations();

createFixture(`Create Profile action`);

const nameInput = Selector("input[name=name]");

test("should show button disabled if required fields are not filled", async (t) => {
	await t
		.expect(Selector('[data-testid="Card"]').withExactText(translations.PROFILE.CREATE_PROFILE).exists)
		.ok({ timeout: 60_000 });
	await t.click(Selector('[data-testid="Card"]').withExactText(translations.PROFILE.CREATE_PROFILE));

	t.expect(Selector('[data-testid="CreateProfile__submit-button"]').hasAttribute("disabled"));
});

test("should create a profile and navigate to welcome screen", async (t) => {
	await t
		.expect(Selector('[data-testid="Card"]').withExactText(translations.PROFILE.CREATE_PROFILE).exists)
		.ok({ timeout: 60_000 });
	await t.click(Selector('[data-testid="Card"]').withExactText(translations.PROFILE.CREATE_PROFILE));

	await t.expect(getLocation()).contains("/profiles/create");

	await t.typeText(nameInput, "Anne Doe");
	await t.click('[data-testid="SelectDropdown__input"]');
	await t.click('[data-testid="SelectDropdown__option--0"]');
	await t.click(Selector("input[name=isDarkMode]").parent());
	await t.click(Selector("button").withExactText(translations.COMMON.CREATE));
	await t.expect(getLocation()).notContains("/profiles/create");
	await t.expect(Selector("span").withText("John Doe").exists).ok();
	await t.expect(Selector("span").withText("Anne Doe").exists).ok();
});

test("should create a profile with password and navigate to welcome screen", async (t) => {
	await t
		.expect(Selector('[data-testid="Card"]').withExactText(translations.PROFILE.CREATE_PROFILE).exists)
		.ok({ timeout: 60_000 });
	await t.click(Selector('[data-testid="Card"]').withExactText(translations.PROFILE.CREATE_PROFILE));

	await t.expect(getLocation()).contains("/profiles/create");

	await t.typeText(nameInput, "Joe Bloggs");
	await t.typeText(Selector("input[name=password]"), "S3cUrePa$sword");
	await t.typeText(Selector("input[name=confirmPassword]"), "S3cUrePa$sword");
	await t.click('[data-testid="SelectDropdown__input"]');
	await t.click('[data-testid="SelectDropdown__option--0"]');
	await t.click(Selector("input[name=isDarkMode]").parent());
	await t.click(Selector("button").withExactText(translations.COMMON.CREATE));

	await t.expect(getLocation()).notContains("/profiles/create");
	await t.expect(Selector("span").withText("John Doe").exists).ok();
	await t.expect(Selector("span").withText("Joe Bloggs").exists).ok();
});
