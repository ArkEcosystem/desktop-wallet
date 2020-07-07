import { images } from "app/assets/images";
import { Address } from "app/components/Address";
import { Avatar } from "app/components/Avatar";
import { Breadcrumbs } from "app/components/Breadcrumbs";
import { Circle } from "app/components/Circle";
import { Header } from "app/components/Header";
import { HeaderSearchBar } from "app/components/Header/HeaderSearchBar";
import { Icon } from "app/components/Icon";
import { Input } from "app/components/Input";
import { SelectAsset } from "app/components/SelectAsset";
import { TransactionDetail } from "app/components/TransactionDetail";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { styled } from "twin.macro";

import { AddressList } from "../../components/AddressList";
import { DelegateList } from "../../components/DelegateList";

type VotesProps = {
	assets?: any[];
	addressList?: any[];
	delegateList?: any[];
};

const { PlaceholderVotes } = images.vote.pages.votes;

const SelectAssetWrapper = styled.div`
	.select-asset__items {
		> div > div {
			box-shadow: none;
		}
	}
`;

export const Votes = ({ assets, addressList, delegateList }: VotesProps) => {
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
		<div data-testid="MyVotes" className="bg-theme-neutral-100 flex flex-col min-h-screen -m-5">
			<Breadcrumbs crumbs={crumbs} className="py-5 pl-10 font-semibold" />

			<div className="flex flex-col flex-1 space-y-5">
				<div className="bg-theme-background px-10 py-16">
					<Header
						title={t("VOTE.VOTES_PAGE.TITLE")}
						subtitle={t("VOTE.VOTES_PAGE.SUBTITLE")}
						extra={
							<HeaderSearchBar placeholder="Enter the delegate’s name or address for a quick search" />
						}
					/>
				</div>

				<div className="px-10">
					<div className="grid grid-flow-col gap-6">
						<TransactionDetail border={false} label="Cryptoasset">
							<SelectAssetWrapper>
								<SelectAsset
									assets={assets}
									name="cryptoasset"
									placeholder="Select cryptoasset"
									onSelect={handleSelectCrypto}
								/>
							</SelectAssetWrapper>
						</TransactionDetail>
						<TransactionDetail border={false} label="Address" className="mt-2">
							<div className="relative flex items-center pb-24">
								<Input type="text" disabled />
								<div className="absolute flex items-center justify-between w-full ml-3">
									<div className="flex items-center">
										{selectedAddress ? (
											<>
												<Avatar className="mr-3" address={selectedAddress} size="sm" noShadow />
												<Address
													address="AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK"
													walletName="ROBank"
												/>
											</>
										) : (
											<>
												<Circle className="mr-3" avatarId="test" size="sm" noShadow />
												<span className="text-theme-neutral-400 text-base font-semibold">
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

				<div className="bg-theme-background relative p-10">
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
				</div>
			</div>
		</div>
	);
};

Votes.defaultProps = {
	assets: [],
	addressList: [],
	delegateList: [],
};
