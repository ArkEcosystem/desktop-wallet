import { Dropdown } from "app/components/Dropdown";
import { FilterNetworks } from "app/components/FilterNetwork";
import { Icon } from "app/components/Icon";
import { Toggle } from "app/components/Toggle";
import React from "react";
import { useTranslation } from "react-i18next";

import { FilterWalletsProps } from "./";

export const FilterWallets = ({
	networks,
	walletsDisplayType,
	showPortfolio,
	showTransactions,
	useTestNetworks,
	showToggleViews,
	onChange,
}: FilterWalletsProps) => {
	const { t } = useTranslation();

	const walletDisplayOptions = [
		{ label: t("COMMON.ALL"), value: "all" },
		{ label: t("COMMON.FAVORITES"), value: "favorites" },
		{ label: t("COMMON.LEDGER"), value: "ledger" },
	];

	return (
		<div className="flex flex-col text-left" data-testid="FilterWallets">
			<div className="mb-8">
				<div className="font-semibold text-theme-secondary-text">
					{t("DASHBOARD.FILTER_WALLETS.CRYPTOASSET.TITLE")}
				</div>
				<div className="mt-1 text-sm text-theme-neutral">
					{t("DASHBOARD.FILTER_WALLETS.CRYPTOASSET.DESCRIPTION")}
				</div>
			</div>

			<FilterNetworks
				useTestNetworks={useTestNetworks}
				networks={networks}
				onChange={(_: any, networks: any[]) => {
					onChange?.(
						"selectedNetworkIds",
						networks.filter((network) => network.isSelected).map((network) => network.id),
					);
				}}
			/>

			<div className="my-8 border-t border-dotted border-theme-neutral-300 dark:border-theme-neutral-800" />

			<div className="flex flex-col">
				<div className="flex justify-between items-center">
					<div className="font-semibold text-theme-secondary-text">
						{t("DASHBOARD.FILTER_WALLETS.WALLETS.TITLE")}
					</div>

					<Dropdown
						toggleIcon="ChevronDown"
						options={walletDisplayOptions}
						onSelect={({ value }: { value: string }) => onChange?.("walletsDisplayType", value)}
						toggleContent={
							<div
								data-testid="filter-wallets__wallets"
								className="flex justify-end items-center cursor-pointer text-theme-secondary-text"
							>
								<span className="inline-block mr-2 font-semibold">
									{walletDisplayOptions.find((option) => option.value === walletsDisplayType)?.label}
								</span>
								<Icon name="ChevronDown" width={12} height={12} />
							</div>
						}
					/>
				</div>

				<div className="pr-12 mt-1 text-sm text-theme-neutral">
					{t("DASHBOARD.FILTER_WALLETS.WALLETS.DESCRIPTION")}
				</div>
			</div>

			{showToggleViews && (
				<>
					<div className="my-8 border-t border-dotted border-theme-neutral-300 dark:border-theme-neutral-800" />

					<div className="flex flex-col mb-6">
						<div className="flex justify-between items-center">
							<div className="font-semibold text-theme-secondary-text">
								{t("DASHBOARD.FILTER_WALLETS.CHART.TITLE")}
							</div>

							<Toggle
								checked={showPortfolio}
								data-testid="filter-wallets_toggle--portfolio"
								onChange={(event) => onChange?.("showPortfolio", event.target.checked)}
							/>
						</div>

						<div className="pr-12 mt-1 text-sm text-theme-neutral">
							{t("DASHBOARD.FILTER_WALLETS.CHART.DESCRIPTION")}
						</div>
					</div>

					<div className="flex flex-col">
						<div className="flex justify-between items-center">
							<div className="font-semibold text-theme-secondary-text">
								{t("DASHBOARD.FILTER_WALLETS.TRANSACTION_HISTORY.TITLE")}
							</div>

							<Toggle
								checked={showTransactions}
								data-testid="filter-wallets_toggle--transactions"
								onChange={(event) => onChange?.("showTransactions", event.target.checked)}
							/>
						</div>

						<div className="pr-12 mt-1 text-sm text-theme-neutral">
							{t("DASHBOARD.FILTER_WALLETS.TRANSACTION_HISTORY.DESCRIPTION")}
						</div>
					</div>
				</>
			)}
		</div>
	);
};

FilterWallets.defaultProps = {
	showToggleViews: true,
};
