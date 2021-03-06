import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { renderHook } from "@testing-library/react-hooks";
import { EnvironmentProvider } from "app/contexts";
import nock from "nock";
import React from "react";
import { env, getDefaultProfileId } from "utils/testing-library";

import { useNotifications } from "./use-notifications";

const NotificationsTransactionsFixture = require("tests/fixtures/coins/ark/devnet/notification-transactions.json");
const TransactionsFixture = require("tests/fixtures/coins/ark/devnet/transactions.json");

let profile: Contracts.IProfile;

const wrapper = ({ children }: any) => <EnvironmentProvider env={env}> {children} </EnvironmentProvider>;

describe("Notifications Hook", () => {
	beforeAll(() => {
		profile = env.profiles().findById(getDefaultProfileId());

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
		const { result } = renderHook(() => useNotifications(), { wrapper });

		const { notifications } = result.current;

		const initialNotifications = profile.notifications().values();

		const transactionNotifications = await notifications.syncReceivedTransactions();

		expect(transactionNotifications.length).toEqual(2);

		// shouldn't have new notifications previously
		expect(
			initialNotifications.some((transaction) => transaction.id === transactionNotifications[0].id),
		).toBeFalsy();

		// should create new notifications
		expect(profile.notifications().has(transactionNotifications[0].id)).toBeTruthy();
	});

	it("should not create transaction notifications if already created", async () => {
		const { result } = renderHook(() => useNotifications(), { wrapper });

		const { notifications } = result.current;

		const transactionNotifications = await notifications.syncReceivedTransactions();

		expect(transactionNotifications.length).toEqual(0);
	});

	it("should sort transaction notifications in descending order", () => {
		const { result } = renderHook(() => useNotifications(), { wrapper });

		const unsortedTransactionNotifications = [
			{
				action: "",
				body: "",
				icon: "",
				name: "withoutMeta",
				type: "transaction",
			},
			{
				action: "",
				body: "",
				icon: "",
				meta: {
					timestamp: undefined,
					transactionId: "0",
					walletAddress: "0",
				},
				name: "",
				type: "transaction",
			},
			{
				action: "",
				body: "",
				icon: "",
				meta: {
					timestamp: 1,
					transactionId: "1",
					walletAddress: "1",
				},
				name: "",
				type: "transaction",
			},
			{
				action: "",
				body: "",
				icon: "",
				meta: {
					timestamp: 2,
					transactionId: "2",
					walletAddress: "2",
				},
				name: "",
				type: "transaction",
			},
			{
				action: "",
				body: "",
				icon: "",
				meta: {
					timestamp: 3,
					transactionId: "ea63bf9a4b3eaf75a1dfff721967c45dce64eb7facf1aef29461868681b5c79b",
					walletAddress: "D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD",
				},
				name: "",
				type: "transaction",
			},
			{
				action: "",
				body: "",
				icon: "",
				meta: {
					timestamp: 4,
					transactionId: "127d323ff3c3a40cb7abec8aa3b045e8c45c72c8feb7dc667d2f85978f8b10cd",
					walletAddress: "D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD",
				},
				name: "",
				type: "transaction",
			},
		];
		const sorted = result.current.notifications.sortTransactionNotificationsDesc(unsortedTransactionNotifications);

		expect(sorted[0].meta.transactionId).toEqual(
			"127d323ff3c3a40cb7abec8aa3b045e8c45c72c8feb7dc667d2f85978f8b10cd",
		);
		expect(sorted[1].meta.transactionId).toEqual(
			"ea63bf9a4b3eaf75a1dfff721967c45dce64eb7facf1aef29461868681b5c79b",
		);
		expect(sorted[2].meta.transactionId).toEqual("2");
		expect(sorted[3].meta.transactionId).toEqual("1");
		expect(sorted[4].name).toEqual("withoutMeta");
	});

	it("should push wallet update notification for all profiles", () => {
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
		const { result } = renderHook(() => useNotifications(), { wrapper });

		const { notifications } = result.current;

		const initialNotificationsCount = profile.notifications().count();
		notifications.notifyWalletUpdate({ version: "2.5.6" });
		const notificationsCount = profile.notifications().count();

		expect(notificationsCount).toEqual(initialNotificationsCount);
	});

	it("should delete existing wallet update notification", () => {
		const { result } = renderHook(() => useNotifications(), { wrapper });

		const { notifications } = result.current;

		const initialNotificationsCount = profile.notifications().count();
		notifications.notifyWalletUpdate({ version: "2.5.6" });
		notifications.deleteNotificationsByVersion({ version: "2.5.6" });

		const notificationsCount = profile.notifications().count();

		expect(notificationsCount).toBeLessThan(initialNotificationsCount);
	});

	it("should do nothing if notification to be deleted is not found", () => {
		const { result } = renderHook(() => useNotifications(), { wrapper });

		const { notifications } = result.current;

		const initialNotificationsCount = profile.notifications().count();
		notifications.deleteNotificationsByVersion({ version: "2.5.8" });
		const notificationsCount = profile.notifications().count();

		expect(notificationsCount).toEqual(initialNotificationsCount);
	});
});
