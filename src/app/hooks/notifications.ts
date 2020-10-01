import { Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { TransactionDataType } from "@arkecosystem/platform-sdk/dist/contracts";
import { useEnvironmentContext } from "app/contexts";
import { useMemo } from "react";

type NotififyReceivedTransactionsParams = {
	profile?: Profile;
	lookupLimit?: number;
	allowedTxTypes?: string[];
};

const fetchRecentProfileTransactions = async (profile: Profile, limit = 10) => {
	const fetchWalletRecentTxs = async (wallet: ReadWriteWallet) =>
		(await wallet.client().transactions({ limit })).items();

	const allWalletsTxs = await Promise.all(profile.wallets().values().map(fetchWalletRecentTxs));
	return allWalletsTxs.flat();
};

const isRecipient = (profile: Profile, tx: TransactionDataType) => {
	const txRecipients = [tx.recipient(), ...tx.recipients().map((r) => r.address)];
	return txRecipients.some((address: string) => profile.wallets().findByAddress(address));
};

const txNotificationExists = (profile: Profile, tx: TransactionDataType) => profile
		.notifications()
		.values()
		.some((n) => n.type === "transaction" && n?.meta?.txId === tx.id());

const formatNotification = (tx: TransactionDataType) => ({
	icon: "",
	body: "",
	name: "",
	action: "",
	type: "transaction",
	meta: {
		txId: tx.id(),
		walletAddress: tx.recipient(),
	},
});

const notifyReceivedTransactions: any = async ({
	profile,
	lookupLimit = 60,
	allowedTxTypes = ["transfer", "multiPayment"],
}: NotififyReceivedTransactionsParams) => {
	if (!profile?.id()) return [];

	const allRecentTxs = await fetchRecentProfileTransactions(profile, lookupLimit);
	const newUnseenTxs = allRecentTxs.filter(
		(tx: TransactionDataType) =>
			allowedTxTypes.includes(tx.type()) && isRecipient(profile, tx) && !txNotificationExists(profile, tx),
	);

	return newUnseenTxs.map((tx: TransactionDataType) => profile.notifications().push(formatNotification(tx)));
};

export const useNotifications = () => {
	const { env } = useEnvironmentContext();
	const profiles = env.profiles().values();

	return useMemo(() => {
		const syncReceivedTransactions = async (params?: NotififyReceivedTransactionsParams) => await Promise.all(
				profiles.map((profile: Profile) => notifyReceivedTransactions({ ...params, profile })),
			);

		return {
			notifications: {
				syncReceivedTransactions,
			},
		};
	}, [profiles]);
};
