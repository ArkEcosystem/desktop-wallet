import { Address } from "app/components/Address";
import { Breadcrumbs } from "app/components/Breadcrumbs";
import { Circle } from "app/components/Circle";
import { Header } from "app/components/Header";
import { HeaderSearchBar } from "app/components/Header/HeaderSearchBar";
import { Icon } from "app/components/Icon";
import { Input } from "app/components/Input";
import { SelectAsset } from "app/components/SelectAsset";
import { TransactionDetail } from "app/components/TransactionDetail";
import React from "react";
import { useTranslation } from "react-i18next";
import { styled } from "twin.macro";

type VotesProps = {
	assets?: any[];
};

const SelectAssetWrapper = styled.div`
	.select-asset__items {
		> div > div {
			box-shadow: none;
		}
	}
`;

export const Votes = ({ assets }: VotesProps) => {
	const { t } = useTranslation();
	const crumbs = [
		{
			route: "portfolio",
			label: "Go back to Portfolio",
		},
	];

	return (
		<div data-testid="MyVotes" className="flex flex-col min-h-screen -m-5 bg-theme-neutral-200">
			<Breadcrumbs crumbs={crumbs} className="p-5 font-semibold" />

			<div className="flex flex-col flex-1 space-y-5">
				<div className="p-10 bg-theme-background">
					<Header
						title={t("VOTE.VOTES_PAGE.TITLE")}
						subtitle={t("VOTE.VOTES_PAGE.SUBTITLE")}
						extra={
							<div className="flex items-center justify-end">
								<HeaderSearchBar />
							</div>
						}
					/>
				</div>

				<div className="px-10">
					<div className="grid grid-flow-col gap-6">
						<TransactionDetail border={false} label="Cryptoasset">
							<SelectAssetWrapper>
								<SelectAsset assets={assets} name="cryptoasset" placeholder="Select cryptoasset" />
							</SelectAssetWrapper>
						</TransactionDetail>
						<TransactionDetail border={false} label="Address">
							<div className="relative flex items-center pb-16">
								<Input type="text" disabled />
								<div className="absolute flex items-center justify-between w-full ml-3">
									<div className="flex items-center">
										<Circle avatarId="test" size="small" noShadow className="mr-3" />
										<Address address="AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK" walletName="ROBank" />
									</div>
									<Icon name="User" className="mr-6" width={20} height={20} />
								</div>
							</div>
						</TransactionDetail>
					</div>
				</div>
			</div>
		</div>
	);
};

Votes.defaultProps = {
	assets: [],
};
