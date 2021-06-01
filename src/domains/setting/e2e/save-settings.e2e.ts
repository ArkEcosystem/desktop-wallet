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

	await scrollToTop();

	await t.click(Selector("[data-testid=Input__suggestion]").withText("1 minute"));
	await t.click('[data-testid="select-list__toggle-option-2"]');

	await t.click(Selector("input[name=isDarkMode]").parent());

	await t.click(Selector("button").withText(translations.COMMON.SAVE));
});

test("should update converted balance in the navbar after changing the currency", async (t) => {
	const getBalanceValue = async (): Promise<string> => {
		const balanceText = await Selector("[data-testid=Balance__value]").textContent;
		return balanceText.replace(/[A-Z]|\s/g, "");
	};

	await t.click(Selector("[aria-owns=select-currency-menu] [data-testid=SelectDropdown__caret]"));
	await t.click(Selector("#select-currency-item-0"));
	await t.click(Selector("button").withText(translations.COMMON.SAVE));
	const balanceBefore = await getBalanceValue();

	await t.click(Selector("[aria-owns=select-currency-menu] [data-testid=SelectDropdown__caret]"));
	await t.click(Selector("#select-currency-item-1"));
	await t.click(Selector("button").withText(translations.COMMON.SAVE));
	const balanceAfter = await getBalanceValue();

	await t.expect(balanceBefore).notEql(balanceAfter);
});
