import { Selector } from "testcafe";

import { CustomSelector, CustomSnapshot } from "../../../utils/e2e-interfaces";
import { getPageURL, scrollToBottom } from "../../../utils/e2e-utils";
import { goToWallet } from "./common";

fixture`Wallet Details`.page(getPageURL()).beforeEach(async (t) => await goToWallet(t));

// TODO: Investigate better and fix why loading is immediate in e2e
// test("should show initial loading state", async (t) => {
// 	await t
// 		.expect(Selector("[data-testid=WalletRegistrations__skeleton]").exists)
// 		.ok()
// 		.expect(Selector("[data-testid=WalletVote__skeleton]").exists)
// 		.ok()
// 		.expect(Selector("[data-testid=TransactionRow__skeleton]").exists)
// 		.ok();
// });

test("should load transactions with load more action", async (t) => {
	// Check for transactions rows
	await t.expect(Selector("[data-testid=TransactionRow]").exists).ok();
	await t.expect(Selector("[data-testid=transactions__fetch-more-button]").exists).ok();

	const count = await Selector("[data-testid=TransactionRow]").count;

	await scrollToBottom();

	await t.click(Selector("[data-testid=transactions__fetch-more-button]"));

	await t.expect(Selector("[data-testid=TransactionRow]").count).gt(count);
});

test("should star a wallet", async (t) => {
	const starButton = <CustomSelector>Selector("[data-testid=WalletHeader__star-button]").addCustomDOMProperties({
		innerHTML: (el) => el.innerHTML,
	});

	const starButtonContent = (<CustomSnapshot>await starButton()).innerHTML;

	await t.click(starButton);

	await t.expect(starButton.innerHTML).notEql(starButtonContent);
});
