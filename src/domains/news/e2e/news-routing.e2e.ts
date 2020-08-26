import { Selector } from "testcafe";

import { getPageURL } from "../../../utils/e2e-utils";
import { goToNews } from "./common";

fixture`News routing`.page(getPageURL());

test("should navigate to news page", async (t) => await goToNews(t));

test("should navigate between pages", async (t) => {
	await goToNews(t);

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
