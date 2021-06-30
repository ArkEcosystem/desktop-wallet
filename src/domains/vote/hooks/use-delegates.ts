import { useState, useCallback } from "react";
import { Contracts, Environment } from "@arkecosystem/platform-sdk-profiles";

export const useDelegates = ({ env, profile }: { env: Environment; profile: Contracts.IProfile }) => {
	const [delegates, setDelegates] = useState<Contracts.IReadOnlyWallet[]>([]);
	const [isLoadingDelegates, setIsLoadingDelegates] = useState(false);

	const fetchDelegates = useCallback(
		async (wallet) => {
			setIsLoadingDelegates(true);
			await env.delegates().sync(profile, wallet.coinId(), wallet.networkId());
			const delegates = env.delegates().all(wallet.coinId(), wallet.networkId());

			setDelegates(delegates);
			setIsLoadingDelegates(false);
		},
		[env, profile],
	);

	return { delegates, fetchDelegates, isLoadingDelegates };
};
