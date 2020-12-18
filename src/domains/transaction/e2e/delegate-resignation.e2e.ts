import { Selector } from "testcafe";

import { createFixture, mockRequest } from "../../../utils/e2e-utils";
import { goToDelegateResignationPage } from "./common";

createFixture(`Delegate Resignation action`, [
	mockRequest(
		{
			url: "https://dwallets.ark.io/api/transactions",
			method: "POST",
		},
		{
			data: {
				accept: ["transaction-id"],
				broadcast: ["transaction-id"],
				excess: [],
				invalid: [],
			},
		},
	),
]);

test("should fail delegate resignation submission", async (t: any) => {
	await goToWallet(t, "D5sRKWckH4rE1hQ9eeMeHAepgyC3cvJtwb");
	await goToDelegateResignationPage(t);

	const continueBtn = "[data-testid=SendDelegateResignation__continue-button]";

	// Go to step 2
	await t.hover(Selector(continueBtn));
	await t.click(Selector(continueBtn));

	// Go to step 3 (authentication)
	await t.hover(Selector(continueBtn));
	await t.click(Selector(continueBtn));

	// Type wrong mnemonic
	await t.typeText(Selector("[data-testid=AuthenticationStep__mnemonic]"), "wrong mnemonic", { replace: true });

	await t.typeText(Selector("[data-testid=AuthenticationStep__second-mnemonic]"), "wrong second mnemonic", {
		replace: true,
	});

	const sendButton = "[data-testid=SendDelegateResignation__send-button]";
	await t.click(Selector(sendButton));

	await t.expect(Selector("[data-testid=AuthenticationStep__mnemonic]").hasAttribute("aria-invalid")).ok();
});

test("should successfully submit delegate resignation", async (t) => {
	await goToWallet(t, "D5sRKWckH4rE1hQ9eeMeHAepgyC3cvJtwb");
	await goToDelegateResignationPage(t);

	const continueButton = "[data-testid=SendDelegateResignation__continue-button]";

	// Go to step 2
	await t.hover(Selector(continueButton));
	await t.click(Selector(continueButton));

	// Go to step 3 (authentication)
	await t.hover(Selector(continueButton));
	await t.click(Selector(continueButton));

	await t.typeText(Selector("[data-testid=AuthenticationStep__mnemonic]"), "v3wallet2", { replace: true });
	await t.typeText(
		Selector("[data-testid=AuthenticationStep__second-mnemonic]"),
		"merge warfare desk catch produce typical young submit enemy wool off card",
		{ replace: true },
	);

	const sendButton = "[data-testid=SendDelegateResignation__send-button]";
	await t.click(Selector(sendButton));

	await t.expect(Selector("[data-testid=SendDelegateResignation__summary-step]").exists).ok();
});
