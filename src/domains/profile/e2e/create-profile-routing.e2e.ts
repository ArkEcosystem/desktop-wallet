import { ClientFunction, Selector } from "testcafe";

import { buildTranslations } from "../../../app/i18n/helpers";
import { createFixture } from "../../../utils/e2e-utils";

const translations = buildTranslations();

createFixture(`Welcome -> Create Profile routing`);

const getLocation = ClientFunction(() => document.location.href);

test("should navigate to create profile and back to welcome screen", async (t) => {
	await t.click(Selector('[data-testid="Card"]').withExactText(translations.PROFILE.CREATE_PROFILE));
	await t.expect(getLocation()).contains("/profiles/create");
	await t.click(Selector("h1").withExactText(translations.PROFILE.PAGE_CREATE_PROFILE.TITLE));

	// Navigate back
	await t.click(Selector("button").withExactText(translations.COMMON.BACK));

	await t.expect(Selector("span").withText(translations.COMMON.DESKTOP_WALLET).exists).ok();
});
