import { Dropdown } from "app/components/Dropdown";
import { FilterNetwork } from "app/components/FilterNetwork";
import { Icon } from "app/components/Icon";
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
		<div className="flex flex-col text-left">
			<div className="mb-8">
				<div className="font-semibold text-theme-neutral-dark">Filter Network</div>
				<div className="mt-1 text-sm text-theme-neutral">Select the types of networks</div>
			</div>

			<FilterNetwork networks={networks} onChange={onNetworkChange} onViewAll={onViewAllNetworks} />

			<div className="my-8 border-t border-dotted border-1 border-theme-neutral-200" />

			<div className="flex flex-col">
				<div className="flex items-center justify-between">
					<div className="font-semibold text-theme-neutral-dark">Your Wallets</div>

					<Dropdown
						toggleIcon="ChevronDown"
						options={[
							{ label: "Option 1", value: "option1" },
							{ label: "Option 2", value: "option2" },
						]}
						onSelect={onWalletClick}
						toggleContent={
							<div
								data-testid="filter-wallets__wallets"
								className="flex items-center justify-end cursor-pointer text-theme-neutral-dark"
							>
								<span className="inline-block mr-2 font-semibold">All</span>
								<Icon name="ChevronDown" width={12} height={12} />
							</div>
						}
					/>
				</div>

				<div className="pr-12 mt-1 text-sm text-theme-neutral">Select the display of your wallets</div>
			</div>

			<div className="my-8 border-t border-dotted border-1 border-theme-neutral-200" />

			<div className="flex flex-col mb-6">
				<div className="flex items-center justify-between">
					<div className="font-semibold text-theme-neutral-dark">Portfolio Chart</div>

					<Toggle
						checked={showPortfolio}
						data-testid="filter-wallets_toggle--portfolio"
						onChange={(e) => togglePortfolio(e.target.checked)}
					/>
				</div>

				<div className="pr-12 mt-1 text-sm text-theme-neutral">You can hide this unit if you like</div>
			</div>

			<div className="flex flex-col">
				<div className="flex items-center justify-between">
					<div className="font-semibold text-theme-neutral-dark">Transaction History</div>

					<Toggle
						checked={showTransactions}
						data-testid="filter-wallets_toggle--transactions"
						onChange={(e) => toggleTransactions(e.target.checked)}
					/>
				</div>

				<div className="pr-12 mt-1 text-sm text-theme-neutral">You can hide this unit if you like</div>
			</div>
		</div>
	);
};

FilterWallets.defaultProps = {
	visibleTransactionsView: false,
	visiblePortfolioView: false,
	networks: [],
};
