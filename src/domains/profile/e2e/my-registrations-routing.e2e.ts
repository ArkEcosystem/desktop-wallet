import { Selector } from "testcafe";

import { buildTranslations as translations } from "../../../app/i18n/helpers";
import { getPageURL } from "../../../utils/e2e-utils";

fixture`My Registrations`.page(getPageURL());

test("should navigate to my registrations page", async (t) => {
	await t.click(Selector("p").withText("John Doe"));
	await t.expect(Selector("div").withText(translations().COMMON.WALLETS).exists).ok();

	// Navigate to wallet details page
	await t.hover(Selector("[data-testid=WalletCard__D5sRKWckH4rE1hQ9eeMeHAepgyC3cvJtwb]"));
	await t.click(Selector("[data-testid=WalletCard__D5sRKWckH4rE1hQ9eeMeHAepgyC3cvJtwb]"));
	await t.expect(Selector("[data-testid=WalletHeader]").exists).ok();

	await t.hover(Selector("[data-testid=WalletRegistrations__show-all]"));
	await t.click(Selector("[data-testid=WalletRegistrations__show-all]"));

	await t.expect(Selector("[data-testid=header__title]").exists).ok();
	await t
		.expect(
			Selector("[data-testid=header__title]").withText(translations().PROFILE.PAGE_MY_REGISTRATIONS.TITLE).exists,
		)
		.ok();
});
