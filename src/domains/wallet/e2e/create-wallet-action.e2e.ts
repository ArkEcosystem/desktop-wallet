import { Selector } from "testcafe";

import { buildTranslations as translations } from "../../../app/i18n/helpers";
import { BASEURL, createFixture, mockRequest } from "../../../utils/e2e-utils";

// match(new RegExp(base + "wallets\/([-0-9a-zA-Z]{1,34})"))

createFixture(`Create Wallet action`, [], [
	mockRequest(
		(request: any) => !!request.url.match(new RegExp(BASEURL + "wallets\/([-0-9a-zA-Z]{1,34})")),
		"coins/ark/wallets/not-found",
		404,
	),
]);

test("should create a wallet", async (t) => {
	const mnemonicWords = [];
	await t.click(Selector("p").withText("John Doe"));
	await t.expect(Selector("div").withText(translations().COMMON.WALLETS).exists).ok();

	// Navigate to create page
	await t.click(Selector("button").withExactText(translations().COMMON.CREATE));
	await t
		.expect(Selector("div").withText(translations().WALLETS.PAGE_CREATE_WALLET.CRYPTOASSET_STEP.SUBTITLE).exists)
		.ok();

	// Select a cryptoasset and advance to step two
	await t.click('[data-testid="SelectNetworkInput__input"]');
	await t.click(Selector("#CreateWallet__network-item-1"));
	await t
		.expect(Selector("button").withText(translations().COMMON.CONTINUE).hasAttribute("disabled"))
		.notOk("Cryptoasset selected", { timeout: 5000 });
	await t.click(Selector("button").withExactText(translations().COMMON.CONTINUE));
	await t.click(Selector("h1").withExactText(translations().COMMON.YOUR_PASSPHRASE));

	// Show passphrase and go to third step
	const mnemonicsCount = await Selector("[data-testid=MnemonicList__item]").count;

	for (let i = 0; i <= mnemonicsCount - 1; i++) {
		const textContent = await Selector("[data-testid=MnemonicList__item]").nth(i).textContent;

		mnemonicWords.push(textContent.replace(/[0-9]+/, "").trim());
	}
	await t.click(Selector("button").withExactText(translations().COMMON.CONTINUE));
~
	// Confirm your password
	await t.expect(Selector("button").withText(translations().COMMON.CONTINUE).hasAttribute("disabled")).ok();
	for (let i = 0; i < 3; i++) {
		const selectWordPhrase = await Selector("[data-testid=MnemonicVerificationOptions__title]").textContent;
		const wordNumber = selectWordPhrase.replace(/Select word #/, "");
		await t.click(
			Selector("[data-testid=MnemonicVerificationOptions__button]").withText(
				new RegExp(`^${mnemonicWords[Number(wordNumber) - 1]}$`),
			),
		);
	}

	await t.click(Selector("button").withExactText(translations().COMMON.CONTINUE));
	await t.expect(Selector("h1").withExactText(translations().COMMON.COMPLETED).exists).ok();

	// Save and finish
	await t.click(Selector("button").withExactText(translations().COMMON.SAVE_FINISH));
	await t.expect(Selector("div").withExactText(translations().COMMON.WALLETS).exists).ok();
});
