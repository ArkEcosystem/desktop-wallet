import { RequestMock, Selector } from "testcafe";

import { buildTranslations as translations } from "../../../app/i18n/helpers";
import { getPageURL } from "../../../utils/e2e-utils";

fixture`Delegate Registration action`.page(getPageURL());

const walletMock = RequestMock()
	.onRequestTo("https://dwallets.ark.io/api/wallets/DDA5nM7KEqLeTtQKv5qGgcnc6dpNBKJNTS")
	.respond(
		{
			data: {
				address: "DDA5nM7KEqLeTtQKv5qGgcnc6dpNBKJNTS",
				nonce: "0",
				balance: "2500000000",
				isDelegate: false,
				isResigned: false,
				attributes: {},
			},
		},
		200,
		{
			"access-control-allow-origin": "*",
		},
	);

const sendMock = RequestMock()
	.onRequestTo("https://dwallets.ark.io/api/transactions")
	.respond(
		{
			data: {
				accept: ["transaction-id"],
				broadcast: ["transaction-id"],
				excess: [],
				invalid: [],
			},
		},
		200,
		{
			"access-control-allow-origin": "*",
		},
	);

test.requestHooks(walletMock, sendMock)("should open wallet details page", async (t) => {
	await t.click(Selector("p").withText("John Doe"));
	await t.expect(Selector("div").withText(translations().COMMON.WALLETS).exists).ok();

	// Navigate to import wallet page
	await t.click(Selector("button").withText("Import"));
	await t.expect(Selector("[data-testid=header__title]").withText("Select a Network").exists).ok();
	await t.click(Selector("#ImportWallet__network-item-1"));
	await t.click(Selector("button").withText("Continue"));
	await t.typeText(Selector("[data-testid=ImportWallet__passphrase-input]"), "passphrase");
	await t.click(Selector("button").withText("Go to Wallet"));
	await t.typeText(Selector("[data-testid=ImportWallet__name-input]"), "Test Wallet");
	await t.click(Selector("button").withText("Save & Finish"));

	// Navigate to wallet details page
	await t.expect(Selector("[data-testid=WalletHeader]").exists).ok();

	// Navigate to Registrations page
	await t.click(Selector("button").withText("Register"));
	await t.expect(Selector("[data-testid=Registration__form]").exists).ok();

	// Choose registration type & go to step 2
	await t.click(Selector("[data-testid=select-list__toggle-button]"));
	await t.click(Selector("li").withText("Delegate"));
	await t.click(Selector("button").withText("Continue"));

	// Choose username
	await t.expect(Selector("[data-testid=Registration__form]").exists).ok();
	await t.typeText(Selector("[data-testid=Input__username]"), "test_delegate");
	await t.click(Selector("button").withText("Continue"));

	// Check details
	await t.expect(Selector("[data-testid=TransactionDetail]").withText("test_delegate").exists).ok();
	await t.click(Selector("button").withText("Continue"));

	// Sign transaction
	await t.expect(Selector("h1").withText("Authenticate").exists).ok();
	await t.typeText(Selector("[data-testid=InputPassword] input"), "passphrase");
	await t.click(Selector("button").withText("Send"));
	await t.expect(Selector("h1").withText("Transaction Sent").exists).ok();
});
