import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { Button } from "app/components/Button";
import { Slider } from "app/components/Slider";
import { Table } from "app/components/Table";
import { WalletCard } from "app/components/WalletCard";
import { WalletListItem } from "app/components/WalletListItem";
import { useActiveProfile } from "app/hooks/env";
import { WalletsControls } from "domains/dashboard/components/WalletsControls";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

type WalletsProps = {
	wallets: ReadWriteWallet[];
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
	const [allWallets, setAllWallets] = useState<any>(undefined);
	const [hasMoreWallets, setHasMoreWallets] = useState<any>(wallets.length > 10);

	const activeProfile = useActiveProfile();

	const history = useHistory();

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
	};

	// Grid
	const loadGridWallets = () => {
		const walletObjects = wallets.map((wallet) => ({ wallet }));
		const walletsPerPage = walletSliderOptions.slidesPerView;

		if (wallets.length < walletsPerPage) {
			const blankWalletsLength = walletsPerPage - wallets.length;
			const blankWalletsCards = new Array(blankWalletsLength).fill({ isBlank: true });

			return [...walletObjects, ...blankWalletsCards];
		}

		return walletObjects;
	};

	// List
	const getWalletsForList = () => wallets.filter((wallet: any) => !wallet.isBlank).map((wallet) => ({ wallet }));

	const loadListWallets = () => allWallets || getWalletsForList().slice(0, 10);

	const loadAllListWallets = () => {
		setAllWallets(getWalletsForList());
		setHasMoreWallets(false);
	};

	const handleClick = (walletId: string) => {
		history.push(`/profiles/${activeProfile.id()}/wallets/${walletId}`);
	};

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
						<Slider data={loadGridWallets()} options={walletSliderOptions}>
							{(walletData: any) => (
								<WalletCard {...walletData} onSelect={onWalletAction} className="w-full" />
							)}
						</Slider>
					</div>
				)}
				{walletsViewType === "list" && (
					<div>
						{wallets.length > 0 && (
							<div data-testid="WalletTable">
								<Table columns={listColumns} data={loadListWallets()}>
									{(rowData: any) => <WalletListItem {...rowData} onClick={handleClick} />}
								</Table>

								{hasMoreWallets && (
									<Button
										variant="plain"
										className="w-full mt-10 mb-5"
										data-testid="WalletsList__ViewMore"
										onClick={() => loadAllListWallets()}
									>
										{t("COMMON.VIEW_MORE")}
									</Button>
								)}
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
