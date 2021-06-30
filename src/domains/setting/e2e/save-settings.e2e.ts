import { Selector } from "testcafe";

import { buildTranslations } from "../../../app/i18n/helpers";
import { createFixture, mockRequest, scrollToTop } from "../../../utils/e2e-utils";
import { goToProfile } from "../../profile/e2e/common";
import { importWalletByAddress } from "../../wallet/e2e/common";
import { goToSettings } from "./common";

const translations = buildTranslations();

createFixture(`Save settings`, [
	mockRequest(
		{
			method: "POST",
			url: "https://wallets.ark.io/api/transactions/search?page=1&limit=20",
		},
		{
			addresses: ["AThxYTVgpzZfW7K6UxyB8vBZVMoPAwQS3D"],
		},
	),
	mockRequest(
		{
			method: "POST",
			url: "https://wallets.ark.io/api/transactions/search?limit=30",
		},
		{
			addresses: ["AdVSe37niA3uFUPgCgMUH2tMsHF4LpLoiX"],
		},
	),
]);

test("should save settings", async (t) => {
	await goToSettings(t);

	const nameInput = Selector('input[data-testid="General-settings__input--name"]');

	await t
		.click(nameInput)
		.pressKey("ctrl+a delete")
		.typeText(nameInput, "Anne Doe");

	await t.click(Selector("input[name=screenshotProtection]").parent());

	await scrollToTop();

	await t.click(Selector("[data-testid=Input__suggestion]").withText("15 minutes"));
	await t.click('[data-testid="SelectDropdown__option--0"]');

	await t.click(Selector("input[name=isDarkMode]").parent());

	await t.click(Selector("button").withText(translations.COMMON.SAVE));
});

test("should prevent navigating away with unsaved settings", async (t) => {
	await goToSettings(t);

	const nameInput = Selector('input[data-testid="General-settings__input--name"]');

	// store original name
	const originalValue = await nameInput.value;

	// clear input and type new name
	await t
		.click(nameInput)
		.pressKey("ctrl+a delete")
		.typeText(nameInput, "Jane Doe");

	// try navigate to portfolio
	await t.click(Selector('a').withText(translations.COMMON.PORTFOLIO));

	// check that modal showed up
	await t.expect(Selector('[data-testid="ConfirmationModal"]').exists).ok();

	// cancel navigation to portfolio
	await t.click(Selector('[data-testid="ConfirmationModal__no-button"]'));

	// restore original name value
	await t
		.click(nameInput)
		.pressKey("ctrl+a delete")
		.typeText(nameInput, originalValue || "");

	// try navigate to portfolio
	await t.click(Selector('a').withText(translations.COMMON.PORTFOLIO));

	// check that modal did not show up
	await t.expect(Selector('[data-testid="ConfirmationModal"]').exists).notOk();
})

test("should update converted balance in the navbar after changing the currency", async (t) => {
	await goToProfile(t);

	// import a mainnet address
	await importWalletByAddress(t, "AThxYTVgpzZfW7K6UxyB8vBZVMoPAwQS3D", undefined, true);

	// go to settings
	await t.click(Selector('[data-testid="navbar__useractions"]'));
	await t.expect(Selector('[data-testid="dropdown__options"] li').withText(translations.COMMON.SETTINGS).exists).ok();
	await t.click(Selector('[data-testid="dropdown__options"] li').withText(translations.COMMON.SETTINGS));
	await t.expect(Selector("h1").withText(translations.SETTINGS.GENERAL.TITLE).exists).ok();

	// select BTC
	await t.click(Selector("[aria-owns=select-currency-menu] [data-testid=SelectDropdown__caret]"));
	await t.click(Selector("#select-currency-menu .select-list-option").withText("BTC (Ƀ)"));
	await t.click(Selector("button").withText(translations.COMMON.SAVE));
	await t.expect(Selector("[data-testid=Balance__value]").withText("0 BTC").exists).notOk();

	// wait for settings to be saved
	await t.expect(Selector("[data-testid=ToastMessage__content]").withText(translations.SETTINGS.GENERAL.SUCCESS).exists).ok();
	await t.expect(Selector("[data-testid=ToastMessage__content]").withText(translations.SETTINGS.GENERAL.SUCCESS).exists).notOk();

	// select ETH
	await t.click(Selector("[aria-owns=select-currency-menu] [data-testid=SelectDropdown__caret]"));
	await t.click(Selector("#select-currency-menu .select-list-option").withText("ETH (Ξ)"));
	await t.click(Selector("button").withText(translations.COMMON.SAVE));
	await t.expect(Selector("[data-testid=Balance__value]").withText("0 ETH").exists).notOk();
});
