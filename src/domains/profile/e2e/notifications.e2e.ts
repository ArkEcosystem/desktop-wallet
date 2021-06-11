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
	mockRequest(
		"https://dwallets.ark.io/api/transactions/f396d8ca7040d5dbdd706d2ba61a3aa2dd02fdf58ffd605b80ed36b52cc39bb1",
		"coins/ark/devnet/transactions/transfer",
	),
	mockRequest(
		"https://dwallets.ark.io/api/transactions/e6fcdca7c3f95f809c784ace7d360710128f2070ee95e21beee87312ba632d4b",
		"coins/ark/devnet/transactions/transfer",
	),
	mockRequest(
		"https://dwallets.ark.io/api/transactions/ee3739c4705393f847e41f4ccc7ba436e434a8a430cba18921b2128d6b18f0dd",
		"coins/ark/devnet/transactions/transfer",
	),
	mockRequest(
		"https://dwallets.ark.io/api/transactions/59c8867267bed07b90567a6ac610a5b4dd4431e07789987b50f3804219618520",
		"coins/ark/devnet/transactions/transfer",
	),
	mockRequest(
		"https://dwallets.ark.io/api/transactions/b0b409f48ed878d98ada880b3d85ff8834f3363d4aff0b9fdcb38fd32acb5320",
		"coins/ark/devnet/transactions/transfer",
	),
	mockRequest(
		"https://dwallets.ark.io/api/transactions/91097d212e343cb7cebc0cb34f6c7051902fe3072355514145221832bcdc6599",
		"coins/ark/devnet/transactions/transfer",
	),
	mockRequest(
		"https://dwallets.ark.io/api/transactions/8c7b53e0114801a0738651d31572981dedb0b85f769fb1b84bee3724f6e63ded",
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
