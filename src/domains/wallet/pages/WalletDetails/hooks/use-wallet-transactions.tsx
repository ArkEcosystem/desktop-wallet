import { Contracts, DTO } from "@arkecosystem/platform-sdk-profiles";
import { useSynchronizer } from "app/hooks";
import { useCallback, useEffect, useMemo } from "react";

export const useWalletTransactions = (wallet: Contracts.IReadWriteWallet) => {
	const pendingMultiSignatureTransactions: DTO.ExtendedSignedTransactionData[] = Object.values({
		...wallet.transaction().waitingForOtherSignatures(),
		...wallet.transaction().waitingForOurSignature(),
		...wallet.transaction().signed(),
	})
		// TODO: Use the `isMultiSignature()` method from interface when ready on the platform-sdk
		.filter((item) => !!item.get("multiSignature"));

	const syncMultiSignatures = useCallback(async () => {
		await wallet.transaction().sync();

		const broadcasted = Object.keys(wallet.transaction().broadcasted());

		await Promise.allSettled(broadcasted.map((id) => wallet.transaction().confirm(id)));
	}, [wallet]);

	const jobs = useMemo(
		() => [
			{
				callback: syncMultiSignatures,
				interval: 30_000,
			},
		],
		[syncMultiSignatures],
	);

	const { start, stop } = useSynchronizer(jobs);

	useEffect(() => {
		start();
		return () => stop();
	}, [start, stop]);

	return {
		pendingMultiSignatureTransactions,
		syncMultiSignatures,
	};
};
