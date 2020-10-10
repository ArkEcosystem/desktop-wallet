import { Selector } from "testcafe";

import { buildTranslations } from "../../../app/i18n/helpers";
import { createFixture } from "../../../utils/e2e-utils";

const translations = buildTranslations();

createFixture(`Import Ledger Wallet action`);

test("should show ledger waiting device modal", async (t) => {
	await t.click(Selector("p").withText("John Doe"));
	await t.expect(Selector("div").withText(translations.COMMON.WALLETS).exists).ok();

	await t.click(Selector("button").withExactText(translations.DASHBOARD.WALLET_CONTROLS.IMPORT_LEDGER));
	await t.expect(Selector("span").withText(translations.WALLETS.MODAL_LEDGER_WALLET.WAITING_DEVICE).exists).ok();
});
