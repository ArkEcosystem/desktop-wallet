import {
	DelegateMapper,
	NetworkData,
	Profile,
	ReadOnlyWallet,
	ReadWriteWallet,
} from "@arkecosystem/platform-sdk-profiles";
import { Address } from "app/components/Address";
import { Avatar } from "app/components/Avatar";
import { Circle } from "app/components/Circle";
import { Divider } from "app/components/Divider";
import { Header } from "app/components/Header";
import { HeaderSearchBar } from "app/components/Header/HeaderSearchBar";
import { Icon } from "app/components/Icon";
import { Input } from "app/components/Input";
import { Page, Section } from "app/components/Layout";
import { TransactionDetail } from "app/components/TransactionDetail";
import { useEnvironmentContext } from "app/contexts";
import { useActiveProfile, useActiveWallet } from "app/hooks/env";
import { SelectNetwork } from "domains/network/components/SelectNetwork";
import { AddressTable } from "domains/vote/components/AddressTable";
import { DelegateTable } from "domains/vote/components/DelegateTable";
import { MyVoteTable } from "domains/vote/components/MyVoteTable";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";

type TabsProps = {
	selected: string;
	onClick?: (item: string) => void;
};

const Tabs = ({ selected, onClick }: TabsProps) => {
	const { t } = useTranslation();

	const getTabItemClass = (item: string) =>
		selected === item
			? "theme-neutral-900 border-theme-primary-dark"
			: "text-theme-neutral-dark hover:text-theme-neutral-900 border-transparent";

	return (
		<ul className="flex h-20 mr-auto -mt-5 -mb-5" data-testid="Tabs">
			<li
				className={`flex items-center mr-4 font-semibold transition-colors duration-200 cursor-pointer border-b-3 text-md ${getTabItemClass(
					"delegate",
				)}`}
				onClick={() => onClick?.("delegate")}
				data-testid="Tab__item--delegate"
			>
				{t("VOTE.VOTES_PAGE.TABS.SELECT_DELEGATE")}
			</li>
			<li className="flex items-center mr-4">
				<Divider type="vertical" />
			</li>
			<li
				className={`flex items-center font-semibold transition-colors duration-200 cursor-pointer border-b-3 text-md ${getTabItemClass(
					"vote",
				)}`}
				onClick={() => onClick?.("vote")}
				data-testid="Tab__item--vote"
			>
				{t("VOTE.VOTES_PAGE.TABS.MY_VOTE")}
			</li>
		</ul>
	);
};

const InputAddress = ({ address, profile }: { address: string; profile: Profile }) => {
	const { t } = useTranslation();
	const walletName = profile.wallets().findByAddress(address)?.alias();

	return (
		<div className="relative flex items-center pb-24">
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
							<Circle className="mr-3 bg-theme-neutral-200 border-theme-neutral-200" size="sm" noShadow />
							<span className="text-base font-semibold text-theme-neutral-light">
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

	const [tabItem, setTabItem] = useState("delegate");
	const [network, setNetwork] = useState<NetworkData | null>(null);
	const [wallets, setWallets] = useState<ReadWriteWallet[]>([]);
	const [address, setAddress] = useState(hasWalletId ? activeWallet.address() : "");
	const [delegates, setDelegates] = useState<ReadOnlyWallet[]>([]);
	const [votes, setVotes] = useState<ReadOnlyWallet[]>([]);

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
			const readOnlyDelegates = DelegateMapper.execute(
				wallet,
				delegates.map((delegate: ReadOnlyWallet) => delegate.publicKey()) as string[],
			);
			setDelegates(readOnlyDelegates);
		},
		[env],
	);

	useEffect(() => {
		if (hasWalletId) {
			loadDelegates(activeWallet);
		}
	}, [activeWallet, loadDelegates, hasWalletId]);

	const handleSelectNetwork = (network?: NetworkData | null) => {
		setNetwork(network!);
	};

	const handleSelectAddress = (address: string) => {
		setAddress(address);
		const wallet = activeProfile.wallets().findByAddress(address);
		loadDelegates(wallet);
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

			<div className="container mx-auto px-14">
				<div className="grid grid-flow-col grid-cols-2 gap-6 -my-5">
					<TransactionDetail border={false} label={t("COMMON.NETWORK")}>
						<SelectNetwork
							id="Votes__network"
							networks={networks}
							selected={network!}
							placeholder={t("COMMON.SELECT_OPTION", { option: t("COMMON.NETWORK") })}
							onSelect={handleSelectNetwork}
							disabled={hasWalletId}
						/>
					</TransactionDetail>
					<TransactionDetail border={false} label={t("COMMON.ADDRESS")} className="mt-2">
						<InputAddress address={address} profile={activeProfile} />
					</TransactionDetail>
				</div>

				{address && (
					<>
						<Divider />
						<Tabs selected={tabItem} onClick={(tabItem) => setTabItem(tabItem)} />
					</>
				)}
			</div>

			<Section className="flex-1">
				{address ? (
					tabItem === "delegate" ? (
						<DelegateTable
							delegates={delegates}
							maxVotes={network?.maximumVotes() as number}
							votes={votes}
							onContinue={(unvotes, votes) => {
								const walletId = hasWalletId
									? activeWallet.id()
									: activeProfile.wallets().findByAddress(address)?.id();

								const params = new URLSearchParams();

								if (unvotes.length > 0) {
									params.append("unvotes", unvotes.join());
								}

								if (votes.length > 0) {
									params.append("votes", votes.join());
								}

								history.push({
									pathname: `/profiles/${activeProfile.id()}/wallets/${walletId}/send-vote`,
									search: `?${params}`,
								});
							}}
						/>
					) : (
						<MyVoteTable address={address} maxVotes={network?.maximumVotes() as number} votes={votes} />
					)
				) : (
					<AddressTable wallets={wallets} onSelect={handleSelectAddress} />
				)}
			</Section>
		</Page>
	);
};
