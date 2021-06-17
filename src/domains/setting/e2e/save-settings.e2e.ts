import { Selector } from "testcafe";

import { buildTranslations } from "../../../app/i18n/helpers";
import { createFixture, mockRequest, scrollToTop } from "../../../utils/e2e-utils";
import { importWalletByAddress } from "../../wallet/e2e/common";
import { goToSettings } from "./common";

const translations = buildTranslations();

createFixture(`Save settings`, [
	mockRequest(
		{
			url: "https://wallets.ark.io/api/transactions/search?limit=30",
			method: "POST",
		},
		{
			addresses: ["AdVSe37niA3uFUPgCgMUH2tMsHF4LpLoiX"],
		},
	),
]);

test("should save settings", async (t) => {
	await goToSettings(t);

	const nameInput = Selector('input[data-testid="General-settings__input--name"]');
	await t.typeText(nameInput, "Anne Doe");

	await t.click(Selector("input[name=isScreenshotProtection]").parent());

	await scrollToTop();

	await t.click(Selector("[data-testid=Input__suggestion]").withText("1 minute"));
	await t.click('[data-testid="SelectDropdown__option--2"]');

	await t.click(Selector("input[name=isDarkMode]").parent());

	await t.click(Selector("button").withText(translations.COMMON.SAVE));
});

test("should update converted balance in the navbar after changing the currency", async (t) => {
	await t.expect(Selector("span").withText("John Doe").exists).ok({ timeout: 60_000 });
	await t.click(Selector("span").withText("John Doe"));
	await t.expect(Selector("div").withText(translations.COMMON.WALLETS).exists).ok();

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

	// select ETH
	await t.click(Selector("[aria-owns=select-currency-menu] [data-testid=SelectDropdown__caret]"));
	await t.click(Selector("#select-currency-menu .select-list-option").withText("ETH (Ξ)"));
	await t.click(Selector("button").withText(translations.COMMON.SAVE));
	await t.expect(Selector("[data-testid=Balance__value]").withText("0 ETH").exists).notOk();
});
