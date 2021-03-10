import { Selector } from "testcafe";

import { buildTranslations } from "../../../app/i18n/helpers";
import { createFixture, mockRequest } from "../../../utils/e2e-utils";
import { goToProfile } from "../../profile/e2e/common";
import { goToWallet, importWallet } from "../../wallet/e2e/common";
import { goToTransferPage } from "./common";

const translations = buildTranslations();

createFixture(`Multiple Transfer action`, [
	mockRequest(
		{
			url: "https://dwallets.ark.io/api/transactions",
			method: "POST",
		},
		{
			data: {
				accept: ["transaction-id"],
				broadcast: ["transaction-id"],
				excess: [],
				invalid: [],
			},
		},
	),
]);

test("should send multiple transfer successfully", async (t) => {
	// Navigate to profile page
	await goToProfile(t);

	// Import wallet
	await importWallet(t, "passphrase");

	// Navigate to transfer page
	await goToTransferPage(t);

	// Select multiple button
	await t.click(Selector("[data-testid=AddRecipient__multi]"));

	await t.typeText(Selector("[data-testid=AddRecipient__amount]"), "10", { replace: true });

	// Add recipient #1
	await t.typeText(Selector("[data-testid=SelectDropdownInput__input]"), "D7JJ4ZfkJDwDCwuwzhtbCFapBUCWU3HHGP", {
		paste: true,
	});
	await t.pressKey("tab");
	await t.pressKey("enter");

	await t.click(Selector("button").withText(translations.TRANSACTION.ADD_RECIPIENT));

	// Go to step 2
	await t.expect(Selector("button").withText(translations.COMMON.CONTINUE).hasAttribute("disabled")).notOk();
	await t.click(Selector("button").withText(translations.COMMON.CONTINUE));
	await t
		.expect(Selector("h1").withText(translations.TRANSACTION.PAGE_TRANSACTION_SEND.SECOND_STEP.TITLE).exists)
		.ok();
	await t.click(Selector("button").withText(translations.COMMON.CONTINUE));

	// Type mnemonic
	await t.typeText(Selector("[data-testid=AuthenticationStep__mnemonic]"), "passphrase", { replace: true });
	await t.click(Selector("[data-testid=SendTransfer__button--submit]"));

	// Transaction successful
	await t.expect(Selector("h1").withText(translations.TRANSACTION.SUCCESS.TITLE).exists).ok({ timeout: 5000 });
});

test("should show an error if wrong mnemonic", async (t: any) => {
	// Navigate to profile page
	await goToProfile(t);

	// Navigate to wallet page
	await goToWallet(t);

	// Navigate to transfer page
	await goToTransferPage(t);

	// Select multiple button
	await t.click(Selector("[data-testid=AddRecipient__multi]"));

	// Add recipient #1
	await t.typeText(Selector("[data-testid=AddRecipient__amount]"), "10", { replace: true });
	await t.typeText(Selector("[data-testid=SelectDropdownInput__input]"), "DReUcXWdCz2QLKzHM9NdZQE7fAwAyPwAmd", {
		paste: true,
	});
	await t.click(Selector("button").withText(translations.TRANSACTION.ADD_RECIPIENT));

	// Add recipient #2
	await t.typeText(Selector("[data-testid=SelectDropdownInput__input]"), "D7JJ4ZfkJDwDCwuwzhtbCFapBUCWU3HHGP", {
		paste: true,
		replace: true,
	});
	await t.typeText(Selector("[data-testid=AddRecipient__amount]"), "10", { replace: true });

	await t.click(Selector("button").withText(translations.TRANSACTION.ADD_RECIPIENT));

	// Go to step 2
	await t.click(Selector("button").withText(translations.COMMON.CONTINUE));
	await t
		.expect(Selector("h1").withText(translations.TRANSACTION.PAGE_TRANSACTION_SEND.SECOND_STEP.TITLE).exists)
		.ok();
	await t.click(Selector("button").withText(translations.COMMON.CONTINUE));

	// Type wrong mnemonic
	await t.typeText(Selector("[data-testid=AuthenticationStep__mnemonic]"), "wrong mnemonic", { replace: true });
	await t.click(Selector("[data-testid=SendTransfer__button--submit]"));
	await t.expect(Selector("[data-testid=AuthenticationStep__mnemonic]").hasAttribute("aria-invalid")).ok();
});

test("should not clear values when returning a step", async (t: any) => {
	// Navigate to profile page
	await goToProfile(t);

	// Navigate to wallet page
	await goToWallet(t);

	// Navigate to transfer page
	await goToTransferPage(t);

	// Select multiple button
	await t.click(Selector("[data-testid=AddRecipient__multi]"));

	// Add recipient #1
	await t.typeText(Selector("[data-testid=AddRecipient__amount]"), "10", { replace: true });
	await t.typeText(Selector("[data-testid=SelectDropdownInput__input]"), "DReUcXWdCz2QLKzHM9NdZQE7fAwAyPwAmd", {
		paste: true,
	});
	await t.click(Selector("button").withText(translations.TRANSACTION.ADD_RECIPIENT));

	// Add recipient #2
	await t.typeText(Selector("[data-testid=SelectDropdownInput__input]"), "D7JJ4ZfkJDwDCwuwzhtbCFapBUCWU3HHGP", {
		paste: true,
		replace: true,
	});
	await t.typeText(Selector("[data-testid=AddRecipient__amount]"), "10", { replace: true });

	await t.click(Selector("button").withText(translations.TRANSACTION.ADD_RECIPIENT));

	// Go to step 2
	await t.click(Selector("button").withText(translations.COMMON.CONTINUE));
	await t
		.expect(Selector("h1").withText(translations.TRANSACTION.PAGE_TRANSACTION_SEND.SECOND_STEP.TITLE).exists)
		.ok();
	await t.click(Selector("button").withText(translations.COMMON.BACK));

	await t.expect(Selector("[data-testid=AddRecipient__multi]").exists).ok();
	await t.expect(Selector("[data-testid=recipient-list__recipient-list-item]").count).eql(2);
});
