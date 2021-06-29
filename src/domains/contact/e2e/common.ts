import { Selector } from "testcafe";

import { buildTranslations } from "../../../app/i18n/helpers";
import { goToProfile } from "../../profile/e2e/common";

const translations = buildTranslations();

export const goToContacts = async (t: any) => {
	await goToProfile(t);

	await t.click(Selector('[data-testid="navbar__useractions"]'));
	await t.expect(Selector('[data-testid="dropdown__option--0"]').withText(translations.COMMON.CONTACTS).exists).ok();
	await t.click(Selector('[data-testid="dropdown__option--0"]').withText(translations.COMMON.CONTACTS));

	await t.expect(Selector("h1").withText(translations.CONTACTS.CONTACTS_PAGE.TITLE).exists).ok();
};
