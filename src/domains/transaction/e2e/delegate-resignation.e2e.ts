import { Selector } from "testcafe";

import { createFixture } from "../../../utils/e2e-utils";
import { goToMyRegistrations } from "../../profile/e2e/common";
import { goToResignDelegatePage } from "./common";
import { transactionsMock, walletMock } from "./mocks";

createFixture(`Delegate Registration action`).beforeEach(async (t) => await goToMyRegistrations(t));

test("should fail delegate resignation submittion", async (t: any) => {
	await goToResignDelegatePage(t);
	const continueBtn = "[data-testid=ResignRegistration__continue-button]";

	// Go to step 2
	await t.hover(Selector(continueBtn));
	await t.click(Selector(continueBtn));

	// Go to step 3 (authentication)
	await t.hover(Selector(continueBtn));
	await t.click(Selector(continueBtn));

	// Type wrong mnemonic
	await t.typeText(Selector("[data-testid=ResignRegistration__mnemonic]"), "wrong mnemonic", { replace: true });

	const sendButton = "[data-testid=ResignRegistration__send-button]";
	await t.click(Selector(sendButton));

	await t.expect(Selector("[data-testid=ResignRegistration__mnemonic]").hasAttribute("aria-invalid")).ok();
});

test("should successfully submit delegate resignation", async (t) => {
	await goToResignDelegatePage(t);
	const continueButton = "[data-testid=ResignRegistration__continue-button]";

	// Go to step 2
	await t.hover(Selector(continueButton));
	await t.click(Selector(continueButton));

	// Go to step 3 (authentication)
	await t.hover(Selector(continueButton));
	await t.click(Selector(continueButton));

	await t.typeText(Selector("[data-testid=ResignRegistration__mnemonic]"), "v3wallet2", { replace: true });

	transactionsMock();
	walletMock("D5sRKWckH4rE1hQ9eeMeHAepgyC3cvJtwb");

	const sendButton = "[data-testid=ResignRegistration__send-button]";
	await t.click(Selector(sendButton));

	await t.expect(Selector("[data-testid=ResignRegistration__fourth-step]").exists).ok();
});
