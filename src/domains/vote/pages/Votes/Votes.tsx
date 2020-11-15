import { ReadOnlyWallet, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { isEmptyObject, uniq, uniqBy } from "@arkecosystem/utils";
import { Icon } from "app/components//Icon";
import { Button } from "app/components/Button";
import { Dropdown, DropdownOption } from "app/components/Dropdown";
import { EmptyBlock } from "app/components/EmptyBlock";
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

	const walletAddress = hasWalletId ? activeWallet.address() : "";
	const walletMaxVotes = hasWalletId ? activeWallet.network().maximumVotesPerWallet() : undefined;

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
	const [votes, setVotes] = useState<ReadOnlyWallet[]>([]);
	const [isLoadingDelegates, setIsLoadingDelegates] = useState(false);
	const [selectedFilter, setSelectedFilter] = useState<FilterOption>("all");

	const crumbs = [
		{
			route: `/profiles/${activeProfile.id()}/dashboard`,
			label: t("COMMON.GO_BACK_TO_PORTFOLIO"),
		},
	];

	const walletsByCoin = useMemo(() => {
		const wallets = activeProfile.wallets().allByCoin();

		return Object.keys(wallets).reduce(
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
				isSelected: selectedNetworkIds.includes(wallet.network().id()),
			}));

		return uniqBy(networks, (network) => network.coin);
	}, [activeProfile, selectedNetworkIds]);

	const currentVotes = useMemo(
		() => votes.filter((vote) => delegates.some((delegate) => vote.address() === delegate.address())),
		[votes, delegates],
	);

	const filteredDelegates = useMemo(() => (selectedFilter === "all" ? delegates : currentVotes), [
		delegates,
		currentVotes,
		selectedFilter,
	]);

	const filterProperties = {
		networks,
		selectedNetworkIds,
		walletsDisplayType,
		onNetworkChange: (_: any, networks: any[]) => {
			setSelectedNetworkIds(networks.filter((network) => network.isSelected).map((network) => network.id));
		},
		onWalletsDisplayType: ({ value }: DropdownOption) => {
			setWalletsDisplayType(value as string);
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
		if (votes.length === 0) setSelectedFilter("all");
	}, [votes]);

	return (
		<Page profile={activeProfile} crumbs={crumbs}>
			<Section>
				<Header
					title={t("VOTE.VOTES_PAGE.TITLE")}
					subtitle={t("VOTE.VOTES_PAGE.SUBTITLE")}
					extra={
						<div className="flex items-center space-x-8 text-theme-primary-light">
							<HeaderSearchBar placeholder={t("VOTE.VOTES_PAGE.SEARCH_PLACEHOLDER")} />
							<div className="h-10 mr-8 border-l border-theme-neutral-300 dark:border-theme-neutral-800" />
							{!selectedAddress ? (
								<Dropdown
									position="right"
									toggleContent={
										<div className="cursor-pointer">
											<Icon name="Filters" width={20} height={20} />
										</div>
									}
								>
									<div className="px-10 py-7 w-128">
										<FilterWallets {...filterProperties} showToggleViews={false} />
									</div>
								</Dropdown>
							) : (
								<VotesFilter
									totalCurrentVotes={currentVotes.length}
									selectedOption={selectedFilter}
									onChange={setSelectedFilter}
								/>
							)}
						</div>
					}
				/>
			</Section>

			{isEmptyObject(walletsByCoin) ? (
				<Section className="flex-1">
					<EmptyBlock>
						<div className="flex items-center justify-between">
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
									variant="plain"
								>
									<div className="flex items-center space-x-2">
										<Icon name="Plus" width={12} height={12} />
										<span>{t("DASHBOARD.WALLET_CONTROLS.CREATE")}</span>
									</div>
								</Button>

								<Button
									onClick={() => history.push(`/profiles/${activeProfile.id()}/wallets/import`)}
									variant="plain"
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
				Object.keys(walletsByCoin).map(
					(coin, index) =>
						walletsByCoin[coin].length > 0 && (
							<Section className="flex-1" key={index}>
								<AddressTable wallets={walletsByCoin[coin]} onSelect={handleSelectAddress} />
							</Section>
						),
				)
			) : (
				<Section className="flex-1">
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
