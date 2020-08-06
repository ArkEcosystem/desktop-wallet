import { ClientFunction, Selector } from "testcafe";

import { buildTranslations } from "../../../app/i18n/helpers";

const translations = buildTranslations();

fixture`Welcome Screen routing`.page`http://localhost:3000`;

const getLocation = ClientFunction(() => document.location.href);

test("should load profiles welcome page", async (t) => {
	await t.click(Selector("h1").withExactText(translations.COMMON.WELCOME));
	await t.expect(getLocation()).contains("http://localhost:3000/");
});

test("should return to welcome page when application is idle", async (t) => {
	await t.click(Selector("h1").withExactText(translations.COMMON.WELCOME));
	await t.expect(getLocation()).contains("http://localhost:3000/");

	await t.click(Selector("p").withText("John Doe"));

	await t.expect(Selector("div").withText(translations.COMMON.WALLETS).exists).ok();

	await t.expect(Selector("h1").withExactText(translations.COMMON.WELCOME).exists).ok({ timeout: 60000 });
	await t.expect(Selector("div").withText(translations.COMMON.WALLETS).exists).notOk();
});
