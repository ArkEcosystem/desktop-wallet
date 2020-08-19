import { NetworkData } from "@arkecosystem/platform-sdk-profiles";
import { images } from "app/assets/images";
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
import { useActiveProfile } from "app/hooks/env";
import { SelectNetwork } from "domains/network/components/SelectNetwork";
import { AddressList } from "domains/vote/components/AddressList";
import { DelegateList } from "domains/vote/components/DelegateList";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

type VotesProps = {
	addressList?: any[];
	delegateList?: any[];
};

const { PlaceholderVotes } = images.vote.pages.votes;

export const Votes = ({ addressList, delegateList }: VotesProps) => {
	const context = useEnvironmentContext();
	const networks = useMemo(() => context.env.availableNetworks(), [context]);

	const [selectedNetwork, setSelectedNetwork] = useState<NetworkData | null>(null);
	const [selectedAddress, setSelectedAddress] = useState("");

	const activeProfile = useActiveProfile();

	const { t } = useTranslation();

	const crumbs = [
		{
			route: `/profiles/${activeProfile.id()}/dashboard`,
			label: t("COMMON.GO_BACK_TO_PORTFOLIO"),
		},
	];

	const handleSelectNetwork = (network?: NetworkData | null) => {
		setSelectedNetwork(network!);
	};

	const handleSelectAddress = (address: string) => {
		setSelectedAddress(address);
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
							placeholder={t("COMMON.SELECT_OPTION", { option: t("COMMON.NETWORK") })}
							onSelect={handleSelectNetwork}
						/>
					</TransactionDetail>
					<TransactionDetail border={false} label={t("COMMON.ADDRESS")} className="mt-2">
						<div className="relative flex items-center pb-24">
							<Input type="text" disabled />
							<div className="absolute flex items-center justify-between w-full ml-3">
								<div className="flex items-center">
									{selectedAddress ? (
										<>
											<Avatar className="mr-3" address={selectedAddress} size="sm" noShadow />
											<Address address="AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK" walletName="ROBank" />
										</>
									) : (
										<>
											<Circle className="mr-3" avatarId="test" size="sm" noShadow />
											<span className="text-base font-semibold text-theme-neutral-light">
												{t("COMMON.SELECT_OPTION", { option: t("COMMON.ADDRESS") })}
											</span>
										</>
									)}
								</div>
								<Icon name="User" className="mr-6" width={20} height={20} />
							</div>
						</div>
					</TransactionDetail>
				</div>
			</div>

			<Section className="flex-1">
				{!selectedNetwork ? (
					<div className="flex flex-col space-y-5">
						{addressList?.map((item) => (
							<PlaceholderVotes key={item.walletAddress} />
						))}
					</div>
				) : selectedAddress ? (
					<DelegateList data={delegateList} />
				) : (
					<AddressList data={addressList} onSelect={handleSelectAddress} />
				)}
			</Section>
		</Page>
	);
};

Votes.defaultProps = {
	addressList: [],
	delegateList: [],
};
