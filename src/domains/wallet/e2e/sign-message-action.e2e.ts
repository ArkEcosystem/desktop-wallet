import { Selector } from "testcafe";

import { buildTranslations } from "../../../app/i18n/helpers";
import { createFixture, scrollToTop } from "../../../utils/e2e-utils";
import { goToProfile } from "../../profile/e2e/common";
import { goToWallet } from "./common";

const translations = buildTranslations();

createFixture(`Sign Message`).beforeEach(async (t) => {
	await goToProfile(t);
	await goToWallet(t);
});

test("Should open and close sign message modal", async (t) => {
	await scrollToTop();

	// Click sign message option in dropdown menu
	await t.click(Selector('[data-testid="WalletHeader__more-button"]'));
	await t.click(
		Selector('[data-testid="WalletHeader__more-button"] li').withText(
			translations.WALLETS.PAGE_WALLET_DETAILS.OPTIONS.SIGN_MESSAGE,
		),
	);

	await t.expect(Selector("[data-testid=modal__inner]").exists).ok();
	await t.expect(Selector('[data-testid="modal__close-btn"]').exists).ok();
	await t.click(Selector('[data-testid="modal__close-btn"]'));
	await t.expect(Selector("[data-testid=modal__inner]").exists).notOk();
});

test("Should open and cancel sign message modal", async (t) => {
	await scrollToTop();

	// Click sign message option in dropdown menu
	await t.click(Selector('[data-testid="WalletHeader__more-button"]'));
	await t.click(
		Selector('[data-testid="WalletHeader__more-button"] li').withText(
			translations.WALLETS.PAGE_WALLET_DETAILS.OPTIONS.SIGN_MESSAGE,
		),
	);

	await t.expect(Selector("[data-testid=modal__inner]").exists).ok();
	await t.expect(Selector("[data-testid=SignMessage__cancel]").exists).ok();
	await t.click(Selector("[data-testid=SignMessage__cancel]"));
	await t.expect(Selector("[data-testid=modal__inner]").exists).notOk();
});

test("Should successfully sign message", async (t) => {
	await scrollToTop();

	// Click sign message option in dropdown menu
	await t.click(Selector('[data-testid="WalletHeader__more-button"]'));
	await t.click(
		Selector('[data-testid="WalletHeader__more-button"] li').withText(
			translations.WALLETS.PAGE_WALLET_DETAILS.OPTIONS.SIGN_MESSAGE,
		),
	);

	await t.typeText(Selector("input[name=message]"), "Hello World");
	await t.typeText(Selector("input[name=mnemonic]"), "this is a top secret passphrase");
	await t.click(Selector("[data-testid=SignMessage__submit-button]"));
	await t.expect(Selector("h2").withText(translations.WALLETS.MODAL_SIGN_MESSAGE.SIGNED_STEP.TITLE).exists).ok();
	await t.click(Selector("[data-testid=modal__close-btn]"));
});
