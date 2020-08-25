import { Selector } from "testcafe";

import { buildTranslations } from "../../../app/i18n/helpers";
import { getPageURL, scrollTo } from "../../../utils/e2e-utils";
import { goToWallet } from "./common";

const translations = buildTranslations();

fixture`Wallet Labeling`.page(getPageURL()).beforeEach(async (t) => await goToWallet(t));

test("Should open and close wallet update name modal", async (t) => {
	await scrollTo(0);

	// Click wallet update name option in dropdown menu
	await t.click(Selector('[data-testid="WalletHeader__more-button"]'));
	await t.click(
		Selector('[data-testid="WalletHeader__more-button"] li').withText(
			translations.WALLETS.PAGE_WALLET_DETAILS.OPTIONS.WALLET_NAME,
		),
	);

	await t.expect(Selector("[data-testid=modal__inner]").exists).ok();
	await t.expect(Selector('[data-testid="modal__close-btn"]').exists).ok();
	await t.click(Selector('[data-testid="modal__close-btn"]'));
	await t.expect(Selector("[data-testid=modal__inner]").exists).notOk();
});

test("Should open and cancel wallet update name modal", async (t) => {
	await scrollTo(0);

	// Click wallet update name option in dropdown menu
	await t.click(Selector('[data-testid="WalletHeader__more-button"]'));
	await t.click(
		Selector('[data-testid="WalletHeader__more-button"] li').withText(
			translations.WALLETS.PAGE_WALLET_DETAILS.OPTIONS.WALLET_NAME,
		),
	);

	await t.expect(Selector("[data-testid=modal__inner]").exists).ok();
	await t.expect(Selector('[data-testid="modal__close-btn"]').exists).ok();
	await t.click(Selector("button").withText(translations.COMMON.CANCEL));
	await t.expect(Selector("[data-testid=modal__inner]").exists).notOk();
});

test("Should succesfully update wallet name", async (t) => {
	await scrollTo(0);

	// Click wallet update name option in dropdown menu
	await t.click(Selector('[data-testid="WalletHeader__more-button"]'));
	await t.click(
		Selector('[data-testid="WalletHeader__more-button"] li').withText(
			translations.WALLETS.PAGE_WALLET_DETAILS.OPTIONS.WALLET_NAME,
		),
	);

	await t.expect(Selector("[data-testid=modal__inner]").exists).ok();
	await t.expect(Selector('[data-testid="modal__close-btn"]').exists).ok();

	const walletLabelNameInput = Selector('[data-testid="UpdateWalletName__input"]');
	await t.typeText(walletLabelNameInput, "New Name", { replace: true });

	await t.click(Selector('[data-testid="UpdateWalletName__submit"]'));
	await t.expect(Selector("[data-testid=modal__inner]").exists).notOk();
});

test("Should error when name is empty", async (t) => {
	await scrollTo(0);

	// Click wallet update name option in dropdown menu
	await t.click(Selector('[data-testid="WalletHeader__more-button"]'));
	await t.click(
		Selector('[data-testid="WalletHeader__more-button"] li').withText(
			translations.WALLETS.PAGE_WALLET_DETAILS.OPTIONS.WALLET_NAME,
		),
	);

	const walletLabelNameInput = Selector('[data-testid="UpdateWalletName__input"]');
	await t.selectText(walletLabelNameInput).pressKey("delete");

	await t.expect(Selector("[data-testid=UpdateWalletName__submit]").hasAttribute("disabled")).ok();

	await t.click(Selector('[data-testid="UpdateWalletName__submit"]'));
	await t.expect(Selector("[data-testid=modal__inner]").exists).ok();
});

test("Should error when name exceeds 42 characters", async (t) => {
	await scrollTo(0);

	// Click wallet update name option in dropdown menu
	await t.click(Selector('[data-testid="WalletHeader__more-button"]'));
	await t.click(
		Selector('[data-testid="WalletHeader__more-button"] li').withText(
			translations.WALLETS.PAGE_WALLET_DETAILS.OPTIONS.WALLET_NAME,
		),
	);

	await t.expect(Selector("[data-testid=modal__inner]").exists).ok();
	await t.expect(Selector('[data-testid="modal__close-btn"]').exists).ok();

	const name = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor";
	const walletLabelNameInput = Selector('[data-testid="UpdateWalletName__input"]');
	await t.typeText(walletLabelNameInput, name, { replace: true });

	await t.expect(Selector("[data-testid=UpdateWalletName__input]").hasAttribute("aria-invalid")).ok();
	await t.expect(Selector("[data-testid=UpdateWalletName__submit]").hasAttribute("disabled")).ok();

	await t.click(Selector('[data-testid="UpdateWalletName__submit"]'));
	await t.expect(Selector("[data-testid=modal__inner]").exists).ok();
});

test("Should disallow empty spaces", async (t) => {
	await scrollTo(0);

	// Click wallet update name option in dropdown menu
	await t.click(Selector('[data-testid="WalletHeader__more-button"]'));
	await t.click(
		Selector('[data-testid="WalletHeader__more-button"] li').withText(
			translations.WALLETS.PAGE_WALLET_DETAILS.OPTIONS.WALLET_NAME,
		),
	);

	await t.expect(Selector("[data-testid=modal__inner]").exists).ok();
	await t.expect(Selector('[data-testid="modal__close-btn"]').exists).ok();

	const walletLabelNameInput = Selector('[data-testid="UpdateWalletName__input"]');
	await t.typeText(walletLabelNameInput, "      ", { replace: true });

	await t.expect(Selector("[data-testid=UpdateWalletName__submit]").hasAttribute("disabled")).ok();

	await t.click(Selector('[data-testid="UpdateWalletName__submit"]'));
	await t.expect(Selector("[data-testid=modal__inner]").exists).ok();
});

test("Should persist wallet name", async (t) => {
	await scrollTo(0);

	const newName = "New Name";

	// Click wallet update name option in dropdown menu
	await t.click(Selector('[data-testid="WalletHeader__more-button"]'));
	await t.click(
		Selector('[data-testid="WalletHeader__more-button"] li').withText(
			translations.WALLETS.PAGE_WALLET_DETAILS.OPTIONS.WALLET_NAME,
		),
	);

	await t.expect(Selector("[data-testid=modal__inner]").exists).ok();
	await t.expect(Selector('[data-testid="modal__close-btn"]').exists).ok();

	const walletLabelNameInput = Selector('[data-testid="UpdateWalletName__input"]');
	await t.typeText(walletLabelNameInput, newName, { replace: true });

	await t.click(Selector('[data-testid="UpdateWalletName__submit"]'));
	await t.expect(Selector("[data-testid=modal__inner]").exists).notOk();

	// Open modal again to see the updated wallet name in input field

	await scrollTo(0);

	// Click wallet update name option in dropdown menu
	await t.click(Selector('[data-testid="WalletHeader__more-button"]'));
	await t.click(
		Selector('[data-testid="WalletHeader__more-button"] li').withText(
			translations.WALLETS.PAGE_WALLET_DETAILS.OPTIONS.WALLET_NAME,
		),
	);

	await t.expect(Selector("[data-testid=modal__inner]").exists).ok();
	await t.expect(Selector('[data-testid="modal__close-btn"]').exists).ok();

	const walletLabelNameInputValue = Selector('[data-testid="UpdateWalletName__input"]').value;
	await t.expect(walletLabelNameInputValue).eql(newName);
});
