import { Selector } from "testcafe";

import { buildTranslations as translations } from "../../../app/i18n/helpers";

fixture`Wallets routing`.page`http://localhost:3000/`;

test("should navigate to portfolio and access a wallet details", async (t) => {
	await t.click(Selector("p").withText("John Doe"));
	await t.expect(Selector("div").withText(translations().COMMON.WALLETS).exists).ok();

	await t.click(Selector("[data-testid=WalletCard__D6Z26L69gdk9qYmTv5uzk3uGepigtHY4ax]"));
	await t.expect(Selector("h2").withText("ARK Wallet 1").exists).ok();
});

test("should navigate to create wallet page", async (t) => {
	await t.click(Selector("p").withText("John Doe"));
	await t.expect(Selector("div").withText(translations().COMMON.WALLETS).exists).ok();

	// Go to create wallet page
	await t.click(Selector("button").withText(translations().COMMON.CREATE));
	await t
		.expect(Selector("div").withText(translations().WALLETS.PAGE_CREATE_WALLET.NETWORK_STEP.SUBTITLE).exists)
		.ok();
});

test("should navigate to import wallet page", async (t) => {
	await t.click(Selector("p").withText("John Doe"));
	await t.expect(Selector("div").withText(translations().COMMON.WALLETS).exists).ok();

	// Go to create wallet page
	await t.click(Selector("button").withText(translations().COMMON.IMPORT));
	await t
		.expect(Selector("div").withText(translations().WALLETS.PAGE_IMPORT_WALLET.NETWORK_STEP.SUBTITLE).exists)
		.ok();
});
