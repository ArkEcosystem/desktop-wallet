import { Coins } from "@arkecosystem/platform-sdk";
import { ReadOnlyWallet, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { Header } from "app/components/Header";
import { HeaderSearchBar } from "app/components/Header/HeaderSearchBar";
import { Page, Section } from "app/components/Layout";
import { useEnvironmentContext } from "app/contexts";
import { useActiveProfile, useActiveWallet, useQueryParams } from "app/hooks";
import { AddressTable } from "domains/vote/components/AddressTable";
import { DelegateTable } from "domains/vote/components/DelegateTable";
import { MyVoteTable } from "domains/vote/components/MyVoteTable";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
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

	const [tabItem, setTabItem] = useState("delegate");
	const [network, setNetwork] = useState<Coins.Network | null>(null);
	const [wallets, setWallets] = useState<ReadWriteWallet[]>([]);
	const [address, setAddress] = useState(hasWalletId ? activeWallet.address() : "");
	const [delegates, setDelegates] = useState<ReadOnlyWallet[]>([]);
	const [votes, setVotes] = useState<ReadOnlyWallet[]>([]);
	const [availableNetworks, setAvailableNetworks] = useState<any[]>([]);

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
		if (address) {
			loadVotes(address);
		}
	}, [address, loadVotes]);

	const loadDelegates = useCallback(
		(wallet) => {
			// eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
			const delegates = env.delegates().all(wallet?.coinId()!, wallet?.networkId()!);
			setDelegates(delegates);
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
			setTabItem("delegate");
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

	return (
		<Page profile={activeProfile} crumbs={crumbs}>
			<Section>
				<Header
					title={t("VOTE.VOTES_PAGE.TITLE")}
					subtitle={t("VOTE.VOTES_PAGE.SUBTITLE")}
					extra={<HeaderSearchBar placeholder={t("VOTE.VOTES_PAGE.SEARCH_PLACEHOLDER")} />}
				/>
			</Section>

			<Section className="flex-1">
				{network?.allowsVoting() && address ? (
					tabItem === "delegate" ? (
						<DelegateTable
							delegates={delegates}
							maxVotes={network.maximumVotesPerWallet()}
							votes={votes}
							selectedUnvoteAddresses={unvoteAddresses}
							selectedVoteAddresses={voteAddresses}
							onContinue={handleContinue}
						/>
					) : (
						<MyVoteTable
							maxVotes={network.maximumVotesPerWallet()}
							votes={votes}
							onContinue={handleContinue}
						/>
					)
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
