import { Dropdown } from "app/components/Dropdown";
import { FilterNetwork } from "app/components/FilterNetwork";
import { Icon } from "app/components/Icon";
import { Toggle } from "app/components/Toggle";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

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

	const { t } = useTranslation();

	const togglePortfolio = (isChecked: boolean) => {
		setShowPortfolio(isChecked);
		togglePortfolioView?.(isChecked);
	};

	const toggleTransactions = (isChecked: boolean) => {
		setShowTransactions(isChecked);
		toggleTransactionsView?.(isChecked);
	};

	const onWalletClick = () => {
		onWalletsDisplay?.();
	};

	return (
		<div className="flex flex-col text-left">
			<div className="mb-8">
				<div className="font-semibold text-theme-secondary-text">
					{t("DASHBOARD.FILTER_WALLETS.CRYPTOASSET.TITLE")}
				</div>
				<div className="mt-1 text-sm text-theme-neutral">
					{t("DASHBOARD.FILTER_WALLETS.CRYPTOASSET.DESCRIPTION")}
				</div>
			</div>

			<FilterNetwork networks={networks} onChange={onNetworkChange} onViewAll={onViewAllNetworks} />

			<div className="my-8 border-t border-dotted border-theme-neutral-300 dark:border-theme-neutral-800" />

			<div className="flex flex-col">
				<div className="flex items-center justify-between">
					<div className="font-semibold text-theme-secondary-text">
						{t("DASHBOARD.FILTER_WALLETS.WALLETS.TITLE")}
					</div>

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
								className="flex items-center justify-end cursor-pointer text-theme-secondary-text"
							>
								<span className="inline-block mr-2 font-semibold">{t("COMMON.ALL")}</span>
								<Icon name="ChevronDown" width={12} height={12} />
							</div>
						}
					/>
				</div>

				<div className="pr-12 mt-1 text-sm text-theme-neutral">
					{t("DASHBOARD.FILTER_WALLETS.WALLETS.DESCRIPTION")}
				</div>
			</div>

			<div className="my-8 border-t border-dotted border-theme-neutral-300 dark:border-theme-neutral-800" />

			<div className="flex flex-col mb-6">
				<div className="flex items-center justify-between">
					<div className="font-semibold text-theme-secondary-text">
						{t("DASHBOARD.FILTER_WALLETS.CHART.TITLE")}
					</div>

					<Toggle
						checked={showPortfolio}
						data-testid="filter-wallets_toggle--portfolio"
						onChange={(e) => togglePortfolio(e.target.checked)}
					/>
				</div>

				<div className="pr-12 mt-1 text-sm text-theme-neutral">
					{t("DASHBOARD.FILTER_WALLETS.CHART.DESCRIPTION")}
				</div>
			</div>

			<div className="flex flex-col">
				<div className="flex items-center justify-between">
					<div className="font-semibold text-theme-secondary-text">
						{t("DASHBOARD.FILTER_WALLETS.TRANSACTION_HISTORY.TITLE")}
					</div>

					<Toggle
						checked={showTransactions}
						data-testid="filter-wallets_toggle--transactions"
						onChange={(e) => toggleTransactions(e.target.checked)}
					/>
				</div>

				<div className="pr-12 mt-1 text-sm text-theme-neutral">
					{t("DASHBOARD.FILTER_WALLETS.TRANSACTION_HISTORY.DESCRIPTION")}
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
