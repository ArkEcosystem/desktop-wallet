import { Selector } from "testcafe";

import { buildTranslations } from "../../../app/i18n/helpers";

const translations = buildTranslations();

export const goToWallet = async (t: any, wallet = "D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD") => {
	await t.click(Selector("p").withText("John Doe"));
	await t.expect(Selector("div").withText(translations.COMMON.WALLETS).exists).ok();

	await t.click(Selector(`[data-testid=WalletCard__${wallet}]`));
	await t.expect(Selector("[data-testid=WalletHeader]").exists).ok();
};

export const importWallet = async (
	t: any,
	passphrase = "passphrase",
	alias = "Test Wallet",
	navigateToWallet = true,
) => {
	await t.click(Selector("a").withText("Portfolio")); // @TODO replace with i18n key
	await t.click(Selector("button").withExactText(translations.COMMON.IMPORT));
	await t
		.expect(Selector("div").withText(translations.WALLETS.PAGE_IMPORT_WALLET.CRYPTOASSET_STEP.SUBTITLE).exists)
		.ok();
	await t.click('[data-testid="SelectNetworkInput__input"]');
	await t.click(Selector("#ImportWallet__network-item-1"));
	await t.click(Selector("button").withExactText(translations.COMMON.CONTINUE));
	await t.typeText(Selector("[data-testid=ImportWallet__passphrase-input]"), passphrase);
	await t.click(Selector("button").withExactText(translations.COMMON.CONTINUE));
	await t.typeText(Selector("[data-testid=ImportWallet__name-input]"), alias);

	if (navigateToWallet) {
		await t.click(Selector("button").withExactText(translations.COMMON.SAVE_FINISH));
	}
};

export const importWalletByAddress = async (
	t: any,
	address: string,
	alias = "Test Wallet",
	navigateToWallet = true,
) => {
	await t.click(Selector("a").withText("Portfolio")); // @TODO replace with i18n key
	await t.click(Selector("button").withExactText(translations.COMMON.IMPORT));
	await t
		.expect(Selector("div").withText(translations.WALLETS.PAGE_IMPORT_WALLET.CRYPTOASSET_STEP.SUBTITLE).exists)
		.ok();
	await t.click('[data-testid="SelectNetworkInput__input"]');
	await t.click(Selector("#ImportWallet__network-item-1"));
	await t.click(Selector("button").withExactText(translations.COMMON.CONTINUE));
	await t.click(Selector("input[name=isAddressOnly]").parent());
	await t.typeText(Selector("input[name=address]"), address);
	await t.click(Selector("button").withExactText(translations.COMMON.CONTINUE));
	await t.typeText(Selector("[data-testid=ImportWallet__name-input]"), alias);

	if (navigateToWallet) {
		await t.click(Selector("button").withExactText(translations.COMMON.SAVE_FINISH));
	}
};
