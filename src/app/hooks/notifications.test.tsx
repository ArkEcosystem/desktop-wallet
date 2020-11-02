import { renderHook } from "@testing-library/react-hooks";
import nock from "nock";
import React from "react";
import { env, getDefaultProfileId } from "utils/testing-library";

import { useNotifications } from "./notifications";

const NotificationsTransactionsFixture = require("tests/fixtures/coins/ark/devnet/notification-transactions.json");
const TransactionsFixture = require("tests/fixtures/coins/ark/devnet/transactions.json");

import { EnvironmentProvider } from "app/contexts";

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
		const wrapper = ({ children }: any) => <EnvironmentProvider env={env}> {children} </EnvironmentProvider>;
		const { result } = renderHook(() => useNotifications(), { wrapper });

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
