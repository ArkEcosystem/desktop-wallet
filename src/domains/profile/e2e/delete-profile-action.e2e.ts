import { Selector } from "testcafe";

import { buildTranslations } from "../../../app/i18n/helpers";
import { createFixture } from "../../../utils/e2e-utils";

const translations = buildTranslations();

createFixture(`Delete Profile action`);

test("should delete profile from profile card menu", async (t) => {
	await t.expect(Selector('[data-testid="Card"]').count).eql(3);
	await t.click(Selector('[data-testid="Card"] [data-testid="dropdown__toggle"]').child(0));
	await t.click(
		Selector('[data-testid="Card"] [data-testid="dropdown__option--1"]').withText(translations.COMMON.DELETE),
	);
	await t.click(Selector('[data-testid="DeleteResource__submit-button"]'));
	await t.expect(Selector('[data-testid="Card"]').count).eql(2);
});
