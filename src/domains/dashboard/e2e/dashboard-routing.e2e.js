import { Selector } from "testcafe";

fixture`Dashboard routing`.page`http://localhost:3000/`;

test("should navigate to dashboard", async (t) => {
	await t.click(Selector("p").withText("Anne Doe"));
	await t.expect(Selector("div").withText("Wallets").exists).ok();
});
