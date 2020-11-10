import { Coins } from "@arkecosystem/platform-sdk";
import { Profile, ReadOnlyWallet, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { Address } from "app/components/Address";
import { Avatar } from "app/components/Avatar";
import { Circle } from "app/components/Circle";
import { Header } from "app/components/Header";
import { HeaderSearchBar } from "app/components/Header/HeaderSearchBar";
import { Icon } from "app/components/Icon";
import { Input } from "app/components/Input";
import { Page, Section } from "app/components/Layout";
import { useEnvironmentContext } from "app/contexts";
import { useActiveProfile, useActiveWallet, useQueryParams } from "app/hooks";
import { SelectNetwork } from "domains/network/components/SelectNetwork";
import { AddressTable } from "domains/vote/components/AddressTable";
import { DelegateTable } from "domains/vote/components/DelegateTable";
import { FilterOption, VotesFilter } from "domains/vote/components/VotesFilter";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";

const InputAddress = ({ address, profile }: { address: string; profile: Profile }) => {
	const { t } = useTranslation();
	const walletName = profile.wallets().findByAddress(address)?.alias();

	return (
		<div className="relative flex items-center">
			<Input type="text" disabled />
			<div className="absolute flex items-center justify-between w-full ml-3">
				<div className="flex items-center">
					{address ? (
						<>
							<Avatar className="mr-3" address={address} size="sm" noShadow />
							<Address address={address} walletName={walletName} />
						</>
					) : (
						<>
							<Circle
								className="mr-3 bg-theme-neutral-200 border-theme-neutral-300 dark:border-theme-neutral-800"
								size="sm"
								noShadow
							/>
							<span className="text-theme-neutral-light">
								{t("COMMON.SELECT_OPTION", { option: t("COMMON.ADDRESS") })}
							</span>
						</>
					)}
				</div>
				<Icon name="User" className="mr-6" width={20} height={20} />
			</div>
		</div>
	);
};

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

	const [network, setNetwork] = useState<Coins.Network | null>(null);
	const [wallets, setWallets] = useState<ReadWriteWallet[]>([]);
	const [address, setAddress] = useState(hasWalletId ? activeWallet.address() : "");
	const [delegates, setDelegates] = useState<ReadOnlyWallet[]>([]);
	const [votes, setVotes] = useState<ReadOnlyWallet[]>([]);
	const [availableNetworks, setAvailableNetworks] = useState<any[]>([]);
	const [isLoadingDelegates, setIsLoadingDelegates] = useState<boolean>(false);
	const [selectedFilter, setSelectedFilter] = useState<FilterOption>("all");

	const crumbs = [
		{
			route: `/profiles/${activeProfile.id()}/dashboard`,
			label: t("COMMON.GO_BACK_TO_PORTFOLIO"),
		},
	];

	const networks = useMemo(() => env.availableNetworks(), [env]);

	useEffect(() => {
		if (hasWalletId) {
			for (const network of networks) {
				if (network.coin() === activeWallet.coinId() && network.id() === activeWallet.networkId()) {
					setNetwork(network);

					break;
				}
			}
		}
	}, [activeWallet, hasWalletId, networks]);

	useEffect(() => {
		if (network) {
			setWallets(activeProfile.wallets().findByCoinWithNetwork(network.coin(), network.id()));
		}
	}, [activeProfile, network]);

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
		if (address) loadVotes(address);
	}, [address, loadVotes]);

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

	useEffect(() => {
		const userNetworks: string[] = [];
		const wallets: any = activeProfile.wallets().values();
		for (const wallet of wallets) {
			userNetworks.push(wallet.networkId());
		}

		setAvailableNetworks(networks.filter((network) => userNetworks.includes(network.id())));
	}, [activeProfile, networks]);

	const handleSelectNetwork = (networkData?: Coins.Network | null) => {
		if (!networkData || networkData.id() !== network?.id()) {
			setWallets([]);
			setAddress("");
		}

		setNetwork(networkData!);
	};

	const handleSelectAddress = (address: string) => {
		setAddress(address);
		const wallet = activeProfile.wallets().findByAddress(address);
		loadDelegates(wallet);
	};

	const handleContinue = (unvotes: string[], votes: string[]) => {
		const walletId = hasWalletId ? activeWallet.id() : activeProfile.wallets().findByAddress(address)?.id();

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

	const currentVotes = useMemo(() => votes.filter((v) => delegates.some((d) => v.address() === d.address())), [
		votes,
		delegates,
	]);

	const filteredDelegates = useMemo(() => (selectedFilter === "all" ? delegates : currentVotes), [
		delegates,
		currentVotes,
		selectedFilter,
	]);

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
							<VotesFilter
								totalCurrentVotes={currentVotes.length}
								selectedOption={selectedFilter}
								onChange={setSelectedFilter}
							/>
						</div>
					}
				/>
			</Section>

			<div className="container pt-10 mx-auto px-14">
				<div className="grid grid-flow-col grid-cols-2 gap-6 mb-10">
					<div className="flex flex-col space-y-2 group">
						<div className="text-sm font-semibold transition-colors duration-100 group-hover:text-theme-primary text-theme-neutral">
							{t("COMMON.CRYPTOASSET")}
						</div>
						<SelectNetwork
							id="Votes__network"
							networks={availableNetworks}
							selected={network!}
							placeholder={t("COMMON.SELECT_OPTION", { option: t("COMMON.CRYPTOASSET") })}
							onSelect={handleSelectNetwork}
						/>
					</div>

					<div className="flex flex-col space-y-2">
						<div className="text-sm font-semibold text-theme-neutral">{t("COMMON.ADDRESS")}</div>
						<InputAddress address={address} profile={activeProfile} />
					</div>
				</div>
			</div>

			<Section className="flex-1">
				{network?.allowsVoting() && address ? (
					<DelegateTable
						isLoading={isLoadingDelegates}
						delegates={filteredDelegates}
						maxVotes={network.maximumVotesPerWallet()}
						votes={votes}
						selectedUnvoteAddresses={unvoteAddresses}
						selectedVoteAddresses={voteAddresses}
						selectedWallet={address}
						onContinue={handleContinue}
					/>
				) : network?.allowsVoting() ? (
					<AddressTable wallets={wallets} onSelect={handleSelectAddress} />
				) : (
					<div className="mt-8 text-center text-theme-secondary-text" data-testid="votes__message">
						{t("VOTE.VOTES_PAGE.SELECT_CRYPTOASSET_MESSAGE")}
					</div>
				)}
			</Section>
		</Page>
	);
};
