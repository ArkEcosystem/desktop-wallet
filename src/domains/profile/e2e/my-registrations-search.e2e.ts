import { Selector } from "testcafe";

import { createFixture } from "../../../utils/e2e-utils";
import { goToMyRegistrations } from "./common";

createFixture(`My Registrations Search`).beforeEach(async (t) => await goToMyRegistrations(t));

test("should search and find delegate wallet", async (t: any) => {
	await t.expect(Selector("[data-testid=DelegateRegistrations] [data-testid=TableRow]").exists).ok();

	await t.click(Selector("[data-testid=header-search-bar__button]"));
	await t.typeText(Selector("[data-testid=header-search-bar__input"), "testwallet", { replace: true });

	await t.expect(Selector("[data-testid=DelegateRegistrations] [data-testid=TableRow]").exists).ok();
});

test("should search and find business entity", async (t: any) => {
	await t.expect(Selector("[data-testid=BusinessRegistrations] [data-testid=TableRow]").exists).ok();

	await t.click(Selector("[data-testid=header-search-bar__button]"));
	await t.typeText(Selector("[data-testid=header-search-bar__input"), "wallet 2", { replace: true });

	await t.expect(Selector("[data-testid=BusinessRegistrations] [data-testid=TableRow]").exists).ok();
});

test("should search and find plugin entity", async (t: any) => {
	await t.expect(Selector("[data-testid=PluginRegistrations] [data-testid=TableRow]").exists).ok();

	await t.click(Selector("[data-testid=header-search-bar__button]"));
	await t.typeText(Selector("[data-testid=header-search-bar__input"), "wallet 2", { replace: true });

	await t.expect(Selector("[data-testid=PluginRegistrations] [data-testid=TableRow]").exists).ok();
});

test("should search and find no results", async (t: any) => {
	await t.expect(Selector("[data-testid=TableRow]").exists).ok();

	await t.click(Selector("[data-testid=header-search-bar__button]"));
	await t.typeText(Selector("[data-testid=header-search-bar__input"), "1234567890123456789", { replace: true });

	await t.expect(Selector("[data-testid=EmptyResults]").exists).ok();
});

test("should reset search input", async (t: any) => {
	await t.expect(Selector("[data-testid=TableRow]").exists).ok();
	await t.expect(Selector("[data-testid=EmptyResults]").exists).notOk();

	await t.click(Selector("[data-testid=header-search-bar__button]"));
	await t.typeText(Selector("[data-testid=header-search-bar__input"), "1234567890123456789", { replace: true });

	await t.expect(Selector("[data-testid=EmptyResults]").exists).ok();
	await t.expect(Selector("[data-testid=TableRow]").exists).notOk();

	await t.click(Selector("[data-testid=header-search-bar__reset]"));

	await t.expect(Selector("[data-testid=TableRow]").exists).ok();
	await t.expect(Selector("[data-testid=EmptyResults]").exists).notOk();
});
