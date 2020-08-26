import { ClientFunction, Selector } from "testcafe";

import { buildTranslations as translations } from "../../../app/i18n/helpers";
import { getPageURL } from "../../../utils/e2e-utils";

fixture`Wallet Details`.page(getPageURL());

const scroll = ClientFunction((x, y) => window.scrollBy(x, y));

test("should show initial loading state", async (t) => {
	await t.click(Selector("p").withText("John Doe"));
	await t.expect(Selector("div").withText(translations().COMMON.WALLETS).exists).ok();

	await t.setTestSpeed(1);
	// Navigate to wallet details page
	await t.hover(Selector("[data-testid=WalletCard__D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD]"));
	await t.click(Selector("[data-testid=WalletCard__D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD]"));

	await t.expect(Selector("[data-testid=WalletHeader]").exists).ok();
	await t.expect(Selector("[data-testid=WalletRegistrations__skeleton]").exists).ok();
	await t.expect(Selector("[data-testid=WalletVote__skeleton]").exists).ok();
	await t.expect(Selector("[data-testid=TransactionRow__skeleton]").exists).ok();
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

	// Check for transactions rows
	await t.expect(Selector("[data-testid=TransactionRow]").exists).ok();
	await t.expect(Selector("[data-testid=transactions__fetch-more-button]").exists).ok();

	// Make sure the "View More" button is visible
	await scroll(0, 2560);
	await t.click(Selector("[data-testid=transactions__fetch-more-button]"));

	await t.expect(Selector("[data-testid=TransactionRow]").count).eql(48, {
		timeout: 4000,
	});
});
