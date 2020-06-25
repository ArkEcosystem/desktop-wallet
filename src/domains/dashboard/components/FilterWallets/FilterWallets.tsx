
import { Badge } from "app/components/Badge";
import { SelectNetwork } from "app/components/SelectNetwork";
import { Toggle } from "app/components/Toggle";
import React, { useState } from "react";

export type FilterWalletsProps = {
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
		<div className="text-left">
			<div className="mb-8">
				<div className="mb-3 font-semibold text-theme-neutral-700">Filter Network</div>
				<div className="text-sm text-theme-neutral-500">Select the types of networks</div>
			</div>
			<SelectNetwork networks={networks} onChange={onNetworkChange} onViewAll={onViewAllNetworks} />
			<div className="border-t border-1 border-theme-neutral-200 border-dotted my-8" />

			<div className="flex flex-row mb-8">
				<div className="w-4/5">
					<div className="mb-3 font-semibold text-theme-neutral-700">Your Wallets</div>
					<div className="text-sm text-theme-neutral-500">Select the display of your wallets</div>
				</div>
				<div className="w-1/5 text-right">
					<div
						data-testid="filter-wallets__wallets"
						className="relative h-6 mt-3 mr-5 cursor-pointer text-theme-neutral-700"
						onClick={onWalletClick}
					>
						<span className="font-semibold inline-block pr-1">All</span>
						<Badge icon="ChevronDown" className="top-1 -right-6" iconWidth={19} iconHeight={19} />
					</div>
				</div>
			</div>

			<div className="border-t border-1 border-theme-neutral-200 border-dotted my-8" />

			<div className="flex flex-row mb-6">
				<div className="w-4/5">
					<div className="mb-3 font-semibold text-theme-neutral-700">Portfolio Chart</div>
					<div className="text-sm text-theme-neutral-500">You an hide this unit if you like</div>
				</div>
				<div className="w-1/5 pt-3 text-right">
					<Toggle
						checked={showPortfolio}
						data-testid="filter-wallets_toggle--portfolio"
						onChange={(e) => togglePortfolio(e.target.checked)}
					/>
				</div>
			</div>

			<div className="flex flex-row mb-4">
				<div className="w-4/5">
					<div className="mb-3 font-semibold text-theme-neutral-700">Transaction History</div>
					<div className="text-sm text-theme-neutral-500">You can hide this unit if you like</div>
				</div>
				<div className="w-1/5 pt-3 text-right">
					<Toggle
						checked={showTransactions}
						data-testid="filter-wallets_toggle--transactions"
						onChange={(e) => toggleTransactions(e.target.checked)}
					/>
				</div>
			</div>
		</div>
	);
};

FilterWallets.defaultProps = {
	visibleTransactionsView: false,
	visiblePortfolioView: false,
	networks: [],
};
