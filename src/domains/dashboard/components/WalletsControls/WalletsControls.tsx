import { Icon } from "app/components//Icon";
import { Button } from "app/components/Button";
import { Dropdown } from "app/components/Dropdown";
import { LayoutControls } from "app/components/LayoutControls";
import { FilterWallets, FilterWalletsProps } from "domains/dashboard/components/FilterWallets";
import React, { useState } from "react";

type WalletsControlsProps = {
	filterProperties?: FilterWalletsProps;
	onCreateWallet?: any;
	onImportWallet?: any;
	onSelectGridView?: any;
	onSelectListView?: any;
	viewType: "grid" | "list";
};

export const WalletsControls = ({
	filterProperties,
	onCreateWallet,
	onImportWallet,
	onSelectGridView,
	onSelectListView,
	viewType,
}: WalletsControlsProps) => {
	const [walletsViewType, setWalletsViewType] = useState(viewType);

	const onClickGridView = () => {
		if (walletsViewType === "grid") return;

		setWalletsViewType("grid");
		if (typeof onSelectGridView === "function") onSelectGridView();
	};

	const onClickListview = () => {
		if (walletsViewType === "list") return;

		setWalletsViewType("list");
		if (typeof onSelectListView === "function") onSelectListView();
	};

	return (
		<div className="flex">
			<div className="flex items-center pr-4 mr-6 border-r border-theme-primary-100">
				<LayoutControls
					onSelectGridView={onClickGridView}
					onSelectListView={onClickListview}
					selectedViewType={walletsViewType}
				/>
			</div>

			<div className="flex items-center relative pr-6 mr-8 text-theme-primary-400 border-r border-theme-primary-100">
				<Dropdown toggleIcon="Filters">
					<div className="px-10 py-7 w-128">
						<FilterWallets {...filterProperties} />
					</div>
				</Dropdown>
			</div>

			<div className="space-x-3">
				<Button onClick={onCreateWallet} variant="plain">
					<div className="flex items-center justify-center mr-2 text-sm align-middle">
						<Icon name="Plus" width={10} />
						<span className="ml-2">Create</span>
					</div>
				</Button>

				<Button onClick={onImportWallet} variant="plain">
					<div className="flex items-center justify-center mr-2 text-sm align-middle">
						<Icon name="Import" />
						<span className="ml-2">Import</span>
					</div>
				</Button>
			</div>
		</div>
	);
};

WalletsControls.defaultProps = {
	viewType: "grid",
};
