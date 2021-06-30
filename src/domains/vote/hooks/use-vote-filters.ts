import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { useWalletFilters } from "domains/dashboard/components/FilterWallets";
import { useState, useMemo } from "react";
import { isEmptyObject, uniqBy, uniq } from "@arkecosystem/utils";
import { FilterOption } from "domains/vote/components/VotesFilter";

export const useVoteFilters = ({
	profile,
	filter,
	wallet,
	hasWalletId,
}: {
	profile: Contracts.IProfile;
	filter: FilterOption;
	wallet: Contracts.IReadWriteWallet;
	hasWalletId: boolean;
}) => {
	const { defaultConfiguration, useTestNetworks } = useWalletFilters({ profile });
	const walletAddress = hasWalletId ? wallet.address() : "";
	const walletMaxVotes = hasWalletId ? wallet.network().maximumVotesPerWallet() : undefined;

	const [walletsDisplayType, setWalletsDisplayType] = useState(defaultConfiguration.walletsDisplayType);
	const [selectedNetworkIds, setSelectedNetworkIds] = useState(defaultConfiguration.selectedNetworkIds);
	const [voteFilter, setVoteFilter] = useState<FilterOption>(filter);
	const [selectedAddress, setSelectedAddress] = useState(walletAddress);
	const [searchQuery, setSearchQuery] = useState("");
	const [maxVotes, setMaxVotes] = useState(walletMaxVotes);

	const networks = useMemo(() => {
		const networks = profile
			.wallets()
			.values()
			.map((wallet) => ({
				coin: wallet.network().coin(),
				id: wallet.network().id(),
				isLive: wallet.network().isLive(),
				isSelected: selectedNetworkIds.includes(wallet.network().id()),
				name: wallet.network().name(),
			}));

		return uniqBy(networks, (network) => network.id);
	}, [profile, selectedNetworkIds]);

	const isFilterChanged = useMemo(() => {
		if (walletsDisplayType !== defaultConfiguration.walletsDisplayType) {
			return true;
		}

		if (selectedNetworkIds.length < defaultConfiguration.selectedNetworkIds.length) {
			return true;
		}

		return false;
	}, [walletsDisplayType, selectedNetworkIds, defaultConfiguration]);

	const filterProperties = {
		networks,
		onChange: (key: string, value: any) => {
			if (key === "walletsDisplayType") {
				setWalletsDisplayType(value);
			}
			if (key === "selectedNetworkIds") {
				setSelectedNetworkIds(value);
			}
		},
		selectedNetworkIds,
		useTestNetworks,
		walletsDisplayType,
	};

	const walletsByCoin = useMemo(() => {
		const wallets = profile.wallets().allByCoin();

		const usesTestNetworks = profile.settings().get(Contracts.ProfileSetting.UseTestNetworks);
		const usedWallets = usesTestNetworks
			? profile.wallets().values()
			: profile
					.wallets()
					.values()
					.filter((wallet) => wallet.network().isLive());

		const usedCoins = uniq(usedWallets.map((wallet) => wallet.currency()));

		return usedCoins.reduce(
			(coins, coin) => ({
				...coins,
				[coin]: Object.values(wallets[coin]).filter((wallet: Contracts.IReadWriteWallet) => {
					if (!selectedNetworkIds.includes(wallet.network().id())) {
						return false;
					}

					if (walletsDisplayType === "starred") {
						return wallet.isStarred();
					}

					if (walletsDisplayType === "ledger") {
						return wallet.isLedger();
					}

					return wallet;
				}),
			}),
			{} as Record<string, Contracts.IReadWriteWallet[]>,
		);
	}, [profile, selectedNetworkIds, walletsDisplayType]);

	const filteredWalletsByCoin = useMemo(() => {
		if (searchQuery.length === 0) {
			return walletsByCoin;
		}

		return Object.keys(walletsByCoin).reduce(
			(coins, coin) => ({
				...coins,
				[coin]: Object.values(walletsByCoin[coin]).filter(
					(wallet: Contracts.IReadWriteWallet) =>
						wallet.address().toLowerCase().includes(searchQuery.toLowerCase()) ||
						wallet.alias()?.toLowerCase()?.includes(searchQuery.toLowerCase()),
				),
			}),
			{} as Record<string, Contracts.IReadWriteWallet[]>,
		);
	}, [searchQuery, walletsByCoin]);

	const hasEmptyResults = Object.keys(filteredWalletsByCoin).every(
		(coin: string) => filteredWalletsByCoin[coin].length === 0,
	);

	const hasWallets = !isEmptyObject(walletsByCoin);

	return {
		networks,
		setSearchQuery,
		setMaxVotes,
		useTestNetworks,
		walletsDisplayType,
		selectedAddress,
		selectedNetworkIds,
		filterProperties,
		isFilterChanged,
		voteFilter,
		walletsByCoin,
		filteredWalletsByCoin,
		hasEmptyResults,
		hasWallets,
		setVoteFilter,
		setSelectedAddress,
		maxVotes,
		searchQuery,
	};
};
