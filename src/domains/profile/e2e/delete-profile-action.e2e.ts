import { Selector } from "testcafe";

import { buildTranslations as translations } from "../../../app/i18n/helpers";
import { getPageURL } from "../../../utils/e2e-utils";

fixture`Delete Profile action`.page(getPageURL());

test("should delete profile from profile card menu", async (t) => {
	await t.click(Selector('[data-testid="ProfileCard"] [data-testid="dropdown__toggle"]'));
	await t.click(
		Selector('[data-testid="ProfileCard"] [data-testid="dropdown__option--1"]').withText(
			translations().COMMON.DELETE,
		),
	);
	await t.click(Selector('[data-testid="DeleteResource__submit-button"]'));
	await t.expect(Selector('[data-testid="ProfileCard"]').count).eql(1);
});
