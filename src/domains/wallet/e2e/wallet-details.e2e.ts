import { ClientFunction, Selector } from "testcafe";

import { buildTranslations as translations } from "../../../app/i18n/helpers";
import { getPageURL } from "../../../utils/e2e-utils";

fixture`Wallet Details`.page(getPageURL());

const scrollTop = ClientFunction(() => {
	window.scrollTo({ top: 0 });
});

test("should open wallet details page", async (t) => {
	await t.click(Selector("p").withText("John Doe"));
	await t.expect(Selector("div").withText(translations().COMMON.WALLETS).exists).ok();

	// Navigate to wallet details page
	await t.click(Selector("[data-testid=WalletCard__D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD]"));
	await t.expect(Selector("[data-testid=WalletHeader]").exists).ok();
});

test("should load transactions with load more action", async (t) => {
	await t.click(Selector("p").withText("John Doe"));
	await t.expect(Selector("div").withText(translations().COMMON.WALLETS).exists).ok();

	// Navigate to wallet details page
	await t.click(Selector("[data-testid=WalletCard__D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD]"));
	await t.expect(Selector("[data-testid=WalletHeader]").exists).ok();
	const fetchMoreButton = Selector("[data-testid=transactions__fetch-more-button]");

	// Check for transactions rows
	await t.expect(Selector("[data-testid=TransactionRow]").exists).ok();
	await t.click(await fetchMoreButton());

	await t.expect(Selector("[data-testid=TransactionRow]").count).eql(48, {
		timeout: 3000,
	});
});
