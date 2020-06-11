import React, { useState } from "react";
import { SelectNetwork } from "../SelectNetwork";
import { Divider } from "app/components//Divider";
import { Badge } from "../Badge";
import { Toggle } from "../Toggle";

type FilterWalletsProps = {
	networks?: any;
	visiblePortfolioView?: any;
	visibleTransactionsView?: any;
	onNetworkChange?: any;
	onViewAllNetworks?: any;
	onWalletsDisplay?: any;
	togglePortfolioView?: any;
	toggleTransactionsView?: any;
};

export const FilterWallets = ({
	networks,
	onNetworkChange,
	onViewAllNetworks,
	onWalletsDisplay,
	togglePortfolioView,
	toggleTransactionsView,
	visibleTransactionsView,
	visiblePortfolioView,
}: FilterWalletsProps) => {
	const [showPortfolio, setShowPortfolio] = useState(visiblePortfolioView);
	const [showTransactions, setShowTransactions] = useState(visibleTransactionsView);

	const toggleTransactions = (isChecked: boolean) => {
		setShowTransactions(isChecked);
		if (typeof toggleTransactionsView === "function") toggleTransactionsView(isChecked);
	};

	const togglePortfolio = (isChecked: boolean) => {
		setShowPortfolio(isChecked);
		if (typeof togglePortfolioView === "function") togglePortfolioView(isChecked);
	};

	const onWalletClick = () => {
		if (typeof onWalletsDisplay === "function") onWalletsDisplay();
	};

	return (
		<div>
			<div className="mb-4">
				<div className="text-lg text-theme-neutral-800 mb-1">Filter Network</div>
				<div className="text-sm text-theme-neutral-500">Select the types of networks</div>
			</div>
			<SelectNetwork networks={networks} onChange={onNetworkChange} onViewAll={onViewAllNetworks}></SelectNetwork>
			<Divider></Divider>

			<div className="mb-4 flex flex-row">
				<div className="w-4/5">
					<div className="text-lg text-theme-neutral-800 mb-1">Your Wallets</div>
					<div className="text-sm text-theme-neutral-500">Select the display of your wallets</div>
				</div>
				<div className="w-1/5 text-right">
					<div
						data-testid="filter-wallets__wallets"
						className="text-theme-neutral-800 relative mt-3 mr-10 h-6 cursor-pointer"
						onClick={onWalletClick}
					>
						All <Badge icon="ChevronDown" className="top-0 -right-6"></Badge>
					</div>
				</div>
			</div>
			<Divider></Divider>
			<div className="mb-4 flex flex-row">
				<div className="w-4/5">
					<div className="text-lg text-theme-neutral-800 mb-1">Portfolio Chart</div>
					<div className="text-sm text-theme-neutral-500">You an hide this unit if you like</div>
				</div>
				<div className="w-1/5 text-right pr-7 pt-3">
					<Toggle
						checked={showPortfolio}
						data-testid="filter-wallets_toggle--portfolio"
						onChange={(e) => togglePortfolio(e.target.checked)}
					/>
				</div>
			</div>
			<Divider></Divider>
			<div className="mb-4 flex flex-row">
				<div className="w-4/5">
					<div className="text-lg text-theme-neutral-800 mb-1">Transaction History</div>
					<div className="text-sm text-theme-neutral-500">You can hide this unit if you like</div>
				</div>
				<div className="w-1/5 text-right pr-7 pt-3">
					<Toggle
						value={showTransactions}
						data-testid="filter-wallets_toggle--transactions"
						onChange={(e) => toggleTransactions(e.target.checked)}
					/>
				</div>
			</div>
			<Divider></Divider>
		</div>
	);
};

FilterWallets.defaultProps = {
	visibleTransactionsView: false,
	visiblePortfolioView: false,
	networks: [],
};
