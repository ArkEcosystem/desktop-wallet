import { Selector } from "testcafe";

import { buildTranslations as translations } from "../../../app/i18n/helpers";

fixture`Delete Profile action`.page`http://localhost:3000/`;

test("should delete profile from profile card menu", async (t) => {
	await t.click(Selector('[data-testid="ProfileCard"] [data-testid="dropdown__toggle"]'));
	await t.click(
		Selector('[data-testid="ProfileCard"] [data-testid="dropdown__option--1"]').withText(
			translations().COMMON.DELETE,
		),
	);
	await t.expect(Selector('[data-testid="ProfileCard"]').exists).notOk();
});
