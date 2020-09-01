import { Selector } from "testcafe";

import { getPageURL } from "../../../utils/e2e-utils";
import { goToNews } from "./common";

const itemsPerPage = 15;

fixture`News routing`.page(getPageURL());

test("should navigate to news page", async (t) => await goToNews(t));

test("should navigate between pages", async (t) => {
	await goToNews(t);

	await t.expect(Selector('[data-testid="NewsCard"]').count).eql(itemsPerPage);

	await t.hover(Selector('[data-testid="Pagination__next"]'));

	await t.click(Selector('[data-testid="Pagination__next"]'));
	await t.expect(Selector('[data-testid="NewsCard"]').exists).ok();
	await t.expect(Selector('[data-testid="NewsCard"]').count).eql(itemsPerPage);

	await t.hover(Selector('[data-testid="Pagination__previous"]'));
	await t.click(Selector('[data-testid="Pagination__previous"]'));

	await t.expect(Selector('[data-testid="NewsCard"]').exists).ok();
	await t.expect(Selector('[data-testid="NewsCard"]').count).eql(itemsPerPage);
});
