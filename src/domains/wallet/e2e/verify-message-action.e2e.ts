import { Selector } from "testcafe";

import { buildTranslations } from "../../../app/i18n/helpers";
import { createFixture, scrollToTop } from "../../../utils/e2e-utils";
import { goToProfile } from "../../profile/e2e/common";
import { goToWallet } from "./common";

const translations = buildTranslations();

createFixture("Verify Message").beforeEach(async (t) => {
	await goToProfile(t);
	await goToWallet(t);
});

test("Should open and cancel verify message modal", async (t) => {
	await scrollToTop();

	// Click verify message option in dropdown menu
	await t.click(Selector('[data-testid="WalletHeader__more-button"]'));
	await t.click(
		Selector('[data-testid="WalletHeader__more-button"] li').withText(
			translations.WALLETS.PAGE_WALLET_DETAILS.OPTIONS.VERIFY_MESSAGE,
		),
	);

	await t.expect(Selector("[data-testid=modal__inner]").exists).ok();
	await t.expect(Selector("[data-testid=VerifyMessage__cancel]").exists).ok();
	await t.click(Selector("[data-testid=VerifyMessage__cancel]"));
	await t.expect(Selector("[data-testid=modal__inner]").exists).notOk();
});

test("Should open and close verify message modal", async (t) => {
	await scrollToTop();

	// Click verify message option in dropdown menu
	await t.click(Selector('[data-testid="WalletHeader__more-button"]'));
	await t.click(
		Selector('[data-testid="WalletHeader__more-button"] li').withText(
			translations.WALLETS.PAGE_WALLET_DETAILS.OPTIONS.VERIFY_MESSAGE,
		),
	);

	await t.expect(Selector("[data-testid=modal__inner]").exists).ok();
	await t.expect(Selector('[data-testid="modal__close-btn"]').exists).ok();
	await t.click(Selector('[data-testid="modal__close-btn"]'));
	await t.expect(Selector("[data-testid=modal__inner]").exists).notOk();
});

test("Should fail verification", async (t) => {
	await scrollToTop();

	// Click verify message option in dropdown menu
	await t.click(Selector('[data-testid="WalletHeader__more-button"]'));
	await t.click(
		Selector('[data-testid="WalletHeader__more-button"] li').withText(
			translations.WALLETS.PAGE_WALLET_DETAILS.OPTIONS.VERIFY_MESSAGE,
		),
	);

	const mockFailingMessage = {
		message: "Wrong message",
		signatory: "03df6cd794a7d404db4f1b25816d8976d0e72c5177d17ac9b19a92703b62cdbbbc",
		signature:
			"7915d8c22ec9dab41bd93d9e003970b2f6aaa5d9a5e837d4d17847308f6e880f31e2c1ad141d9b080d9a151baa31dcd36dd05faa51e5db95586d630b66485e1e",
	};

	await t.click(Selector("input[type=checkbox]").parent());

	await t.typeText(Selector("[data-testid=VerifyMessage__json-jsonString]"), JSON.stringify(mockFailingMessage));

	await t.click(Selector("[data-testid=VerifyMessage__submit]"));
	await t
		.expect(
			Selector("[data-testid=modal__inner]").withText(translations.WALLETS.MODAL_VERIFY_MESSAGE.ERROR.TITLE)
				.exists,
		)
		.ok();
});

test("Should successfully verify message", async (t) => {
	await scrollToTop();

	// Click verify message option in dropdown menu
	await t.click(Selector('[data-testid="WalletHeader__more-button"]'));
	await t.click(
		Selector('[data-testid="WalletHeader__more-button"] li').withText(
			translations.WALLETS.PAGE_WALLET_DETAILS.OPTIONS.VERIFY_MESSAGE,
		),
	);

	const mockSuccessMessage = {
		message: "Hello World",
		signatory: "03df6cd794a7d404db4f1b25816d8976d0e72c5177d17ac9b19a92703b62cdbbbc",
		signature:
			"7915d8c22ec9dab41bd93d9e003970b2f6aaa5d9a5e837d4d17847308f6e880f31e2c1ad141d9b080d9a151baa31dcd36dd05faa51e5db95586d630b66485e1e",
	};

	await t.click(Selector("input[type=checkbox]").parent());

	await t.typeText(Selector("[data-testid=VerifyMessage__json-jsonString]"), JSON.stringify(mockSuccessMessage));

	await t.click(Selector("[data-testid=VerifyMessage__submit]"));
	await t
		.expect(
			Selector("[data-testid=modal__inner]").withText(translations.WALLETS.MODAL_VERIFY_MESSAGE.SUCCESS.TITLE)
				.exists,
		)
		.ok();
});
