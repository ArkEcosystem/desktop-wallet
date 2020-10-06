import { Selector } from "testcafe";

import { buildTranslations } from "../../../app/i18n/helpers";
import { createFixture } from "../../../utils/e2e-utils";

const translations = buildTranslations();

createFixture(`Welcome Screen routing`);

test("should load profiles welcome page", async (t) => {
	await t.expect(Selector('[data-testid="Splash__text"]').exists).ok();
	await t.expect(Selector('[data-testid="Splash__text"]').exists).notOk({ timeout: 10000 });

	const title = await Selector("h1").textContent;

	for (const part of translations.PROFILE.PAGE_WELCOME.TITLE.split("<1/>")) {
		await t.expect(title).contains(part);
	}
});

test("should return to welcome page when application is idle", async (t) => {
	await t.expect(Selector('[data-testid="Splash__text"]').exists).ok();
	await t.expect(Selector('[data-testid="Splash__text"]').exists).notOk({ timeout: 10000 });

	const title = await Selector("h1").textContent;

	for (const part of translations.PROFILE.PAGE_WELCOME.TITLE.split("<1/>")) {
		await t.expect(title).contains(part);
	}

	await t.click(Selector("p").withText("John Doe"));

	await t.expect(Selector("div").withText(translations.COMMON.WALLETS).exists).ok();

	await t.expect(Selector("div").withText(translations.COMMON.WALLETS).exists).notOk({ timeout: 80000 });
});
