import { TransactionFee } from "@arkecosystem/platform-sdk/dist/contracts";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { useEnvironmentContext } from "app/contexts";
import { useCallback } from "react";

type FeeInput = string | number | BigNumber;

export const useFees = () => {
	const { env } = useEnvironmentContext();

	const findByType = useCallback(
		async (coin: string, network: string, type: string) => {
			let transactionFees: TransactionFee;

			try {
				transactionFees = env.fees().findByType(coin, network, type);
			} catch (error) {
				await env.fees().syncAll();
				transactionFees = env.fees().findByType(coin, network, type);
			}

			return transactionFees;
		},
		[env],
	);

	return { findByType };
};
