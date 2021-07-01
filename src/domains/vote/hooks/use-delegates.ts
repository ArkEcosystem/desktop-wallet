import { Contracts, Environment } from "@arkecosystem/platform-sdk-profiles";
import { FilterOption } from "domains/vote/components/VotesFilter";
import { useCallback, useMemo, useState } from "react";

export const useDelegates = ({
	env,
	profile,
	searchQuery,
	voteFilter,
}: {
	env: Environment;
	profile: Contracts.IProfile;
	searchQuery: string;
	voteFilter: FilterOption;
}) => {
	const [delegates, setDelegates] = useState<Contracts.IReadOnlyWallet[]>([]);
	const [votes, setVotes] = useState<Contracts.IReadOnlyWallet[] | undefined>();
	const [isLoadingDelegates, setIsLoadingDelegates] = useState(false);

	const currentVotes = useMemo(
		() => votes?.filter((vote) => delegates.some((delegate) => vote.address() === delegate.address())),
		[votes, delegates],
	);

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

	const filteredDelegatesVotes = useMemo(() => {
		const value = voteFilter === "all" ? delegates : currentVotes;
		return value?.filter((delegate) => !delegate.isResignedDelegate());
	}, [delegates, currentVotes, voteFilter]);

	const filteredDelegates = useMemo(() => {
		if (searchQuery.length === 0) {
			return filteredDelegatesVotes;
		}

		/* istanbul ignore next */
		return filteredDelegatesVotes?.filter(
			(delegate) =>
				delegate.address().toLowerCase().includes(searchQuery.toLowerCase()) ||
				delegate.username()?.toLowerCase()?.includes(searchQuery.toLowerCase()),
		);
	}, [filteredDelegatesVotes, searchQuery]);

	const fetchVotes = useCallback(
		(address) => {
			const wallet = profile.wallets().findByAddress(address);
			let votes: Contracts.IReadOnlyWallet[] = [];

			try {
				votes = wallet!.voting().current();
			} catch {
				votes = [];
			}

			setVotes(votes);
		},
		[profile],
	);

	const hasResignedDelegateVotes = useMemo(() => currentVotes?.some((vote) => vote.isResignedDelegate()), [
		currentVotes,
	]);

	return {
		currentVotes,
		delegates,
		fetchDelegates,
		fetchVotes,
		filteredDelegates,
		hasResignedDelegateVotes,
		isLoadingDelegates,
		votes,
	};
};
