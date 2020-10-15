import { renderHook } from "@testing-library/react-hooks";
import nock from "nock";
import { env, getDefaultProfileId } from "utils/testing-library";

import { useNotifications } from "./notifications";

const NotificationsTransactionsFixture = require("tests/fixtures/coins/ark/devnet/notification-transactions.json");
const TransactionsFixture = require("tests/fixtures/coins/ark/devnet/transactions.json");

describe("Notifications Hook", () => {
	beforeAll(() => {
		nock("https://dwallets.ark.io")
			.get("/api/transactions")
			.query(true)
			.reply(200, {
				data: [...NotificationsTransactionsFixture.data, ...TransactionsFixture.data],
				meta: TransactionsFixture.meta,
			})
			.persist();
	});

	it("should create and save notifications from received transactions", async () => {
		const { result } = renderHook(() => useNotifications(env));
		const { notifications } = result.current;

		const transactionNotifications = await notifications.syncReceivedTransactions();
		expect(transactionNotifications.length).toEqual(1);

		const savedNotification = env
			.profiles()
			.findById(getDefaultProfileId())
			.notifications()
			.get(transactionNotifications[0].id);
		expect(savedNotification).toBeTruthy();
	});
});
