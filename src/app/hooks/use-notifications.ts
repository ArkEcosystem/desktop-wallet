import { TransactionDataType } from "@arkecosystem/platform-sdk/dist/contracts";
import { Environment, Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { sortByDesc } from "@arkecosystem/utils";
import { useEnvironmentContext } from "app/contexts";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

type SyncReceivedTransactionsParams = {
	lookupLimit?: number;
	allowedTransactionTypes?: string[];
};

type NotifyReceivedTransactionsParams = SyncReceivedTransactionsParams & { profile: Profile };

const fetchRecentProfileTransactions = async (profile: Profile, limit: number) => {
	const fetchWalletRecentTransactions = async (wallet: ReadWriteWallet) =>
		(await wallet.client().transactions({ limit })).items();

	const allWalletTransactions = await Promise.all(profile.wallets().values().map(fetchWalletRecentTransactions));
	return allWalletTransactions.flat();
};

const isRecipient = (profile: Profile, transaction: TransactionDataType) => {
	const allRecipients = [transaction.recipient(), ...transaction.recipients().map((r) => r.address)];
	return allRecipients.some((address: string) => profile.wallets().findByAddress(address));
};

const transactionNotificationExists = (profile: Profile, transaction: TransactionDataType) =>
	profile
		.notifications()
		.values()
		.some((n) => n.type === "transaction" && n?.meta?.transactionId === transaction.id());

const formatTransactionNotification = (transaction: TransactionDataType) => ({
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
	profile: Profile,
	transactions: TransactionDataType[],
	allowedTransactionTypes: string[],
) =>
	transactions.reduce((addedTransactions: TransactionDataType[], transaction: TransactionDataType) => {
		if (
			allowedTransactionTypes.includes(transaction.type()) &&
			isRecipient(profile, transaction) &&
			!transactionNotificationExists(profile, transaction) &&
			!addedTransactions.find((t) => t.id() === transaction.id())
		) {
			addedTransactions.push(transaction);
		}
		return addedTransactions;
	}, []);

const notifyReceivedTransactions: any = async ({
	profile,
	lookupLimit = 20,
	allowedTransactionTypes = ["transfer", "multiPayment"],
}: NotifyReceivedTransactionsParams) => {
	const allRecentTransactions = await fetchRecentProfileTransactions(profile, lookupLimit);
	const newUnseenTransactions = filterUnseenTransactions(profile, allRecentTransactions, allowedTransactionTypes);

	return newUnseenTransactions.map((transaction: TransactionDataType) =>
		profile.notifications().push(formatTransactionNotification(transaction)),
	);
};

const findNotificationByVersion = (profile: Profile, version?: string) =>
	profile
		.notifications()
		.values()
		.find((n) => n.type === "wallet" && n.action === "update" && n?.meta?.version === version);

const notifyWalletUpdate = (env: Environment, t: any) => ({ version }: { version: string }) => {
	env.profiles()
		.values()
		.forEach((profile: Profile) => {
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
		.forEach((profile: Profile) => {
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
	const { env } = useEnvironmentContext();

	const profiles = env.profiles();

	return useMemo(() => {
		const syncReceivedTransactions = async (params?: SyncReceivedTransactionsParams) => {
			const savedNotifications = await Promise.all(
				profiles.values().map((profile: Profile) => notifyReceivedTransactions({ ...params, profile })),
			);

			await env.persist();
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
	}, [profiles, env, t]);
};
