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
import { useActiveProfile } from "app/hooks/env";
import { SelectNetwork } from "domains/network/components/SelectNetwork";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import { AddressList } from "../../components/AddressList";
import { DelegateList } from "../../components/DelegateList";

type VotesProps = {
	networks?: any[];
	addressList?: any[];
	delegateList?: any[];
};

const { PlaceholderVotes } = images.vote.pages.votes;

export const Votes = ({ networks, addressList, delegateList }: VotesProps) => {
	const [selectedCrypto, setSelectCrypto] = useState<NetworkData | undefined | null>(undefined);
	const [selectedAddress, setSelectAddress] = useState("");

	const activeProfile = useActiveProfile();

	const { t } = useTranslation();

	const crumbs = [
		{
			route: `/profiles/${activeProfile.id()}/dashboard`,
			label: t("COMMON.GO_BACK_TO_PORTFOLIO"),
		},
	];

	const handleSelectCrypto = (network?: NetworkData | null) => {
		setSelectCrypto(network);
	};

	const handleSelectAddress = (address: string) => {
		setSelectAddress(address);
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
							networks={networks}
							id="Votes__network"
							placeholder={t("COMMON.SELECT_OPTION", { option: t("COMMON.NETWORK") })}
							onSelect={handleSelectCrypto}
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
				{!selectedCrypto ? (
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
	networks: [],
	addressList: [],
	delegateList: [],
};
