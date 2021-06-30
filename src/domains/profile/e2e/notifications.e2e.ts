import { Selector } from "testcafe";

import { createFixture, mockRequest } from "../../../utils/e2e-utils";
import { goToProfile } from "./common";

createFixture(`Profile notifications`, [
	mockRequest(
		"https://dwallets.ark.io/api/transactions?page=1&limit=12&address=D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD",
		"coins/ark/devnet/transactions/byAddress/D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD-1-10",
	),
	mockRequest(
		"https://dwallets.ark.io/api/transactions?page=1&limit=12&address=D5sRKWckH4rE1hQ9eeMeHAepgyC3cvJtwb",
		"coins/ark/devnet/transactions/byAddress/D5sRKWckH4rE1hQ9eeMeHAepgyC3cvJtwb-1-10",
	),
]).beforeEach(async (t) => await goToProfile(t));

test("should show red dot for unread notifications", async (t) => {
	await t.expect(Selector("[data-testid=navbar__buttons--notifications] .rounded-full").exists).ok();
});

test.skip("should mark notifications as read and hide red dot", async (t) => {
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
