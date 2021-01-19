import { Selector } from "testcafe";

import { buildTranslations } from "../../../app/i18n/helpers";
import { createFixture } from "../../../utils/e2e-utils";

const translations = buildTranslations();

createFixture(`Welcome Page Profile Card`);

test("should navigate to profile setting from profile card menu", async (t) => {
	await t.click(Selector('[data-testid="Card"] [data-testid="dropdown__toggle"]').child(0));
	await t.click(
		Selector('[data-testid="Card"] [data-testid="dropdown__option--0"]').withText(translations.COMMON.SETTINGS),
	);
	await t.expect(Selector("h1").withText(translations.SETTINGS.GENERAL.TITLE).exists).ok();
});
