import { Selector } from "testcafe";

import { buildTranslations } from "../../../app/i18n/helpers";
import { getPageURL } from "../../../utils/e2e-utils";

const translations = buildTranslations();

fixture`Transactions routing`.page(getPageURL());

test("should navigate to portfolio and access registrations", async (t) => {
	await t.click(Selector("p").withText("John Doe"));
	await t.expect(Selector("div").withText(translations.COMMON.WALLETS).exists).ok();

	// Go to registrations
	await t.click(Selector("[data-testid=WalletCard__D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD]"));
	await t.click(Selector("[data-testid=WalletRegistrations__show-all]"));
	await t.expect(Selector("h1").withText(translations.PROFILE.PAGE_MY_REGISTRATIONS.TITLE).exists).ok();
});

test("should navigate to portfolio and registration page", async (t) => {
	await t.click(Selector("p").withText("John Doe"));
	await t.expect(Selector("div").withText(translations.COMMON.WALLETS).exists).ok();

	// Go to registrations
	await t.click(Selector("[data-testid=WalletCard__D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD]"));
	await t.click(Selector("[data-testid=WalletRegistrations__register]"));
	await t.expect(Selector("h1").withText("Registration").exists).ok();
});
