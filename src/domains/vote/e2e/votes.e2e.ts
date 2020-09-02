import { Selector } from "testcafe";

import { buildTranslations } from "../../../app/i18n/helpers";
import { createFixture } from "../../../utils/e2e-utils";
import { goToWallet } from "./common";

const translations = buildTranslations();

createFixture(`Votes`).beforeEach(async (t) => await goToWallet(t));

test("should navigate to votes page from navigation bar", async (t) => {
	await t.click(Selector('[data-testid="navbar__useractions"]'));
	await t.expect(Selector('[data-testid="dropdown__option--1"]').withText(translations.COMMON.VOTES).exists).ok();
	await t.click(Selector('[data-testid="dropdown__option--1"]').withText(translations.COMMON.VOTES));

	await t.expect(Selector("h1").withText(translations.VOTE.VOTES_PAGE.TITLE).exists).ok();
});

test("should navigate to votes page from wallet card", async (t) => {
	// await t
	// 	.expect(Selector("[data-testid=WalletRegistrations__skeleton]").exists)
	// 	.ok()
	// 	.expect(Selector("[data-testid=WalletVote__skeleton]").exists)
	// 	.ok()
	// 	.expect(Selector("[data-testid=TransactionRow__skeleton]").exists)
	// 	.ok();

	await t.click(Selector('[data-testid="WalletVote__delegate__vote"]').withText(translations.COMMON.VOTE));

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

test("should select a delegate", async (t) => {
	// await t
	// 	.expect(Selector("[data-testid=WalletRegistrations__skeleton]").exists)
	// 	.ok()
	// 	.expect(Selector("[data-testid=WalletVote__skeleton]").exists)
	// 	.ok()
	// 	.expect(Selector("[data-testid=TransactionRow__skeleton]").exists)
	// 	.ok();

	await t.click(Selector('[data-testid="WalletVote__delegate__vote"]').withText(translations.COMMON.VOTE));

	await t.expect(Selector("h1").withText(translations.VOTE.VOTES_PAGE.TITLE).exists).ok();

	// Select delegate
	await t.expect(Selector("h2").withText(translations.VOTE.DELEGATE_TABLE.TITLE).exists).ok();
	await t.click(Selector('[data-testid="DelegateRow__toggle-0"]').withText(translations.COMMON.SELECT));
	await t.expect(Selector("[data-testid=DelegateTable__footer]").exists).ok();
	await t.click(Selector('[data-testid="DelegateTable__continue-button"]').withText(translations.COMMON.CONTINUE));

	// Vote Transaction
	await t.expect(Selector("h1").withText(translations.TRANSACTION.PAGE_VOTE.FIRST_STEP.TITLE).exists).ok();
});
