import { Selector } from "testcafe";

import { buildTranslations } from "../../../app/i18n/helpers";
import { getPageURL } from "../../../utils/e2e-utils";

const translations = buildTranslations();

fixture`Welcome Screen routing`.page(getPageURL());

test("should load profiles welcome page", async (t) => {
	await t.click(Selector("h1").withExactText(translations.COMMON.WELCOME));
});

test("should return to welcome page when application is idle", async (t) => {
	await t.click(Selector("h1").withExactText(translations.COMMON.WELCOME));

	await t.click(Selector("p").withText("John Doe"));

	await t.expect(Selector("div").withText(translations.COMMON.WALLETS).exists).ok();

	await t.expect(Selector("h1").withExactText(translations.COMMON.WELCOME).exists).ok({ timeout: 80000 });
	await t.expect(Selector("div").withText(translations.COMMON.WALLETS).exists).notOk();
});
