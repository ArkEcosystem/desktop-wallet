import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { isEmptyObject, uniq, uniqBy } from "@arkecosystem/utils";
import { Icon } from "app/components//Icon";
import { Alert } from "app/components/Alert";
import { Button } from "app/components/Button";
import { ControlButton } from "app/components/ControlButton";
import { Dropdown } from "app/components/Dropdown";
import { EmptyBlock } from "app/components/EmptyBlock";
import { EmptyResults } from "app/components/EmptyResults";
import { Header } from "app/components/Header";
import { HeaderSearchBar } from "app/components/Header/HeaderSearchBar";
import { Page, Section } from "app/components/Layout";
import { useEnvironmentContext } from "app/contexts";
import { useActiveProfile, useActiveWallet, useProfileUtils, useQueryParams } from "app/hooks";
import { toasts } from "app/services";
import { FilterWallets } from "domains/dashboard/components/FilterWallets";
import { AddressTable } from "domains/vote/components/AddressTable";
import { DelegateTable } from "domains/vote/components/DelegateTable";
import { FilterOption, VotesFilter } from "domains/vote/components/VotesFilter";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";

export const Votes = () => {
	const { t } = useTranslation();
	const history = useHistory();
	const { walletId: hasWalletId } = useParams();
	const { env } = useEnvironmentContext();

	const activeProfile = useActiveProfile();
	const { getErroredNetworks } = useProfileUtils(env);

	const activeWallet = useActiveWallet();

	const queryParams = useQueryParams();
	const unvoteAddresses = queryParams.get("unvotes")?.split(",");
	const voteAddresses = queryParams.get("votes")?.split(",");
	const filter = (queryParams.get("filter") || "all") as FilterOption;

	const walletAddress = hasWalletId ? activeWallet.address() : "";
	const walletMaxVotes = hasWalletId ? activeWallet.network().maximumVotesPerWallet() : undefined;

	const defaultConfiguration = useMemo(
		() => ({
			walletsDisplayType: "all",
			selectedNetworkIds: uniq(
				activeProfile
					.wallets()
					.values()
					.map((wallet) => wallet.network().id()),
			),
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
				id: wallet.network().id(),
				name: wallet.network().name(),
				coin: wallet.network().coin(),
				isLive: wallet.network().isLive(),
				isSelected: selectedNetworkIds.includes(wallet.network().id()),
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
		useTestNetworks: activeProfile.settings().get(Contracts.ProfileSetting.UseTestNetworks) as boolean,
		selectedNetworkIds,
		walletsDisplayType,
		onChange: (key: string, value: any) => {
			if (key === "walletsDisplayType") {
				setWalletsDisplayType(value);
			}
			if (key === "selectedNetworkIds") {
				setSelectedNetworkIds(value);
			}
		},
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

		toasts.warning(t("COMMON.ERRORS.NETWORK_ERROR", { network: erroredNetworks.join(", ") }));
	}, [getErroredNetworks, activeProfile, t]);

	const loadDelegates = useCallback(
		async (wallet) => {
			setIsLoadingDelegates(true);
			await env.delegates().sync(wallet.coinId(), wallet.networkId());
			const delegates = env.delegates().all(wallet.coinId(), wallet.networkId());

			setDelegates(delegates);
			setIsLoadingDelegates(false);
		},
		[env],
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

		const params = new URLSearchParams();

		if (unvotes?.length > 0) {
			params.append("unvotes", unvotes.join());
		}

		/* istanbul ignore else */
		if (votes?.length > 0) {
			params.append("votes", votes.join());
		}

		history.push({
			pathname: `/profiles/${activeProfile.id()}/wallets/${walletId}/send-vote`,
			search: `?${params}`,
		});
	};

	useEffect(() => {
		if (votes?.length === 0) {
			setSelectedFilter("all");
		}
	}, [votes]);

	const filteredWalletsByCoin = useMemo(() => {
		if (!searchQuery.length) {
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
		if (!searchQuery.length) {
			return filteredDelegatesVotes;
		}

		/* istanbul ignore next */
		return filteredDelegatesVotes?.filter(
			(delegate) =>
				delegate.address().toLowerCase().includes(searchQuery.toLowerCase()) ||
				delegate.username()?.toLowerCase()?.includes(searchQuery.toLowerCase()),
		);
	}, [filteredDelegatesVotes, searchQuery]);

	const isEmptyWalletsByCoin =
		searchQuery.length > 0 &&
		Object.keys(filteredWalletsByCoin).every((coin: string) => !filteredWalletsByCoin[coin].length);

	return (
		<Page profile={activeProfile}>
			<Section border>
				<Header
					title={t("VOTE.VOTES_PAGE.TITLE")}
					subtitle={t("VOTE.VOTES_PAGE.SUBTITLE")}
					extra={
						activeProfile.wallets().count() ? (
							<div className="flex items-center space-x-5 text-theme-primary-200">
								<HeaderSearchBar
									placeholder={t("VOTE.VOTES_PAGE.SEARCH_PLACEHOLDER")}
									onSearch={setSearchQuery}
									onReset={() => setSearchQuery("")}
									debounceTimeout={100}
								/>

								<div className="h-10 border-l border-theme-secondary-300 dark:border-theme-secondary-800" />

								{!selectedAddress ? (
									<div data-testid="Votes__FilterWallets">
										<Dropdown
											position="right"
											toggleContent={
												<ControlButton isChanged={isFilterChanged}>
													<div className="flex items-center justify-center w-5 h-5">
														<Icon name="Filters" width={17} height={19} />
													</div>
												</ControlButton>
											}
										>
											<div className="px-10 py-7 w-128">
												<FilterWallets {...filterProperties} />
											</div>
										</Dropdown>
									</div>
								) : (
									<VotesFilter
										totalCurrentVotes={currentVotes?.length || 0}
										selectedOption={selectedFilter}
										onChange={setSelectedFilter}
									/>
								)}
							</div>
						) : null
					}
				/>
			</Section>

			{isEmptyObject(walletsByCoin) ? (
				<Section>
					<EmptyBlock>
						<div className="flex items-center justify-between">
							<span>
								<Trans
									i18nKey="VOTE.VOTES_PAGE.EMPTY_MESSAGE"
									values={{
										create: t("DASHBOARD.WALLET_CONTROLS.CREATE"),
										import: t("DASHBOARD.WALLET_CONTROLS.IMPORT"),
									}}
									components={{ bold: <strong /> }}
								/>
							</span>

							<div className="flex -m-3 space-x-3">
								<Button
									onClick={() => history.push(`/profiles/${activeProfile.id()}/wallets/create`)}
									variant="secondary"
								>
									<div className="flex items-center space-x-2">
										<Icon name="Plus" width={12} height={12} />
										<span>{t("DASHBOARD.WALLET_CONTROLS.CREATE")}</span>
									</div>
								</Button>

								<Button
									onClick={() => history.push(`/profiles/${activeProfile.id()}/wallets/import`)}
									variant="secondary"
								>
									<div className="flex items-center space-x-2">
										<Icon name="Import" width={15} height={15} />
										<span>{t("DASHBOARD.WALLET_CONTROLS.IMPORT")}</span>
									</div>
								</Button>
							</div>
						</div>
					</EmptyBlock>
				</Section>
			) : !selectedAddress ? (
				isEmptyWalletsByCoin ? (
					<Section>
						<EmptyResults
							className="mt-16"
							title={t("COMMON.EMPTY_RESULTS.TITLE")}
							subtitle={t("COMMON.EMPTY_RESULTS.SUBTITLE")}
						/>
					</Section>
				) : (
					Object.keys(filteredWalletsByCoin).map(
						(coin, index) =>
							filteredWalletsByCoin[coin].length > 0 && (
								<Section key={index}>
									<AddressTable
										wallets={filteredWalletsByCoin[coin]}
										onSelect={handleSelectAddress}
									/>
								</Section>
							),
					)
				)
			) : (
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
