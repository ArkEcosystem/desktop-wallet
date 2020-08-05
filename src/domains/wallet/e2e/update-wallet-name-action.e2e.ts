import { ClientFunction, Selector } from "testcafe";

import { buildTranslations as translations } from "../../../app/i18n/helpers";

fixture`Wallet Labeling`.page`http://localhost:3000/`;

const scrollTop = ClientFunction(() => {
	window.scrollTo({ top: 0 });
});

test("Should open and close wallet update name modal", async (t) => {
	await t.click(Selector("p").withText("John Doe"));
	await t.expect(Selector("div").withText(translations().COMMON.WALLETS).exists).ok();

	// Navigate to wallet details page
	await t.click(Selector("[data-testid=WalletCard__D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD]"));
	await t.expect(Selector("[data-testid=WalletHeader]").exists).ok();

	// Click wallet update name option in dropdown menu
	await scrollTop();
	await t.click(Selector('[data-testid="WalletHeader__more-button"]'));
	await t.click(
		Selector('[data-testid="WalletHeader__more-button"] li').withText(
			translations().WALLETS.PAGE_WALLET_DETAILS.OPTIONS.WALLET_NAME,
		),
	);

	await t.expect(Selector("[data-testid=modal__inner]").exists).ok();
	await t.expect(Selector('[data-testid="modal__close-btn"]').exists).ok();
	await t.click(Selector('[data-testid="modal__close-btn"]'));
	await t.expect(Selector("[data-testid=modal__inner]").exists).notOk();
});

test("Should open and cancel wallet update name modal", async (t) => {
	await t.click(Selector("p").withText("John Doe"));
	await t.expect(Selector("div").withText(translations().COMMON.WALLETS).exists).ok();

	// Navigate to wallet details page
	await t.click(Selector("[data-testid=WalletCard__D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD]"));
	await t.expect(Selector("[data-testid=WalletHeader]").exists).ok();

	// Click wallet update name option in dropdown menu
	await scrollTop();
	await t.click(Selector('[data-testid="WalletHeader__more-button"]'));
	await t.click(
		Selector('[data-testid="WalletHeader__more-button"] li').withText(
			translations().WALLETS.PAGE_WALLET_DETAILS.OPTIONS.WALLET_NAME,
		),
	);

	await t.expect(Selector("[data-testid=modal__inner]").exists).ok();
	await t.expect(Selector('[data-testid="modal__close-btn"]').exists).ok();
	await t.click(Selector("button").withText(translations().COMMON.CANCEL));
	await t.expect(Selector("[data-testid=modal__inner]").exists).notOk();
});

test("Should succesfully update wallet name", async (t) => {
	await t.click(Selector("p").withText("John Doe"));
	await t.expect(Selector("div").withText(translations().COMMON.WALLETS).exists).ok();

	// Navigate to wallet details page
	await t.click(Selector("[data-testid=WalletCard__D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD]"));
	await t.expect(Selector("[data-testid=WalletHeader]").exists).ok();

	// Click wallet update name option in dropdown menu
	await scrollTop();
	await t.click(Selector('[data-testid="WalletHeader__more-button"]'));
	await t.click(
		Selector('[data-testid="WalletHeader__more-button"] li').withText(
			translations().WALLETS.PAGE_WALLET_DETAILS.OPTIONS.WALLET_NAME,
		),
	);

	await t.expect(Selector("[data-testid=modal__inner]").exists).ok();
	await t.expect(Selector('[data-testid="modal__close-btn"]').exists).ok();

	const walletLabelNameInput = Selector('[data-testid="UpdateWalletName__input"]');
	await t.typeText(walletLabelNameInput, "New Name");

	await t.click(Selector('[data-testid="UpdateWalletName__submit"]'));
	await t.expect(Selector("[data-testid=modal__inner]").exists).notOk();
});

test("Should prevent submittion on empty name", async (t) => {
	await t.click(Selector("p").withText("John Doe"));
	await t.expect(Selector("div").withText(translations().COMMON.WALLETS).exists).ok();

	// Navigate to wallet details page
	await t.click(Selector("[data-testid=WalletCard__D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD]"));
	await t.expect(Selector("[data-testid=WalletHeader]").exists).ok();

	// Click wallet update name option in dropdown menu
	await scrollTop();
	await t.click(Selector('[data-testid="WalletHeader__more-button"]'));
	await t.click(
		Selector('[data-testid="WalletHeader__more-button"] li').withText(
			translations().WALLETS.PAGE_WALLET_DETAILS.OPTIONS.WALLET_NAME,
		),
	);

	const walletLabelNameInput = Selector('[data-testid="UpdateWalletName__input"]');
	await t.selectText(walletLabelNameInput).pressKey("delete");

	await t.expect(Selector("[data-testid=UpdateWalletName__submit]").hasAttribute("disabled")).ok();

	await t.click(Selector('[data-testid="UpdateWalletName__submit"]'));
	await t.expect(Selector("[data-testid=modal__inner]").exists).ok();
});

