import { Selector } from "testcafe";

import { buildTranslations as translations } from "../../../app/i18n/helpers";

fixture`Contacts routing`.page`http://localhost:3000/`;

test("should navigate to contacts page", async (t) => {
	await t.click(Selector("p").withText("John Doe"));
	await t.expect(Selector("div").withText(translations().COMMON.WALLETS).exists).ok();

	await t.click(Selector('[data-testid="navbar__useractions"]'));
	await t
		.expect(Selector('[data-testid="dropdown__option--0"]').withText(translations().COMMON.CONTACTS).exists)
		.ok();
	await t.click(Selector('[data-testid="dropdown__option--0"]').withText(translations().COMMON.CONTACTS));

	await t.expect(Selector("h1").withText(translations().CONTACTS.CONTACTS_PAGE.TITLE).exists).ok();
});
