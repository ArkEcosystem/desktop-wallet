import { createFixture, getLocation } from "../../../utils/e2e-utils";
import { goToProfile } from "../../profile/e2e/common";

// const translations = buildTranslations();

createFixture("Dashboard routing").beforeEach(async (t) => await goToProfile(t));

test("should navigate to dashboard", async (t) => {
	await t.expect(getLocation()).contains("/dashboard");
});

// TODO: In ci, password protected profile is failing to restore and enter dashboard, possibly due to container.bind('State<Profile', profile)
//		 and password-protected profile restoration, causing endless timeouts. Could be enabled again once the container bind issue is resolved in tests

// test("should navigate to dashboard of password protected profile", async (t) => {
// 	await t.expect(Selector("span").withText("Jane Doe").exists).ok({ timeout: 60000 });
// 	await t.click(Selector("span").withText("Jane Doe"));
// 	await t
// 		.expect(Selector('[data-testid="modal__inner"]').withText(translations.PROFILE.MODAL_SIGN_IN.TITLE).exists)
// 		.ok();
//
// 	await t.typeText(Selector('[data-testid="SignIn__input--password"]'), "password");
// 	await t.click(Selector('[data-testid="SignIn__submit-button"]'));
//
// 	await t.expect(Selector("div").withText(translations.COMMON.WALLETS).exists).ok({ timeout: 60000 });
// 	await t.expect(getLocation()).contains("/dashboard");
// });
