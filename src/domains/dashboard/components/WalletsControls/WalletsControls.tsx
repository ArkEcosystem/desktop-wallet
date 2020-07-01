import { Icon } from "app/components//Icon";
import { Button } from "app/components/Button";
import { Divider } from "app/components/Divider";
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
		<div className="flex items-center">
			<LayoutControls
				onSelectGridView={onClickGridView}
				onSelectListView={onClickListview}
				selectedViewType={walletsViewType}
			/>

			<Divider type="vertical" />

			<div className="relative inline-block px-3 text-theme-primary-400">
				<Dropdown toggleIcon="Filters">
					<div className="px-10 py-7 w-128">
						<FilterWallets {...filterProperties} />
					</div>
				</Dropdown>
			</div>

			<Divider type="vertical" />

			<Button onClick={onCreateWallet} variant="plain" className="ml-8 mr-3">
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
	);
};

WalletsControls.defaultProps = {
	viewType: "grid",
};
