import { Contracts } from "@arkecosystem/platform-sdk";
import { Contracts as ProfileContracts, Environment } from "@arkecosystem/platform-sdk-profiles";
import { sortByDesc } from "@arkecosystem/utils";
import { useEnvironmentContext } from "app/contexts";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

interface SyncReceivedTransactionsParameters {
	lookupLimit?: number;
	allowedTransactionTypes?: string[];
}

type NotifyReceivedTransactionsParameters = SyncReceivedTransactionsParameters & { profile: ProfileContracts.IProfile };

const fetchRecentProfileTransactions = async (profile: ProfileContracts.IProfile, limit: number) => {
	const query = {
		addresses: profile
			.wallets()
			.values()
			.map((wallet) => wallet.address()),
		cursor: 1,
		limit,
	};

	const recentTransactions = await profile.transactionAggregate().all(query);
	return recentTransactions.items();
};

const isRecipient = (profile: ProfileContracts.IProfile, transaction: Contracts.ConfirmedTransactionData) => {
	const allRecipients = [transaction.recipient(), ...transaction.recipients().map((r) => r.address)];
	return allRecipients.some((address: string) => profile.wallets().findByAddress(address));
};

const transactionNotificationExists = (
	profile: ProfileContracts.IProfile,
	transaction: Contracts.ConfirmedTransactionData,
) =>
	profile
		.notifications()
		.values()
		.some((n) => n.type === "transaction" && n?.meta?.transactionId === transaction.id());

const formatTransactionNotification = (transaction: Contracts.ConfirmedTransactionData) => ({
	action: undefined,
	body: undefined,
	icon: undefined,
	meta: {
		timestamp: transaction.timestamp()?.toUNIX(),
		transactionId: transaction.id(),
	},
	name: undefined,
	type: "transaction",
});

const formatNotification = (input: any) =>
	Object.assign(
		{
			action: "update",
			body: undefined,
			icon: undefined,
			meta: {},
			name: undefined,
			type: "wallet",
		},
		input,
	);

const filterUnseenTransactions = (
	profile: ProfileContracts.IProfile,
	transactions: Contracts.ConfirmedTransactionData[],
	allowedTransactionTypes: string[],
) =>
	transactions.reduce(
		(addedTransactions: Contracts.ConfirmedTransactionData[], transaction: Contracts.ConfirmedTransactionData) => {
			if (
				allowedTransactionTypes.includes(transaction.type()) &&
				isRecipient(profile, transaction) &&
				!transactionNotificationExists(profile, transaction)
			) {
				addedTransactions.push(transaction);
			}
			return addedTransactions;
		},
		[],
	);

const notifyReceivedTransactions: any = async ({
	profile,
	lookupLimit = 10,
	allowedTransactionTypes = ["transfer", "multiPayment"],
}: NotifyReceivedTransactionsParameters) => {
	const allRecentTransactions = await fetchRecentProfileTransactions(profile, lookupLimit);
	// @ts-ignore
	const newUnseenTransactions = filterUnseenTransactions(profile, allRecentTransactions, allowedTransactionTypes);

	return newUnseenTransactions.map((transaction: Contracts.ConfirmedTransactionData) =>
		profile.notifications().push(formatTransactionNotification(transaction)),
	);
};

const findNotificationByVersion = (profile: ProfileContracts.IProfile, version?: string) =>
	profile
		.notifications()
		.values()
		.find((n) => n.type === "wallet" && n.action === "update" && n?.meta?.version === version);

const notifyWalletUpdate = (environment: Environment, t: any) => ({ version }: { version: string }) => {
	environment
		.profiles()
		.values()
		.forEach((profile: ProfileContracts.IProfile) => {
			if (findNotificationByVersion(profile, version)) {
				return;
			}

			profile.notifications().push(
				formatNotification({
					action: "update",
					body: `- ${t("COMMON.UPDATE").toLowerCase()} v${version}`,
					meta: { version },
					name: t("COMMON.APP_NAME"),
					type: "wallet",
				}),
			);
		});
};

const deleteNotificationsByVersion = (environment: Environment) => ({ version }: { version?: string }) => {
	environment
		.profiles()
		.values()
		.forEach((profile: ProfileContracts.IProfile) => {
			const notification = findNotificationByVersion(profile, version);
			if (notification) {
				profile.notifications().forget(notification.id);
			}
		});
};

const sortTransactionNotificationsDesc = (notifications: any[]) =>
	sortByDesc(notifications, (notification) => notification?.meta?.timestamp);

export const useNotifications = () => {
	const { t } = useTranslation();
	const { env, persist } = useEnvironmentContext();

	const profiles = env.profiles();

	return useMemo(() => {
		const syncReceivedTransactions = async (parameters?: SyncReceivedTransactionsParameters) => {
			const savedNotifications = await Promise.all(
				profiles
					.values()
					.map((profile: ProfileContracts.IProfile) =>
						notifyReceivedTransactions({ ...parameters, profile }),
					),
			);

			await persist();
			return savedNotifications.flat();
		};

		return {
			notifications: {
				deleteNotificationsByVersion: deleteNotificationsByVersion(env),
				fetchRecentProfileTransactions,
				notifyReceivedTransactions,
				notifyWalletUpdate: notifyWalletUpdate(env, t),
				sortTransactionNotificationsDesc,
				syncReceivedTransactions,
			},
		};
	}, [profiles, env, persist, t]);
};
