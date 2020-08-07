import { Selector } from "testcafe";

import { buildTranslations as translations } from "../../../app/i18n/helpers";
import { getPageURL } from "../../../utils/e2e-utils";

fixture`Splash screen`.page(getPageURL());

test("should show splash screen", async (t) => {
	await t.expect(Selector('[data-testid="Splash__text"]').exists).ok();
	await t.expect(Selector('[data-testid="Splash__text"]').withText(translations().SPLASH.BRAND).exists).ok();
	await t.expect(Selector('[data-testid="Splash__text"]').withText(translations().SPLASH.LOADING).exists).ok();
	await t.expect(Selector('[data-testid="Splash__footer"]').withText(translations().SPLASH.COPYRIGHT).exists).ok();
	await t.expect(Selector('[data-testid="Splash__footer"]').withText(translations().SPLASH.RIGHTS).exists).ok();
	await t.expect(Selector('[data-testid="Splash__footer"]').withText(translations().SPLASH.PRODUCT).exists).ok();
	await t.expect(Selector('[data-testid="Splash__footer"]').withText(translations().SPLASH.VERSION).exists).ok();
});

test("should show welcome screen after splash screen", async (t) => {
	await t.expect(Selector('[data-testid="Splash__text"]').exists).ok();
	await t.expect(Selector('[data-testid="Splash__text"]').exists).notOk({ timeout: 6000 });
	await t.expect(Selector("h1").withExactText(translations().COMMON.WELCOME).exists).ok();
});
