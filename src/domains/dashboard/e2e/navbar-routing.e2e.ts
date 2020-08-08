import { ClientFunction, Selector } from "testcafe";

import { buildTranslations as translations } from "../../../app/i18n/helpers";
import { getPageURL } from "../../../utils/e2e-utils";

fixture`NavBar routing`.page(getPageURL());

const getLocation = ClientFunction(() => document.location.href);

test("should navigate to profile dashboard", async (t) => {
	await t.click(Selector("p").withExactText("John Doe"));
});

test("should navigate to plugins", async (t) => {
	await t.click(Selector("p").withExactText("John Doe"));
	await t.click(Selector("a").withExactText(translations().COMMON.PLUGINS));
	await t.expect(getLocation()).contains("/plugins");
	await t.expect(Selector("h1").withExactText(translations().PLUGINS.PAGE_PLUGIN_MANAGER.TITLE).exists).ok();
});

test("should navigate to exchange", async (t) => {
	await t.click(Selector("p").withExactText("John Doe"));
	await t.click(Selector("a").withExactText(translations().EXCHANGE.PAGE_EXCHANGE.TITLE));
	await t.expect(getLocation()).contains("/exchange");
	await t.expect(Selector("h1").withExactText(translations().EXCHANGE.PAGE_EXCHANGE.TITLE).exists).ok();
});

test("should navigate to news", async (t) => {
	await t.click(Selector("p").withExactText("John Doe"));
	await t.click(Selector("a").withExactText(translations().NEWS.NEWS));
	await t.expect(getLocation()).contains("/news");
	await t.expect(Selector("h1").withExactText(translations().NEWS.PAGE_NEWS.TITLE).exists).ok();
});

test("should navigate to transaction send page", async (t) => {
	await t.click(Selector("p").withExactText("John Doe"));
	await t.click(Selector("[data-testid=navbar__buttons--send]"));
	await t.click(
		Selector("div").withExactText(translations().TRANSACTION.PAGE_TRANSACTION_SEND.FIRST_STEP.DESCRIPTION),
	);
	await t.expect(getLocation()).contains("/transactions/transfer");
});

test("should navigate back to portfolio", async (t) => {
	await t.click(Selector("p").withExactText("John Doe"));
	await t.click(Selector("a").withExactText(translations().NEWS.NEWS));
	await t.click(Selector("a").withExactText(translations().COMMON.GO_BACK_TO_PORTFOLIO));
	await t.expect(getLocation()).contains("/dashboard");
});
