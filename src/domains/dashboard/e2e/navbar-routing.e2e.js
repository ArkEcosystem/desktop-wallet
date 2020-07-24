import { ClientFunction, Selector } from "testcafe";

fixture`NavBar routing`.page`http://localhost:3000`;

const getLocation = ClientFunction(() => document.location.href);

test("should navigate to profile dashboard", async (t) => {
	await t.click(Selector("p").withExactText("Anne Doe"));
});

test("should navigate to plugins", async (t) => {
	await t.click(Selector("p").withExactText("Anne Doe"));
	await t.click(Selector("a").withExactText("Plugins"));
	await t.expect(getLocation()).contains("/plugins");
	await t.expect(Selector("h1").withExactText("Plugin Manager").exists).ok();
});

test("should navigate to exchange", async (t) => {
	await t.click(Selector("p").withExactText("Anne Doe"));
	await t.click(Selector("a").withExactText("Exchange"));
	await t.expect(getLocation()).contains("/exchange");
	await t.expect(Selector("h1").withExactText("Exchange").exists).ok();
});

test("should navigate to news", async (t) => {
	await t.click(Selector("p").withExactText("Anne Doe"));
	await t.click(Selector("a").withExactText("News"));
	await t.expect(getLocation()).contains("/news");
	await t.expect(Selector("a").withExactText("News").exists).ok();
});

test("should navigate to transaction send page", async (t) => {
	await t.click(Selector("p").withExactText("Anne Doe"));
	await t.click(Selector("[data-testid=navbar__buttons--send]"));
	await t.click(Selector("div").withExactText("Enter details to send your money"));
	await t.expect(getLocation()).contains("/transactions/transfer");
});

test("should navigate back to portfolio", async (t) => {
	await t.click(Selector("p").withExactText("Anne Doe"));
	await t.click(Selector("a").withExactText("News"));
	await t.click(Selector("a").withExactText("Go back to Portfolio"));
	await t.expect(getLocation()).contains("/dashboard");
});
