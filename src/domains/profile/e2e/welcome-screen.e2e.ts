import { Selector } from "testcafe";

import { buildTranslations } from "../../../app/i18n/helpers";
import { createFixture } from "../../../utils/e2e-utils";

const translations = buildTranslations();

createFixture("Welcome Screen routing");

test("should load profiles welcome page", async (t) => {
	await t.expect(Selector("span").withText(translations.COMMON.DESKTOP_WALLET).exists).ok();
});

test("should return to welcome page when application is idle", async (t) => {
	await t.expect(Selector("span").withText(translations.COMMON.DESKTOP_WALLET).exists).ok();

	await t.click(Selector("span").withText("John Doe"));

	await t.expect(Selector("div").withText(translations.COMMON.WALLETS).exists).ok();
	await t.expect(Selector('[data-testid="transactions__fetch-more-button"]').exists).ok();

	await t.expect(Selector("div").withText(translations.COMMON.WALLETS).exists).notOk({ timeout: 80000 });
});
