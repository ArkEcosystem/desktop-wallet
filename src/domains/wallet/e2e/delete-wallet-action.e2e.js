import { ClientFunction, Selector } from "testcafe";

fixture`Delete Wallet action`.page`http://localhost:3000/`;

const getLocation = ClientFunction(() => document.location.href);

const scrollTop = ClientFunction(() => {
	window.scrollTo({ top: 0 });
});
test("Should open and cancel deletion modal in wallet detail page", async (t) => {
	await t.click(Selector("p").withText("John Doe"));
	await t.expect(Selector("div").withText("Wallets").exists).ok();

	// Navigate to wallet detail page
	await t.click(Selector("[data-testid=WalletCard__ac38fe6d-4b67-4ef1-85be-17c5f6841129]"));
	await t.expect(Selector("[data-testid=WalletHeader]").exists).ok();

	// Click delete message in dropdown menu
	await scrollTop();
	await t.click(Selector('[data-testid="WalletHeader__more-button"]'));
	await t.click(Selector('[data-testid="WalletHeader__more-button"] li').nth(3));

	await t.expect(Selector("[data-testid=modal__inner]").exists).ok();
	await t.expect(Selector("[data-testid=DeleteResource__cancel-button]").exists).ok();
	await t.click(Selector('[data-testid="DeleteResource__cancel-button"]'));
	await t.expect(Selector("[data-testid=modal__inner]").exists).notOk();
});

test("Should open and close deletion modal in wallet detail page", async (t) => {
	await t.click(Selector("p").withText("John Doe"));
	await t.expect(Selector("div").withText("Wallets").exists).ok();

	// Navigate to wallet detail page
	await t.click(Selector("[data-testid=WalletCard__ac38fe6d-4b67-4ef1-85be-17c5f6841129]"));
	await t.expect(Selector("[data-testid=WalletHeader]").exists).ok();

	// Click delete message in dropdown menu
	await scrollTop();
	await t.click(Selector('[data-testid="WalletHeader__more-button"]'));
	await t.click(Selector('[data-testid="WalletHeader__more-button"] li').nth(3));

	await t.expect(Selector("[data-testid=modal__inner]").exists).ok();
	await t.expect(Selector('[data-testid="modal__close-btn"]').exists).ok();
	await t.click(Selector('[data-testid="modal__close-btn"]'));
	await t.expect(Selector("[data-testid=modal__inner]").exists).notOk();
});

test("Should delete wallet from wallet details page", async (t) => {
	await t.click(Selector("p").withText("John Doe"));
	await t.expect(Selector("div").withText("Wallets").exists).ok();

	// Navigate to wallet detail page
	await t.click(Selector("[data-testid=WalletCard__ac38fe6d-4b67-4ef1-85be-17c5f6841129]"));
	await t.expect(Selector("[data-testid=WalletHeader]").exists).ok();

	// Click delete message in dropdown menu
	await scrollTop();
	await t.click(Selector('[data-testid="WalletHeader__more-button"]'));
	await t.click(Selector('[data-testid="WalletHeader__more-button"] li').nth(3));

	await t.expect(Selector("[data-testid=modal__inner]").exists).ok();
	await t.expect(Selector("[data-testid=DeleteResource__submit-button]").exists).ok();
	await t.click(Selector('[data-testid="DeleteResource__submit-button"]'));
	await t.expect(Selector("[data-testid=modal__inner]").exists).notOk();
	await t.expect(getLocation()).contains("/dashboard");
});
