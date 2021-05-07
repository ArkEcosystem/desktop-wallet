import { Selector } from "testcafe";

import { buildTranslations } from "../../../app/i18n/helpers";

const translations = buildTranslations();

export const goToProfile = async (t: any) => {
	await t.expect(Selector("span").withText("John Doe").exists).ok({ timeout: 60000 });
	await t.click(Selector("span").withText("John Doe"));
	await t.expect(Selector("div").withText(translations.COMMON.WALLETS).exists).ok();
	const transactionsCount = Selector('[data-testid="TableRow"]').count;
	await t.expect(transactionsCount).gte(10, { timeout: 120000 });
};
