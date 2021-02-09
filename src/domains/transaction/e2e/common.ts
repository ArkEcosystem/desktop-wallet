import { Selector } from "testcafe";

import { buildTranslations } from "../../../app/i18n/helpers";

const translations = buildTranslations();

export const goToTransferPage = async (t: any) => {
	await t.click(Selector("[data-testid=WalletHeader__send-button]"));
	await t
		.expect(Selector("h1").withText(translations.TRANSACTION.PAGE_TRANSACTION_SEND.FIRST_STEP.TITLE).exists)
		.ok();
};

export const goToRegistrationPage = async (t: any) => {
	await t.click(Selector('[data-testid="navbar__useractions"]'));
	await t.expect(Selector("li").withText(translations.COMMON.REGISTRATIONS).exists).ok();
	await t.click(Selector("li").withText(translations.COMMON.REGISTRATIONS));
	await t.click(Selector("button").withText(translations.COMMON.REGISTER));
	await t.expect(Selector("[data-testid=Registration__form]").exists).ok();
};

export const goToDelegateRegistrationPage = async (t: any) => {
	await t.click(Selector('[data-testid="WalletHeader__more-button"]'));
	await t.click(
		Selector('[data-testid="WalletHeader__more-button"] li').withText(
			translations.WALLETS.PAGE_WALLET_DETAILS.OPTIONS.REGISTER_DELEGATE,
		),
	);

	await t
		.expect(Selector("div").withText(translations.TRANSACTION.PAGE_DELEGATE_REGISTRATION.SECOND_STEP.TITLE).exists)
		.ok();
};

export const goToDelegateResignationPage = async (t: any) => {
	await t.click(Selector('[data-testid="WalletHeader__more-button"]'));
	await t.click(
		Selector('[data-testid="WalletHeader__more-button"] li').withText(
			translations.WALLETS.PAGE_WALLET_DETAILS.OPTIONS.RESIGN_DELEGATE,
		),
	);

	await t
		.expect(
			Selector("div").withText(translations.TRANSACTION.PAGE_RESIGN_REGISTRATION.FORM_STEP.DELEGATE.TITLE).exists,
		)
		.ok();
};
