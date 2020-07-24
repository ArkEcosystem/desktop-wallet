import { Selector } from "testcafe";

fixture`Create Profile action`.page`http://localhost:3000/profiles/create`;

test("should return an error when submit without required fields", async (t) => {
	await t.click(Selector("button").withExactText("Complete"));
	await t.click(Selector("fieldset p").withText("Name is required"));
	await t.click(Selector("fieldset p").withText("Market Provider is required"));
	await t.click(Selector("fieldset p").withText("Currency is required"));
	await t.click(Selector("h1").withExactText("Create Profile"));
});

test("should create a profile and navigate to welcome screen", async (t) => {
	const nameInput = Selector("input[name=name]");

	await t.typeText(nameInput, "John Doe");
	await t.click(Selector("button").withText("Select Market Provider"));
	await t.click(Selector("li.select-list-option").withText("Option 1"));
	await t.click(Selector("button").withText("Select Currency"));
	await t.click(Selector("li.select-list-option").withText("Option 1"));
	await t.click(Selector("input[name=isDarkMode]").parent());
	await t.click(Selector("button").withExactText("Complete"));
	// Check welcome with created profiles
	await t.expect(Selector("p").withText("Anne Doe").exists).ok();
	await t.expect(Selector("p").withText("John Doe").exists).ok();
});
