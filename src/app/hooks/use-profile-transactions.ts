import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { IReadWriteWallet } from "@arkecosystem/platform-sdk-profiles/dist/contracts";
import { useCallback, useRef } from "react";

export const useProfileTransactions = ({ profile }: { profile: Contracts.IProfile }) => {
	const abortRef = useRef<() => void>();

	const fetchTransactions = useCallback(
		async ({
			flush = false,
			mode = "transactions",
			transactionType,
			wallets,
		}: {
			flush?: boolean;
			mode: string;
			transactionType?: any;
			wallets: IReadWriteWallet[];
		}) => {
			if (abortRef.current) {
				abortRef.current();
			}

			let aborted = false;
			abortRef.current = () => (aborted = true);

			const methodMap = {
				all: "transactions",
				sent: "sentTransactions",
				received: "receivedTransactions",
			};
			const method = methodMap[mode as keyof typeof methodMap];

			if (flush) {
				profile.transactionAggregate().flush(method);
			}

			const defaultQuery = { limit: 30, addresses: wallets.map((wallet) => wallet.address()) };
			const queryParams = transactionType ? { ...defaultQuery, ...transactionType } : defaultQuery;

			// @ts-ignore
			const response = await profile.transactionAggregate()[method](queryParams);
			const transactionsAggregate = response.items();

			if (aborted) {
				return [];
			}

			return transactionsAggregate;
		},
		[],
	);

	return { fetchTransactions };
};
