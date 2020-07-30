import { ClientFunction, Selector } from "testcafe";

import { buildTranslations as translations } from "../../../app/i18n/helpers";

fixture`Settings screen routing`.page`http://localhost:3000/`;

const scrollTop = ClientFunction(() => {
	window.scrollTo({ top: 0 });
});

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

	await t.click(Selector("input[name=isScreenshotProtection]").parent());
	await t.click(Selector("input[name=isAdvancedMode]").parent());

	await scrollTop();

	// Open Advanced Mode Modal
	await t.expect(Selector("[data-testid=modal__inner]").exists).ok();
	await t.click(Selector("[data-testid=AdvancedMode__accept-button]"));
	await t.expect(Selector("[data-testid=modal__inner]").exists).notOk();

	await t.click(Selector("input[name=isDarkMode]").parent());
	await t.click(Selector("input[name=isUpdateLedger]").parent());

	await t.click(Selector("button").withText(translations().COMMON.SAVE));
});
