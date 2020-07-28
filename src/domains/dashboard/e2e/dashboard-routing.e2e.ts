import { Selector } from "testcafe";

import { buildTranslations as translations } from "../../../app/i18n/helpers";

fixture`Dashboard routing`.page`http://localhost:3000/`;

test("should navigate to dashboard", async (t) => {
	await t.click(Selector("p").withText("John Doe"));
	await t.expect(Selector("div").withText(translations().COMMON.WALLETS).exists).ok();
});
