import { Selector } from "testcafe";

fixture`Create Wallet action`.page`http://localhost:3000/`;

test("should create a wallet", async (t) => {
	const mnemonicWords = [];
	await t.click(Selector("p").withText("Anne Doe"));
	await t.expect(Selector("div").withText("Wallets").exists).ok();
	// Navigate to create page
	await t.click(Selector("button").withExactText("Create"));
	await t.expect(Selector("div").withText("Select a Network to create your new wallet address").exists).ok();

	// Select a network and advance to step two
	await t.click(Selector("#CreateWallet__network-item-1"));
	await t
		.expect(Selector("button").withText("Continue").hasAttribute("disabled"))
		.notOk("Network selected", { timeout: 5000 });
	await t.click(Selector("button").withExactText("Continue"));
	await t.click(Selector("h1").withExactText("Your Passphrase"));

	// Show passphrase and go to third step
	const mnemonicsCount = await Selector("[data-testid=MnemonicList__item]").count;

	for (let i = 0; i <= mnemonicsCount - 1; i++) {
		const textContent = await Selector("[data-testid=MnemonicList__item]").nth(i).textContent;

		mnemonicWords.push(textContent.replace(/[0-9]+/, "").trim());
	}
	await t.click(Selector("button").withExactText("Continue"));

	// Confirm your password
	await t.expect(Selector("button").withText("Continue").hasAttribute("disabled")).ok();
	for (let i = 0; i < 3; i++) {
		const selectWordPhrase = await Selector("[data-testid=MnemonicVerificationOptions__title]").textContent;
		const wordNumber = selectWordPhrase.replace(/Select word #/, "");
		await t.click(
			Selector("[data-testid=MnemonicVerificationOptions__button]").withText(
				new RegExp(`^${mnemonicWords[wordNumber - 1]}$`),
			),
		);
	}

	await t.click(Selector("button").withExactText("Continue"));
	await t.expect(Selector("h1").withExactText("Completed").exists).ok();

	// Save and finish
	await t.click(Selector("button").withExactText("Save & Finish"));
	await t.expect(Selector("div").withExactText("Wallets").exists).ok();
});
