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
		signatory: "034151a3ec46b5670a682b0a63394f863587d1bc97483b1b6c70eb58e7f0aed192",
		signature:
			"2521d2ebe067546920bec3becc581d4d8186d4d2431980b34834ad3d3945be6ed32d10b6499307ba499b72448c971516a9e2be96c79cbf2ad5948b06c1ab242a",
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
		signatory: "034151a3ec46b5670a682b0a63394f863587d1bc97483b1b6c70eb58e7f0aed192",
		signature:
			"2521d2ebe067546920bec3becc581d4d8186d4d2431980b34834ad3d3945be6ed32d10b6499307ba499b72448c971516a9e2be96c79cbf2ad5948b06c1ab242a",
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
