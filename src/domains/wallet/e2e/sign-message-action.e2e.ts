import { ClientFunction, Selector } from "testcafe";

import { buildTranslations as translations } from "../../../app/i18n/helpers";
import { getPageURL } from "../../../utils/e2e-utils";

fixture`Sign Message`.page(getPageURL());

const scrollTop = ClientFunction(() => {
	window.scrollTo({ top: 0 });
});

test("Should open and close sign message modal", async (t) => {
	await t.click(Selector("p").withText("John Doe"));
	await t.expect(Selector("div").withText(translations().COMMON.WALLETS).exists).ok();

	// Navigate to wallet details page
	await t.click(Selector("[data-testid=WalletCard__D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD]"));
	await t.expect(Selector("[data-testid=WalletHeader]").exists).ok();

	// Click sign message option in dropdown menu
	await scrollTop();
	await t.click(Selector('[data-testid="WalletHeader__more-button"]'));
	await t.click(
		Selector('[data-testid="WalletHeader__more-button"] li').withText(
			translations().WALLETS.PAGE_WALLET_DETAILS.OPTIONS.SIGN_MESSAGE,
		),
	);

	await t.expect(Selector("[data-testid=modal__inner]").exists).ok();
	await t.expect(Selector('[data-testid="modal__close-btn"]').exists).ok();
	await t.click(Selector('[data-testid="modal__close-btn"]'));
	await t.expect(Selector("[data-testid=modal__inner]").exists).notOk();
});

test("Should open and cancel sign message modal", async (t) => {
	await t.click(Selector("p").withText("John Doe"));
	await t.expect(Selector("div").withText(translations().COMMON.WALLETS).exists).ok();

	// Navigate to wallet details page
	await t.click(Selector("[data-testid=WalletCard__D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD]"));
	await t.expect(Selector("[data-testid=WalletHeader]").exists).ok();

	// Click sign message option in dropdown menu
	await scrollTop();
	await t.click(Selector('[data-testid="WalletHeader__more-button"]'));
	await t.click(
		Selector('[data-testid="WalletHeader__more-button"] li').withText(
			translations().WALLETS.PAGE_WALLET_DETAILS.OPTIONS.SIGN_MESSAGE,
		),
	);

	await t.expect(Selector("[data-testid=modal__inner]").exists).ok();
	await t.expect(Selector("[data-testid=SignMessage__cancel]").exists).ok();
	await t.click(Selector("[data-testid=SignMessage__cancel]"));
	await t.expect(Selector("[data-testid=modal__inner]").exists).notOk();
});

test("Should successfully sign message", async (t) => {
	await t.click(Selector("p").withText("John Doe"));
	await t.expect(Selector("div").withText("Wallets").exists).ok();

	// Navigate to wallet details page
	await t.click(Selector("[data-testid=WalletCard__D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD]"));
	await t.expect(Selector("[data-testid=WalletHeader]").exists).ok();

	// Click sign message option in dropdown menu
	await scrollTop();
	await t.click(Selector('[data-testid="WalletHeader__more-button"]'));
	await t.click(
		Selector('[data-testid="WalletHeader__more-button"] li').withText(
			translations().WALLETS.PAGE_WALLET_DETAILS.OPTIONS.SIGN_MESSAGE,
		),
	);

	await t.typeText(Selector("input[name=message]"), "Hello World");
	await t.typeText(Selector("input[name=mnemonic]"), "this is a top secret passphrase");
	await t.click(Selector("[data-testid=SignMessage__submit-button]"));
	await t.expect(Selector("h2").withText(translations().WALLETS.MODAL_SIGN_MESSAGE.SUCCESS_TITLE).exists).ok();
	await t.click(Selector("[data-testid=modal__close-btn]"));
});
