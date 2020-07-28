import { ClientFunction, Selector } from "testcafe";

import { buildTranslations as translations } from "../../../app/i18n/helpers";

fixture`Welcome -> Create Profile routing`.page`http://localhost:3000/`;

const getLocation = ClientFunction(() => document.location.href);

test("should navigate to create profile and back to welcome screen", async (t) => {
	await t.click(Selector("button").withExactText(translations().PROFILE.CREATE_PROFILE));
	await t.expect(getLocation()).contains("http://localhost:3000/profiles/create");
	await t.click(Selector("h1").withExactText(translations().PROFILE.PAGE_CREATE_PROFILE.TITLE));

	// Navigate back
	await t.click(Selector("button").withExactText("Back"));
	await t.click(Selector("h1").withExactText(translations().COMMON.WELCOME));
	await t.expect(getLocation()).contains("http://localhost:3000/");
});
