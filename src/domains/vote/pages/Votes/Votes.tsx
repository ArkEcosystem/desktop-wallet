import { ProfileSetting, ReadOnlyWallet, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { isEmptyObject, uniq, uniqBy } from "@arkecosystem/utils";
import { Icon } from "app/components//Icon";
import { Button } from "app/components/Button";
import { Dropdown } from "app/components/Dropdown";
import { EmptyBlock } from "app/components/EmptyBlock";
import { EmptyResults } from "app/components/EmptyResults";
import { Header } from "app/components/Header";
import { HeaderSearchBar } from "app/components/Header/HeaderSearchBar";
import { Page, Section } from "app/components/Layout";
import { useEnvironmentContext } from "app/contexts";
import { useActiveProfile, useActiveWallet, useQueryParams } from "app/hooks";
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
	const activeWallet = useActiveWallet();

	const queryParams = useQueryParams();
	const unvoteAddresses = queryParams.get("unvotes")?.split(",");
	const voteAddresses = queryParams.get("votes")?.split(",");
	const filter = (queryParams.get("filter") || "all") as FilterOption;

	const walletAddress = hasWalletId ? activeWallet.address() : "";
	const walletMaxVotes = hasWalletId ? activeWallet.network().maximumVotesPerWallet() : undefined;

	const [searchQuery, setSearchQuery] = useState("");
	const [walletsDisplayType, setWalletsDisplayType] = useState("all");
	const [selectedNetworkIds, setSelectedNetworkIds] = useState(
		uniq(
			activeProfile
				.wallets()
				.values()
				.map((wallet) => wallet.network().id()),
		),
	);
	const [selectedAddress, setSelectedAddress] = useState(walletAddress);
	const [maxVotes, setMaxVotes] = useState(walletMaxVotes);
	const [delegates, setDelegates] = useState<ReadOnlyWallet[]>([]);
	const [votes, setVotes] = useState<ReadOnlyWallet[] | undefined>();
	const [isLoadingDelegates, setIsLoadingDelegates] = useState(false);
	const [selectedFilter, setSelectedFilter] = useState<FilterOption>(filter);

	const walletsByCoin = useMemo(() => {
		const wallets = activeProfile.wallets().allByCoin();

		const usesTestNetworks = activeProfile.settings().get(ProfileSetting.UseTestNetworks);
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
				[coin]: Object.values(wallets[coin]).filter((wallet: ReadWriteWallet) => {
					if (!selectedNetworkIds.includes(wallet.network().id())) {
						return false;
					}

					if (walletsDisplayType === "favorites") {
						return wallet.isStarred();
					}

					if (walletsDisplayType === "ledger") {
						return wallet.isLedger();
					}

					return wallet;
				}),
			}),
			{} as Record<string, ReadWriteWallet[]>,
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

	const filteredDelegatesVotes = useMemo(() => (selectedFilter === "all" ? delegates : currentVotes), [
		delegates,
		currentVotes,
		selectedFilter,
	]);

	const filterProperties = {
		networks,
		useTestNetworks: activeProfile.settings().get(ProfileSetting.UseTestNetworks) as boolean,
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

	const loadVotes = useCallback(
		(address) => {
			const wallet = activeProfile.wallets().findByAddress(address);
			let votes: ReadOnlyWallet[] = [];

			try {
				votes = wallet!.votes();
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

	const loadDelegates = useCallback(
		(wallet) => {
			setIsLoadingDelegates(true);
			// eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
			const delegates = env.delegates().all(wallet?.coinId()!, wallet?.networkId()!);
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
					(wallet: ReadWriteWallet) =>
						wallet.address().toLowerCase().includes(searchQuery.toLowerCase()) ||
						wallet.alias()?.toLowerCase()?.includes(searchQuery.toLowerCase()),
				),
			}),
			{} as Record<string, ReadWriteWallet[]>,
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
						<div className="flex items-center space-x-8 text-theme-primary-200">
							<HeaderSearchBar
								placeholder={t("VOTE.VOTES_PAGE.SEARCH_PLACEHOLDER")}
								onSearch={setSearchQuery}
								onReset={() => setSearchQuery("")}
								debounceTimeout={100}
							/>
							<div className="mr-8 h-10 border-l border-theme-secondary-300 dark:border-theme-secondary-800" />
							{!selectedAddress ? (
								<div data-testid="Votes__FilterWallets">
									<Dropdown
										position="right"
										toggleContent={
											<div className="cursor-pointer">
												<Icon name="Filters" width={20} height={20} />
											</div>
										}
									>
										<div className="py-7 px-10 w-128">
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
					}
				/>
			</Section>

			{isEmptyObject(walletsByCoin) ? (
				<Section>
					<EmptyBlock>
						<div className="flex justify-between items-center">
							<Trans
								i18nKey="VOTE.VOTES_PAGE.EMPTY_MESSAGE"
								defaults="Your must first <bold>{{create}}</bold> or <bold>{{import}}</bold> an address to view your current voting status"
								values={{
									create: t("DASHBOARD.WALLET_CONTROLS.CREATE"),
									import: t("DASHBOARD.WALLET_CONTROLS.IMPORT"),
								}}
								components={{ bold: <strong /> }}
							/>

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
				<Section>
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
					/>
				</Section>
			)}
		</Page>
	);
};
