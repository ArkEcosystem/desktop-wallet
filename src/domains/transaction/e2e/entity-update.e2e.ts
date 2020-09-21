import { Selector } from "testcafe";

import { buildTranslations } from "../../../app/i18n/helpers";
import { createFixture, mockRequest } from "../../../utils/e2e-utils";
import { goToMyRegistrations,goToProfile } from "../../profile/e2e/common";
import { goToImportWalletPage } from "./common";

const IpfsFixture = require("../../../tests/fixtures/ipfs/QmRwgWaaEyYgGqp55196TsFDQLW4NZkyTnPwiSVhJ7NPRV.json");

const translations = buildTranslations();

createFixture(`Send Entity Update`, [
	mockRequest(
		{
			url: "https://dwallets.ark.io/api/transactions/search",
			method: "POST",
		},
		require("../../../tests/fixtures/registrations/DC8ghUdhS8w8d11K8cFQ37YsLBFhL3Dq2P-businesses.json"),
	),
	mockRequest("https://platform.ark.io/api/ipfs/QmRwgWaaEyYgGqp55196TsFDQLW4NZkyTnPwiSVhJ7NPRV", IpfsFixture),
	mockRequest(
		{
			url: "https://dwallets.ark.io/api/transactions",
			method: "GET",
		},
		require("../../../tests/fixtures/registrations/DC8ghUdhS8w8d11K8cFQ37YsLBFhL3Dq2P-businesses.json"),
	),
	mockRequest(
		{
			url: "https://dwallets.ark.io/api/transactions",
			method: "POST",
		},
		require("../../../tests/fixtures/coins/ark/transactions/entity-update.json"),
	),
]);

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

const goToSendEntityUpdate = async (t: any) => {
	const businessRowItem = "[data-testid=BusinessRegistrations] [data-testid=TableRow]:last-child";
	await t.expect(Selector(businessRowItem).exists).ok();

	await selectRegistrationOption(businessRowItem, "update", t);

	await t
		.expect(
			Selector("div").withText(translations.TRANSACTION.PAGE_UPDATE_REGISTRATION.FIRST_STEP.BUSINESS.TITLE)
				.exists,
		)
		.ok();
};

test("should navigate to entity update form", async (t: any) => {
	const passphrase = "buddy year cost vendor honey tonight viable nut female alarm duck symptom";

	await goToProfile(t);
	await goToImportWalletPage(t, { passphrase });
	await goToMyRegistrations(t);

	await goToSendEntityUpdate(t);
});

test("should fail validation in first step", async (t: any) => {
	await goToProfile(t);
	await goToImportWalletPage(t);
	await goToMyRegistrations(t);
	await goToSendEntityUpdate(t);

	await t
		.expect(Selector("[data-testid=EntityRegistrationForm__display-name]").value)
		.eql(IpfsFixture.data.meta.displayName);

	const longText =
		"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.";

	// Display name
	// Required
	await t.typeText(Selector("[data-testid=EntityRegistrationForm__display-name]"), " ", { replace: true });
	await t.expect(Selector("[data-testid=EntityRegistrationForm__display-name]").hasAttribute("aria-invalid")).ok();

	// MinLength
	await t.typeText(Selector("[data-testid=EntityRegistrationForm__display-name]"), "ab", { replace: true });
	await t.expect(Selector("[data-testid=EntityRegistrationForm__display-name]").hasAttribute("aria-invalid")).ok();

	// MaxLength
	await t.typeText(Selector("[data-testid=EntityRegistrationForm__display-name]"), longText, {
		replace: true,
		paste: true,
	});
	await t.expect(Selector("[data-testid=EntityRegistrationForm__display-name]").hasAttribute("aria-invalid")).ok();

	// Description field
	// Required
	await t.typeText(Selector("[data-testid=EntityRegistrationForm__description]"), " ", { replace: true });
	await t.expect(Selector("[data-testid=EntityRegistrationForm__description]").hasAttribute("aria-invalid")).ok();

	// MinLength
	await t.typeText(Selector("[data-testid=EntityRegistrationForm__description]"), "ab", { replace: true });
	await t.expect(Selector("[data-testid=EntityRegistrationForm__description]").hasAttribute("aria-invalid")).ok();

	// MaxLength
	await t.typeText(Selector("[data-testid=EntityRegistrationForm__description]"), longText, {
		replace: true,
		paste: true,
	});
	await t.expect(Selector("[data-testid=EntityRegistrationForm__description]").hasAttribute("aria-invalid")).ok();

	// Website field
	// Required
	await t.typeText(Selector("[data-testid=EntityRegistrationForm__website]"), " ", { replace: true });
	await t.expect(Selector("[data-testid=EntityRegistrationForm__website]").hasAttribute("aria-invalid")).ok();

	// Wrong url
	await t.typeText(Selector("[data-testid=EntityRegistrationForm__website]"), "wrong url", { replace: true });
	await t.expect(Selector("[data-testid=EntityRegistrationForm__website]").hasAttribute("aria-invalid")).ok();
});

