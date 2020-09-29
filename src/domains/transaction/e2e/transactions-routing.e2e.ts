import { Selector } from "testcafe";

import { buildTranslations } from "../../../app/i18n/helpers";
import { createFixture } from "../../../utils/e2e-utils";
import { goToMyRegistrations, goToProfile } from "../../profile/e2e/common";
import { goToWallet } from "../../wallet/e2e/common";
import { goToRegistrationPage, goToResignDelegatePage, goToTransferPage } from "./common";

const translations = buildTranslations();

createFixture(`Transactions routing`);

test("should navigate to transfer page", async (t) => {
	await goToWallet(t);
	await goToTransferPage(t);
});

test("should navigate to my registrations page", async (t) => {
	await goToWallet(t);

	// Go to my registrations page
	await t.click(Selector("[data-testid=WalletRegistrations__button]"));
	await t.expect(Selector("h1").withText(translations.PROFILE.PAGE_MY_REGISTRATIONS.TITLE).exists).ok();
});

test("should navigate to registration page", async (t) => {
	await goToWallet(t);
	await goToRegistrationPage(t);
});

test("should navigate to delegate resignation page", async (t) => {
	await goToProfile(t);
	await goToMyRegistrations(t);
	await goToResignDelegatePage(t);
});
