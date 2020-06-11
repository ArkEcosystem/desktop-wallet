import React, { useState } from "react";
import { Button } from "../Button";
import { Icon } from "../Icon";
import { Divider } from "../Divider";
import { Dropdown } from "../Dropdown";
import { FilterWallets, FilterWalletsProps } from "../FilterWallets";

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

	const gridIconColorClass = walletsViewType === "grid" ? "text-theme-danger-400" : "text-theme-primary-400";
	const listIconColorClass = walletsViewType === "list" ? "text-theme-danger-400" : "text-theme-primary-400";

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
		<div>
			<div
				data-testid="controls__grid"
				className={`mr-4 px-1 inline-block cursor-pointer ${gridIconColorClass}`}
				onClick={onClickGridView}
			>
				<Icon name="Grid" width={20} height={20}></Icon>
			</div>
			<div
				data-testid="controls__list"
				className={`mr-6 px-1 inline-block cursor-pointer ${listIconColorClass}`}
				onClick={onClickListview}
			>
				<Icon name="List" width={20} height={20}></Icon>
			</div>

			<Divider type="vertical"></Divider>

			<div className="relative inline-block px-3 text-theme-primary-400">
				<Dropdown toggleIcon="Filters">
					<div className="w-128 px-11 py-8">
						<FilterWallets {...filterProperties}></FilterWallets>
					</div>
				</Dropdown>
			</div>

			<Divider type="vertical"></Divider>

			<Button onClick={onCreateWallet} color="primary" variant="solid" className="ml-8 mr-1">
				<div className="flex justify-center align-middle items-center mr-2 text-sm">
					<Icon name="Plus" width={10}></Icon>
					<span className="ml-2">Create</span>
				</div>
			</Button>
			<Button onClick={onImportWallet} color="primary" variant="plain">
				<div className="flex justify-center align-middle items-center mr-2 text-sm">
					<Icon name="Import"></Icon>
					<span className="ml-2">Import</span>
				</div>
			</Button>
		</div>
	);
};

WalletsControls.defaultProps = {
	viewType: "grid",
};
