import { Selector } from "testcafe";

import { buildTranslations } from "../../../app/i18n/helpers";

const translations = buildTranslations();

export const goToWallet = async (t: any, wallet = "D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD") => {
	await t.click(Selector(`[data-testid=WalletCard__${wallet}]`));
	await t.expect(Selector("[data-testid=WalletHeader]").exists).ok();
	const transactionsCount = Selector('[data-testid="TableRow"]').count;
	await t.expect(transactionsCount).gte(12);
};

export const importWallet = async (t: any, passphrase = "passphrase", alias = "Test Wallet") => {
	await t.click(Selector("a").withText(translations.COMMON.PORTFOLIO));
	await t.click(Selector("button").withExactText(translations.COMMON.IMPORT));
	await t
		.expect(Selector("div").withText(translations.WALLETS.PAGE_IMPORT_WALLET.CRYPTOASSET_STEP.SUBTITLE).exists)
		.ok();
	await t.click('[data-testid="SelectNetworkInput__input"]');
	await t.click(Selector('[data-testid="NetworkIcon-ARK-ark.devnet"]'));
	await t.click(Selector("button").withExactText(translations.COMMON.CONTINUE));
	await t.typeText(Selector("[data-testid=ImportWallet__mnemonic-input]"), passphrase);
	await t.click(Selector("button").withExactText(translations.COMMON.CONTINUE));
	await t.typeText(Selector("[data-testid=ImportWallet__name-input]"), alias);

	await t.click(Selector("button").withExactText(translations.COMMON.SAVE_FINISH));

	await t.expect(Selector("[data-testid=WalletHeader]").exists).ok();

	if (passphrase === "passphrase") {
		const transactionsCount = Selector('[data-testid="TransactionRowMode"]').count;
		await t.expect(transactionsCount).gte(2);
	}
};

export const importWalletByAddress = async (t: any, address: string, alias = "Test Wallet") => {
	await t.click(Selector("a").withText(translations.COMMON.PORTFOLIO));
	await t.click(Selector("button").withExactText(translations.COMMON.IMPORT));
	await t
		.expect(Selector("div").withText(translations.WALLETS.PAGE_IMPORT_WALLET.CRYPTOASSET_STEP.SUBTITLE).exists)
		.ok();
	await t.click('[data-testid="SelectNetworkInput__input"]');
	await t.click(Selector('[data-testid="NetworkIcon-ARK-ark.devnet"]'));
	await t.click(Selector("button").withExactText(translations.COMMON.CONTINUE));

	await t.click('[data-testid="SelectDropdownInput__input"]');
	await t.click(Selector("#ImportWallet__select-item-1"));

	await t.typeText(Selector("[data-testid=ImportWallet__address-input]"), address);
	await t.click(Selector("button").withExactText(translations.COMMON.CONTINUE));
	await t.typeText(Selector("[data-testid=ImportWallet__name-input]"), alias);

	await t.click(Selector("button").withExactText(translations.COMMON.SAVE_FINISH));

	await t.expect(Selector("[data-testid=WalletHeader]").exists).ok();

	const transactionsCount = Selector('[data-testid="TransactionRowMode"]').count;
	await t.expect(transactionsCount).gte(2);
};
