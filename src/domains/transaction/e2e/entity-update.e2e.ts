import { Selector } from "testcafe";

import { buildTranslations } from "../../../app/i18n/helpers";
import { createFixture, mockRequest } from "../../../utils/e2e-utils";
import { goToMyRegistrations } from "../../profile/e2e/common";

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
	await goToMyRegistrations(t);

	// Select update action for business
	const businessRowItem = "[data-testid=BusinessRegistrations] [data-testid=EntityTableRowItem]:nth-child(1)";
	await selectRegistrationOption(businessRowItem, "update", t);

	await t
		.expect(
			Selector("div").withText(translations.TRANSACTION.PAGE_UPDATE_REGISTRATION.FIRST_STEP.BUSINESS.TITLE)
				.exists,
		)
		.ok();
};

test("should navigate to update entity registration", async (t: any) => goToSendEntityUpdate(t));

test("should render 1st step filled with entity values", async (t: any) => {
	await goToSendEntityUpdate(t);
	await t.expect(Selector("[data-testid=SendEntityUpdate__name]").value).eql(IpfsFixture.data.meta.displayName);
	await t
		.expect(Selector("[data-testid=SendEntityUpdate__description]").value)
		.eql(IpfsFixture.data.meta.description);

	// Open and check Repository links to be 4
	await t.click(Selector("[data-testid=LinkCollection__header]").nth(0));
	await t.expect(Selector("[data-testid=LinkCollection__remove-link]").count).eql(4);
	await t.click(Selector("[data-testid=LinkCollection__header]").nth(0));

	// Check social media links to be 12
	await t.click(Selector("[data-testid=LinkCollection__header]").nth(1));
	await t.expect(Selector("[data-testid=LinkCollection__remove-link]").count).eql(11);
	await t.click(Selector("[data-testid=LinkCollection__header]").nth(1));
});

test("should fail validation", async (t: any) => {
	await goToSendEntityUpdate(t);
	await t.expect(Selector("[data-testid=SendEntityUpdate__name]").value).eql(IpfsFixture.data.meta.displayName);

	const longText =
		"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.";

	// Name field
	// Required
	await t.typeText(Selector("[data-testid=SendEntityUpdate__name]"), " ", { replace: true });
	await t.expect(Selector("[data-testid=SendEntityUpdate__name]").hasAttribute("aria-invalid")).ok();

	// MinLength
	await t.typeText(Selector("[data-testid=SendEntityUpdate__name]"), "ab", { replace: true });
	await t.expect(Selector("[data-testid=SendEntityUpdate__name]").hasAttribute("aria-invalid")).ok();

	// MaxLength
	await t.typeText(Selector("[data-testid=SendEntityUpdate__name]"), longText, { replace: true, paste: true });
	await t.expect(Selector("[data-testid=SendEntityUpdate__name]").hasAttribute("aria-invalid")).ok();

	// Description field
	// Required
	await t.typeText(Selector("[data-testid=SendEntityUpdate__description]"), " ", { replace: true });
	await t.expect(Selector("[data-testid=SendEntityUpdate__description]").hasAttribute("aria-invalid")).ok();

	// MinLength
	await t.typeText(Selector("[data-testid=SendEntityUpdate__description]"), "ab", { replace: true });
	await t.expect(Selector("[data-testid=SendEntityUpdate__description]").hasAttribute("aria-invalid")).ok();

	// MaxLength
	await t.typeText(Selector("[data-testid=SendEntityUpdate__description]"), longText, { replace: true, paste: true });
	await t.expect(Selector("[data-testid=SendEntityUpdate__description]").hasAttribute("aria-invalid")).ok();

	// Website field
	// Required
	await t.typeText(Selector("[data-testid=SendEntityUpdate__website]"), " ", { replace: true });
	await t.expect(Selector("[data-testid=SendEntityUpdate__website]").hasAttribute("aria-invalid")).ok();

	// Wrong url
	await t.typeText(Selector("[data-testid=SendEntityUpdate__website]"), "wrong url", { replace: true });
	await t.expect(Selector("[data-testid=SendEntityUpdate__website]").hasAttribute("aria-invalid")).ok();
});

test("should fail validation on submit to continue", async (t: any) => {
	await goToSendEntityUpdate(t);
	await t.expect(Selector("[data-testid=SendEntityUpdate__name]").value).eql(IpfsFixture.data.meta.displayName);

	// Empty name field
	await t.typeText(Selector("[data-testid=SendEntityUpdate__name]"), " ", { replace: true });

	await t.hover(Selector("[data-testid=SendEntityUpdate__continue-button]"));
	await t.click(Selector("[data-testid=SendEntityUpdate__continue-button]"));

	await t.expect(Selector("[data-testid=SendEntityUpdate__first-step]").exists).ok();
	await t.expect(Selector("[data-testid=SendEntityUpdate__name]").hasAttribute("aria-invalid")).ok();
});

test("should pass validation on submit and go to 2nd step", async (t: any) => {
	await goToSendEntityUpdate(t);
	await t.expect(Selector("[data-testid=SendEntityUpdate__name]").value).eql(IpfsFixture.data.meta.displayName);

	// Empty name field
	await t.typeText(Selector("[data-testid=SendEntityUpdate__name]"), "Lorem ipsum", { replace: true });
	await t.typeText(Selector("[data-testid=SendEntityUpdate__description]"), "Lorem ipsum dolor sit amet", {
		replace: true,
	});
	await t.typeText(Selector("[data-testid=SendEntityUpdate__website]"), "https://ark.io", { replace: true });

	await t.hover(Selector("[data-testid=SendEntityUpdate__continue-button]"));
	await t.click(Selector("[data-testid=SendEntityUpdate__continue-button]"));

	await t.expect(Selector("[data-testid=SendEntityUpdate__second-step]").exists).ok();
});
