import { Selector } from "testcafe";

import { buildTranslations } from "../../../app/i18n/helpers";

const translations = buildTranslations();

export const gotoResignDelegatePage = async (t: any) => {
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
