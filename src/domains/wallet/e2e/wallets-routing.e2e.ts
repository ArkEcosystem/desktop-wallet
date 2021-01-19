import { Selector } from "testcafe";

import { buildTranslations as translations } from "../../../app/i18n/helpers";
import { createFixture } from "../../../utils/e2e-utils";

createFixture(`Wallets routing`);

test("should navigate to portfolio and access a wallet details", async (t) => {
	await t.click(Selector("span").withText("John Doe"));
	await t.expect(Selector("div").withText(translations().COMMON.WALLETS).exists).ok();

	await t.click(Selector("[data-testid=WalletCard__D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD]"));
	await t.expect(Selector("span").withText("ARK Wallet 1").exists).ok();
});

test("should navigate to create wallet page", async (t) => {
	await t.click(Selector("span").withText("John Doe"));
	await t.expect(Selector("div").withText(translations().COMMON.WALLETS).exists).ok();

	// Go to create wallet page
	await t.click(Selector("button").withText(translations().COMMON.CREATE));
	await t
		.expect(Selector("div").withText(translations().WALLETS.PAGE_CREATE_WALLET.CRYPTOASSET_STEP.SUBTITLE).exists)
		.ok();
});

test("should navigate to import wallet page", async (t) => {
	await t.click(Selector("span").withText("John Doe"));
	await t.expect(Selector("div").withText(translations().COMMON.WALLETS).exists).ok();

	// Go to create wallet page
	await t.click(Selector("button").withText(translations().COMMON.IMPORT));
	await t
		.expect(Selector("div").withText(translations().WALLETS.PAGE_IMPORT_WALLET.CRYPTOASSET_STEP.SUBTITLE).exists)
		.ok();
});
