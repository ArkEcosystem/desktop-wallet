import { Selector } from "testcafe";

import { buildTranslations } from "../../../app/i18n/helpers";
import { createFixture, getLocation, scrollToTop } from "../../../utils/e2e-utils";
import { goToProfile } from "../../profile/e2e/common";
import { goToWallet } from "./common";

const translations = buildTranslations();

createFixture(`Delete Wallet action`).beforeEach(async (t) => {
	await goToProfile(t);
	await goToWallet(t);
});

test("Should open and cancel deletion modal in wallet detail page", async (t) => {
	await scrollToTop();

	// Click delete message in dropdown menu
	await t.click(Selector('[data-testid="WalletHeader__more-button"]'));
	await t.click(Selector('[data-testid="WalletHeader__more-button"] li').withText(translations.COMMON.DELETE));

	await t.expect(Selector("[data-testid=modal__inner]").exists).ok();
	await t.expect(Selector("[data-testid=DeleteResource__cancel-button]").exists).ok();
	await t.click(Selector('[data-testid="DeleteResource__cancel-button"]'));
	await t.expect(Selector("[data-testid=modal__inner]").exists).notOk();
});

test("Should open and close deletion modal in wallet detail page", async (t) => {
	await scrollToTop();

	// Click delete message in dropdown menu
	await t.click(Selector('[data-testid="WalletHeader__more-button"]'));
	await t.click(Selector('[data-testid="WalletHeader__more-button"] li').withText(translations.COMMON.DELETE));

	await t.expect(Selector("[data-testid=modal__inner]").exists).ok();
	await t.expect(Selector('[data-testid="modal__close-btn"]').exists).ok();
	await t.click(Selector('[data-testid="modal__close-btn"]'));
	await t.expect(Selector("[data-testid=modal__inner]").exists).notOk();
});

test("Should delete wallet from wallet details page", async (t) => {
	await scrollToTop();

	// Click delete message in dropdown menu
	await t.click(Selector('[data-testid="WalletHeader__more-button"]'));
	await t.click(Selector('[data-testid="WalletHeader__more-button"] li').withText(translations.COMMON.DELETE));

	await t.expect(Selector("[data-testid=modal__inner]").exists).ok();
	await t.expect(Selector("[data-testid=DeleteResource__submit-button]").exists).ok();
	await t.click(Selector('[data-testid="DeleteResource__submit-button"]'));
	await t.expect(Selector("[data-testid=modal__inner]").exists).notOk();
	await t.expect(getLocation()).contains("/dashboard");
});
