import { Dropdown, DropdownOption } from "app/components/Dropdown";
import { FilterNetwork } from "app/components/FilterNetwork";
import { Icon } from "app/components/Icon";
import React from "react";
import { useTranslation } from "react-i18next";

export type FilterWalletsProps = {
	networks?: any;
	walletsDisplayType?: string;
	onNetworkChange?: any;
	onViewAllNetworks?: any;
	onWalletsDisplayType?: any;
};

export const FilterWallets = ({
	networks,
	walletsDisplayType,
	onNetworkChange,
	onViewAllNetworks,
	onWalletsDisplayType,
}: FilterWalletsProps) => {
	const { t } = useTranslation();

	const walletDisplayOptions = [
		{ label: t("COMMON.ALL"), value: "all" },
		{ label: t("COMMON.FAVORITES"), value: "favorites" },
		{ label: t("COMMON.LEDGER"), value: "ledger" },
	];

	return (
		<Dropdown
			position="right"
			toggleContent={
				<div className="cursor-pointer">
					<Icon name="Filters" width={20} height={20} />
				</div>
			}
		>
			<div className="px-10 py-7 w-128">
				<div className="flex flex-col text-left" data-testid="FilterWallets">
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
								options={walletDisplayOptions}
								onSelect={(option: DropdownOption) => onWalletsDisplayType?.(option)}
								toggleContent={
									<div
										data-testid="filter-wallets__wallets"
										className="flex items-center justify-end cursor-pointer text-theme-secondary-text"
									>
										<span className="inline-block mr-2 font-semibold">
											{
												walletDisplayOptions.find(
													(option) => option.value === walletsDisplayType,
												)?.label
											}
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
				</div>
			</div>
		</Dropdown>
	);
};

FilterWallets.defaultProps = {
	networks: [],
	walletsDisplayType: "all",
};
