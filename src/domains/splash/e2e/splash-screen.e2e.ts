import { Selector } from "testcafe";

import { buildTranslations } from "../../../app/i18n/helpers";
import { createFixture } from "../../../utils/e2e-utils";

// const mockWindowNavigator = "window.navigator = { onLine: true };";

const translations = buildTranslations();

createFixture("Splash screen");

test("should render welcome page", async (t) => {
	await t.expect(Selector("span").withText(translations.COMMON.DESKTOP_WALLET).exists).ok();
});

// test("should show splash screen", async (t) => {
// 	await t.expect(Selector('[data-testid="Splash__text"]').exists).ok();
// 	await t.expect(Selector('[data-testid="Splash__text"]').withText(translations.SPLASH.BRAND).exists).ok();
// 	await t.expect(Selector('[data-testid="Splash__text"]').withText(translations.SPLASH.LOADING).exists).ok();
// 	await t.expect(Selector('[data-testid="Splash__footer"]').withText(translations.SPLASH.COPYRIGHT).exists).ok();
// 	await t.expect(Selector('[data-testid="Splash__footer"]').withText(translations.SPLASH.RIGHTS).exists).ok();
// 	await t.expect(Selector('[data-testid="Splash__footer"]').withText(translations.SPLASH.PRODUCT).exists).ok();
// 	await t.expect(Selector('[data-testid="Splash__footer"]').withText(translations.SPLASH.VERSION).exists).ok();
// });
//
// test("should show welcome screen after splash screen", async (t) => {
// 	await t.expect(Selector('[data-testid="Splash__text"]').exists).ok();
// 	await t.expect(Selector('[data-testid="Splash__text"]').exists).notOk({ timeout: 10000 });
//
//	await t.expect(Selector("span").withText(translations.COMMON.DESKTOP_WALLET).exists).ok();
// }).clientScripts({ content: mockWindowNavigator });
