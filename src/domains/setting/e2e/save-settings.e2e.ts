import { Selector } from "testcafe";

import { buildTranslations } from "../../../app/i18n/helpers";
import { createFixture, scrollToTop } from "../../../utils/e2e-utils";
import { goToSettings } from "./common";

const translations = buildTranslations();

createFixture(`Save settings`).beforeEach(async (t) => await goToSettings(t));

test("should save settings", async (t) => {
	const nameInput = Selector('input[data-testid="General-settings__input--name"]');
	await t.typeText(nameInput, "Anne Doe");

	await t.click(Selector("input[name=isScreenshotProtection]").parent());
	await t.click(Selector("input[name=isAdvancedMode]").parent());

	await scrollToTop();

	await t.click(Selector("[data-testid=Input__suggestion]").withText("1 minute"));
	await t.click('[data-testid="select-list__toggle-option-2"]');

	await t.click(Selector("input[name=isDarkMode]").parent());

	await t.click(Selector("button").withText(translations.COMMON.SAVE));
});
