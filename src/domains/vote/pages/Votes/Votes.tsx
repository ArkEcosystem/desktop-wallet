import { images } from "app/assets/images";
import { Address } from "app/components/Address";
import { Avatar } from "app/components/Avatar";
import { Circle } from "app/components/Circle";
import { Header } from "app/components/Header";
import { HeaderSearchBar } from "app/components/Header/HeaderSearchBar";
import { Icon } from "app/components/Icon";
import { Input } from "app/components/Input";
import { Page, Section } from "app/components/Layout";
import { SelectNetwork } from "app/components/SelectNetwork";
import { TransactionDetail } from "app/components/TransactionDetail";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { styled } from "twin.macro";

import { AddressList } from "../../components/AddressList";
import { DelegateList } from "../../components/DelegateList";

type VotesProps = {
	networks?: any[];
	addressList?: any[];
	delegateList?: any[];
};

const { PlaceholderVotes } = images.vote.pages.votes;

const SelectNetworkWrapper = styled.div`
	.select-asset__items {
		> div > div {
			box-shadow: none;
		}
	}
`;

export const Votes = ({ networks, addressList, delegateList }: VotesProps) => {
	const { t } = useTranslation();

	const [selectedCrypto, setSelectCrypto] = useState("");
	const [selectedAddress, setSelectAddress] = useState("");

	const crumbs = [
		{
			route: "portfolio",
			label: "Go back to Portfolio",
		},
	];

	const handleSelectCrypto = (crypto: any) => {
		setSelectCrypto(crypto.icon);
	};

	const handleSelectAddress = (address: string) => {
		setSelectAddress(address);
	};

	return (
		<Page crumbs={crumbs}>
			<Section>
				<Header
					title={t("VOTE.VOTES_PAGE.TITLE")}
					subtitle={t("VOTE.VOTES_PAGE.SUBTITLE")}
					extra={<HeaderSearchBar placeholder="Enter the delegate’s name or address for a quick search" />}
				/>
			</Section>

			<div className="container mx-auto px-14">
				<div className="-my-5 grid grid-cols-2 grid-flow-col gap-6">
					<TransactionDetail border={false} label="Cryptoasset">
						<SelectNetworkWrapper>
							<SelectNetwork
								networks={networks}
								name="cryptoasset"
								placeholder="Select cryptoasset"
								onSelect={handleSelectCrypto}
							/>
						</SelectNetworkWrapper>
					</TransactionDetail>
					<TransactionDetail border={false} label="Address" className="mt-2">
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
												Select address
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
