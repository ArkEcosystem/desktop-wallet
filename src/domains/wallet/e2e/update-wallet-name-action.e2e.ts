import { Selector } from "testcafe";

import { buildTranslations } from "../../../app/i18n/helpers";
import { createFixture } from "../../../utils/e2e-utils";
import { goToProfile } from "../../profile/e2e/common";
import { goToWallet } from "./common";

const translations = buildTranslations();

const openUpdateWalletName = async (t: any) => {
	await t.click(Selector('[data-testid="WalletHeader__more-button"]'));
	await t.click(
		Selector('[data-testid="WalletHeader__more-button"] li').withText(
			translations.WALLETS.PAGE_WALLET_DETAILS.OPTIONS.WALLET_NAME,
		),
	);

	await t.expect(Selector("[data-testid=modal__inner]").exists).ok();
	await t.expect(Selector('[data-testid="modal__close-btn"]').exists).ok();
};

const prepareTest = async (t: any) => {
	await goToProfile(t);
	await goToWallet(t);
	await openUpdateWalletName(t);
};

createFixture(`Wallet Labeling`).beforeEach(async (t) => await prepareTest(t));

test("Should open and close wallet update name modal", async (t) => {
	await t.click(Selector('[data-testid="modal__close-btn"]'));
	await t.expect(Selector("[data-testid=modal__inner]").exists).notOk();
});

test("Should open and cancel wallet update name modal", async (t) => {
	await t.click(Selector("button").withText(translations.COMMON.CANCEL));
	await t.expect(Selector("[data-testid=modal__inner]").exists).notOk();
});

test("Should successfully update wallet name", async (t) => {
	const walletLabelNameInput = Selector('[data-testid="UpdateWalletName__input"]');
	await t.typeText(walletLabelNameInput, "New Name", { replace: true });

	await t.expect(Selector("[data-testid=UpdateWalletName__submit]").hasAttribute("disabled")).notOk();

	await t.click(Selector('[data-testid="UpdateWalletName__submit"]'));
	await t.expect(Selector("[data-testid=modal__inner]").exists).notOk();
});

test("Should successfully remove wallet name", async (t) => {
	const walletLabelNameInput = Selector('[data-testid="UpdateWalletName__input"]');
	await t.selectText(walletLabelNameInput).pressKey("delete");

	await t.expect(Selector("[data-testid=UpdateWalletName__submit]").hasAttribute("disabled")).notOk();

	await t.click(Selector('[data-testid="UpdateWalletName__submit"]'));
	await t.expect(Selector("[data-testid=modal__inner]").exists).notOk();
});

test("Should error when name exceeds 42 characters", async (t) => {
	const name = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor";
	const walletLabelNameInput = Selector('[data-testid="UpdateWalletName__input"]');
	await t.typeText(walletLabelNameInput, name, { replace: true });

	await t.expect(Selector("[data-testid=UpdateWalletName__input]").hasAttribute("aria-invalid")).ok();
	await t.expect(Selector("[data-testid=UpdateWalletName__submit]").hasAttribute("disabled")).ok();

	await t.click(Selector('[data-testid="UpdateWalletName__submit"]'));
	await t.expect(Selector("[data-testid=modal__inner]").exists).ok();
});

test("Should error when name consists only of whitespace", async (t) => {
	const walletLabelNameInput = Selector('[data-testid="UpdateWalletName__input"]');
	await t.typeText(walletLabelNameInput, "      ", { replace: true });

	await t.expect(Selector("[data-testid=UpdateWalletName__input]").hasAttribute("aria-invalid")).ok();
	await t.expect(Selector("[data-testid=UpdateWalletName__submit]").hasAttribute("disabled")).ok();

	await t.click(Selector('[data-testid="UpdateWalletName__submit"]'));
	await t.expect(Selector("[data-testid=modal__inner]").exists).ok();
});

test("Should persist wallet name", async (t) => {
	const newName = "New Name";

	const walletLabelNameInput = Selector('[data-testid="UpdateWalletName__input"]');

	await t.expect(walletLabelNameInput.value).notEql(newName);

	await t.typeText(walletLabelNameInput, newName, { replace: true });

	await t.click(Selector('[data-testid="UpdateWalletName__submit"]'));
	await t.expect(Selector("[data-testid=modal__inner]").exists).notOk();

	await openUpdateWalletName(t);

	await t.expect(walletLabelNameInput.value).eql(newName);
});
