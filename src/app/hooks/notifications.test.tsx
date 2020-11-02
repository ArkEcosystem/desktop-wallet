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

	it("should push wallet update notification for all profiles", () => {
		const wrapper = ({ children }: any) => <EnvironmentProvider env={env}> {children} </EnvironmentProvider>;
		const { result } = renderHook(() => useNotifications(), { wrapper });

		const { notifications } = result.current;

		notifications.notifyWalletUpdate({ version: "3.0.0" });
		const newNotification = env
			.profiles()
			.values()[0]
			.notifications()
			.values()
			.find((n) => n?.meta?.version === "3.0.0");

		expect(newNotification).toBeDefined();
		expect(newNotification?.action).toEqual("update");
		expect(newNotification?.type).toEqual("wallet");
		expect(newNotification?.meta?.version).toEqual("3.0.0");
	});

	it("should not push wallet update notification if exists", () => {
		const wrapper = ({ children }: any) => <EnvironmentProvider env={env}> {children} </EnvironmentProvider>;
		const { result } = renderHook(() => useNotifications(), { wrapper });

		const { notifications } = result.current;

		const initialNotificationsCount = env.profiles().values()[0].notifications().count();
		notifications.notifyWalletUpdate({ version: "2.5.6" });
		const notificationsCount = env.profiles().values()[0].notifications().count();
		expect(notificationsCount).toEqual(initialNotificationsCount);
	});
});
