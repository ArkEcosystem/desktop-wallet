import { Icon } from "app/components//Icon";
import { Button } from "app/components/Button";
import { Dropdown } from "app/components/Dropdown";
import { ControlButton, LayoutControls } from "app/components/LayoutControls";
import { FilterWallets, FilterWalletsProps } from "domains/dashboard/components/FilterWallets";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

type WalletsControlsProps = {
	filterProperties: FilterWalletsProps;
	onCreateWallet?: any;
	onImportWallet?: any;
	onImportLedgerWallet?: () => void;
	onSelectGridView?: any;
	onSelectListView?: any;
	onFilterChange?: (property: Record<string, any>) => void;
};

export const WalletsControls = ({
	filterProperties,
	onCreateWallet,
	onImportWallet,
	onImportLedgerWallet,
	onSelectGridView,
	onSelectListView,
	onFilterChange,
}: WalletsControlsProps) => {
	const [walletsViewType, setWalletsViewType] = useState(filterProperties.viewType);

	const { t } = useTranslation();

	const onClickGridView = () => {
		if (walletsViewType === "grid") return;

		setWalletsViewType("grid");
		onSelectGridView?.();
	};

	const onClickListview = () => {
		if (walletsViewType === "list") return;

		setWalletsViewType("list");
		onSelectListView?.();
	};

	return (
		<div data-testid="WalletControls" className="flex justify-end">
			<div className="flex items-center pr-5 mr-5 border-r border-theme-primary-contrast dark:border-theme-neutral-800">
				<LayoutControls
					onSelectGridView={onClickGridView}
					onSelectListView={onClickListview}
					selectedViewType={walletsViewType}
				/>
			</div>

			<div className="relative flex items-center pr-5 mr-8 border-r text-theme-primary-400 border-theme-primary-contrast dark:border-theme-neutral-800">
				<Dropdown
					dropdownClass="transform -translate-y-4"
					toggleContent={
						<div className="group">
							<ControlButton isActive={filterProperties?.isFilterChanged}>
								<Icon name="Filters" width={17} height={19} />
							</ControlButton>
						</div>
					}
				>
					<div className="px-10 py-7 w-128">
						<FilterWallets {...filterProperties} onChange={onFilterChange} />
					</div>
				</Dropdown>
			</div>

			<div className="flex space-x-3">
				<Button onClick={onCreateWallet} variant="plain">
					<div className="flex items-center space-x-2">
						<Icon name="Plus" width={14} height={14} />
						<span>{t("DASHBOARD.WALLET_CONTROLS.CREATE")}</span>
					</div>
				</Button>

				<Button onClick={onImportWallet} variant="plain">
					<div className="flex items-center space-x-2">
						<Icon name="Import" width={16} height={16} />
						<span>{t("DASHBOARD.WALLET_CONTROLS.IMPORT")}</span>
					</div>
				</Button>

				<Button onClick={onImportLedgerWallet} variant="plain">
					<div className="flex items-center space-x-2">
						<Icon name="Ledger" />
						<span>{t("DASHBOARD.WALLET_CONTROLS.IMPORT_LEDGER")}</span>
					</div>
				</Button>
			</div>
		</div>
	);
};

WalletsControls.defaultProps = {
	activeFilter: false,
};
