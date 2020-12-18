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
	const walletDropdown = Selector("[data-testid=WalletHeader] [data-testid=dropdown__toggle]");
	await t.expect(walletDropdown.exists).ok();

	await t.hover(walletDropdown);
	await t.click(walletDropdown);

	const delegateRegistrationOption = Selector(
		"[data-testid=WalletHeader] [data-testid=dropdown__options] li",
	).withText(translations.TRANSACTION - PAGE_WALLET_DETAILS.OPTIONS.REGISTER_DELEGATE);
	await t.click(delegateRegistrationOption);

	await t
		.expect(Selector("div").withText(translations.TRANSACTION.PAGE_DELEGATE_REGISTRATION.SECOND_STEP.TITLE).exists)
		.ok();
};

export const goToDelegateResignationPage = async (t: any) => {
	const walletDropdown = Selector("[data-testid=WalletHeader] [data-testid=dropdown__toggle]");
	await t.expect(walletDropdown.exists).ok();

	await t.hover(walletDropdown);
	await t.click(walletDropdown);

	const delegateResignationOption = Selector(
		"[data-testid=WalletHeader] [data-testid=dropdown__options] li",
	).withText(translations.TRANSACTION - PAGE_WALLET_DETAILS.OPTIONS.RESIGN_DELEGATE);
	await t.click(delegateResignationOption);

	await t
		.expect(
			Selector("div").withText(translations.TRANSACTION.PAGE_RESIGN_REGISTRATION.FIRST_STEP.DELEGATE.TITLE)
				.exists,
		)
		.ok();
};
