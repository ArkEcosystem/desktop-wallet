import { Selector } from "testcafe";

import { buildTranslations } from "../../../app/i18n/helpers";
import { createFixture, scrollToTop } from "../../../utils/e2e-utils";
import { goToProfile } from "../../profile/e2e/common";
import { goToWallet } from "./common";

const translations = buildTranslations();

createFixture(`Verify Message`).beforeEach(async (t) => {
	await goToProfile(t);
	await goToWallet(t);
});

test("Should open and cancel verify message modal", async (t) => {
	await scrollToTop();

	// Click verify message option in dropdown menu
	await t.click(Selector('[data-testid="WalletHeader__more-button"]'));
	await t.click(
		Selector('[data-testid="WalletHeader__more-button"] li').withText(
			translations.WALLETS.MODAL_VERIFY_MESSAGE.TITLE,
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
			translations.WALLETS.MODAL_VERIFY_MESSAGE.TITLE,
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
			translations.WALLETS.MODAL_VERIFY_MESSAGE.TITLE,
		),
	);

	const mockFailingMessage = {
		signatory: "03df6cd794a7d404db4f1b25816d8976d0e72c5177d17ac9b19a92703b62cdbbbc",
		signature:
			"2f8a569a753be5d7a66ea7ce34ff8e8e59e328241d99b05257c30bffef18206950b642bba15ccb52272eaeb35e142d24d7076a6f5864a01df615f6c6c9c0a414",
		message: "Wrong message",
	};

	await t.typeText(Selector("[data-testid=VerifyMessage_message-content]"), JSON.stringify(mockFailingMessage));

	await t.click(Selector("[data-testid=VerifyMessage__submit]"));
	await t
		.expect(
			Selector("[data-testid=modal__inner]").withText(translations.WALLETS.MODAL_VERIFY_MESSAGE.FAIL_TITLE)
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
			translations.WALLETS.MODAL_VERIFY_MESSAGE.TITLE,
		),
	);

	const mockSuccessMessage = {
		signatory: "03df6cd794a7d404db4f1b25816d8976d0e72c5177d17ac9b19a92703b62cdbbbc",
		signature:
			"2f8a569a753be5d7a66ea7ce34ff8e8e59e328241d99b05257c30bffef18206950b642bba15ccb52272eaeb35e142d24d7076a6f5864a01df615f6c6c9c0a414",
		message: "Hello world",
	};

	await t.typeText(Selector("[data-testid=VerifyMessage_message-content]"), JSON.stringify(mockSuccessMessage));

	await t.click(Selector("[data-testid=VerifyMessage__submit]"));
	await t
		.expect(
			Selector("[data-testid=modal__inner]").withText(translations.WALLETS.MODAL_VERIFY_MESSAGE.SUCCESS_TITLE)
				.exists,
		)
		.ok();
});
