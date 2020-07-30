import { Selector } from "testcafe";

import { buildTranslations as translations } from "../../../app/i18n/helpers";

fixture`Welcome Page Profile Card`.page`http://localhost:3000/`;

test("should navigate to profile setting from profile card menu", async (t) => {
	await t.click(Selector('[data-testid="ProfileCard"] [data-testid="dropdown__toggle"]'));
	await t.click(
		Selector('[data-testid="ProfileCard"] [data-testid="dropdown__option--0"]').withText(
			translations().COMMON.SETTINGS,
		),
	);
	await t.expect(Selector("h1").withText(translations().SETTINGS.GENERAL.TITLE).exists).ok();
});
