import { ClientFunction, Selector } from "testcafe";

import { buildTranslations as translations } from "../../../app/i18n/helpers";

fixture`Transactions routing`.page`http://localhost:3000/`;

const scrollBy = ClientFunction((x, y) => {
	window.scrollBy(x, y);
});

test("should navigate to portfolio and sign message", async (t) => {
	await t.click(Selector("p").withText("John Doe"));
	await t.expect(Selector("div").withText(translations().COMMON.WALLETS).exists).ok();
	await t.click(Selector("[data-testid=navbar__buttons--send]"));
	await t
		.expect(
			Selector("div").withText(translations().TRANSACTION.PAGE_TRANSACTION_SEND.FIRST_STEP.DESCRIPTION).exists,
		)
		.ok();

	// Handle sign message
	await t.click(Selector("span").withText(translations().COMMON.GO_BACK_TO_PORTFOLIO));
	await t.click(Selector("[data-testid=WalletCard__ac38fe6d-4b67-4ef1-85be-17c5f6841129]"));
	await scrollBy(0, -200);
	await t.click(Selector("[data-testid=WalletHeader__more-button]"));
	await t.click(Selector("li").withText(translations().WALLETS.PAGE_WALLET_DETAILS.OPTIONS.SIGN_MESSAGE));

	await t.click(Selector("[data-testid=sign-message__sign-button]"));
	await t.expect(Selector("h2").withText(translations().WALLETS.MODAL_SIGN_MESSAGE.SUCCESS_TITLE).exists).ok();
	await t.click(Selector("[data-testid=modal__close-btn]"));
});

test("should navigate to portfolio and access registrations", async (t) => {
	await t.click(Selector("p").withText("John Doe"));
	await t.expect(Selector("div").withText(translations().COMMON.WALLETS).exists).ok();

	// Go to registrations
	await t.click(Selector("[data-testid=WalletCard__ac38fe6d-4b67-4ef1-85be-17c5f6841129]"));
	await t.click(Selector("[data-testid=WalletRegistrations__show-all]"));
	await t.expect(Selector("h1").withText(translations().PROFILE.PAGE_MY_REGISTRATIONS.TITLE).exists).ok();
});

test("should navigate to portfolio and registrate", async (t) => {
	await t.click(Selector("p").withText("John Doe"));
	await t.expect(Selector("div").withText(translations().COMMON.WALLETS).exists).ok();

	// Go to registrations
	await t.click(Selector("[data-testid=WalletCard__ac38fe6d-4b67-4ef1-85be-17c5f6841129]"));
	await t.click(Selector("[data-testid=WalletRegistrations__register]"));
	await t.expect(Selector("h1").withText("Registration").exists).ok();
});
