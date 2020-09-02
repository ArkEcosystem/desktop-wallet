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
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";

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
	const history = useHistory();
	const { walletId: hasWalletId } = useParams();
	const { env } = useEnvironmentContext();
	const activeProfile = useActiveProfile();
	const activeWallet = useActiveWallet();

	const [network, setNetwork] = useState<NetworkData | null>(null);
	const [wallets, setWallets] = useState<ReadWriteWallet[]>([]);
	const [address, setAddress] = useState(hasWalletId ? activeWallet.address() : "");
	const [delegates, setDelegates] = useState<ReadOnlyWallet[]>([]);

	const { t } = useTranslation();

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
				<div className="-my-5 grid grid-flow-col grid-cols-2 gap-6">
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
			</div>

			<Section className="flex-1">
				{address ? (
					<DelegateTable
						coin={network?.coin()}
						delegates={delegates}
						onContinue={(delegateAddress) => {
							const walletId = hasWalletId
								? activeWallet.id()
								: activeProfile.wallets().findByAddress(address)?.id();

							history.push(
								`/profiles/${activeProfile.id()}/wallets/${walletId}/transactions/vote/${delegateAddress}/sender/${address}`,
							);
						}}
					/>
				) : (
					<AddressTable wallets={wallets} onSelect={handleSelectAddress} />
				)}
			</Section>
		</Page>
	);
};
