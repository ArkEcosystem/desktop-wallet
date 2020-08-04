import { ClientFunction, Selector } from "testcafe";

import { buildTranslations } from "../../../app/i18n/helpers";

fixture`Verify Message`.page`http://localhost:3000/`;

const scrollTop = ClientFunction(() => {
	window.scrollTo({ top: 0 });
});

test("Should open and cancel verify message modal", async (t) => {
	await t.click(Selector("p").withText("John Doe"));
	await t.expect(Selector("div").withText("Wallets").exists).ok();

	// Navigate to wallet detail page
	await t.click(Selector("[data-testid=WalletCard__D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD]"));
	await t.expect(Selector("[data-testid=WalletHeader]").exists).ok();

	// Click verify message option in dropdown menu
	await scrollTop();
	await t.click(Selector('[data-testid="WalletHeader__more-button"]'));
	await t.click(
		Selector('[data-testid="WalletHeader__more-button"] li').withText(
			buildTranslations().WALLETS.MODAL_VERIFY_MESSAGE.TITLE,
		),
	);

	await t.expect(Selector("[data-testid=modal__inner]").exists).ok();
	await t.expect(Selector("[data-testid=VerifyMessage__cancel]").exists).ok();
	await t.click(Selector("[data-testid=VerifyMessage__cancel]"));
	await t.expect(Selector("[data-testid=modal__inner]").exists).notOk();
});

test("Should open and close verify message modal", async (t) => {
	await t.click(Selector("p").withText("John Doe"));
	await t.expect(Selector("div").withText("Wallets").exists).ok();

	// Navigate to wallet detail page
	await t.click(Selector("[data-testid=WalletCard__D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD]"));
	await t.expect(Selector("[data-testid=WalletHeader]").exists).ok();

	// Click verify message option in dropdown menu
	await scrollTop();
	await t.click(Selector('[data-testid="WalletHeader__more-button"]'));
	await t.click(
		Selector('[data-testid="WalletHeader__more-button"] li').withText(
			buildTranslations().WALLETS.MODAL_VERIFY_MESSAGE.TITLE,
		),
	);

	await t.expect(Selector("[data-testid=modal__inner]").exists).ok();
	await t.expect(Selector('[data-testid="modal__close-btn"]').exists).ok();
	await t.click(Selector('[data-testid="modal__close-btn"]'));
	await t.expect(Selector("[data-testid=modal__inner]").exists).notOk();
});

test("Should fail verification", async (t) => {
	await t.click(Selector("p").withText("John Doe"));
	await t.expect(Selector("div").withText("Wallets").exists).ok();

	// Navigate to wallet detail page
	await t.click(Selector("[data-testid=WalletCard__D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD]"));
	await t.expect(Selector("[data-testid=WalletHeader]").exists).ok();

	// Click verify message option in dropdown menu
	await scrollTop();
	await t.click(Selector('[data-testid="WalletHeader__more-button"]'));
	await t.click(
		Selector('[data-testid="WalletHeader__more-button"] li').withText(
			buildTranslations().WALLETS.MODAL_VERIFY_MESSAGE.TITLE,
		),
	);

	const mockFailingMessage = {
		signatory: "03600a30cb66c6f6275ead993078d691764629c4f9244e5d38fea73483f31821cc",
		signature:
			"3044022027fdda09a4bc3e2215b56d7f0cedda8bfdc4fb97507bef3b7e74505f2e988e3102205e4aa5afa72d2011ac0c3e05bbcb72dccb17ad63f0c77a097b0046066c8030ff",
		message: "Wrong message",
	};

	await t.typeText(Selector("[data-testid=VerifyMessage_message-content]"), JSON.stringify(mockFailingMessage));

	await t.click(Selector("[data-testid=VerifyMessage__submit]"));
	await t
		.expect(
			Selector("[data-testid=modal__inner]").withText(buildTranslations().WALLETS.MODAL_VERIFY_MESSAGE.FAIL_TITLE)
				.exists,
		)
		.ok();
});

test("Should successfully verify message", async (t) => {
	await t.click(Selector("p").withText("John Doe"));
	await t.expect(Selector("div").withText("Wallets").exists).ok();

	// Navigate to wallet detail page
	await t.click(Selector("[data-testid=WalletCard__D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD]"));
	await t.expect(Selector("[data-testid=WalletHeader]").exists).ok();

	// Click verify message option in dropdown menu
	await scrollTop();
	await t.click(Selector('[data-testid="WalletHeader__more-button"]'));
	await t.click(
		Selector('[data-testid="WalletHeader__more-button"] li').withText(
			buildTranslations().WALLETS.MODAL_VERIFY_MESSAGE.TITLE,
		),
	);

	const mockSuccessMessage = {
		signatory: "03600a30cb66c6f6275ead993078d691764629c4f9244e5d38fea73483f31821cc",
		signature:
			"3044022027fdda09a4bc3e2215b56d7f0cedda8bfdc4fb97507bef3b7e74505f2e988e3102205e4aa5afa72d2011ac0c3e05bbcb72dccb17ad63f0c77a097b0046066c8030ff",
		message: "Hello world",
	};

	await t.typeText(Selector("[data-testid=VerifyMessage_message-content]"), JSON.stringify(mockSuccessMessage));

	await t.click(Selector("[data-testid=VerifyMessage__submit]"));
	await t
		.expect(
			Selector("[data-testid=modal__inner]").withText(
				buildTranslations().WALLETS.MODAL_VERIFY_MESSAGE.SUCCESS_TITLE,
			).exists,
		)
		.ok();
});
