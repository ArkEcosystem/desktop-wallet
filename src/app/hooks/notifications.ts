import { Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { TransactionDataType } from "@arkecosystem/platform-sdk/dist/contracts";
import { useEnvironmentContext } from "app/contexts";
import { useMemo } from "react";

type NotififyReceivedTransactionsParams = {
	profile?: Profile;
	lookupLimit?: number;
	allowedTransactionTypes?: string[];
};

const fetchRecentProfileTransactions = async (profile: Profile, limit = 10) => {
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

const formatNotification = (transaction: TransactionDataType) => ({
	icon: "",
	body: "",
	name: "",
	action: "",
	type: "transaction",
	meta: {
		transactionId: transaction.id(),
		walletAddress: transaction.recipient(),
	},
});

const notifyReceivedTransactions: any = async ({
	profile,
	lookupLimit = 20,
	allowedTransactionTypes = ["transfer", "multiPayment"],
}: NotififyReceivedTransactionsParams) => {
	if (!profile?.id()) return [];

	const allRecentTransactions = await fetchRecentProfileTransactions(profile, lookupLimit);
	const newUnseenTransactions = allRecentTransactions.filter(
		(transaction: TransactionDataType) =>
			allowedTransactionTypes.includes(transaction.type()) &&
			isRecipient(profile, transaction) &&
			!transactionNotificationExists(profile, transaction),
	);

	return newUnseenTransactions.map((transaction: TransactionDataType) =>
		profile.notifications().push(formatNotification(transaction)),
	);
};

export const useNotifications = () => {
	const { env } = useEnvironmentContext();
	const profiles = env.profiles().values();

	return useMemo(() => {
		const syncReceivedTransactions = async (params?: NotififyReceivedTransactionsParams) =>
			await Promise.all(profiles.map((profile: Profile) => notifyReceivedTransactions({ ...params, profile })));

		return {
			notifications: {
				syncReceivedTransactions,
			},
		};
	}, [profiles]);
};
