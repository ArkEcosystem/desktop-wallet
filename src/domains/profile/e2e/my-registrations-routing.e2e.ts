import { Selector } from "testcafe";

import { buildTranslations } from "../../../app/i18n/helpers";
import { getPageURL } from "../../../utils/e2e-utils";
import { goToMyRegistrations,goToProfile } from "./common";

const translations = buildTranslations();

fixture`My Registrations`.page(getPageURL());

test("should navigate to my registrations page", async (t) => {
	await goToProfile(t);
	// Navigate to wallet details page
	await t.hover(Selector("[data-testid=WalletCard__D5sRKWckH4rE1hQ9eeMeHAepgyC3cvJtwb]"));
	await t.click(Selector("[data-testid=WalletCard__D5sRKWckH4rE1hQ9eeMeHAepgyC3cvJtwb]"));
	await t.expect(Selector("[data-testid=WalletHeader]").exists).ok();

	await t.hover(Selector("[data-testid=WalletRegistrations__show-all]"));
	await t.click(Selector("[data-testid=WalletRegistrations__show-all]"));

	await t.expect(Selector("[data-testid=header__title]").exists).ok();
	await t
		.expect(
			Selector("[data-testid=header__title]").withText(translations.PROFILE.PAGE_MY_REGISTRATIONS.TITLE).exists,
		)
		.ok();
});

test("should navigate to my registrations from navigation bar", goToMyRegistrations);

test("should render delegates list", async (t: any) => {
	await goToMyRegistrations(t);

	await t.expect(Selector("[data-testid=DelegateRowItem]").exists).ok();
});

test("should handle delegate update action", async (t: any) => {
	await goToMyRegistrations(t);

	await t.expect(Selector("[data-testid=DelegateRowItem]").exists).ok();
	await t.expect(Selector("[data-testid=DelegateRowItem] [data-testid=dropdown__toggle]").exists).ok();

	await t.hover(Selector("[data-testid=DelegateRowItem] [data-testid=dropdown__toggle]"));
	await t.click(Selector("[data-testid=DelegateRowItem] [data-testid=dropdown__toggle]"));
	// Update option
	await t.click(Selector("[data-testid=DelegateRowItem] [data-testid=dropdown__option--0]"));

	await t
		.expect(
			Selector("div").withText(translations.TRANSACTION.PAGE_UPDATE_REGISTRATION.FIRST_STEP.BUSINESS.TITLE)
				.exists,
		)
		.ok();
});

test("should handle delegate resign action", async (t: any) => {
	await goToMyRegistrations(t);

	await t.expect(Selector("[data-testid=DelegateRowItem]").exists).ok();
	await t.expect(Selector("[data-testid=DelegateRowItem] [data-testid=dropdown__toggle]").exists).ok();

	await t.hover(Selector("[data-testid=DelegateRowItem] [data-testid=dropdown__toggle]"));
	await t.click(Selector("[data-testid=DelegateRowItem] [data-testid=dropdown__toggle]"));
	// Update option
	await t.click(Selector("[data-testid=DelegateRowItem] [data-testid=dropdown__option--1]"));

	await t
		.expect(
			Selector("div").withText(translations.TRANSACTION.PAGE_RESIGN_REGISTRATION.FIRST_STEP.DELEGATE.TITLE)
				.exists,
		)
		.ok();
});

test("should render business registrations list", async (t: any) => {
	await goToMyRegistrations(t);

	await t.expect(Selector("[data-testid=BusinessRegistrationRowItem]").exists).ok();
});

test("should handle busines registration update action", async (t: any) => {
	await goToMyRegistrations(t);

	await t.expect(Selector("[data-testid=BusinessRegistrationRowItem]").exists).ok();
	await t.expect(Selector("[data-testid=BusinessRegistrationRowItem] [data-testid=dropdown__toggle]").exists).ok();

	await t.hover(Selector("[data-testid=BusinessRegistrationRowItem] [data-testid=dropdown__toggle]"));
	await t.click(Selector("[data-testid=BusinessRegistrationRowItem] [data-testid=dropdown__toggle]"));
	// Update option
	await t.click(Selector("[data-testid=BusinessRegistrationRowItem] [data-testid=dropdown__option--0]"));

	await t
		.expect(
			Selector("div").withText(translations.TRANSACTION.PAGE_UPDATE_REGISTRATION.FIRST_STEP.BUSINESS.TITLE)
				.exists,
		)
		.ok();
});

test("should handle business registration resign action", async (t: any) => {
	await goToMyRegistrations(t);

	await t.expect(Selector("[data-testid=BusinessRegistrationRowItem]").exists).ok();
	await t.expect(Selector("[data-testid=BusinessRegistrationRowItem] [data-testid=dropdown__toggle]").exists).ok();

	await t.hover(Selector("[data-testid=BusinessRegistrationRowItem] [data-testid=dropdown__toggle]"));
	await t.click(Selector("[data-testid=BusinessRegistrationRowItem] [data-testid=dropdown__toggle]"));
	// Update option
	await t.click(Selector("[data-testid=BusinessRegistrationRowItem] [data-testid=dropdown__option--1]"));

	await t
		.expect(
			Selector("div").withText(translations.TRANSACTION.PAGE_RESIGN_REGISTRATION.FIRST_STEP.DELEGATE.TITLE)
				.exists,
		)
		.ok();
});
