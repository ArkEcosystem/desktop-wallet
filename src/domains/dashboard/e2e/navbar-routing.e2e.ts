import { Selector } from "testcafe";

import { buildTranslations } from "../../../app/i18n/helpers";
import { createFixture, getLocation, mockRequest } from "../../../utils/e2e-utils";

const translations = buildTranslations();

createFixture(`NavBar routing`, [
	mockRequest("https://platform.ark.io/api/coins/signals?coins=ARK&page=1", { data: [], meta: {} }),
]);

test("should navigate to profile dashboard", async (t) => {
	await t.click(Selector("span").withText("John Doe"));
});

test("should navigate to plugins", async (t) => {
	await t.click(Selector("span").withText("John Doe"));
	await t.click(Selector("a").withExactText(translations.COMMON.PLUGINS));
	await t.expect(getLocation()).contains("/plugins");
	await t.expect(Selector("h1").withExactText(translations.PLUGINS.PAGE_PLUGIN_MANAGER.TITLE).exists).ok();
});

test("should navigate to exchange", async (t) => {
	await t.click(Selector("span").withText("John Doe"));
	await t.click(Selector("a").withExactText(translations.EXCHANGE.PAGE_EXCHANGES.TITLE));
	await t.expect(getLocation()).contains("/exchange");
	await t.expect(Selector("h1").withExactText(translations.EXCHANGE.PAGE_EXCHANGES.TITLE).exists).ok();
});

test("should navigate to news", async (t) => {
	await t.click(Selector("span").withText("John Doe"));
	await t.click(Selector("a").withExactText(translations.NEWS.NEWS));
	await t.expect(getLocation()).contains("/news");
	await t.expect(Selector("h1").withExactText(translations.NEWS.PAGE_NEWS.TITLE).exists).ok();
});

test("should navigate to transaction send page", async (t) => {
	await t.click(Selector("span").withText("John Doe"));
	await t.expect(Selector("[data-testid=navbar__buttons--send]").hasAttribute("disabled")).notOk();
	await t.click(Selector("[data-testid=navbar__buttons--send]"));
	await t.click(Selector("div").withExactText(translations.TRANSACTION.PAGE_TRANSACTION_SEND.FIRST_STEP.DESCRIPTION));
	await t.expect(getLocation()).contains("/send-transfer");
});

test("should navigate back to portfolio", async (t) => {
	await t.click(Selector("span").withText("John Doe"));
	await t.click(Selector("a").withExactText(translations.NEWS.NEWS));
	await t.click(Selector("a").withExactText(translations.COMMON.PORTFOLIO));
	await t.expect(getLocation()).contains("/dashboard");
});
