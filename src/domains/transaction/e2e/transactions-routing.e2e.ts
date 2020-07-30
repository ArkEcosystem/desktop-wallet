import { Selector } from "testcafe";

import { buildTranslations as translations } from "../../../app/i18n/helpers";

fixture`Transactions routing`.page`http://localhost:3000/`;

test("should navigate to portfolio and access registrations", async (t) => {
	await t.click(Selector("p").withText("John Doe"));
	await t.expect(Selector("div").withText(translations().COMMON.WALLETS).exists).ok();

	// Go to registrations
	await t.click(Selector("[data-testid=WalletCard__D6Z26L69gdk9qYmTv5uzk3uGepigtHY4ax]"));
	await t.click(Selector("[data-testid=WalletRegistrations__show-all]"));
	await t.expect(Selector("h1").withText(translations().PROFILE.PAGE_MY_REGISTRATIONS.TITLE).exists).ok();
});

test("should navigate to portfolio and registrate", async (t) => {
	await t.click(Selector("p").withText("John Doe"));
	await t.expect(Selector("div").withText(translations().COMMON.WALLETS).exists).ok();

	// Go to registrations
	await t.click(Selector("[data-testid=WalletCard__D6Z26L69gdk9qYmTv5uzk3uGepigtHY4ax]"));
	await t.click(Selector("[data-testid=WalletRegistrations__register]"));
	await t.expect(Selector("h1").withText("Registration").exists).ok();
});
