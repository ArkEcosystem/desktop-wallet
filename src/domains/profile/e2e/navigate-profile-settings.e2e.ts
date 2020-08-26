import { Selector } from "testcafe";

import { buildTranslations } from "../../../app/i18n/helpers";
import { getPageURL } from "../../../utils/e2e-utils";

const translations = buildTranslations();

fixture`Welcome Page Profile Card`.page(getPageURL());

test("should navigate to profile setting from profile card menu", async (t) => {
	await t.click(Selector('[data-testid="ProfileCard"] [data-testid="dropdown__toggle"]'));
	await t.click(
		Selector('[data-testid="ProfileCard"] [data-testid="dropdown__option--0"]').withText(
			translations.COMMON.SETTINGS,
		),
	);
	await t.expect(Selector("h1").withText(translations.SETTINGS.GENERAL.TITLE).exists).ok();
});
