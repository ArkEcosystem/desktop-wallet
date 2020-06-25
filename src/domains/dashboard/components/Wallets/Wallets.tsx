import { Button } from "app/components/Button";
import { Slider } from "app/components/Slider";
import { Table } from "app/components/Table";
import { WalletCard } from "app/components/WalletCard";
import { WalletListItem } from "app/components/WalletListItem";
import { WalletsControls } from "domains/dashboard/components/WalletsControls";
import React, { useState } from "react";

type WalletsProps = {
	wallets?: any;
	title?: string;
	filterProperties: any;
	viewType?: "grid" | "list";
	listColumns?: any;
	onCreateWallet?: any;
	onImportWallet?: any;
	onWalletAction?: any;
};

export const Wallets = ({
	viewType,
	title,
	wallets,
	filterProperties,
	listColumns,
	onCreateWallet,
	onImportWallet,
	onWalletAction,
}: WalletsProps) => {
	const [walletsViewType, setWalletsViewType] = useState(viewType);

	const walletSliderOptions = {
		slideHeight: 220, // Wallet card height, including margin-bottom
		slidesPerView: 4,
		slidesPerColumn: 2,

		// Responsive breakpoints
		breakpoints: {
			// 	// when window width is >= 320px
			320: {
				slidesPerView: 1,
				slidesPerColumn: 2,
			},
			600: {
				slidesPerView: 2,
				slidesPerColumn: 2,
			},
			860: {
				slidesPerView: 3,
				slidesPerColumn: 2,
			},
			1140: {
				slidesPerView: 4,
				slidesPerColumn: 2,
			},
			1320: {
				slidesPerView: 5,
				slidesPerColumn: 2,
			},
		},
	};

	// Pad with empty cards to fill the row
	const walletsGridData = (wallets: any, walletsPerPage: number) => {
		if (wallets.length < walletsPerPage) {
			const blankWalletsLength = walletsPerPage - wallets.length;
			const blankWalletsCards = new Array(blankWalletsLength).fill({ isBlank: true });
			return [...wallets, ...blankWalletsCards];
		}
		return wallets;
	};

	return (
		<div>
			<div className="flex w-full pb-8">
				<div className="w-2/4 -mt-1 text-3xl font-bold">{title}</div>
				<div className="w-2/4 text-right">
					<WalletsControls
						onCreateWallet={onCreateWallet}
						onImportWallet={onImportWallet}
						onSelectGridView={() => setWalletsViewType("grid")}
						onSelectListView={() => setWalletsViewType("list")}
						filterProperties={filterProperties}
						viewType={walletsViewType}
					/>
				</div>
			</div>
			<div className="mt-1">
				{walletsViewType === "grid" && (
					<Slider
						data={walletsGridData(wallets, walletSliderOptions.slidesPerView)}
						options={walletSliderOptions}
					>
						{(walletData: any) => <WalletCard {...walletData} onSelect={onWalletAction} />}
					</Slider>
				)}
				{walletsViewType === "list" && (
					<div>
						<Table columns={listColumns} data={wallets}>
							{(rowData: any) => <WalletListItem {...rowData} />}
						</Table>

						<Button variant="plain" className="w-full mt-10 mb-5">
							See more
						</Button>
					</div>
				)}
			</div>
		</div>
	);
};

Wallets.defaultProps = {
	title: "Wallets",
	networks: [],
	wallets: [],
	viewType: "grid",
	listColumns: [
		{
			Header: "Asset Type",
			accessor: "avatarId",
		},
		{
			Header: "Wallet Address",
			accessor: "address",
		},
		{
			Header: "Wallet Type",
		},
		{
			Header: "Balance",
			accessor: "balance",
			className: "float-right",
		},
		{
			Header: "Fiat Value",
			accessor: "fiat",
			className: "float-right",
		},
	],
};
