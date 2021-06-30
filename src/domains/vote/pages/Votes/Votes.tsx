import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { isEmptyObject, uniq, uniqBy } from "@arkecosystem/utils";
import { Alert } from "app/components/Alert";
import { Page, Section } from "app/components/Layout";
import { useEnvironmentContext } from "app/contexts";
import { useActiveProfile, useActiveWallet, useProfileUtils, useQueryParams } from "app/hooks";
import { toasts } from "app/services";
import { DelegateTable } from "domains/vote/components/DelegateTable";
import { FilterOption } from "domains/vote/components/VotesFilter";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import { VotesHeader } from "domains/vote/components/VotesHeader";
import { VotesEmpty } from "domains/vote/components/VotesEmpty";
import { VotingWallets } from "domains/vote/components/VotingWallets/VotingWallets";

export const Votes = () => {
	const { t } = useTranslation();
	const history = useHistory();
	const { walletId: hasWalletId } = useParams();
	const { env } = useEnvironmentContext();

	const activeProfile = useActiveProfile();
	const { getErroredNetworks } = useProfileUtils(env);

	const activeWallet = useActiveWallet();

	const queryParameters = useQueryParams();
	const unvoteAddresses = queryParameters.get("unvotes")?.split(",");
	const voteAddresses = queryParameters.get("votes")?.split(",");
	const filter = (queryParameters.get("filter") || "all") as FilterOption;

	const walletAddress = hasWalletId ? activeWallet.address() : "";
	const walletMaxVotes = hasWalletId ? activeWallet.network().maximumVotesPerWallet() : undefined;

	const defaultConfiguration = useMemo(
		() => ({
			selectedNetworkIds: uniq(
				activeProfile
					.wallets()
					.values()
					.map((wallet) => wallet.network().id()),
			),
			walletsDisplayType: "all",
		}),
		[activeProfile],
	);

	const [searchQuery, setSearchQuery] = useState("");

	const [walletsDisplayType, setWalletsDisplayType] = useState(defaultConfiguration.walletsDisplayType);
	const [selectedNetworkIds, setSelectedNetworkIds] = useState(defaultConfiguration.selectedNetworkIds);

	const [selectedAddress, setSelectedAddress] = useState(walletAddress);
	const [maxVotes, setMaxVotes] = useState(walletMaxVotes);
	const [delegates, setDelegates] = useState<Contracts.IReadOnlyWallet[]>([]);
	const [votes, setVotes] = useState<Contracts.IReadOnlyWallet[] | undefined>();
	const [isLoadingDelegates, setIsLoadingDelegates] = useState(false);
	const [selectedFilter, setSelectedFilter] = useState<FilterOption>(filter);

	const walletsByCoin = useMemo(() => {
		const wallets = activeProfile.wallets().allByCoin();

		const usesTestNetworks = activeProfile.settings().get(Contracts.ProfileSetting.UseTestNetworks);
		const usedWallets = usesTestNetworks
			? activeProfile.wallets().values()
			: activeProfile
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
	}, [activeProfile, selectedNetworkIds, walletsDisplayType]);

	const networks = useMemo(() => {
		const networks = activeProfile
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
	}, [activeProfile, selectedNetworkIds]);

	const currentVotes = useMemo(
		() => votes?.filter((vote) => delegates.some((delegate) => vote.address() === delegate.address())),
		[votes, delegates],
	);

	const hasResignedDelegateVotes = useMemo(() => currentVotes?.some((vote) => vote.isResignedDelegate()), [
		currentVotes,
	]);

	const filteredDelegatesVotes = useMemo(() => {
		const value = selectedFilter === "all" ? delegates : currentVotes;
		return value?.filter((delegate) => !delegate.isResignedDelegate());
	}, [delegates, currentVotes, selectedFilter]);

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
		useTestNetworks: activeProfile.settings().get(Contracts.ProfileSetting.UseTestNetworks) as boolean,
		walletsDisplayType,
	};

	const isFilterChanged = useMemo(() => {
		if (walletsDisplayType !== defaultConfiguration.walletsDisplayType) {
			return true;
		}

		if (selectedNetworkIds.length < defaultConfiguration.selectedNetworkIds.length) {
			return true;
		}

		return false;
	}, [walletsDisplayType, selectedNetworkIds, defaultConfiguration]);

	const loadVotes = useCallback(
		(address) => {
			const wallet = activeProfile.wallets().findByAddress(address);
			let votes: Contracts.IReadOnlyWallet[] = [];

			try {
				votes = wallet!.voting().current();
			} catch {
				votes = [];
			}

			setVotes(votes);
		},
		[activeProfile],
	);

	useEffect(() => {
		if (selectedAddress) {
			loadVotes(selectedAddress);
		}
	}, [loadVotes, selectedAddress]);

	useEffect(() => {
		const { hasErroredNetworks, erroredNetworks } = getErroredNetworks(activeProfile);
		if (!hasErroredNetworks) {
			return;
		}

		toasts.warning(
			<Trans
				i18nKey="COMMON.ERRORS.NETWORK_ERROR"
				values={{ network: erroredNetworks.join(", ") }}
				components={{ bold: <strong /> }}
			/>,
		);
	}, [getErroredNetworks, activeProfile, t]);

	const loadDelegates = useCallback(
		async (wallet) => {
			setIsLoadingDelegates(true);
			await env.delegates().sync(activeProfile, wallet.coinId(), wallet.networkId());
			const delegates = env.delegates().all(wallet.coinId(), wallet.networkId());

			setDelegates(delegates);
			setIsLoadingDelegates(false);
		},
		[env, activeProfile],
	);

	useEffect(() => {
		if (hasWalletId) {
			loadDelegates(activeWallet);
		}
	}, [activeWallet, loadDelegates, hasWalletId]);

	const handleSelectAddress = (address: string) => {
		const wallet = activeProfile.wallets().findByAddress(address);

		setSearchQuery("");
		setSelectedAddress(address);
		setMaxVotes(wallet?.network().maximumVotesPerWallet());

		loadDelegates(wallet);
	};

	const handleContinue = (unvotes: string[], votes: string[]) => {
		const walletId = hasWalletId ? activeWallet.id() : activeProfile.wallets().findByAddress(selectedAddress)?.id();

		const parameters = new URLSearchParams();

		if (unvotes?.length > 0) {
			parameters.append("unvotes", unvotes.join(","));
		}

		/* istanbul ignore else */
		if (votes?.length > 0) {
			parameters.append("votes", votes.join(","));
		}

		history.push({
			pathname: `/profiles/${activeProfile.id()}/wallets/${walletId}/send-vote`,
			search: `?${parameters}`,
		});
	};

	useEffect(() => {
		if (votes?.length === 0) {
			setSelectedFilter("all");
		}
	}, [votes]);

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

	const hasEmptyResults = Object.keys(filteredWalletsByCoin).every(
		(coin: string) => filteredWalletsByCoin[coin].length === 0,
	);

	const hasWallets = !isEmptyObject(walletsByCoin);
	const hasSelectedAddress = !!selectedAddress;

	return (
		<Page profile={activeProfile}>
			<Section border>
				<VotesHeader
					profile={activeProfile}
					setSearchQuery={setSearchQuery}
					selectedAddress={selectedAddress}
					isFilterChanged={isFilterChanged}
					filterProperties={filterProperties}
					totalCurrentVotes={currentVotes?.length || 0}
					selectedFilter={selectedFilter}
					setSelectedFilter={setSelectedFilter}
				/>
			</Section>

			{!hasWallets && (
				<Section>
					<VotesEmpty
						onCreateWallet={() => history.push(`/profiles/${activeProfile.id()}/wallets/create`)}
						onImportWallet={() => history.push(`/profiles/${activeProfile.id()}/wallets/import`)}
					/>
				</Section>
			)}

			{hasWallets && !hasSelectedAddress && (
				<VotingWallets
					showEmptyResults={hasEmptyResults}
					walletsByCoin={filteredWalletsByCoin}
					onSelectAddress={handleSelectAddress}
				/>
			)}

			{hasSelectedAddress && (
				<Section innerClassName="mb-27">
					<DelegateTable
						delegates={filteredDelegates}
						emptyText={t("VOTE.DELEGATE_TABLE.DELEGATES_NOT_FOUND")}
						isLoading={isLoadingDelegates}
						maxVotes={maxVotes!}
						votes={votes}
						selectedUnvoteAddresses={unvoteAddresses}
						selectedVoteAddresses={voteAddresses}
						selectedWallet={selectedAddress}
						onContinue={handleContinue}
						isPaginationDisabled={searchQuery.length > 0}
						subtitle={
							hasResignedDelegateVotes ? (
								<Alert className="mb-6">
									<div data-testid="Votes__resigned-vote">
										<Trans
											i18nKey="VOTE.VOTES_PAGE.RESIGNED_VOTE"
											values={{
												name: currentVotes
													?.find((vote) => vote.isResignedDelegate())
													?.username(),
											}}
											components={{ bold: <strong /> }}
										/>
									</div>
								</Alert>
							) : null
						}
					/>
				</Section>
			)}
		</Page>
	);
};
