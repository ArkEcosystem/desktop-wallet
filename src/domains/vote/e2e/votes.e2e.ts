import { Selector } from "testcafe";

import { buildTranslations } from "../../../app/i18n/helpers";
import { createFixture, mockRequest, requestMocks } from "../../../utils/e2e-utils";
import { goToWallet } from "./common";

const translations = buildTranslations();

const requestMocksCopy = { ...requestMocks };

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
]).beforeEach(async (t) => await goToWallet(t));

test("should navigate to votes page from navigation bar", async (t) => {
	await t.click(Selector('[data-testid="navbar__useractions"]'));
	await t.expect(Selector('[data-testid="dropdown__option--1"]').withText(translations.COMMON.VOTES).exists).ok();
	await t.click(Selector('[data-testid="dropdown__option--1"]').withText(translations.COMMON.VOTES));

	await t.expect(Selector("h1").withText(translations.VOTE.VOTES_PAGE.TITLE).exists).ok();
});

test("should select network, address and delegate", async (t) => {
	await t.click(Selector('[data-testid="navbar__useractions"]'));
	await t.expect(Selector('[data-testid="dropdown__option--1"]').withText(translations.COMMON.VOTES).exists).ok();
	await t.click(Selector('[data-testid="dropdown__option--1"]').withText(translations.COMMON.VOTES));

	await t.expect(Selector("h1").withText(translations.VOTE.VOTES_PAGE.TITLE).exists).ok();

	// Select network
	await t.click(Selector("#Votes__network-item-1"));

	// Select address
	await t.expect(Selector("h2").withText(translations.VOTE.ADDRESS_TABLE.TITLE).exists).ok();
	await t.click(Selector('[data-testid="AddressRow__select-0"]').withText(translations.COMMON.SELECT));

	// Select delegate
	await t.expect(Selector("h2").withText(translations.VOTE.DELEGATE_TABLE.TITLE).exists).ok();
	await t.click(Selector('[data-testid="DelegateRow__toggle-0"]').withText(translations.COMMON.SELECT));
	await t.expect(Selector("[data-testid=DelegateTable__footer]").exists).ok();
	await t.click(Selector('[data-testid="DelegateTable__continue-button"]').withText(translations.COMMON.CONTINUE));

	// Vote Transaction
	await t.expect(Selector("h1").withText(translations.TRANSACTION.PAGE_VOTE.FIRST_STEP.TITLE).exists).ok();
});
