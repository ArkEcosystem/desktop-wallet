import { Selector } from "testcafe";

import { buildTranslations } from "../../../app/i18n/helpers";
import { createFixture } from "../../../utils/e2e-utils";
import { goToMyRegistrations, goToProfile } from "./common";

const translations = buildTranslations();

createFixture(`My Registrations`);

const selectRegistrationOption = async (rowSelector: string, optionLabel: string, t: any) => {
	const dropdownToggle = `${rowSelector} [data-testid=dropdown__toggle]`;

	const optionTestId: { [key: string]: string } = { resign: "dropdown__option--1", update: "dropdown__option--0" };
	const dropdownOption = `${rowSelector} [data-testid=${optionTestId[optionLabel]}]`;

	await t.expect(Selector(rowSelector).exists).ok();
	await t.expect(Selector(dropdownToggle).exists).ok();

	await t.hover(Selector(dropdownToggle));
	await t.click(Selector(dropdownToggle));

	// Select Option
	await t.click(Selector(dropdownOption));
};

test("should navigate to my registrations page", async (t) => {
	await goToProfile(t);
	// Navigate to wallet details page
	await t.hover(Selector("[data-testid=WalletCard__D5sRKWckH4rE1hQ9eeMeHAepgyC3cvJtwb]"));
	await t.click(Selector("[data-testid=WalletCard__D5sRKWckH4rE1hQ9eeMeHAepgyC3cvJtwb]"));
	await t.expect(Selector("[data-testid=WalletHeader]").exists).ok();

	await t.hover(Selector("[data-testid=WalletRegistrations__button]"));
	await t.click(Selector("[data-testid=WalletRegistrations__button]"));

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
	await t.expect(Selector("[data-testid=DelegateRegistrations]").exists).ok();
});

test("should handle delegate update action", async (t: any) => {
	await goToMyRegistrations(t);

	const delegateRowItem = "[data-testid=DelegateRegistrations] [data-testid=TableRow]";
	await selectRegistrationOption(delegateRowItem, "update", t);

	await t
		.expect(
			Selector("div").withText(translations.TRANSACTION.PAGE_UPDATE_REGISTRATION.FIRST_STEP.BUSINESS.TITLE)
				.exists,
		)
		.ok();
});

test("should handle delegate resign action", async (t: any) => {
	await goToMyRegistrations(t);

	const delegateRowItem = "[data-testid=DelegateRegistrations] [data-testid=TableRow]";
	await selectRegistrationOption(delegateRowItem, "resign", t);

	await t
		.expect(
			Selector("div").withText(translations.TRANSACTION.PAGE_RESIGN_REGISTRATION.FIRST_STEP.DELEGATE.TITLE)
				.exists,
		)
		.ok();
});

test("should render business registrations list", async (t: any) => {
	await goToMyRegistrations(t);
	await t.expect(Selector("[data-testid=BusinessRegistrations] [data-testid=TableRow]").exists).ok();
});

test("should handle business registration update action", async (t: any) => {
	await goToMyRegistrations(t);

	const businessRowItem = "[data-testid=BusinessRegistrations] [data-testid=TableRow]:nth-child(1)";
	await selectRegistrationOption(businessRowItem, "update", t);

	await t
		.expect(
			Selector("div").withText(translations.TRANSACTION.PAGE_UPDATE_REGISTRATION.FIRST_STEP.BUSINESS.TITLE)
				.exists,
		)
		.ok();
});

test("should handle business registration resign action", async (t: any) => {
	await goToMyRegistrations(t);

	const businessRowItem = "[data-testid=BusinessRegistrations] [data-testid=TableRow]:nth-child(1)";
	await selectRegistrationOption(businessRowItem, "resign", t);

	await t
		.expect(
			Selector("div").withText(translations.TRANSACTION.PAGE_RESIGN_REGISTRATION.FIRST_STEP.ENTITY.TITLE).exists,
		)
		.ok();
});

test("should render plugin registrations list", async (t: any) => {
	await goToMyRegistrations(t);
	await t.expect(Selector("[data-testid=PluginRegistrations] [data-testid=TableRow]").exists).ok();
});

test("should handle plugin registration update action", async (t: any) => {
	await goToMyRegistrations(t);

	const pluginRowItem = "[data-testid=PluginRegistrations] [data-testid=TableRow]";
	await selectRegistrationOption(pluginRowItem, "update", t);

	await t
		.expect(
			Selector("div").withText(translations.TRANSACTION.PAGE_UPDATE_REGISTRATION.FIRST_STEP.BUSINESS.TITLE)
				.exists,
		)
		.ok();
});

test("should handle plugin registration resign action", async (t: any) => {
	await goToMyRegistrations(t);

	const pluginRowItem = "[data-testid=PluginRegistrations] [data-testid=TableRow]";
	await selectRegistrationOption(pluginRowItem, "resign", t);

	await t
		.expect(
			Selector("div").withText(translations.TRANSACTION.PAGE_RESIGN_REGISTRATION.FIRST_STEP.ENTITY.TITLE).exists,
		)
		.ok();
});
