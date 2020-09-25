import { DateTime } from "@arkecosystem/platform-sdk-intl";
import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { waitFor } from "@testing-library/react";
import React from "react";
import { act } from "react-dom/test-utils";
import { env, fireEvent, getDefaultProfileId, render } from "testing-library";

import { markAsRead,Notifications } from "./";

const transactions = [
	{
		id: () => "ee4175091d9f4dacf5fed213711c3e0e4cc371e37afa7bce0429d09bcf3ecefe",
		blockId: () => "71fd1a494ded5430586f4dd1c79c3ac77bf38120e868c8f8980972b8075d67e9",
		type: () => "transfer",
		timestamp: () => DateTime.fromUnix(1596213281),
		confirmations: () => BigNumber.make(10),
		votes: () => ["10"],
		unvotes: () => ["10"],
		sender: () => "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT",
		recipient: () => "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT",
		recipients: () => [],
		amount: () => BigNumber.make(100),
		fee: () => BigNumber.make(21),
		memo: () => "Test",
		asset: () => ({ a: "b" }),
		isConfirmed: () => false,
		isSent: () => true,
		isReceived: () => false,
		isTransfer: () => true,
		isSecondSignature: () => false,
		isMultiSignature: () => false,
		isDelegateRegistration: () => false,
		isDelegateResignation: () => false,
		isVote: () => false,
		isUnvote: () => false,
		isIpfs: () => false,
		isMultiPayment: () => false,
		isHtlcLock: () => false,
		isHtlcClaim: () => false,
		isHtlcRefund: () => false,

		isEntityRegistration: () => false,
		isEntityResignation: () => false,
		isEntityUpdate: () => false,
		isBusinessEntityRegistration: () => false,
		isBusinessEntityResignation: () => false,
		isBusinessEntityUpdate: () => false,
		isDeveloperEntityRegistration: () => false,
		isDeveloperEntityResignation: () => false,
		isDeveloperEntityUpdate: () => false,
		isCorePluginEntityRegistration: () => false,
		isCorePluginEntityResignation: () => false,
		isCorePluginEntityUpdate: () => false,
		isDesktopPluginEntityRegistration: () => false,
		isDesktopPluginEntityResignation: () => false,
		isDesktopPluginEntityUpdate: () => false,
		isDelegateEntityRegistration: () => false,
		isDelegateEntityResignation: () => false,
		isDelegateEntityUpdate: () => false,
		isLegacyBusinessRegistration: () => false,
		isLegacyBusinessResignation: () => false,
		isLegacyBusinessUpdate: () => false,
		isLegacyBridgechainRegistration: () => false,
		isLegacyBridgechainResignation: () => false,
		isLegacyBridgechainUpdate: () => false,
		toObject: () => ({ a: "b" }),
		hasPassed: () => true,
		hasFailed: () => false,
		getMeta: () => "",
		setMeta: () => "",
		total: () => BigNumber.make(121).times(1e8),
		convertedTotal: () => BigNumber.ZERO,
		wallet: () => undefined,
		coin: () => undefined,
		data: () => undefined,
	},
];

let profile: Profile;

describe("Notifications", () => {
	beforeAll(() => {
		profile = env.profiles().findById(getDefaultProfileId());
		profile.notifications().push({
			icon: "ArkLogo",
			name: "New plugin updates",
			body: "test",
			action: "Goto",
		});
	});

	it("should render with plugins", () => {
		const { container } = render(<Notifications profile={profile} />);
		expect(container).toMatchSnapshot();
	});

	it("should render with transactions and plugins", async () => {
		const allNotifications = profile.notifications().count();

		const { container, getAllByTestId } = render(
			<Notifications profile={profile} transactions={transactions as any} />,
		);
		await waitFor(() => expect(getAllByTestId("NotificationItem")).toHaveLength(allNotifications));
		await waitFor(() => expect(getAllByTestId("TransactionRowMode")).toHaveLength(transactions.length));
		expect(container).toMatchSnapshot();
	});

	it("should emit onNotificationAction event", async () => {
		const onNotificationAction = jest.fn();
		const all = profile.notifications().count();

		const { getAllByTestId } = render(
			<Notifications
				profile={profile}
				transactions={transactions as any}
				onNotificationAction={onNotificationAction}
			/>,
		);
		await waitFor(() => expect(getAllByTestId("NotificationItem")).toHaveLength(all));
		await waitFor(() => expect(getAllByTestId("TransactionRowMode")).toHaveLength(transactions.length));

		act(() => {
			fireEvent.click(getAllByTestId("NotificationItem__action")[3]);
		});

		await waitFor(() => expect(onNotificationAction).toHaveBeenCalled());
	});

	it("should emit transactionClick event", async () => {
		const onTransactionClick = jest.fn();

		const all = profile.notifications().count();

		const { container, getAllByTestId } = render(
			<Notifications
				profile={profile}
				transactions={transactions as any}
				onTransactionClick={onTransactionClick}
			/>,
		);
		await waitFor(() => expect(getAllByTestId("NotificationItem")).toHaveLength(all));
		await waitFor(() => expect(getAllByTestId("TransactionRowMode")).toHaveLength(transactions.length));

		act(() => {
			fireEvent.click(getAllByTestId("TransactionRowMode")[0]);
		});

		await waitFor(() => expect(onTransactionClick).toHaveBeenCalled());
		expect(container).toMatchSnapshot();
	});

	it("should emit onFetchMoreTransactions when button is clicked", async () => {
		const onFetchMoreTransactions = jest.fn();

		const all = profile.notifications().count();

		const { getAllByTestId, getByTestId } = render(
			<Notifications
				profile={profile}
				transactions={transactions as any}
				onFetchMoreTransactions={onFetchMoreTransactions}
			/>,
		);
		await waitFor(() => expect(getAllByTestId("NotificationItem")).toHaveLength(all));
		await waitFor(() => expect(getAllByTestId("TransactionRowMode")).toHaveLength(transactions.length));

		act(() => {
			fireEvent.click(getByTestId("transactions__fetch-more-button"));
		});

		await waitFor(() => expect(onFetchMoreTransactions).toHaveBeenCalled());
	});

	it("should mark notification as read", () => {
		const notification = profile.notifications().first();
		expect(notification.read_at).toBeUndefined();
		const isVisible = true;
		markAsRead(isVisible, notification.id, profile, env);
		expect(profile.notifications().get(notification.id).read_at).toBeTruthy();
	});

	it("should not mark notification if is already read", () => {
		const notification = profile.notifications().last();
		expect(notification.read_at).toBeUndefined();
		const isVisible = true;

		markAsRead(isVisible, notification.id, profile, env);
		const firstReadAt = profile.notifications().get(notification.id).read_at;
		expect(firstReadAt).toBeTruthy();

		markAsRead(isVisible, notification.id, profile, env);
		expect(profile.notifications().get(notification.id).read_at).toEqual(firstReadAt);
	});

	it("should render empty", () => {
		profile.notifications().flush();
		const { container } = render(<Notifications profile={profile} />);
		expect(container).toMatchSnapshot();
	});
});
