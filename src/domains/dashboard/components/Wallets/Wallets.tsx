import { Wallet } from "@arkecosystem/platform-sdk-profiles";
import { Button } from "app/components/Button";
import { Slider } from "app/components/Slider";
import { Table } from "app/components/Table";
import { WalletCard } from "app/components/WalletCard";
import { WalletListItem } from "app/components/WalletListItem";
import { WalletsControls } from "domains/dashboard/components/WalletsControls";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

type WalletsProps = {
	wallets: Wallet[];
	title?: string;
	walletsEmptyText?: string;
	filterProperties: any;
	viewType?: "grid" | "list";
	onCreateWallet?: any;
	onImportWallet?: any;
	onWalletAction?: any;
};

export const Wallets = ({
	viewType,
	title,
	wallets,
	filterProperties,
	onCreateWallet,
	onImportWallet,
	onWalletAction,
	walletsEmptyText,
}: WalletsProps) => {
	const [walletsViewType, setWalletsViewType] = useState(viewType);

	const { t } = useTranslation();

	const listColumns = [
		{
			Header: t("COMMON.ASSET_TYPE"),
			accessor: "avatarId",
		},
		{
			Header: t("COMMON.WALLET_ADDRESS"),
			accessor: "address",
		},
		{
			Header: t("COMMON.WALLET_TYPE"),
			className: "justify-center",
		},
		{
			Header: t("COMMON.BALANCE"),
			accessor: "balance",
			className: "justify-end",
		},
		{
			Header: t("COMMON.FIAT_VALUE"),
			accessor: "fiat",
			className: "justify-end",
		},
	];

	const walletSliderOptions = {
		slideHeight: 185,
		slidesPerView: 4,
		slidesPerColumn: 2,
		slidesPerGroup: 4,
		spaceBetween: 20,

		// Responsive breakpoints
		// breakpoints: {
		// 	// 	// when window width is >= 320px
		// 	320: {
		// 		slidesPerView: 1,
		// 		slidesPerColumn: 2,
		// 	},
		// 	600: {
		// 		slidesPerView: 2,
		// 		slidesPerColumn: 2,
		// 	},
		// 	860: {
		// 		slidesPerView: 3,
		// 		slidesPerColumn: 2,
		// 	},
		// 	1140: {
		// 		slidesPerView: 4,
		// 		slidesPerColumn: 2,
		// 	},
		// 	1320: {
		// 		slidesPerView: 5,
		// 		slidesPerColumn: 2,
		// 	},
		// },
	};

	// Pad with empty cards to fill the row
	const walletsGridData = (wallets: Wallet[], walletsPerPage: number) => {
		const walletObjects = wallets.map((wallet) => ({ wallet }));
		if (wallets.length < walletsPerPage) {
			const blankWalletsLength = walletsPerPage - wallets.length;
			const blankWalletsCards = new Array(blankWalletsLength).fill({ isBlank: true });
			return [...walletObjects, ...blankWalletsCards];
		}

		return walletObjects;
	};

	const walletListItems = wallets.filter((wallet: any) => !wallet.isBlank).map((wallet) => ({ wallet }));

	return (
		<div>
			<div className="flex items-center justify-between pb-8">
				<div className="-mt-1 text-4xl font-bold">{title}</div>
				<div className="text-right">
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
					<div className="w-full">
						<Slider
							data={walletsGridData(wallets, walletSliderOptions.slidesPerView)}
							options={walletSliderOptions}
						>
							{(walletData: any) => (
								<WalletCard {...walletData} onSelect={onWalletAction} className="w-full" />
							)}
						</Slider>
					</div>
				)}
				{walletsViewType === "list" && (
					<div>
						{wallets.length > 10 && (
							<div>
								<Table columns={listColumns} data={walletListItems}>
									{(rowData: any) => <WalletListItem {...rowData} />}
								</Table>

								<Button variant="plain" className="w-full mt-10 mb-5">
									{t("COMMON.VIEW_MORE")}
								</Button>
							</div>
						)}
						{wallets.length === 0 && <div className="text-theme-neutral-dark">{walletsEmptyText}</div>}
					</div>
				)}
			</div>
		</div>
	);
};

Wallets.defaultProps = {
	networks: [],
	wallets: [],
	walletsEmptyText: "",
	viewType: "grid",
};
