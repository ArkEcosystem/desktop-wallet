import { Dropdown } from "app/components/Dropdown";
import { FilterNetworks } from "app/components/FilterNetwork";
import { Icon } from "app/components/Icon";
import React from "react";
import { useTranslation } from "react-i18next";

import { FilterWalletsProps } from "./";

export const FilterWallets = ({ networks, walletsDisplayType, useTestNetworks, onChange }: FilterWalletsProps) => {
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
				<div className="mt-1 text-sm text-theme-secondary-500">
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

			<div className="my-8 border-t border-dotted border-theme-secondary-300 dark:border-theme-secondary-800" />

			<div className="flex flex-col">
				<div className="flex justify-between items-center">
					<div className="font-semibold text-theme-secondary-text">
						{t("DASHBOARD.FILTER_WALLETS.WALLETS.TITLE")}
					</div>

					<Dropdown
						toggleIcon="ChevronDown"
						options={walletDisplayOptions}
						onSelect={({ value }: { value: string }) => onChange?.("walletsDisplayType", value)}
						toggleContent={(isOpen: boolean) => (
							<div
								data-testid="filter-wallets__wallets"
								className="flex justify-end items-center cursor-pointer text-theme-secondary-text"
							>
								<span className="inline-block mr-2 font-semibold">
									{walletDisplayOptions.find((option) => option.value === walletsDisplayType)?.label}
								</span>
								<Icon
									name="ChevronDown"
									className={`transition-transform ${isOpen ? "transform rotate-180" : ""}`}
									width={8}
									height={5}
								/>
							</div>
						)}
					/>
				</div>

				<div className="pr-12 mt-1 text-sm text-theme-secondary-500">
					{t("DASHBOARD.FILTER_WALLETS.WALLETS.DESCRIPTION")}
				</div>
			</div>
		</div>
	);
};
