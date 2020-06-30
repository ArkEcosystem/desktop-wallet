import { Breadcrumbs } from "app/components/Breadcrumbs";
import { Header } from "app/components/Header";
import { HeaderSearchBar } from "app/components/Header/HeaderSearchBar";
import { SelectAsset } from "app/components/SelectAsset";
import React from "react";
import { useTranslation } from "react-i18next";

type VotesProps = {
	assets?: any[];
};

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

				<div className="p-10">
					<SelectAsset assets={assets} name="cryptoasset" placeholder="Select cryptoasset" />
				</div>
			</div>
		</div>
	);
};

Votes.defaultProps = {
	assets: [],
};
