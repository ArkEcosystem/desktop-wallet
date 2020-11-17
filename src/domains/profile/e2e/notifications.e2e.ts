import { Selector } from "testcafe";

import { buildTranslations } from "../../../app/i18n/helpers";
import { createFixture, mockRequest } from "../../../utils/e2e-utils";
import { goToProfile } from "./common";

const translations = buildTranslations();

createFixture(`Profile notifications`, [
	mockRequest(
		"https://dwallets.ark.io/api/transactions/ea63bf9a4b3eaf75a1dfff721967c45dce64eb7facf1aef29461868681b5c79b",
		"coins/ark/devnet/transactions/transfer",
	),
	mockRequest(
		"https://dwallets.ark.io/api/transactions/1a767ebc0cc53246b9105a9f09b6c2ffa7baedcc7e632c8c1bac58f8f17389f6",
		"coins/ark/devnet/transactions/transfer",
	),
]).beforeEach(async (t) => await goToProfile(t));

test("should show red dot for unread notifications", async (t) => {
	await t.expect(Selector("[data-testid=navbar__buttons--notifications] .rounded-full").exists).ok();
});

test("should mark notifications as read and hide red dot", async (t) => {
	await t.expect(Selector("[data-testid=navbar__buttons--notifications] .rounded-full").exists).ok();
	await t.click(Selector("[data-testid=navbar__buttons--notifications"));

	await t.expect(Selector("[data-testid=NotificationsWrapper]").exists).ok();
	await t.expect(Selector("[data-testid=NotificationItem]").count).eql(2);
	await t.hover(Selector("[data-testid=NotificationItem]:last-child"));

	await t.expect(Selector("[data-testid=navbar__buttons--notifications] .rounded-full").exists).notOk();
});

test("should open notifications and see notifications list", async (t) => {
	await t.expect(Selector("[data-testid=navbar__buttons--notifications]").exists).ok();
	await t.click(Selector("[data-testid=navbar__buttons--notifications]"));

	await t.expect(Selector("[data-testid=NotificationsWrapper]").exists).ok();
	await t.expect(Selector("[data-testid=NotificationItem]").count).eql(2);
});

test("should open notifications and see transactions list", async (t) => {
	await t.expect(Selector("[data-testid=navbar__buttons--notifications").exists).ok();
	await t.click(Selector("[data-testid=navbar__buttons--notifications"));

	await t.expect(Selector("[data-testid=NotificationsWrapper]").exists).ok();
	await t.expect(Selector("[data-testid=NotificationItem]").count).eql(2);

	await t.expect(Selector("[data-testid=TransactionTable]").exists).ok();
	await t.hover(Selector("[data-testid=TransactionTable]"));
	await t.expect(Selector("[data-testid=NotificationsWrapper] [data-testid=TableRow]").count).gt(0);
});

test("should open and close transaction details modal", async (t) => {
	await t.expect(Selector("[data-testid=navbar__buttons--notifications").exists).ok();
	await t.click(Selector("[data-testid=navbar__buttons--notifications"));

	await t.expect(Selector("[data-testid=NotificationsWrapper]").exists).ok();
	await t.expect(Selector("[data-testid=NotificationItem]").count).eql(2);

	await t.expect(Selector("[data-testid=TransactionTable]").exists).ok();
	await t.hover(Selector("[data-testid=TransactionTable]"));
	await t.expect(Selector("[data-testid=NotificationsWrapper] [data-testid=TableRow]").count).gt(0);

	await t.click(Selector("[data-testid=NotificationsWrapper] [data-testid=TableRow]:first-child"));
	await t.expect(Selector("[data-testid=modal__inner]").exists).ok();

	await t.click(Selector("[data-testid=modal__close-btn]"));
	await t.expect(Selector("[data-testid=modal__inner]").exists).notOk();
});