test("Should error when name exceeds 42 characters", async (t) => {
	await t.click(Selector("p").withText("John Doe"));
	await t.expect(Selector("div").withText(translations().COMMON.WALLETS).exists).ok();

	// Navigate to wallet details page
	await t.click(Selector("[data-testid=WalletCard__D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD]"));
	await t.expect(Selector("[data-testid=WalletHeader]").exists).ok();

	// Click wallet update name option in dropdown menu
	await scrollTop();
	await t.click(Selector('[data-testid="WalletHeader__more-button"]'));
	await t.click(
		Selector('[data-testid="WalletHeader__more-button"] li').withText(
			translations().WALLETS.PAGE_WALLET_DETAILS.OPTIONS.WALLET_NAME,
		),
	);

	await t.expect(Selector("[data-testid=modal__inner]").exists).ok();
	await t.expect(Selector('[data-testid="modal__close-btn"]').exists).ok();

	const name = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor";
	const walletLabelNameInput = Selector('[data-testid="UpdateWalletName__input"]');
	await t.typeText(walletLabelNameInput, name);

	await t.expect(Selector("[data-testid=UpdateWalletName__input]").hasAttribute("aria-invalid")).ok();
	await t.expect(Selector("[data-testid=UpdateWalletName__submit]").hasAttribute("disabled")).ok();

	await t.click(Selector('[data-testid="UpdateWalletName__submit"]'));
	await t.expect(Selector("[data-testid=modal__inner]").exists).ok();
});

test("Should disallow empty spaces", async (t) => {
	await t.click(Selector("p").withText("John Doe"));
	await t.expect(Selector("div").withText(translations().COMMON.WALLETS).exists).ok();

	// Navigate to wallet details page
	await t.click(Selector("[data-testid=WalletCard__D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD]"));
	await t.expect(Selector("[data-testid=WalletHeader]").exists).ok();

	// Click wallet update name option in dropdown menu
	await scrollTop();
	await t.click(Selector('[data-testid="WalletHeader__more-button"]'));
	await t.click(
		Selector('[data-testid="WalletHeader__more-button"] li').withText(
			translations().WALLETS.PAGE_WALLET_DETAILS.OPTIONS.WALLET_NAME,
		),
	);

	await t.expect(Selector("[data-testid=modal__inner]").exists).ok();
	await t.expect(Selector('[data-testid="modal__close-btn"]').exists).ok();

	const walletLabelNameInput = Selector('[data-testid="UpdateWalletName__input"]');
	await t.selectText(walletLabelNameInput).pressKey("delete");
	await t.typeText(walletLabelNameInput, "      ");

	await t.expect(Selector("[data-testid=UpdateWalletName__submit]").hasAttribute("disabled")).ok();

	await t.click(Selector('[data-testid="UpdateWalletName__submit"]'));
	await t.expect(Selector("[data-testid=modal__inner]").exists).ok();
});

test("Should persist wallet name", async (t) => {
	await t.click(Selector("p").withText("John Doe"));
	await t.expect(Selector("div").withText(translations().COMMON.WALLETS).exists).ok();

	// Navigate to wallet details page
	await t.click(Selector("[data-testid=WalletCard__D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD]"));
	await t.expect(Selector("[data-testid=WalletHeader]").exists).ok();

	// Click wallet update name option in dropdown menu
	await scrollTop();
	await t.click(Selector('[data-testid="WalletHeader__more-button"]'));
	await t.click(
		Selector('[data-testid="WalletHeader__more-button"] li').withText(
			translations().WALLETS.PAGE_WALLET_DETAILS.OPTIONS.WALLET_NAME,
		),
	);

	await t.expect(Selector("[data-testid=modal__inner]").exists).ok();
	await t.expect(Selector('[data-testid="modal__close-btn"]').exists).ok();

	const walletLabelNameInput = Selector('[data-testid="UpdateWalletName__input"]');
	await t.typeText(walletLabelNameInput, "New Name", { replace: true });

	await t.click(Selector('[data-testid="UpdateWalletName__submit"]'));
	await t.expect(Selector("[data-testid=modal__inner]").exists).notOk();

	// Open modal again to see the updated wallet name in input field

	// Click wallet update name option in dropdown menu
	await scrollTop();
	await t.click(Selector('[data-testid="WalletHeader__more-button"]'));
	await t.click(
		Selector('[data-testid="WalletHeader__more-button"] li').withText(
			translations().WALLETS.PAGE_WALLET_DETAILS.OPTIONS.WALLET_NAME,
		),
	);

	await t.expect(Selector("[data-testid=modal__inner]").exists).ok();
	await t.expect(Selector('[data-testid="modal__close-btn"]').exists).ok();

	const walletLabelNameInputValue = Selector('[data-testid="UpdateWalletName__input"]').value;
	await t.expect(walletLabelNameInputValue).eql("New Name");
});
