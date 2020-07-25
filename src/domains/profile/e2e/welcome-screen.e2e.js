import { ClientFunction, Selector } from "testcafe";

fixture`Welcome Screen routing`.page`http://localhost:3000`;

const getLocation = ClientFunction(() => document.location.href);

test("should load profiles welcome page", async (t) => {
	await t.click(Selector("h1").withExactText("Welcome to ARK"));
	await t.expect(getLocation()).contains("http://localhost:3000/");
});
