import { Selector } from "testcafe";

import { buildTranslations as translations } from "../../../app/i18n/helpers";

fixture`Settings screen routing`.page`http://localhost:3000/`;

test("should navigate to settings page", async (t) => {
	await t.click(Selector("p").withText("John Doe"));
	await t.expect(Selector("div").withText(translations().COMMON.WALLETS).exists).ok();

	await t.click(Selector('[data-testid="navbar__useractions"]'));
	await t
		.expect(Selector('[data-testid="dropdown__option--1"]').withText(translations().COMMON.SETTINGS).exists)
		.ok();
	await t.click(Selector('[data-testid="dropdown__option--1"]').withText(translations().COMMON.SETTINGS));

	await t.expect(Selector("h1").withText(translations().SETTINGS.GENERAL.TITLE).exists).ok();
});

test("should return an error when submit without required fields", async (t) => {
	await t.click(Selector("p").withText("John Doe"));
	await t.expect(Selector("div").withText(translations().COMMON.WALLETS).exists).ok();

	await t.click(Selector('[data-testid="navbar__useractions"]'));
	await t
		.expect(Selector('[data-testid="dropdown__option--1"]').withText(translations().COMMON.SETTINGS).exists)
		.ok();
	await t.click(Selector('[data-testid="dropdown__option--1"]').withText(translations().COMMON.SETTINGS));
	await t.expect(Selector("h1").withText(translations().SETTINGS.GENERAL.TITLE).exists).ok();

	await t.expect(Selector("h1").withText(translations().SETTINGS.GENERAL.TITLE).exists).ok();
	await t.click(Selector("button").withExactText(translations().COMMON.SAVE));
	await t.click(Selector("fieldset p").withText("Name is required"));
	await t.click(Selector("fieldset p").withText("Passphrase Language is required"));
	await t.click(Selector("fieldset p").withText("Currency is required"));
	await t.click(Selector("fieldset p").withText("Language is required"));
	await t.click(Selector("fieldset p").withText("Market Provider is required"));
	await t.click(Selector("fieldset p").withText("Time Format is required"));
});

test("should save settings", async (t) => {
	await t.click(Selector("p").withText("John Doe"));
	await t.expect(Selector("div").withText(translations().COMMON.WALLETS).exists).ok();

	await t.click(Selector('[data-testid="navbar__useractions"]'));
	await t
		.expect(Selector('[data-testid="dropdown__option--1"]').withText(translations().COMMON.SETTINGS).exists)
		.ok();
	await t.click(Selector('[data-testid="dropdown__option--1"]').withText(translations().COMMON.SETTINGS));
	await t.expect(Selector("h1").withText(translations().SETTINGS.GENERAL.TITLE).exists).ok();

	const nameInput = Selector('input[data-testid="General-settings__input--name"]');
	await t.typeText(nameInput, "Anne Doe");

	await t.click(Selector("button").withText("Select Language"));
	await t.click(Selector("li.select-list-option").withText("English"));

	await t.click(Selector("button").withText("Select Passphrase Language"));
	await t.click(Selector("li.select-list-option").withText("English"));

	await t.click(Selector("button").withText("Select Market Provider"));
	await t.click(Selector("li.select-list-option").withText("CoinGecko"));

	await t.click(Selector("button").withText("Select Currency"));
	await t.click(Selector("li.select-list-option").withText("ETH"));

	await t.click(Selector("button").withText("Select Time Format"));
	await t.click(Selector("li.select-list-option").withText("24h"));

	await t.click(Selector("input[name=isScreenshotProtection]").parent());
	await t.click(Selector("input[name=isAdvancedMode]").parent());
	await t.click(Selector("input[name=isDarkMode]").parent());
	await t.click(Selector("input[name=isUpdateLedger]").parent());

	await t.click(Selector("button").withText(translations().COMMON.SAVE));
});
