import { Selector } from "testcafe";

import { buildTranslations } from "../../../app/i18n/helpers";
import { createFixture } from "../../../utils/e2e-utils";
import { goToSettings } from "./common";

const translations = buildTranslations();

createFixture("Reset profile").beforeEach(async (t) => await goToSettings(t));

test("should reset profile", async (t) => {
	await t.click(Selector("[data-testid=Input__suggestion]").withText("15 minutes"));
	await t.click('[data-testid="SelectDropdown__option--0"]');

	await t.click(Selector("button").withText(translations.COMMON.SAVE));

	const name = await Selector("input[name=name]").value;
	const automaticSignOutPeriod = await Selector("input[name=automaticSignOutPeriod]").value;

	await t.click(Selector("button").withText(translations.COMMON.RESET_SETTINGS));
	await t.click(Selector("button").withText(translations.COMMON.RESET).nth(-1));

	await t.expect(Selector("input[name=name]").value).eql(name);
	await t.expect(Selector("input[name=automaticSignOutPeriod]").value).notEql(automaticSignOutPeriod);
});
