import { ClientFunction, Selector } from "testcafe";

fixture`Welcome -> Create Profile routing`.page`http://localhost:3000`;

const getLocation = ClientFunction(() => document.location.href);

test("should navigate to create profile and get back to welcome screen", async (t) => {
	await t.click(Selector("button").withExactText("Create Profile"));
	await t.expect(getLocation()).contains("http://localhost:3000/profiles/create");
	await t.click(Selector("h1").withExactText("Create Profile"));

	// Back to welcome screen
	await t.click(Selector("button").withExactText("Back"));
	await t.click(Selector("h1").withExactText("Welcome to ARK"));
	await t.expect(getLocation()).contains("http://localhost:3000/");
});
