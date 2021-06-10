import { Contracts } from "@arkecosystem/platform-sdk";
import { Contracts as ProfileContracts, Environment } from "@arkecosystem/platform-sdk-profiles";
import { sortByDesc } from "@arkecosystem/utils";
import { useEnvironmentContext } from "app/contexts";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

interface SyncReceivedTransactionsParams {
	lookupLimit?: number;
	allowedTransactionTypes?: string[];
}

type NotifyReceivedTransactionsParams = SyncReceivedTransactionsParams & { profile: ProfileContracts.IProfile };

const fetchRecentProfileTransactions = async (profile: ProfileContracts.IProfile, limit: number) => {
	const query = {
		cursor: 1,
		orderBy: "timestamp",
		limit,
		addresses: profile
			.wallets()
			.values()
			.map((wallet) => wallet.address()),
	};

	const recentTransactions = await profile.transactionAggregate().all(query);
	return recentTransactions.items();
};

const isRecipient = (profile: ProfileContracts.IProfile, transaction: Contracts.TransactionDataType) => {
	const allRecipients = [transaction.recipient(), ...transaction.recipients().map((r) => r.address)];
	return allRecipients.some((address: string) => profile.wallets().findByAddress(address));
};

const transactionNotificationExists = (
	profile: ProfileContracts.IProfile,
	transaction: Contracts.TransactionDataType,
) =>
	profile
		.notifications()
		.values()
		.some((n) => n.type === "transaction" && n?.meta?.transactionId === transaction.id());

const formatTransactionNotification = (transaction: Contracts.TransactionDataType) => ({
	icon: "",
	body: "",
	name: "",
	action: "",
	type: "transaction",
	meta: {
		timestamp: transaction.timestamp()?.toUNIX(),
		transactionId: transaction.id(),
		walletAddress: transaction.recipient(),
	},
});

const formatNotification = (input: any) =>
	Object.assign(
		{
			icon: "",
			body: "",
			name: "",
			action: "update",
			type: "wallet",
			meta: {},
		},
		input,
	);

const filterUnseenTransactions = (
	profile: ProfileContracts.IProfile,
	transactions: Contracts.TransactionDataType[],
	allowedTransactionTypes: string[],
) =>
	transactions.reduce(
		(addedTransactions: Contracts.TransactionDataType[], transaction: Contracts.TransactionDataType) => {
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
}: NotifyReceivedTransactionsParams) => {
	const allRecentTransactions = await fetchRecentProfileTransactions(profile, lookupLimit);
    // @ts-ignore
	const newUnseenTransactions = filterUnseenTransactions(profile, allRecentTransactions, allowedTransactionTypes);

	return newUnseenTransactions.map((transaction: Contracts.TransactionDataType) =>
		profile.notifications().push(formatTransactionNotification(transaction)),
	);
};

const findNotificationByVersion = (profile: ProfileContracts.IProfile, version?: string) =>
	profile
		.notifications()
		.values()
		.find((n) => n.type === "wallet" && n.action === "update" && n?.meta?.version === version);

const notifyWalletUpdate = (env: Environment, t: any) => ({ version }: { version: string }) => {
	env.profiles()
		.values()
		.forEach((profile: ProfileContracts.IProfile) => {
			if (findNotificationByVersion(profile, version)) {
				return;
			}

			profile.notifications().push(
				formatNotification({
					name: t("COMMON.APP_NAME"),
					body: `- ${t("COMMON.UPDATE").toLowerCase()} v${version}`,
					type: "wallet",
					action: "update",
					meta: { version },
				}),
			);
		});
};

const deleteNotificationsByVersion = (env: Environment) => ({ version }: { version?: string }) => {
	env.profiles()
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
		const syncReceivedTransactions = async (params?: SyncReceivedTransactionsParams) => {
			const savedNotifications = await Promise.all(
				profiles
					.values()
					.map((profile: ProfileContracts.IProfile) => notifyReceivedTransactions({ ...params, profile })),
			);

			await persist();
			return savedNotifications.flat();
		};

		return {
			notifications: {
				notifyReceivedTransactions,
				syncReceivedTransactions,
				formatNotification,
				sortTransactionNotificationsDesc,
				notifyWalletUpdate: notifyWalletUpdate(env, t),
				deleteNotificationsByVersion: deleteNotificationsByVersion(env),
			},
		};
	}, [profiles, env, persist, t]);
};
