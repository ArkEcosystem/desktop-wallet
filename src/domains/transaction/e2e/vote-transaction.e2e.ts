import { RequestMock, Selector } from "testcafe";

import { buildTranslations } from "../../../app/i18n/helpers";
import { createFixture, mockRequest, requestMocks } from "../../../utils/e2e-utils";
import { goToProfile } from "../../profile/e2e/common";
import { goToImportWalletPage } from "./common";

const translations = buildTranslations();

const requestMocksCopy = { ...requestMocks };

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

requestMocksCopy.wallets[3] = mockRequest("https://dwallets.ark.io/api/wallets/D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD", {
	data: {
		address: "D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD",
		publicKey: "03df6cd794a7d404db4f1b25816d8976d0e72c5177d17ac9b19a92703b62cdbbbc",
		nonce: "245",
		balance: "3375089801",
		attributes: {
			htlc: {
				locks: {},
				lockedBalance: "0",
			},
		},
		multiSignature: {},
		lockedBalance: "0",
		isDelegate: false,
		isResigned: false,
	},
});

createFixture(`Votes`, [
	...requestMocksCopy.configuration,
	...requestMocksCopy.delegates,
	...requestMocksCopy.transactions,
	...requestMocksCopy.wallets,
]);

test("should show an error if wrong mnemonic", async (t) => {
	// Navigate to profile page
	await goToProfile(t);

	// Navigate to import wallet page
	await goToImportWalletPage(t);

	// Navigate to vote page
	await t.click(Selector('[data-testid="navbar__useractions"]'));
	await t.expect(Selector('[data-testid="dropdown__option--1"]').withText(translations.COMMON.VOTES).exists).ok();
	await t.click(Selector('[data-testid="dropdown__option--1"]').withText(translations.COMMON.VOTES));
	await t.expect(Selector("h1").withText(translations.VOTE.VOTES_PAGE.TITLE).exists).ok();

	// Select cryptoasset
	await t.click('[data-testid="SelectNetworkInput__input"]');
	await t.click(Selector("#Votes__network-item-1"));

	// Select address
	await t.expect(Selector("h2").withText(translations.VOTE.ADDRESS_TABLE.TITLE).exists).ok();
	await t.click(Selector('[data-testid="AddressRow__select-2"]').withText(translations.COMMON.SELECT));

	// Select delegate
	await t.expect(Selector("h2").withText(translations.VOTE.DELEGATE_TABLE.TITLE).exists).ok();
	await t.click(Selector('[data-testid="DelegateRow__toggle-0"]').withText(translations.COMMON.SELECT));
	await t.expect(Selector("[data-testid=DelegateTable__footer]").exists).ok();
	await t.click(Selector('[data-testid="DelegateTable__continue-button"]').withText(translations.COMMON.CONTINUE));

	// Vote Transaction
	await t.expect(Selector("h1").withText(translations.TRANSACTION.PAGE_VOTE.FIRST_STEP.TITLE).exists).ok();
	await t.click(Selector("button").withText(translations.COMMON.CONTINUE));

	// Transaction Review
	await t.click(Selector("button").withText(translations.COMMON.CONTINUE));

	// Type wrong mnemonic
	await t.typeText(Selector("[data-testid=AuthenticationStep__mnemonic]"), "wrong mnemonic", { replace: true });
	await t.typeText(Selector("[data-testid=AuthenticationStep__second-mnemonic]"), "wrong mnemonic", {
		replace: true,
	});
	await t.click(Selector("[data-testid=SendVote__button--submit]"));
	await t.expect(Selector("[data-testid=AuthenticationStep__mnemonic]").hasAttribute("aria-invalid")).ok();
});

test.requestHooks(walletMock, sendMock)("should send a vote transaction", async (t) => {
	// Navigate to profile page
	await goToProfile(t);

	// Navigate to import wallet page
	await goToImportWalletPage(t);

	// Navigate to vote page
	await t.click(Selector('[data-testid="navbar__useractions"]'));
	await t.expect(Selector('[data-testid="dropdown__option--1"]').withText(translations.COMMON.VOTES).exists).ok();
	await t.click(Selector('[data-testid="dropdown__option--1"]').withText(translations.COMMON.VOTES));
	await t.expect(Selector("h1").withText(translations.VOTE.VOTES_PAGE.TITLE).exists).ok();

	// Select cryptoasset
	await t.click('[data-testid="SelectNetworkInput__input"]');
	await t.click(Selector("#Votes__network-item-1"));

	// Select address
	await t.expect(Selector("h2").withText(translations.VOTE.ADDRESS_TABLE.TITLE).exists).ok();
	await t.click(Selector('[data-testid="AddressRow__select-2"]').withText(translations.COMMON.SELECT));

	// Select delegate
	await t.expect(Selector("h2").withText(translations.VOTE.DELEGATE_TABLE.TITLE).exists).ok();
	await t.click(Selector('[data-testid="DelegateRow__toggle-0"]').withText(translations.COMMON.SELECT));
	await t.expect(Selector("[data-testid=DelegateTable__footer]").exists).ok();
	await t.click(Selector('[data-testid="DelegateTable__continue-button"]').withText(translations.COMMON.CONTINUE));

	// Vote Transaction
	await t.expect(Selector("h1").withText(translations.TRANSACTION.PAGE_VOTE.FIRST_STEP.TITLE).exists).ok();
	await t.click(Selector("button").withText(translations.COMMON.CONTINUE));

	// Transaction Review
	await t.click(Selector("button").withText(translations.COMMON.CONTINUE));

	// Type mnemonic
	await t.typeText(Selector("[data-testid=AuthenticationStep__mnemonic]"), "passphrase", { replace: true });
	await t.click(Selector("[data-testid=SendVote__button--submit]"));

	// Transaction successful
	await t.expect(Selector("h1").withText(translations.TRANSACTION.SUCCESS.TITLE).exists).ok();
});