test("should fail validation on submit to continue in first step", async (t: any) => {
	await goToProfile(t);
	await goToImportWalletPage(t);
	await goToMyRegistrations(t);
	await goToSendEntityUpdate(t);

	await t
		.expect(Selector("[data-testid=EntityRegistrationForm__display-name]").value)
		.eql(IpfsFixture.data.meta.displayName);

	// Empty name field
	await t.typeText(Selector("[data-testid=EntityRegistrationForm__display-name]"), " ", { replace: true });

	await t.hover(Selector("[data-testid=SendEntityUpdate__continue-button]"));
	await t.click(Selector("[data-testid=SendEntityUpdate__continue-button]"));

	await t.expect(Selector("[data-testid=EntityRegistrationForm__display-name]").hasAttribute("aria-invalid")).ok();
});

test("should pass validation on submit and go to 2nd step", async (t: any) => {
	await goToProfile(t);
	await goToImportWalletPage(t);
	await goToMyRegistrations(t);
	await goToSendEntityUpdate(t);

	await t
		.expect(Selector("[data-testid=EntityRegistrationForm__display-name]").value)
		.eql(IpfsFixture.data.meta.displayName);

	// Empty name field
	await t.typeText(Selector("[data-testid=EntityRegistrationForm__display-name]"), "Lorem ipsum", { replace: true });
	await t.typeText(Selector("[data-testid=EntityRegistrationForm__description]"), "Lorem ipsum dolor sit amet", {
		replace: true,
	});
	await t.typeText(Selector("[data-testid=EntityRegistrationForm__website]"), "https://ark.io", { replace: true });

	await t.hover(Selector("[data-testid=SendEntityUpdate__continue-button]"));
	await t.click(Selector("[data-testid=SendEntityUpdate__continue-button]"));

	await t.expect(Selector("[data-testid=ReviewStep]").exists).ok();
});

test("should fail authentication and see error message in toast", async (t: any) => {
	const passphrase = "buddy year cost vendor honey tonight viable nut female alarm duck symptom";

	await goToProfile(t);
	await goToImportWalletPage(t, { passphrase });
	await goToMyRegistrations(t);
	await goToSendEntityUpdate(t);

	await t.hover(Selector("[data-testid=SendEntityUpdate__continue-button]"));
	await t.click(Selector("[data-testid=SendEntityUpdate__continue-button]"));
	await t.expect(Selector("[data-testid=ReviewStep]").exists).ok();

	await t.hover(Selector("[data-testid=SendEntityUpdate__continue-button]"));
	await t.click(Selector("[data-testid=SendEntityUpdate__continue-button]"));
	await t.expect(Selector("[data-testid=AuthenticationStep").exists).ok();

	// mnemonic
	await t.hover(Selector("[data-testid=AuthenticationStep__mnemonic]"));
	await t.typeText(Selector("[data-testid=AuthenticationStep__mnemonic]"), "wrong passphrase", { replace: true });

	await t.hover(Selector("[data-testid=SendEntityUpdate__send-button]"));
	await t.click(Selector("[data-testid=SendEntityUpdate__send-button]"));

	await t.expect(Selector("[data-testid=AuthenticationStep").exists).ok();
	await t.expect(Selector(".Toastify__toast--error").exists).ok();
});

test("should succesfully update entity", async (t: any) => {
	const passphrase = "buddy year cost vendor honey tonight viable nut female alarm duck symptom";

	await goToProfile(t);
	await goToImportWalletPage(t, { passphrase });
	await goToMyRegistrations(t);

	await goToSendEntityUpdate(t);

	await t.hover(Selector("[data-testid=SendEntityUpdate__continue-button]"));
	await t.click(Selector("[data-testid=SendEntityUpdate__continue-button]"));
	await t.expect(Selector("[data-testid=ReviewStep]").exists).ok();

	await t.hover(Selector("[data-testid=SendEntityUpdate__continue-button]"));
	await t.click(Selector("[data-testid=SendEntityUpdate__continue-button]"));
	await t.expect(Selector("[data-testid=AuthenticationStep").exists).ok();

	// mnemonic
	await t.hover(Selector("[data-testid=AuthenticationStep__mnemonic]"));
	await t.typeText(Selector("[data-testid=AuthenticationStep__mnemonic]"), passphrase, { replace: true });

	await t.hover(Selector("[data-testid=SendEntityUpdate__send-button]"));
	await t.click(Selector("[data-testid=SendEntityUpdate__send-button]"));

	await t.expect(Selector("[data-testid=TransactionSuccessful").exists).ok();
});
