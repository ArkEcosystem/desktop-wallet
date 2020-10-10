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

export const goToResignDelegatePage = async (t: any) => {
	const delegateDropdown = Selector("[data-testid=DelegateRowItem__actions] [data-testid=dropdown__toggle]");
	await t.expect(delegateDropdown.exists).ok();

	await t.hover(delegateDropdown);
	await t.click(delegateDropdown);

	const delegateResignOption = Selector("[data-testid=DelegateRowItem__actions] [data-testid=dropdown__option--1]");
	await t.click(delegateResignOption);

	await t
		.expect(
			Selector("div").withText(translations.TRANSACTION.PAGE_RESIGN_REGISTRATION.FIRST_STEP.DELEGATE.TITLE)
				.exists,
		)
		.ok();
};
