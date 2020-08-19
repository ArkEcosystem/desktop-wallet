import { ClientFunction, Selector } from "testcafe";

import { buildTranslations as translations } from "../../../app/i18n/helpers";
import { getPageURL } from "../../../utils/e2e-utils";
import { goToNews } from "./common";

const scrollTop = ClientFunction(() => {
	window.scrollTo({ top: 0 });
});

fixture`News screen routing`.page(getPageURL()).beforeEach(goToNews);
const itemsPerPage = 15;

test("should display news feed", async (t) => {
	await scrollTop();

	await t.expect(Selector('[data-testid="NewsCard"]').exists).ok();
	await t.expect(Selector('[data-testid="NewsCard"]').count).eql(itemsPerPage);
});

test("should navigate between pages", async (t) => {
	await t.expect(Selector('[data-testid="NewsCard"]').count).eql(itemsPerPage);

	await t.hover(Selector('[data-testid="CompactPagination__next"]'));

	await t.expect(Selector('[data-testid="CompactPagination__previous"]').hasAttribute("disabled")).ok();

	await t.click(Selector('[data-testid="CompactPagination__next"]'));
	await t.expect(Selector('[data-testid="NewsCard"]').exists).ok();
	await t.expect(Selector('[data-testid="NewsCard"]').count).eql(itemsPerPage);

	await t.expect(Selector('[data-testid="CompactPagination__previous"]').hasAttribute("disabled")).notOk();
	await t.hover(Selector('[data-testid="CompactPagination__previous"]'));
	await t.click(Selector('[data-testid="CompactPagination__previous"]'));

	await t.expect(Selector('[data-testid="NewsCard"]').exists).ok();
	await t.expect(Selector('[data-testid="NewsCard"]').count).eql(itemsPerPage);
});

test("should filter news results", async (t) => {
	// Filter technical category
	const technical = translations().NEWS.CATEGORIES.TECHNICAL;
	const eth = "network__option--1";
	const query = "the block";

	const queryInput = Selector('[data-testid="NewsOptions__search"]');
	await t.typeText(queryInput, query, { replace: true });

	await t.click(Selector(`[data-testid='NewsOptions__category-${technical}']`));
	await t.click(Selector(`[data-testid=${eth}]`));
	await t.click(Selector(`[data-testid=NewsOptions__submit]`));

	await t.expect(Selector('[data-testid="NewsCard"]').exists).ok();
	await t.expect(Selector('[data-testid="NewsCard__category"]').withText(technical).exists).ok();
	await t.expect(Selector('[data-testid="NetworkIcon-ETH-mainnet"]').exists).ok();
	await t.expect(Selector('[data-testid="NewsCard__content"]').withText(query).exists).ok();
});

test("should show no results screen", async (t) => {
	// Filter technical category
	const query = "fjdskfjdfsdjfkdsfjdsfsd";

	const queryInput = Selector('[data-testid="NewsOptions__search"]');
	await t.typeText(queryInput, query, { replace: true });

	await t.click(Selector(`[data-testid=NewsOptions__submit]`));

	await t.expect(Selector('[data-testid="News__empty-results"]').exists).ok();
});
